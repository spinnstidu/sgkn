import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as DBInterface from '../../DBInterface';
import * as Global from '../../definition';
import { FuncClass } from 'src/app/myFunc';
import E from 'wangeditor';
import { BackEnd } from '../../DBInterface';
import { AUTO_STYLE } from '@angular/animations';
import { MatTabChangeEvent } from '@angular/material/tabs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild("wang") editor!: ElementRef;
  @Input() height = AUTO_STYLE;
  @Output() valueChange = new EventEmitter();

  onChange: ((value: string) => {}) | undefined;

  accountconfig: Global.accountconfig = {
    accountindex: Number(localStorage.getItem('accountindex')) | 0,
    modifyfavorite: false,
    favorite: String(localStorage.getItem('favorite')) || '',
    modifyhistory: false,
    sharedtome: [],
    modifysharedtome: false,
    history: [],
    modifytemplate: false,
    template: []
  }
  //html = ''
  //Text = ''
  wangEditor: E | undefined;

  MainTabIndex = 0;

  ngOnInit(): void {

    setTimeout(() => {
      this.wangEditor = new E(this.editor.nativeElement)
      this.wangEditor.config.zIndex = 500;
      this.wangEditor.config.styleWithCSS = true;
      this.wangEditor.config.height = 700;
      this.wangEditor.config.uploadImgShowBase64 = true
      this.wangEditor.config.uploadImgMaxSize = 20 * 1024
      this.wangEditor.config.onchange = (html: any) => {
        this.accountconfig.favorite = html;
        this.valueChange.emit(html)
        if (this.onChange) {
          this.onChange(html);
        }
      }
      this.wangEditor.config.onchangeTimeout = 500;
      this.wangEditor.create();
      this.wangEditor.txt.html(this.accountconfig.favorite)
    }, 200);

    this.func.accountconfig.subscribe(u => {
      if (u.modifyfavorite || u.modifyhistory || u.modifysharedtome || u.modifytemplate) {
        console.log('accountconfig changed');
        //console.log(this.func.Accountconfig);      
        this.accountconfig = this.func.accountconfig.getValue();
        if (this.accountconfig.modifyfavorite)
          this.wangEditor?.txt.html(this.accountconfig.favorite)

        let config = {
          accountindex: this.accountconfig.accountindex,
          modifyfavorite: this.accountconfig.modifyfavorite,
          favorite: this.accountconfig.modifyfavorite ? this.accountconfig.favorite : '',
          modifyhistory: this.accountconfig.modifyhistory,
          sharedtome: this.accountconfig.modifysharedtome ? this.accountconfig.sharedtome : [],
          modifysharedtome: this.accountconfig.modifysharedtome,
          history: this.accountconfig.modifyhistory ? this.accountconfig.history : [],
          modifytemplate: this.accountconfig.modifytemplate,
          template: this.accountconfig.modifytemplate ? this.accountconfig.template : []
        }
        this.DB.PostAccountConfig( //减少传输数据
          config,
          () => {  // this.func.Accountconfig.modifyfavorite = false;
            // this.func.Accountconfig.modifyhistory = false;
            // this.func.Accountconfig.modifysharedtome = false;        
          })

        // localStorage.setItem('history', JSON.stringify({history:u.history}))
        // localStorage.setItem('favorite', u.favorite)
        // localStorage.setItem('sharedtome', JSON.stringify({sharedtome:u.sharedtome}))

      }
    })

    this.func.route.subscribe(d => {
      // this.a=d.articleindex
      if(d.page === 'home')
        this.MainTabIndex = d.articleindex
    })

  }


  // new_releases:Global.simpleArticle[] = []
  // mineown:Global.simpleArticle[] = []
  // iposted:Global.simpleArticle[] = []
  // LoadConfig(){
  //   this.wangEditor?.txt.html(this.accountconfig.favorite)    
  //   this.DB.GetSimpleArticleList(this.new_releases, 0, ()=>{})
  //   this.DB.GetSimpleArticleList(this.mineown, 1, ()=>{})
  //   this.DB.GetSimpleArticleList(this.iposted, 2, ()=>{})
  // }

  constructor(private DB: DBInterface.BackEnd, private func: FuncClass) {

    var tmphistory = localStorage.getItem('history')
    var tmpfavorite = localStorage.getItem('favorite')
    var tmpsharedtome = localStorage.getItem('sharedtome')
    var tmptemplate = localStorage.getItem('template')
    console.log('loading config from localstorge');
    if (tmphistory && tmpfavorite && tmpsharedtome && tmptemplate) {
      var tmpconfig =
      {
        accountindex: Number(localStorage.getItem('account_index')),
        favorite: tmpfavorite,
        modifyfavorite: false,
        history: JSON.parse(tmphistory),
        modifyhistory: false,
        sharedtome: JSON.parse(tmpsharedtome),
        modifysharedtome: false,
        template: JSON.parse(tmptemplate),
        modifytemplate: false
      }

      console.log(tmpconfig);
      this.func.accountconfig.next(tmpconfig)
    }
  }

  lasthomepage = 0;
  homesubtabpagechange(e: MatTabChangeEvent) {
    if (e.index === 0) {
      localStorage.setItem('favorite', this.accountconfig.favorite)

      var index = Number(localStorage.getItem('account_index'))

      var next: Global.accountconfig = {
        accountindex: index,
        modifyfavorite: true,
        favorite: this.accountconfig.favorite,
        modifyhistory: false,
        sharedtome: this.accountconfig.sharedtome,
        modifysharedtome: false,
        history: this.accountconfig.history,
        modifytemplate: false,
        template: this.accountconfig.template
      }

      this.func.accountconfig.next(next)
    }
  }
  // FindandOpenNewWindows(id:number):void{   
  //   this.Func.Route('article', id, false)
  // }
}
