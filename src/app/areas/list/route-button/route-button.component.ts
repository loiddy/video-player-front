import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { List } from '../../../models/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Unsub } from 'src/app/shared/classes/unsub.class';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'route-button',
  templateUrl: './route-button.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RouteButtonComponent extends Unsub implements OnInit {
  isNavigationOpen = false;
  showDeleteButton = false;
  lists!: List[];
  listener!: () => void;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute, private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    this.dataService.listsUpdate.pipe(takeUntil(this.unsubscribe$)).subscribe((res: List[]) => {
      this.lists = res;
    });
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.isNavigationOpen = false;
    });
  }

  toggleNavigation() {
    this.isNavigationOpen = !this.isNavigationOpen;
    if (this.isNavigationOpen) {
      this.listener = this.renderer.listen(window, 'click', (event) => {
        if (event.srcElement.className === 'overlay-background') this.closePopUp();
      });
    }
    if (!this.isNavigationOpen) this.closePopUp();
  }

  closePopUp() {
    this.isNavigationOpen = false;
    this.listener();
  }

  onNewListFormSubmit(listName: string) {
    this.dataService.createNewListWithOrWithoutVideo(listName).then((res: string) => {
      if (res === 'success') {
        this.listener();
        this.router.navigate(['/', listName]);
      }
    });
  }
}
