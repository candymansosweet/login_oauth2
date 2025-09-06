import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "GetValueByKeyPipe",
})
export class GetValueByKeyPipe implements PipeTransform {
  transform(value: any, keyTag: string, nameTag: string, arrObject: any): string {
    let str = "";
    if (arrObject) {
      arrObject.map((item: any) => {
        if (item[keyTag] == value) {
          str = item[nameTag];
        }
      });
    }
    return str;
  }
}
