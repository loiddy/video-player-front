import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models/video';
import { List } from '../models/list';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataBaseService {
  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseURL;
  }

  // ***-- LISTS --*** //

  getLists() {
    return firstValueFrom(this.http.get<List[]>(this.baseURL + 'lists'));
  }

  createNewListWithOrWithoutVideo(body: { listName: string; videoID?: number }) {
    return firstValueFrom(this.http.post<{ listID: number; videoID?: number }>(this.baseURL + 'lists', body));
  }

  deleteListAndVideosInList(body: { listID: number }) {
    return firstValueFrom(
      this.http.request<{ success: string }>('delete', this.baseURL + 'lists', {
        body,
      })
    );
  }

  // ***-- VIDEOS IN LIST --*** //

  getVideosInList(listID: number) {
    return firstValueFrom(this.http.get<Video[]>(this.baseURL + 'videos-in-list/' + listID));
  }

  updateVideoInList(body: { videoID: number; listID: number }) {
    return firstValueFrom(this.http.put<{ success: string }>(this.baseURL + 'videos-in-list', body));
  }

  addVideoToList(body: { videoID: number; listID: number }) {
    return firstValueFrom(this.http.post<{ inserID: number }>(this.baseURL + 'videos-in-list', body)).then((res) => res.inserID);
  }

  deleteVideoFromList(body: { videoID: number; listID: number }) {
    return firstValueFrom(
      this.http.request<{ success: string }>('delete', this.baseURL + 'videos-in-list', {
        body,
      })
    );
  }

  // ***-- NEW VIDEO --*** //

  getNewVideo(sourceID: string, routedList: number): Promise<Video> {
    return firstValueFrom(this.http.get<Video>(this.baseURL + 'new-video/' + sourceID));
  }
}
