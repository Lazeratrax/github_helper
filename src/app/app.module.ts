import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './main-page/main-page.component';
import { RepositoryInfoComponent } from './repository-info/repository-info.component';
import { SearchPanelComponent } from './main-page/search-panel/search-panel.component';
import { FiltersPanelComponent } from './main-page/filters-panel/filters-panel.component';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MainItemComponent } from './main-page/main-item/main-item.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    RepositoryInfoComponent,
    SearchPanelComponent,
    MainItemComponent,
    FiltersPanelComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MaterialModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
