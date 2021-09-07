import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { IGithubParams, IReposirotySearchResponse, IRepository } from '../interfaces/interfaces';
import * as Variables from '../variables';

const DEFAULT_PARAMS: IGithubParams =
{
  q: '',
  order: '',
  sort: '',
  per_page: 5,
  page: 1,
  isFavorite: false
};

export const QUERY_STRING = '';

export type SortStateType = 'stars' | 'forks' | 'help-wanted-issues';
export type OrderStateType = 'asc' | 'desc';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {

  public canLoadMore!: boolean;
  public queryStringAfterChecked!: string;
  private storedRepo: IRepository[] = [];
  private storedNextPageToken: number | undefined;
  stateSortList: SortStateType[] = ['stars', 'forks', 'help-wanted-issues'];
  stateOrderList: OrderStateType[] = ['asc', 'desc'];

  possibilityFilter = new BehaviorSubject<boolean>(false);
  infoDataSubject = new BehaviorSubject<any>(null);
  public searchString = new BehaviorSubject<string>('');
  public repoSubjectSource: BehaviorSubject<IGithubParams> = new BehaviorSubject<IGithubParams>(DEFAULT_PARAMS);

  private favoritesRepo = this.fetchFavoriteRepoFromLS();
  private fetchFavoriteRepoFromLS() {
    try {
      const repos = localStorage.getItem(Variables.FAVORITE_REPO_LS_KEY);
      return repos ? JSON.parse(repos) : [];
    } catch { }
  }

  constructor(
    private _http: HttpClient
  ) { }

  public getPageParams(): Observable<IGithubParams> {
    return this.repoSubjectSource.asObservable();
  }

  public setPageParams(textFragment?: string, pageToken?: number, isReset?: boolean) {
    if (isReset) {
      this.storedRepo = [];
    }
    let query = ``;
    if (textFragment) {
      query = `q=${textFragment}`;
    }

    return this.repoSubjectSource.next({
      ...this.repoSubjectSource.getValue(),
      ...(pageToken ? { page: pageToken } : '')
    });
  }

  public updateStoredNextPageToken(previousPageToken: number): void {
    this.storedNextPageToken = previousPageToken + 1;
  }

  public updateFilters(filters: Partial<any>): void {
    this.storedRepo = [];
    let params = this.repoSubjectSource.getValue();

    this.repoSubjectSource
      .next({
        ...DEFAULT_PARAMS,
        ...(filters.data ? { q: DEFAULT_PARAMS.q + filters.data } : params.q ? { q: params.q } : ''),
        ...(filters.order ? { order: filters.order } : params.q.length > 1 && params.order ? { order: params.order } : ''),
        ...(filters.sort ? { sort: filters.sort } : params.q.length > 1 && params.sort ? { sort: params.sort } : '')
      });
  }

  public loadRepos(): void {
    const pageToken = this.storedNextPageToken;
    this.setPageParams('', pageToken);
  }

  public getRepositories(params?: any) {
    params = {
      q: params.q,
      ...(params.sort ? { sort: params.sort } : ''),
      ...(params.order ? { order: params.order } : ''),
      per_page: params.per_page,
      page: params.page
    }

    this.canLoadMore = this.repoSubjectSource.getValue().q.length <= 0;
    return this._http.get<IReposirotySearchResponse>(`${Variables.ADRESS}`, { params })
      .pipe(
        debounceTime(400),
        map((result) => {
          return {
            page: params.page,
            per_page: params.per_page,
            total_count: result.total_count,
            items: result.items.map((item) => {
              return {
                id: item.id,
                name: item.name,
                full_name: item.full_name,
                size: item.size,
                forks_count: item.forks_count,
                created_at: item.created_at,
                html_url: item.html_url,
                description: item.description,
                stargazers_count: item.stargazers_count,
                open_issues_count: item.open_issues_count,
                avatar_url: item.owner.avatar_url,
                login: item.owner.login,
                urlAuthor: item.owner.html_url,
              }
            })
          }
        })
      )
  }

  public updatestoredRepo(repositories: IRepository[] | []): IRepository[] {
    return this.storedRepo = this.storedRepo.concat(repositories);
  }

  //--------- Favorites region (Local Storage filtering) ------------

  public addToFavorites(repo: IRepository): void {
    const index = this.favoritesRepo.findIndex((v: { id: number; }) => v.id === repo.id);
    if (index === -1) {
      this.favoritesRepo.push(repo);
    } else {
      this.favoritesRepo.splice(index, 1);
    }
    localStorage.setItem(Variables.FAVORITE_REPO_LS_KEY, JSON.stringify(this.favoritesRepo));
  }

  public isFavorite(repo: IRepository): boolean {
    return this.favoritesRepo.some((v: { id: number }) => v.id === repo.id);
  }

  public showFavoritesItems(): void {
    this.queryStringAfterChecked = this.repoSubjectSource.getValue().q;
    this.storedRepo = [];
    this.canLoadMore = false;
    this.repoSubjectSource.next({ ...DEFAULT_PARAMS, isFavorite: true });
  }

  public getFavoritesRepo(): IRepository[] {
    return this.favoritesRepo;
  }

  public showAllItems(): void {
    this.storedRepo = [];
    this.repoSubjectSource.next({ ...DEFAULT_PARAMS, q: this.queryStringAfterChecked, isFavorite: false });
  }

}

