import { Component, OnInit, Input, Output } from '@angular/core';
import { FuncClass } from 'src/app/myFunc';
import * as Global from '../../../../definition';

@Component({
  selector: 'app-singlearticleinfo',
  templateUrl: './singlearticleinfo.component.html',
  styleUrls: ['./singlearticleinfo.component.css']
})
export class SinglearticleinfoComponent implements OnInit {

  @Input() myFunc: string = ''
  @Input() List: Global.simpleArticle[] = []
  @Input() AllowDelete: boolean = true
  @Input() IamTemplate: boolean = false

  // testcheckbox = "Here is checkbox in innerHtml: <input type=\"checkbox\">"

  constructor(private func: FuncClass) {

  }

  ngOnInit(): void {
    this.func.accountconfig.subscribe(u => {
      if ((this.myFunc === 'sharetome' && u.modifysharedtome) ||
        (this.myFunc === 'template' && u.modifytemplate) ||
        (this.myFunc === 'history' && u.modifyhistory) ||
        (u.modifyhistory && u.modifysharedtome && u.modifyfavorite && u.modifytemplate)
      )
      this.doInit()
    })
    this.func.Loadsimplearticlelist.subscribe(u=>{
      if(this.myFunc === u)
      this.doInit()
    })
    this.doInit()
  }
  FindandOpenNewWindows(id: number): void {
    if (this.IamTemplate) { this.func.Route('fromtemplate', id, false) }
    else this.func.Route('article', id, false)
  }

  doInit() {
    if (this.myFunc === '') return

    var value = localStorage.getItem(this.myFunc)
    
    if (value) {
      var value1 = JSON.parse(value);
      this.List = value1.list     
    }
  }

  delete(simplesarticle: Global.simpleArticle) {
    this.List.splice(this.List.indexOf(simplesarticle), 1)
  }
  // do(){
  //   this.List = this.articleList
  //   console.log('ok');
  //   console.log(this.List?.length);

  // }
}
