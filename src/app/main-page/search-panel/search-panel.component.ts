import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { GithubApiService } from 'src/app/services/github-api.service';

@UntilDestroy()
@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

  @Input() control: AbstractControl | undefined;
  @Input() placeholder: string = $localize`Search`;

  @Output() searchTermChanded = new EventEmitter<string>();
  searchControl = new FormControl('');

  constructor(private api: GithubApiService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      tap((res) => {
        (res.length <= 1) ?
          this.api.possibilityFilter.next(false) :
          this.api.possibilityFilter.next(true);
      }),
      filter((query: string) => query?.length > 1),
      untilDestroyed(this)
    ).subscribe({
      next: (data) => {
        if (this.control) {
          this.control.setValue(data);
        }
        this.searchTermChanded.emit(data);
      }
    })
  }

}
