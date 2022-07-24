import { Component, OnInit } from '@angular/core';
import * as Global from '../../../definition';
import * as DBInterface from '../../../DBInterface';
import { FuncClass } from 'src/app/myFunc';
import * as FuncC from '../../../myFunc';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-show-article',
  templateUrl: './show-article.component.html',
  styleUrls: ['./show-article.component.css']
})
export class ShowArticleComponent implements OnInit {

  article:Global.Article = this.DB.GetNewArticle()
  //searchwithfilter = true;

  search:string = ''
  morefilter:boolean = false;
  MoreFilter(){this.morefilter=!this.morefilter}

  articletypeactived:boolean = false;
  articletype = 'Knowledge';

  haveattachment:boolean = false;

  searchfrom:Date = new Date;
  searchfromactived:boolean = false;
  searchuntil:Date = new Date;
  searchuntilactived:boolean = false;

  sameregion:boolean = false;
  samedepartment:boolean = false;
  onlyforme:boolean = false;
  withappendix:boolean = false;

  maxCount:number = 10;

  articleList:Global.simpleArticle[] = []

  appendixlist:string[] = [];

  constructor(private DB:DBInterface.BackEnd, private Func:FuncClass, private routerIn:ActivatedRoute, public datepipe: DatePipe) { 
    // if(Number(localStorage.getItem('token'))<=0) this.Func.Route('me', 0, false);
    let titlestr = (routerIn.snapshot.params['index'])
    //搜索标题
  }
  //
  ngOnInit(): void {

  }

  FindArticleWithFilter():void{
    if(this.search.trim() === '' && !this.morefilter) {
      this.search = 'Please input something!'
      return;
    }
    let searchInfo:DBInterface.searcharticle={
    ['searchstr']:this.search.trim(),
    ['morefilter']:this.morefilter,
    ['articletypeactived']:this.articletypeactived,
    ['articletype']:this.articletype,  
    ['haveattachment']:this.haveattachment,
    ['searchfromactived']:this.searchfromactived,
    ['searchfrom']:this.datepipe.transform(this.searchfrom, 'yyyy-MM-dd'),
    ['searchuntilactived']:this.searchuntilactived,
    ['searchunitl']:this.datepipe.transform(this.searchuntil, 'yyyy-MM-dd'),
    ['fromsameregion']:this.sameregion,
    ['fromsamedepartment']:this.samedepartment,
    ['onlyforme']:this.onlyforme,
    ['maxCount']:this.maxCount
    }
    //let article = this.DB.GetNewArticle();
    this.articleList = []
    this.DB.SearchArticle(searchInfo, this.articleList, ()=>{})  //
  }


  // FindArticle():void{  
  //   //this.DB.GetArticle(this.article,this.ShowMessage,this.ShowMessage);
  // }

  FindandOpenNewWindows(id:number):void{   
   
    // let info:FuncC.GotoInterface = {
    //   page: 'article',
    //   NewTab: true,
    //   params:{['currentshowarticle']:id, ['currentpage']:3}
    // }
    // console.log(id);
   
    //this.func.Goto(info)
    this.Func.Route('article', id, true)
  }

  //ShowMessage(message:string):void{}
}
