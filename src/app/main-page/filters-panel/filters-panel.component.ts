import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GithubApiService } from 'src/app/services/github-api.service';

@UntilDestroy()
@Component({
  selector: 'app-filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponent implements OnInit {
  @Output() filterTermChanded = new EventEmitter<Object>();
  public form!: FormGroup;

  triggerContent = `Filter`;
  count$: Observable<number> | undefined;
  disableForm = true;
  disableSelectOrder = true;

  fields = {
    order: 'order',
    sort: 'sort'
  };

  constructor(
    public githubApiService: GithubApiService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      [this.fields.order]: new FormControl(null),
      [this.fields.sort]: new FormControl(null),
    });

    this.githubApiService.possibilityFilter.subscribe(res => {
      this.disableForm = !res;
    });

    this.form.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe({
        next: (data) => {
          (data.sort !== null) ?
            this.disableSelectOrder = false :
            (this.disableSelectOrder = true,
              data.order = null,
              this.githubApiService.showAllItems());

          this.filterTermChanded.emit(data);
        }
      })
  }

  stopClick(event: MouseEvent) {
    event.stopPropagation();
  }

  public showFavoriteItems(e: MatCheckboxChange): void {
    e.checked ? this.githubApiService.showFavoritesItems() : this.githubApiService.showAllItems();
  }

}
