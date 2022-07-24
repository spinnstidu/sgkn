import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as DBInterface from '../../../../DBInterface';
import { BackEnd } from '../../../../DBInterface';
import * as Global from '../../../../definition';
import { ClipboardService } from 'ngx-clipboard'

@Component({
  selector: 'app-autocompletetitle',
  templateUrl: './autocompletetitle.component.html',
  styleUrls: ['./autocompletetitle.component.css']
})
export class AutocompletetitleComponent implements OnInit {
  
  ArticleFullList = this.DB.ArticleFulllist();
  stateCtrl = new FormControl('');
  filteredStates: Observable<Global.Article[]>|undefined;
  constructor(private _clipboardService: ClipboardService, private DB:BackEnd) {
    this.filteredStates = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.ArticleFullList.articles.slice())),
    );
  }
  private _filterStates(value: string): Global.Article[] {
    const filterValue = value.toLowerCase();

    return this.ArticleFullList.articles.filter(state => state.title.toLowerCase().includes(filterValue));
  }
  ngOnInit(): void {
  }

  autocompletestr = ''
  CopyToClipboard(){
    if(this.autocompletestr)
      this._clipboardService.copy(this.autocompletestr)
  }
}


