import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as Global from '../../../../definition';

@Component({
  selector: 'app-articletypeselection',
  templateUrl: './articletypeselection.component.html',
  styleUrls: ['./articletypeselection.component.css']
})
export class ArticletypeselectionComponent implements OnInit {

  @Input() article:Global.Article = Global.CurentShowing
  @Output() articleChange = new EventEmitter<Global.Article>()

  constructor() { }

  ngOnInit(): void {
  }

}
