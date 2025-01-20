import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewListFormComponent } from './components/new-list/new-list-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UppercaseFirstLetter } from './pipes/uppercase-first-letter.pipe';

@NgModule({
  declarations: [NewListFormComponent, UppercaseFirstLetter],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [NewListFormComponent, UppercaseFirstLetter],
})
export class SharedModule {}
