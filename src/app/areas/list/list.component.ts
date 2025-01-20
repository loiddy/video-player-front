import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from 'src/app/services/data.service';
import { Video } from '../../models/video';
import { Unsub } from 'src/app/shared/classes/unsub.class';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent extends Unsub implements OnInit {
  loading = true;
  error = false;
  errMessage = '';
  showDeleteButton = false;
  listName = '';
  list: Video[] = [];
  selectedVideoID!: number;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.error = false;
      this.loading = true;
      this.listName = res.listName;
      this.dataService.handleGetVideosInList(res.listName).then((res) => {
        if (res === 'success') {
          this.showDeleteButton = this.listName !== 'history' && this.listName !== 'bookmarks';
        }
      });
    });

    this.dataService.videosInListUpdate.pipe(takeUntil(this.unsubscribe$)).subscribe((res: Video[]) => {
      this.list = res;
      this.loading = false;
    });

    this.dataService.showErrorInListUpdate.pipe(takeUntil(this.unsubscribe$)).subscribe((res: string) => {
      this.loading = false;
      this.error = true;
      this.errMessage = res;
    });

    this.dataService.selectedVideoUpdate.pipe(takeUntil(this.unsubscribe$)).subscribe((res: Video | null) => {
      if (res) this.selectedVideoID = res.videoID;
    });
  }

  deleteList() {
    this.dataService.deleteListAndVideosInList().then((res: string) => {
      if (res === 'success') {
        this.router.navigate(['/', 'history']);
      }
    });
  }

  onClick(vid: Video) {
    this.dataService.handleClickInList(vid).then((res: string) => {
      if (res === 'success') {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'auto',
        });
      }
    });
  }
}
