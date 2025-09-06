import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(collection: any[], property: string): any[] {
    if (!collection) {
      return [];
    }

    const groupedCollection = collection.reduce((prev, cur) => {
      const key = cur[property];
      if (!prev[key]) {
        prev[key] = [cur];
      } else {
        prev[key].push(cur);
      }
      return prev;
    }, {});

    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }
}
