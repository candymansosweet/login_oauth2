import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constants, ErrMess, Regex } from '../constants/constant';
// FormControl chỉ chứa giá trị trắng
// @minValue - giá trị nhỏ nhất control có thể nhận
export function WhiteSpaceValidator(isHtml: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /\S/;
    let value = control.value;
    if(isHtml) value = value?.replace(Regex.HTML_CHAR,'');
    const isValid = Constants.NULL_VALUES.includes(value) || pattern.test(value); //nếu chưa được nhập hoặc không chứa toàn space thì hợp lệ
    return isValid ? null : { isWhiteSpace : true, mess: ErrMess.INVALID_ONLY_WHITE_SPACE };
  };
}
