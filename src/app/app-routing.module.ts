import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './areas/list/list.component';

const routes: Routes = [
  { path: ':listName', component: ListComponent },
  { path: '', redirectTo: '/history', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
