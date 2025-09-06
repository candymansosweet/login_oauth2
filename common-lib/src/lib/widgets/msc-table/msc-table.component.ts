import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { TABLE_MODULES } from '../../shared/import/import_table';
import { ChangeDisplayColumnsComponent } from '../change-display-columns/change-display-columns.component';
import { Router } from '@angular/router';
import { MscTableService } from '../../services/msc-table.service';
import { InputFilter } from '../table-cm.widget/input-filter.interface';
import { format } from 'date-fns';

@Component({
  selector: 'msc-table',
  templateUrl: './msc-table.component.html',
  styleUrls: ['./msc-table.component.scss'],
  imports: [
    CommonModule,
    ...TABLE_MODULES,
  ],
})
export class MscTableComponent implements OnInit {
  ACTIONS = {
    EDIT: 0,
    DELETE: 1,
  };
  menus = [
    { label: 'Edit', icon: 'pi pi-fw pi-search', command: () => this.editItem() }
  ];
  testValues = [
    { id: 1, value: "Test Item 1" },
    { id: 2, value: "Test Item 2" }
  ];
  showSearchBar: boolean = false;
  inputFilter: InputFilter = {
    pageNo: 1,
    pageSize: 40,
    first: 0,
    sortField: undefined,
    sortOrder: undefined,
    dataSearch: {},
  };
  paramsFilter = {};
  sortOrderList = ['asc', 'desc', undefined];
  sortOderIndex: any = 2;
  @Input() target: string = "";
  @Input() selectedItem: any = [];
  @Output() selectedItemChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() menuContextItem: any;
  @Input() menuItems: any[] = [];
  @Input() items: any[] = [];
  _cols: any[] = [];
  @Input() set cols(list: any[]) {
    if (list) {
      this._cols = list;
      list.map(col => {
        this.getValueDateToDate(col.field);
      });
    }
  }
  get cols() {
    return this._cols;
  }
  @Input() selectionMode: "single" | "multiple" | null | undefined = "single";
  @Input() actions: any[] = [this.ACTIONS.EDIT, this.ACTIONS.DELETE];
  @Input() totalRecords = 0;
  @Input() dataKey = '';
  @Input() loading = false;
  @Input() showCurrentPageReport = true;
  @Input() showPaging = true;
  @Input() showSort = false;
  @Input() sortFieldDefault?: string;
  @Input() sortOrderDefault?: string;
  @Input() showFilterColumn = true;
  @Input() isLazyLoad = false; // server-side pagination
  @Input() take = 40;
  @Input() groupRowsBy: string | any[] = '';
  @Input() rowGroupMode: "subheader" | "rowspan" | undefined = undefined;
  @Input() isShowCheckBoxAll = false;

  _calcHeight: number = 225;
  @Input() set calcHeight(value: number) {
    this._calcHeight = value;
    this.calculateScrollHeight();
  }
  public get calcHeight(): number {
    return this._calcHeight;
  }
  @Input() calcHeightType = 'relative';
  @Input() calcHeightUnit = 'px';

  @Input() actionColWidth = '6rem';
  @Input() tableStyleClass = 'p-datatable-xs';
  @Input() resizableColumns: boolean = true;
  @Input() columnResizeMode: string = 'expand';
  @Input() customHeaderTemplate!: TemplateRef<any>;
  @Input() customBodyTemplate!: TemplateRef<any>;
  @Input() customFooterTemplate!: TemplateRef<any>;
  @Input() additionButtonsTemplate!: TemplateRef<any>;
  @Input() showActionButton: boolean = true;
  @Input() hasCustomActionButton: boolean = false;
  @Input() hiddenColumns?: any[];
  @Input() showNumberColumn?: boolean = true;
  @Input() lazyLoadOnInit: boolean = true;
  @Input() showCheckBox: boolean = false;
  @Output() onEditItem = new EventEmitter<any>();
  @Output() onDeleteItem = new EventEmitter<any>();
  @Output() selectRow = new EventEmitter<any>();
  @Output() unselectRow = new EventEmitter<any>();
  @Output() onHover = new EventEmitter<any>();
  @Output() onLeave = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<any>();
  @Output() onSearchFilter = new EventEmitter<any>();
  @Output() onContextMenu = new EventEmitter<any>();
  @Output() onSort = new EventEmitter<any>();
  @ViewChild("dt", { read: ElementRef, static: true }) dataTable!: ElementRef;
  @ViewChild("op", { read: ElementRef, static: true }) calendarDateToDate!: ElementRef;
  scrollHeight = '';

