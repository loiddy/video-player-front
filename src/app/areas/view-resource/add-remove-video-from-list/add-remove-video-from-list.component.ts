import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { List } from 'src/app/models/list';
import { CommonListIDs } from 'src/app/models/list-ids';
import { Video } from 'src/app/models/video';
import { DataService } from 'src/app/services/data.service';
import { Unsub } from 'src/app/shared/classes/unsub.class';
import { NewListFormComponent } from 'src/app/shared/components/new-list/new-list-form.component';

@Component({
  selector: 'add-remove-video-from-list',
  templateUrl: './add-remove-video-from-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AddRemoveVideoFromListComponent extends Unsub implements OnInit {
  listIDs = CommonListIDs;
  lists!: List[];
  video!: Video;

  dialogListener!: () => void;
  dialogContentListener!: () => void;

  @ViewChild(NewListFormComponent) newListForm!: NewListFormComponent;
  @ViewChild('dialog') dialog!: ElementRef;
  @ViewChild('dialogContent') dialogContent!: ElementRef;

  constructor(private dataService: DataService, private router: Router, private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    this.dataService.listsUpdate.pipe(takeUntil(this.unsubscribe$)).subscribe((res: List[]) => {
      this.lists = res;
    });
    this.dataService.selectedVideoUpdate.pipe(takeUntil(this.unsubscribe$)).subscribe((res: Video | null) => {
      if (res) this.video = res;
    });
  }

  showDialog() {
    this.dialog.nativeElement.showModal();
    this.dialogListener = this.renderer.listen(this.dialog.nativeElement, 'click', () => {
      this.closeDialog();
    });
    this.dialogContentListener = this.renderer.listen(this.dialogContent.nativeElement, 'click', (event) => event.stopPropagation());
  }

  closeDialog() {
    this.dialog.nativeElement.close();
    this.newListForm.clearForm();
    this.dialogListener();
    this.dialogContentListener();
  }

  onClick(event: Event, listID: number) {
    event.preventDefault();
    this.video.inLists.includes(listID) ? this.dataService.deleteVideoFromList(this.video.videoID, listID) : this.dataService.addVideoToList(this.video.videoID, listID);
  }

  onNewListFormSubmit(listName: string) {
    this.dataService.createNewListWithOrWithoutVideo(listName, this.video.videoID).then((res: string) => {
      if (res === 'success') {
        this.router.navigate(['/', listName]);
        this.newListForm.clearForm();
      }
    });
  }
}
