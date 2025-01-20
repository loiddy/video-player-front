import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseFirstLetter',
})
export class UppercaseFirstLetter implements PipeTransform {
  transform(title: string) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
}
