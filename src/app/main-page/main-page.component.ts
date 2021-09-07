import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GithubApiService } from '../services/github-api.service';

@UntilDestroy()
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  public form!: FormGroup;
  fields = {
    q: '',
  }
  public disableCheckbox = true;
  public repos$: Observable<any> | undefined;
  public searchStringState: string = '';

  constructor(
    private fb: FormBuilder,
    private githubApiService: GithubApiService) { }

  public ngOnInit(): void {
    this.githubApiService.possibilityFilter.subscribe(res => {
      this.disableCheckbox = !res;
    });

    this.repos$ = this.githubApiService.getPageParams().pipe(
      switchMap(({ isFavorite, ...params }) => {
        if (isFavorite) {
          return of(this.githubApiService.getFavoritesRepo());
        }
        if (!params.q) return of();
        return this.githubApiService.getRepositories(params)
          .pipe(
            tap((data: any) => {
              console.log('rereerrer', data);
              this.githubApiService.updateStoredNextPageToken(data.page);
            }),
            map((data: any) => this.githubApiService.updatestoredRepo(data.items))
          );
      }),
    untilDestroyed(this)
    );

    this.formInit();
  }


  formInit() {
    this.form = this.fb.group(this.githubApiService.repoSubjectSource.getValue());
  }

  public addToFavorites(repo: any): void {
    console.log('sdsdsvdsvds', repo)
    this.githubApiService.addToFavorites(repo);
  }

  public showAllItems(): void {
    this.githubApiService.showAllItems();
  }

  public loadMoreRepositories(): void {
    this.githubApiService.loadRepos();
  }


  updateFilters(data: string | Object): void {
    if (typeof data === 'string') { data = { data } };
    this.githubApiService.updateFilters(data);
  }

  get canLoadMore(): boolean { return this.githubApiService.canLoadMore; }
}
