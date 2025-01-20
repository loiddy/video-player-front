import { Injectable } from '@angular/core';
import { DataBaseService } from './db.service';
import { Subject, BehaviorSubject } from 'rxjs';

import { Video } from '../models/video';
import { List } from '../models/list';
import { CommonListIDs } from '../models/list-ids';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  listsUpdate = new BehaviorSubject<List[]>([]);
  videosInListUpdate = new Subject<Video[]>();
  selectedVideoUpdate = new BehaviorSubject<Video | null>(null);
  showErrorInListUpdate = new Subject<string>();
  showErrorInPlayerUpdate = new Subject<string>();

  private videosInList: Video[] = [];
  private selectedVideo!: Video;
  private lists: List[] | never = [];
  private routedListID!: number;

  constructor(private dbService: DataBaseService) {}

  async handleGetVideosInList(routedListName: string): Promise<string> {
    try {
      await this.getAllLists();
      this.getRoutedListID(routedListName);
      this.videosInList = await this.dbService.getVideosInList(this.routedListID);
      this.videosInListUpdate.next(this.videosInList);
      return 'success';
    } catch (error) {
      const msg = error === "doesn't exists" ? "You haven't created this list yet, or there might be a typo. Please check." : 'general';
      this.showErrorInListUpdate.next(this.errorMiddlewear(msg));
      return 'error';
    }
  }

  async createNewListWithOrWithoutVideo(listName: string, videoID?: number): Promise<string> {
    try {
      const res = await this.dbService.createNewListWithOrWithoutVideo({ listName, videoID });
      this.lists.push({ listID: res.listID, name: listName });
      this.listsUpdate.next(this.lists);
      if (videoID) {
        this.selectedVideo.inLists.push(res.listID);
        this.selectedVideoUpdate.next(this.selectedVideo);
      }
      return 'success';
    } catch (error) {
      this.showErrorInListUpdate.next(this.errorMiddlewear('general'));
      return 'fail';
    }
  }

  async deleteListAndVideosInList(): Promise<string> {
    try {
      await this.dbService.deleteListAndVideosInList({ listID: this.routedListID });
      this.lists = this.lists.filter((list) => list.listID !== this.routedListID);
      this.listsUpdate.next(this.lists);
      return 'success';
    } catch (error) {
      this.showErrorInListUpdate.next(this.errorMiddlewear('general'));
      return 'fail';
    }
  }

  async handleSearchInput(youtubeID: string): Promise<string> {
    try {
      this.selectedVideo = this.videosInList.filter((video) => video.youtubeID === youtubeID)[0];
      if (this.selectedVideo) this.updateOrAddSelectedVideoToHistory();
      else this.selectedVideo = await this.dbService.getNewVideo(youtubeID, this.routedListID);
      this.selectedVideoUpdate.next(this.selectedVideo);
      if (this.routedListID === CommonListIDs.History) {
        this.videosInList = [this.selectedVideo, ...this.videosInList.filter((video) => video.videoID !== this.selectedVideo.videoID)];
        this.videosInListUpdate.next(this.videosInList);
      }
      return 'success';
    } catch (error) {
      this.showErrorInPlayerUpdate.next(this.errorMiddlewear('general'));
      return 'fail';
    }
  }

  async handleClickInList(video: Video): Promise<string> {
    try {
      this.selectedVideo = video;
      await this.updateOrAddSelectedVideoToHistory();
      this.selectedVideoUpdate.next(this.selectedVideo);
      if (this.routedListID === CommonListIDs.History) {
        this.videosInList = [this.selectedVideo, ...this.videosInList.filter((video) => video.videoID !== this.selectedVideo.videoID)];
        this.videosInListUpdate.next(this.videosInList);
      }
      return 'success';
    } catch (error) {
      this.showErrorInPlayerUpdate.next(this.errorMiddlewear('general'));
      return 'fail';
    }
  }

  async addVideoToList(videoID: number, listID: number): Promise<void> {
    try {
      await this.dbService.addVideoToList({ videoID, listID });
      this.selectedVideo.inLists.push(listID);
      if (this.routedListID === listID) {
        this.videosInList = [this.selectedVideo, ...this.videosInList.filter((v) => v.videoID !== videoID)];
      }
      this.selectedVideoUpdate.next(this.selectedVideo);
      this.videosInListUpdate.next(this.videosInList);
    } catch (error) {
      this.showErrorInPlayerUpdate.next(this.errorMiddlewear('general'));
    }
  }

  async deleteVideoFromList(videoID: number, listID: number): Promise<string> {
    try {
      await this.dbService.deleteVideoFromList({ videoID, listID });
      this.selectedVideo.inLists = this.selectedVideo.inLists.filter((id: number) => id !== listID);
      if (this.routedListID === listID) {
        this.videosInList = this.videosInList.filter((video) => video.videoID !== videoID);
      }
      this.selectedVideoUpdate.next(this.selectedVideo);
      this.videosInListUpdate.next(this.videosInList);
      return 'success';
    } catch (error) {
      this.showErrorInPlayerUpdate.next(this.errorMiddlewear('general'));
      return 'fail';
    }
  }

  private async getAllLists(): Promise<void> {
    if (this.lists.length === 0) {
      this.lists = await this.dbService.getLists();
      this.listsUpdate.next(this.lists);
    }
  }

  private getRoutedListID(routedListName: string): void | never {
    const list: List | undefined = this.lists.find((l) => l.name === routedListName);
    if (list !== undefined) {
      this.routedListID = list.listID;
    } else {
      throw Error("doesn't exists");
    }
  }

  private async updateOrAddSelectedVideoToHistory(): Promise<void> {
    if (this.selectedVideo.histID) {
      await this.dbService.updateVideoInList({ videoID: this.selectedVideo.videoID, listID: CommonListIDs.History });
    } else {
      this.selectedVideo.histID = await this.dbService.addVideoToList({
        videoID: this.selectedVideo.videoID,
        listID: CommonListIDs.History,
      });
      this.selectedVideo.inLists.push(CommonListIDs.History);
    }
  }

  private errorMiddlewear(message: string): string {
    const generalMessage = 'Ups! Something went wrong 😢 . Sorry for any inconveniences. Please try again.';
    return message === 'general' ? generalMessage : message;
  }
}
