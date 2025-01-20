import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Video } from 'src/app/models/video';
import { DataService } from 'src/app/services/data.service';
import { Unsub } from 'src/app/shared/classes/unsub.class';

@Component({
  selector: 'view-resource',
  templateUrl: './view-resource.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ViewResourceComponent extends Unsub implements OnInit {
  showVideo = false;
  selectedVid!: Video;
  error = false;
  errMessage!: string;

  constructor(private dataService: DataService) {
    super();
  }

  ngOnInit() {
    // load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.dataService.selectedVideoUpdate.pipe(takeUntil(this.unsubscribe$)).subscribe((res: Video | null) => {
      if (res) {
        this.showVideo = true;
        this.error = false;
        this.selectedVid = res;
      }
    });

    this.dataService.showErrorInPlayerUpdate.pipe(takeUntil(this.unsubscribe$)).subscribe((res: string) => {
      this.error = true;
      this.showVideo = false;
      this.errMessage = res;
    });
  }
}
