'use strict';
import { Injectable, Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import {BehaviorSubject} from 'rxjs';
import * as Global from './definition';

import { SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

import * as dialogdata from './component/Dialog/publicdialog/publicdialog.component'
import {MatDialog} from '@angular/material/dialog';
import {PublicdialogComponent} from './component/Dialog/publicdialog/publicdialog.component'

import * as jsPDF from 'jspdf';

let lastpage:string = ''

let gotointerface:GotoInterface = {
    page:'',
    articleindex:0
}

let Accout:Global.Account = Global.emptyaccount;

let Accountconfig:Global.accountconfig = {
    accountindex:0,
    modifyfavorite:false,
    favorite:'',
    modifyhistory:false,
    sharedtome:[],
    modifysharedtome:false,
    history:[],
    modifytemplate:false,
    template:[]
}


@Injectable()
export class FuncClass{
    constructor(private router:Router, private dialog:MatDialog){        
    }


    public route:BehaviorSubject<GotoInterface> = new BehaviorSubject(gotointerface);

    public account:BehaviorSubject<Global.Account> = new BehaviorSubject(Accout);
    
    public accountconfig:BehaviorSubject<Global.accountconfig> = new BehaviorSubject(Accountconfig)

    public preview:BehaviorSubject<Global.Article> = new BehaviorSubject(Global.CurentShowing)

    public Loadsimplearticlelist:BehaviorSubject<string> = new BehaviorSubject('')

    Route(page:string, articleindex:number, NewTab:boolean):void{
        //this.route.next({articleindex:articleindex,page:page})
        //let substr=`route/?page=${page}&articleindex=${articleindex}`
        if(NewTab)
        window.open(this.BuildLink(page,articleindex))
        else
        {
            this.route.next({articleindex:articleindex,page:page})
        }
    }

    BuildLink(page:string, articleindex:number):string
    {
        return `#/?page=${page}&articleindex=${articleindex}`
    }

    ShowPublicDialog(data:dialogdata.DialogData) {
        this.dialog.open(PublicdialogComponent, {data});
    }

    GetMyAccount():Global.Account{
        return {
            Index : Number(localStorage.getItem('account_index')),
          name: String(localStorage.getItem('account_name')),
          Company:String(localStorage.getItem('account_company')),
          Department:String(localStorage.getItem('account_department')),
          Role:String(localStorage.getItem('account_role')),
          Region:String(localStorage.getItem('account_region')),
          Authority:Number(localStorage.getItem('account_authority')),
          Password:'',
          Email:String(localStorage.getItem('account_email')),
          Createtime:String(localStorage.getItem('account_createtime')),
          Endtime:String(localStorage.getItem('account_endtime')),
          }
    }

    ConvertToPDF(html:any, filename:string){
        var doc = new jsPDF.jsPDF();
        doc.addPage(html);
        doc.save(filename)
    }
}

export const RouteFrom = ''

export interface GotoInterface{
    page:string //0:search, 1:edit 3:show single article
    articleindex:number
    //params:{[key:string]:any} //currentpage, currentshowarticle, currenteditarticle
}

// this.func.function.subscribe(d=>{
//     if(d.page === 'new')
//       {
//         console.log('Info coming');
//         console.log('next article index '+ d.articleindex.toString());
        
//         if(this.article.index>0)
//           {
//             if(!this.ioresult.successful){
//               const dialogRef = this.dialog.open(DialogContentWarnSaveDialog);
//               dialogRef.afterClosed().subscribe(result => {
//                 if(result){
//                   this.article.index = d.articleindex
//                   if(this.article.index>0){
//                 this.LoadArticle()
//                 //this.wangEditor?.txt.html(this.article.contenthtml)
//                 }  }
//                 else return   
//               });}
//           }
//         this.article.index = d.articleindex
//         if(this.article.index>0){
//         this.LoadArticle()
//         //this.wangEditor?.txt.html(this.article.contenthtml)
//         } 
//       }
//   })


@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }
  transform(value: string) {
      return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
