import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHtmlTag'
})
export class RemoveHtmlTagPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    value = value.replaceAll('</p><p>','</p><p> ');
    value = value.replace(/&nbsp/g,' ');
    return value.replace(/<[^>]*>/g, '');
  }

}
