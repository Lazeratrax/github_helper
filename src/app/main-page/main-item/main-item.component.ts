import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GithubApiService } from 'src/app/services/github-api.service';
import {
  faLink, faCodeBranch, IconDefinition, faLongArrowAltRight,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { HelpersService } from 'src/app/services/helpers.service';
import { IRepository } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-main-item',
  templateUrl: './main-item.component.html',
  styleUrls: ['./main-item.component.scss']
})
export class MainItemComponent implements OnInit{
  public trimName: string | undefined;
  public trimDescription: string | undefined;

  public faLink: IconDefinition = faLink;
  public faCodeBranch: IconDefinition = faCodeBranch;
  public faQuestionCircle: IconDefinition = faQuestionCircle;
  public faLongArrowAltRight: IconDefinition = faLongArrowAltRight;

  @Input() repo!: IRepository;
  @Output() addToFavorites = new EventEmitter<IRepository>();

  public constructor(
    private githubApiService: GithubApiService,
    public helpersService: HelpersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.trimName = this.helpersService.trim(this.repo.name, 17);
    this.trimDescription = this.helpersService.trim(this.repo.description, 100);
  }

  goToInfoPage(): void {
    this.repo = { ...this.repo, description: this.helpersService.trim(this.repo.description, 200) };
    this.githubApiService.infoDataSubject.next(this.repo);
    this.router.navigate([`/item/${this.repo.id}`]);
  }

  public toggleFavorite(): void {
    this.addToFavorites.emit(this.repo);
  }

  get isFavorite(): boolean {
    return this.githubApiService.isFavorite(this.repo);
  }
}
