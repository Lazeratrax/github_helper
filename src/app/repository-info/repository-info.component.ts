import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  faUndo, IconDefinition
} from '@fortawesome/free-solid-svg-icons';

import { GithubApiService } from '../services/github-api.service';
import { IRepository, IRepositoryFinite } from '../interfaces/interfaces';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-repository-info',
  templateUrl: './repository-info.component.html',
  styleUrls: ['./repository-info.component.scss']
})
export class RepositoryInfoComponent implements OnInit {
  public infoData!: IRepositoryFinite;
  public dateOfCreation!: string;

  public faUndo: IconDefinition = faUndo;

  constructor(
    public githubApiService: GithubApiService
  ) { }

  ngOnInit(): void {
    this.githubApiService.infoDataSubject
    .pipe(untilDestroyed(this))
    .subscribe((res: IRepositoryFinite) => {
      this.infoData = res;
      this.dateOfCreation = moment(res.created_at).format('DD.MM.YYYY, HH:MM');
    })
  }

}
