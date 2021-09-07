
export interface ISearchString {
  search_string: string;
}


export interface IRepository {
  id: number;
  name: string;
  full_name: string;
  size: string;
  forks_count: string;
  created_at: string;
  html_url: string;
  description: string;
  stargazers_count: string;
  open_issues_count: string;

  owner: {
    avatar_url: string,
    login: string;
    html_url: string
  };
}

export interface IRepositoryFinite {
  id: number;
  name: string;
  full_name: string;
  size: string;
  forks_count: string;
  created_at: string;
  html_url: string;
  description: string;
  stargazers_count: string;
  open_issues_count: string;
  avatar_url: string,
  login: string;
  urlAuthor: string;
}

export interface IReposirotySearchResponse {
  items: IRepository[];
  total_count: number;
}

export interface IGithubParams {
  q: string;
  page?: number;
  per_page?: number;
  sort?: string;
  order?: string;
  isFavorite?: boolean;
}
