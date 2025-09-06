// map value trong objectSource vào objectTarget
// Output: objectTarget gồm các giá trị của objectSource với đk key giống nhau
// this.activityForm.patchValue({ ...AutoMapUtils.objectAutoMap(res, this.body) });
export class AutoMapUtils {
  static objectAutoMap(objectSource: any, objectTarget:any, noMapField: string[] = []) {
    for (let item in objectTarget) {
      if (objectSource.hasOwnProperty(item) && !noMapField.includes(item)) {
        objectTarget[item] = objectSource[item];
      }
    }
    return objectTarget;
  }
  // input: 1 respone có id và name
  static mapMenuList(source: any) {
    let rawList: any[] = [];
    source.map((item: any) => {
      rawList.push({
        id: item.id,
        name: item.name,
      });
    });
    return rawList;
  }

    // input: 1 respone có id và name ( có chiều sâu 1 )
    static mapMenuListForManyJoin(source: any, condiName: string) {
      let rawList: any[] = [];
      source.map((item: any) => {
        rawList.push({
          id: item[condiName].id,
          name: item[condiName].name,
        });
      });
      return rawList;
    }
}
