import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RepositoryInfoComponent } from './repository-info/repository-info.component';

const routes: Route[] = [
  { path: '', component: MainPageComponent},
  { path: 'item/:id', component: RepositoryInfoComponent },
  { path: '**', component: PageNotFoundComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
