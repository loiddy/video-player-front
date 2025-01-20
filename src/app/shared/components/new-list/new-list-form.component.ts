import { Component, output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'new-list-form',
  templateUrl: './new-list-form.component.html',
})
export class NewListFormComponent {
  newListForm = new FormGroup({
    listName: new FormControl('', [Validators.minLength(2), Validators.required]),
  });

  onNewListFormSubmit = output<string>();

  constructor() {}

  onSubmit() {
    if (this.newListForm.value.listName) {
      this.onNewListFormSubmit.emit(this.newListForm.value.listName);
    }
  }

  onInput(e: string) {
    if (e === '') {
      this.clearForm();
    }
  }

  clearForm() {
    this.newListForm.reset();
  }
}