  @Input() set isChangeColumn(value: any) {
    if (value) {
      const newDataSearch = this.inputFilter.dataSearch;
      this.hiddenColumns?.forEach((item: any) => {
        newDataSearch[item.field] = undefined;
        if (item.field == this.inputFilter.sortField || item.fieldSort == this.inputFilter.sortField) {
          this.inputFilter.sortField = undefined;
          this.inputFilter.sortOrder = undefined;
        }
      })
      // this.inputFilter.first = 0;
      this.inputFilter.dataSearch = newDataSearch;
      let processedData = this.convertDataFilter(this.inputFilter);
      this.onSearchFilter.emit(processedData);
    }
  };

  mapDateToDate: any = {};

  constructor(
    private mscTableService: MscTableService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.selectedItem = this.selectionMode == 'single' ? {} : [];
    this.cols?.map(col => {
      this.mapDateToDate[col.field] = '';
      if (!this.inputFilter.dataSearch[col.field])
        this.inputFilter.dataSearch[col.field] = col.defaultFilter ? col.defaultFilter : '';
    });
    this.inputFilter.sortField = this.sortFieldDefault;
    this.inputFilter.sortOrder = this.sortOrderDefault;
    let getFilter: any = this.mscTableService.getStorageFilter();
    let dataFilter = getFilter?.[this.target];

    if (dataFilter) {
      this.inputFilter = dataFilter; //sửa chỗ này
      this.showSearchBar = false;
      for (let key in this.inputFilter.dataSearch) {
        this.getValueDateToDate(key);
        if (this.inputFilter.dataSearch.hasOwnProperty(key) && this.inputFilter.dataSearch[key] !== null && this.inputFilter.dataSearch[key] !== '') {
          this.showSearchBar = true;
          // break;
        }
      }
    }
    if (this.inputFilter.sortOrder == 'asc') {
      this.sortOderIndex = 0;
    }
    if (this.inputFilter.sortOrder == 'desc') {
      this.sortOderIndex = 1;
    }
    // @ts-ignore
    this.gfg = [
      {
        label: "See this Row",
      },
    ];
  }
  public editItem() {
    // console.log(this.selectedItem);
  }

  ngAfterViewInit(): void {
    this.calculateScrollHeight();
  }

  calculateScrollHeight() {
    const parentElement = this.dataTable.nativeElement;
    const pDatatableWrapper = parentElement.querySelector('.p-datatable-wrapper');
    if (pDatatableWrapper) {
      if (this.calcHeight !== 0) {
        const scrollHeight = (this.calcHeightType === 'absolute') ? `${this.calcHeight}${this.calcHeightUnit}` : `calc(100vh - ${this.calcHeight}${this.calcHeightUnit})`;
        pDatatableWrapper.style.height = scrollHeight;
        this.scrollHeight = scrollHeight;
      } else { //Auto height
        pDatatableWrapper.style.height = 'auto';
      }
    }
  }

  actionSearchBar(): void {
    this.showSearchBar = !this.showSearchBar
  }

  clearInput(data: any) {
    this.inputFilter.dataSearch[data] = '';
    this.inputFilter.first = 0;
    this.inputFilter.pageNo = 1;
    this.mscTableService.setFilter(this.target, this.inputFilter);
    let processedData = this.convertDataFilter(this.inputFilter);

    this.onSearchFilter.emit(processedData);
  }

  clearAll() {
    this.inputFilter.dataSearch = {};
    this.mscTableService.clearFilter(this.target);
    this.inputFilter.first = 0;
    this.inputFilter.pageNo = 1;
    let processedData = this.convertDataFilter(this.inputFilter);
    this.onSearchFilter.emit(processedData);
  }

