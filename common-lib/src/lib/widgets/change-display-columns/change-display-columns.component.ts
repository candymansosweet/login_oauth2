import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TABLE_MODULES } from '../../shared/import/import_table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'change-display-columns',
  templateUrl: './change-display-columns.component.html',
  styleUrls: ['./change-display-columns.component.scss'],
  imports: [
    CommonModule,
    ...TABLE_MODULES
  ],
})
export class ChangeDisplayColumnsComponent implements OnInit {
_visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    if(value){
      this._sourceCurrent = JSON.parse(JSON.stringify(this.sourceCurrent));
      this._targetCurrent = JSON.parse(JSON.stringify(this.targetCurrent));
    }
  }
  get visible() {
    return this._visible;
  }
  @Input() sourceCurrent : any[] = [];
  @Input() targetCurrent : any[] = [];
  @Input() targetTable : string = '';
  _numberColDefault: number = 0;
  @Input() set numberColDefault(value: any){
    this._numberColDefault = value;
  }
  get numberColDefault(){
    return this._numberColDefault;
  }
  @Input() isShowNumberDefault : boolean = false;
  @Output() numberColDefaultChange = new EventEmitter<any>();
  @Output() visibleChange = new EventEmitter<any>();
  @Output() onSaveChange = new EventEmitter<any>();
  _sourceCurrent : any[] = [];
  _targetCurrent : any[] = [];
  isShowError: boolean = false;
  // numberCol: number = 1;
  colForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.colForm = this.fb.group({
      numberCol: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
    })
  }

  ngOnInit(): void {
    this.colForm.patchValue({numberCol: this.numberColDefault});
    // this.numberCol = this.numberColDefault;
  }

  cancel() {
    this.colForm.patchValue({numberCol: this.numberColDefault});
    this.isShowError = false;
    this.visibleChange.emit(false);
  }

  saveChange() {
    // Kiểm tra xem cột cố định có bị ẩn đi ko
    let flag = true;
    for(let i of this._sourceCurrent){
      if(i?.isRequiredShow){
        this.isShowError = true;
        flag = false;
      }
    }

    if(flag && this.colForm.valid){
      this.numberColDefaultChange.emit(this.colForm.value.numberCol);
      this.saveLocal();
      this.onSaveChange.emit({
        target : this._targetCurrent,
        source : this._sourceCurrent,
      });
      this.visibleChange.emit(false);
      this.isShowError = false;
    }
  }

  saveLocal() {
    let temp: any = []
    let arr: any = this._targetCurrent.map(item => {
      if (item.field) {
        temp.push(item);
        return { field: item.field};
      }
      return null;
    }).filter(item => item !== null);
    this._targetCurrent = temp;
    localStorage.setItem(this.targetTable, JSON.stringify(arr));
  }

  handleMoveSource(event: any) {
    if(this._sourceCurrent.length === 0){
      this._sourceCurrent = [...event.items];
    }
    this._sourceCurrent = [...this._sourceCurrent];
    this._targetCurrent = [...this._targetCurrent];
  }

  handleMoveTarget(event: any) {
    if(this._targetCurrent.length === 0){
      this._targetCurrent = [...event.items];
    }
    this._sourceCurrent = [...this._sourceCurrent];
    this._targetCurrent = [...this._targetCurrent];
  }
}
