import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

/* declarations */
import { AppComponent } from './app.component';
import { SearchBarComponent } from './areas/search-bar/search-bar.component';
import { RouteButtonComponent } from './areas/list/route-button/route-button.component';
import { ListComponent } from './areas/list/list.component';

/* imports */
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ViewResourceModule } from './areas/view-resource/view-resource.module';

/* providers */
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { authInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [AppComponent, SearchBarComponent, RouteButtonComponent, ListComponent],
  imports: [BrowserModule, ReactiveFormsModule, AppRoutingModule, SharedModule, ViewResourceModule],
  providers: [provideFirebaseApp(() => initializeApp(environment.firebase.config)), provideAuth(() => getAuth()), provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent],
})
export class AppModule {}
