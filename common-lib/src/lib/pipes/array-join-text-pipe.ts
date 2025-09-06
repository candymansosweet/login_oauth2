import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ArrayJoinTextLabel',
})
export class ArrayJoinTextPipe implements PipeTransform {
  constructor() { }
  transform(data: any[], keyName: string[]): string | null {
    if(data){
      let arrName: string[] = [];
      data.forEach((ele: any) => {
        arrName.push(this.getValue(ele, keyName));
      });
      return arrName.join(', ');
    }
    return null;
  }
  getValue(obj: any, keys: string[]): any {
    return keys.reduce((acc, key) => acc && acc[key], obj);
  }
}