  contextSelect($event: any) {
    this.selectedItem = $event.data;
  }

  // unSelectRow($event: any) {
  //   this.selectedItem = [];
  //   // console.log($event);
  // }

  onRowSelect($event: any) {
    this.selectRow.emit(this.selectedItem);
    if (this.selectedItemChange)
      this.selectedItemChange.emit(this.selectedItem);
  }
  onRowUnselect($event: any) {
    this.unselectRow.emit(this.selectedItem);
    if (this.selectedItemChange)
      this.selectedItemChange.emit(this.selectedItem);
  }

  deSelectRow() {
    this.selectedItem = [];
  }

  onFilter(inputFilter?: any) {
    this.inputFilter.first = 0;
    this.inputFilter.pageNo = 1;
    this.mscTableService.setFilter(this.target, this.inputFilter);
    let processedData = this.convertDataFilter(this.inputFilter);

    this.onSearchFilter.emit(processedData);
  }

  onDateFilter(field: any, data: any): void {
    this.inputFilter.dataSearch[field] = data;
    this.onFilter();
  }

  onLazyLoad($event: any) {
    this.inputFilter.pageNo = ($event.first / $event.rows) + 1;
    this.inputFilter.pageSize = $event.rows;
    this.inputFilter.first = $event.first;
    this.mscTableService.setFilter(this.target, this.inputFilter);
    let processedData = this.convertDataFilter(this.inputFilter);
    this.onPageChange.emit(processedData);
  }

  handleSort(sortField: any) {
    if (sortField != 'noSort') {
      this.inputFilter.first = 0;
      this.inputFilter.pageNo = 1;
      if (this.inputFilter.sortField == sortField) {
        this.sortOderIndex += 1;
        if (this.sortOderIndex > 2) {
          this.sortOderIndex = 0;
        }
      }
      else {
        this.sortOderIndex = 0;
        this.inputFilter.sortField = sortField;
      }
      this.inputFilter.sortOrder = this.sortOrderList[this.sortOderIndex];
      this.inputFilter.sortField = this.sortOderIndex == 2 ? undefined : sortField;
      let processedData = this.convertDataFilter(this.inputFilter);
      this.onSort.emit(processedData);
    }
  }

  convertDataFilter(inputData: { dataSearch: any }): {} {
    let rawData = {
      ...inputData.dataSearch,
    }
    let processedDataSearch: any = {};
    for (const key in rawData) {
      if (rawData[key] !== undefined && rawData[key] !== null && rawData[key] !== '') {
        if (typeof (rawData[key]) === 'object' && !Array.isArray(rawData[key])) {
          processedDataSearch[key] = rawData[key]?.toISOString();
        }
        else {
          processedDataSearch[key] = rawData[key];
        }

      }
    }
    return ({
      pageNo: this.inputFilter.pageNo,
      pageSize: this.inputFilter.pageSize,
      sortField: this.inputFilter.sortField,
      sortOrder: this.inputFilter.sortOrder,
      dataSearch: processedDataSearch,
    })
  }

  getValueDateToDate(field: string) {
    this.mapDateToDate[field] = '';
    let start = this.inputFilter.dataSearch[field + 'Start'];
    start = start ? format(start, 'dd/MM/yyyy') : '';

    let end = this.inputFilter.dataSearch[field + 'End'];
    end = end ? format(end, 'dd/MM/yyyy') : '';

    if (start && end) {
      this.mapDateToDate[field] = start + '-' + end;
    }
    else {
      this.mapDateToDate[field] = start + end;
    }
  }

  onSearchDateToDate(field: any) {
    this.getValueDateToDate(field);
    let processedData = this.convertDataFilter(this.inputFilter);
    this.onSearchFilter.emit(processedData);
  }
  onClearDateToDate(field: any) {
    this.inputFilter.dataSearch[field + 'Start'] = null;
    this.inputFilter.dataSearch[field + 'End'] = null;
    this.inputFilter.dataSearch[field] = null;
    this.mapDateToDate[field] = '';

    let processedData = this.convertDataFilter(this.inputFilter);
    this.onSearchFilter.emit(processedData);
  }
}
