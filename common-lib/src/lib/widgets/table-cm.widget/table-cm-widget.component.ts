import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { INIT_AUTH_MODEL } from '../../models/auth-model';
import { NotificationService } from '../../services/notification.service';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { deepCopy } from '../../utils/deep-copy';
import { SELECTION_MODE, TableColumn, TableColumnType } from '../../models/type.model';
import { InputFilter } from './input-filter.interface';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'table-cm-widget',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    ContextMenuModule,
    ButtonModule,
    InputTextModule,
    OverlayPanelModule
    // thêm các module khác nếu có sử dụng trong template
  ],
  templateUrl: './table-cm-widget.component.html',
  styleUrl: './table-cm-widget.component.scss'
})
export class TableCmWidgetComponent {
  @Input() data: any[] = [];
  @Input() tableHeight = 350;
  @Input() total = 0;
  @Input() loading = false;
  @Input() showFilter = true;
  @Input() lazy = true;
  @Input() paginator = true;
  @Input() showOrderColumn = true;
  @Input() isExportMultipleReportsTable = false;
  @Input() selectionMode: SELECTION_MODE = 'single';
  @Input() selectedItem: any = [];
  @Output() selectedItemChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectRow = new EventEmitter<any>();
  @Output() unselectRow = new EventEmitter<any>();
  @Input() tableStyleClass = 'p-datatable-xs';
  @Input() dataKey = '';
  @Input() customBodyTemplate!: TemplateRef<any>;
  @Input() showCurrentPageReport = true;
  @ViewChild("dt", { read: ElementRef, static: true }) dataTable!: ElementRef;
  scrollHeight = '';
  @Input() showPaging = true;
  @Input() customFooterTemplate!: TemplateRef<any>;
  @Input() menuContextItem: any;
  @Output() onContextMenu = new EventEmitter<any>();
  @Input() resizableColumns: boolean = true;
  @Input() columnResizeMode: string = 'expand';
  @Input() lazyLoadOnInit: boolean = true;
  @Input() showFilterColumn = true;
  @Input() showNumberColumn?: boolean = true;
  showSearchBar: boolean = false;
  @Input() customHeaderTemplate!: TemplateRef<any>;
  inputFilter: InputFilter = {
    pageNo: 1,
    pageSize: 40,
    first: 0,
    sortField: undefined,
    sortOrder: undefined,
    dataSearch: {},
  };
  @Input() showActionButton: boolean = true;
  @Input() actionColWidth = '6rem';
  @Input() hasCustomActionButton: boolean = false;
  @Output() onHover = new EventEmitter<any>();
  @Output() onLeave = new EventEmitter<any>();
  @Input() menuItems: any[] = [];
  ACTIONS = {
    EDIT: 0,
    DELETE: 1,
  };
  @Input() actions: any[] = [this.ACTIONS.EDIT, this.ACTIONS.DELETE];
  @Output() onEditItem = new EventEmitter<any>();
  @Output() onDeleteItem = new EventEmitter<any>();
  @Input() additionButtonsTemplate!: TemplateRef<any>;

