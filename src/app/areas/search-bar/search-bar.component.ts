import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent {
  newVideoForm = new FormGroup({
    urlVideo: new FormControl('', [this.sourceValidator]),
  });

  constructor(private dataService: DataService) {}

  sourceValidator(inputURL: AbstractControl) {
    const url = inputURL.value;
    const length = inputURL.value.length > 0 ? true : false;
    const mobile = url.startsWith('https://m.youtube.com/watch?v=') && url.length <= 41 ? true : false;
    const web = url.startsWith('https://www.youtube.com/watch?v=') && url.length <= 43 ? true : false;
    const short = url.startsWith('https://youtu.be/') && url.length <= 28 ? true : false;
    return (length && mobile) || web || short ? null : { error: 'error' };
  }

  onSubmit() {
    if (this.newVideoForm.value.urlVideo) {
      const youtubeID = this.getYoutubeID(this.newVideoForm.value.urlVideo);
      this.dataService.handleSearchInput(youtubeID).then((res: string) => {
        if (res === 'success') {
          this.clearForm();
        }
      });
    }
  }

  clearForm() {
    this.newVideoForm.controls.urlVideo.reset('');
  }

  onInput(e: string) {
    if (e === '') {
      this.clearForm();
    }
  }

  getYoutubeID(url: string) {
    let id = '';
    const mobile = 'https://m.youtube.com/watch?v=';
    const web = 'https://www.youtube.com/watch?v=';
    const short = 'https://youtu.be/';
    if (url.startsWith(web) || url.startsWith(mobile)) {
      const split = url.split('v=');
      id = split[1];
    } else if (url.startsWith(short)) {
      id = url.replace(short, '');
    }
    const seconds = id.search('&');
    if (seconds !== -1 && id.endsWith('s')) {
      id = seconds === -1 ? id : id.slice(0, seconds);
    }
    return id;
  }
}
