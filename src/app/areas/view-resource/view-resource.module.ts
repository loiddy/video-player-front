import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewResourceComponent } from './view-resource.component';
import { AddRemoveVideoFromListComponent } from './add-remove-video-from-list/add-remove-video-from-list.component';

import { YouTubePlayer } from '@angular/youtube-player';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewResourceComponent, AddRemoveVideoFromListComponent],
  imports: [CommonModule, YouTubePlayer, ReactiveFormsModule, SharedModule],
  exports: [ViewResourceComponent],
})
export class ViewResourceModule {}