  // @Input() set isChangeColumn(value: any) {
  //   if(value){
  //     const newDataSearch = this.inputFilter.dataSearch;
  //     this.hiddenColumns?.forEach((item : any) => {
  //       newDataSearch[item.field] = undefined;
  //       if(item.field == this.inputFilter.sortField || item.fieldSort  == this.inputFilter.sortField){
  //         this.inputFilter.sortField = undefined;
  //         this.inputFilter.sortOrder = undefined;
  //       }
  //     })
  //     // this.inputFilter.first = 0;
  //     this.inputFilter.dataSearch = newDataSearch;
  //     let processedData = this.convertDataFilter(this.inputFilter);
  //     this.onSearchFilter.emit(processedData);
  //   }
  // };

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
  _isShowSearch = false;
  @Input() set isShowSearch(value: boolean) {
    this._isShowSearch = value;
    this.isShowSearchChange.emit(value);
  }
  // searchData: SearchCaseStudy = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  get isShowSearch() {
    return this._isShowSearch;
  }

  @Output() onAction = new EventEmitter<any>();
  @Output() hoveredItemChange = new EventEmitter<any>();
  @Output() onSelectCaseStudy = new EventEmitter<any>();
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() isShowSearchChange = new EventEmitter<any>();

  @ViewChild('caseStudyTable') caseStudyTable!: Table;
  // @ViewChild('sltDateRange') sltDateRange!: OverlayPanel;

  @Input() contextMenuItems: MenuItem[] = [];
  _hoveredItem: any = {};
  @Input() set hoveredItem(value: any) {
    this._hoveredItem = value;
    this.hoveredItemChange.emit(value);
  }
  get hoveredItem() {
    return this._hoveredItem;
  }
  @Input() cols!: any[];

  isSearchTable = false;

  constructor(
  ) {
    this.initFilterSearch();
  }
  initFilterSearch() {
    this.filterData.page = 1;
    this.filterData.pageSize = 20;
    this.filterData.first = 0;
  }
  @Output() onSearchFilter = new EventEmitter<any>();

  onFilter(inputFilter?: any) {
    this.inputFilter.first = 0;
    this.inputFilter.pageNo = 1;
    // this.mscTableService.setFilter(this.target,this.inputFilter);
    let processedData = this.convertDataFilter(this.inputFilter);

    this.onSearchFilter.emit(processedData);
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
  clearAll() {
    this.inputFilter.dataSearch = {};
    // this.mscTableService.clearFilter(this.target);
    this.inputFilter.first = 0;
    this.inputFilter.pageNo = 1;
    let processedData = this.convertDataFilter(this.inputFilter);
    this.onSearchFilter.emit(processedData);
  }
  clearInput(data: any) {
    this.inputFilter.dataSearch[data] = '';
    this.inputFilter.first = 0;
    this.inputFilter.pageNo = 1;
    // this.mscTableService.setFilter(this.target,this.inputFilter);
    let processedData = this.convertDataFilter(this.inputFilter);

    this.onSearchFilter.emit(processedData);
  }
  onDateFilter(field: any, data: any): void {
    this.inputFilter.dataSearch[field] = data;
    this.onFilter();
  }
  DPS_COLUMN_TYPE = { ...TableColumnType };
  filterData: any = {
    page: 1,
    pageSize: 20,
    first: 0
  };
  @Output() onSearch = new EventEmitter<{}>();
  clearAllInputSearch() {
    this.clearFilterData();
    this.reloadData();
    // this.dpsTableService.setDataSearch({});
  }
  clearFilterData() {
    this.filterData = {};
    this.initFilterSearch();
  }

  clearInputSearch(fieldName: string) {
    delete this.filterData[fieldName]
    this.reloadData();
  }

  reloadData() {
    let filterData = deepCopy(this.filterData);
    delete filterData.first;
    this.onSearch.emit(filterData);
    // this.dpsTableService.updateDataSearch(this.filterData);
  }
  onFilterData(column: TableColumn) {
    if (this.filterData[column.field] === null) {
      delete this.filterData[column.field];
    }
    console.log(this.filterData[column.field]);
    this.reloadData();

    // switch(column.type){
    //     case DPSColumnType.TEXT:
    // this.dpsTableService.updateDataSearch(this.filterData);
    //         break;
    //     case DPSColumnType.DATE:

    // }
  }

  onLazyLoad(event: any) {
    this.filterData.page = (event.first / event.rows) + 1;;
    this.filterData.pageSize = event.rows;
    this.filterData.first = event.first;
    console.log(this.filterData);
    this.reloadData();


    // if (!event.sortField) {
    //     // only emit when page change
    //     // this.lazyLoad.emit(event);
    //     let page = event.first / event.rows + 1;
    //     let pageSize = event.rows;
    //     this.searchCaseStudyStateService.dispatch({ page, pageSize });
    // }
  }

  ngOnInit() {
    this.selectedItem = this.selectionMode == 'single' ? {} : [];
  }
  contextSelect($event: any) {
    this.selectedItem = $event.data;
  }
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

  calculateScrollHeight() {
    const parentElement = this.dataTable.nativeElement;
    const pDatatableWrapper = parentElement.querySelector('.p-datatable-wrapper');
    if (this.calcHeight !== 0) {
      const scrollHeight = (this.calcHeightType === 'absolute') ? `${this.calcHeight}${this.calcHeightUnit}` : `calc(100vh - ${this.calcHeight}${this.calcHeightUnit})`;
      // pDatatableWrapper.style.height = scrollHeight;
      this.scrollHeight = scrollHeight;
    } else { //Auto height
      pDatatableWrapper.style.height = 'auto';
    }
  }
  processSortDir(dir: any) {
    switch (dir) {
      case 'none':
        return 'desc';
      case 'desc':
        return 'asc';
      default:
        return 'none';
    }
  }
}
