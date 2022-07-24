import { Component, OnInit, EventEmitter } from '@angular/core';
import * as Global from '../../../definition';
import * as DBInterface from '../../../DBInterface';
import { BackEnd } from '../../../DBInterface';
import { ActivatedRoute } from '@angular/router';
import { FuncClass } from 'src/app/myFunc';
import { MatListModule } from '@angular/material/list';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  me: Global.Account = {
    Index: Number(localStorage.getItem('account_index')),
    name: String(localStorage.getItem('account_name')),
    Company: String(localStorage.getItem('account_company')),
    Department: String(localStorage.getItem('account_department')),
    Role: String(localStorage.getItem('account_role')),
    Region: String(localStorage.getItem('account_region')),
    Authority: Number(localStorage.getItem('account_authority')),
    Email: String(localStorage.getItem('account_email')),
    Createtime: String(localStorage.getItem('account_createtime')),
    Endtime: String(localStorage.getItem('account_endtime')),
    Password: ''
  }
  article: Global.Article = this.DB.GetNewArticle();
  articleOwner: Global.Account = this.DB.GetNewAccount();
  appendix: string[] = [];

  TestStr: string = 'ABC'

  //LinkDict:number[][] = [] //二维数组，LinkDict[]的序号为链接的参数，返回一维数组，数组存放指向具体文章的articleindex
  showFiller = false;
  showauthority = false;

  ArticleFullList = this.DB.ArticleFulllist();

  sharing = false;
  shareEmails: string[] = []
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON] as const;

  myDepartment = String(localStorage.getItem('account_department'))
  myRegion = String(localStorage.getItem('account_region'))

  constructor(private DB: BackEnd, private router: ActivatedRoute, private func: FuncClass) {

    this.func.route.subscribe(d => {
      if (d.page === 'article') {
        this.article.index = d.articleindex
        if (this.article.index > 0) {
          this.ShowArticle()//加入到历史记录中        
        }
      }
    })

    this.ShowArticle()

  }

  Buildsimplearticle(): Global.simpleArticle {
    return {
      index: this.article.index,
      title: this.article.title, //不允许重复，以免出现链接bug
      description: this.article.description, //描述，帮助搜索
      contenttext: this.article.contenttext || '', //用于搜索        
      ownerIndex: this.article.ownerIndex, //accountName, not email
      otherauthors: this.article.otherauthors, //OwnerID OwnerID OwnerID ...... 方便搜索。分隔符在程序中定义, 此项可以缺省
      region: this.article.region, //生成的时候跟随作者
      department: this.article.department, //生成的时候跟随作者
      group: this.article.group, //团队;可以缺省，用于对应特定的团队，比如项目团队，部门子团队。
      forotherdepartment: this.article.forotherdepartment,
      forotherregion: this.article.forotherregion,
      forothergroup: this.article.forothergroup,
      authority: this.article.authority, //账号不低于此值的才能看到文档，
      comment: this.article.comment, //comment总是以6个信息节组成：Index(唯一）书写人accountIndex, 书写人名字，comment内容，comment时间，comment对象（可以为正文，就是0，也可以为其他comment Index)
      onlyforowner: this.article.onlyforowner, //是否个人专属，比如是作为个人的收藏夹使用
      createtime: this.article.createtime,
      lastedittime: this.article.lastedittime,
      read: this.article.read //记录文章被读取多少次
    }
  }

  ShowArticle() {
    if (this.article.index > 0) {
      console.log('showing article');
      this.DB.GetArticle(this.article, () => {
        let simpleArticle: Global.simpleArticle = this.Buildsimplearticle()

        var value = localStorage.getItem('history')
        var currenthistory: Global.simpleArticle[] = []
        if (value) {
          var value1 = JSON.parse(value);
          currenthistory = value1.list
        }

        if (currenthistory && currenthistory.length > 0) {
          for (let item of currenthistory) {
            if (item.index === simpleArticle.index) {
              currenthistory.splice(currenthistory.indexOf(item), 1)
              break
            }
          }
        }
        if (currenthistory && currenthistory.length > 0) currenthistory?.splice(0, 0, simpleArticle)
        else currenthistory = [simpleArticle]
        localStorage.setItem('history', JSON.stringify({ list: currenthistory }))

        var currentconfig = this.func.accountconfig.getValue()
        let config = {
          accountindex: Number(localStorage.getItem('account_index')),
          favorite: currentconfig.favorite,
          modifyfavorite: false,
          history: currenthistory,
          modifyhistory: true,
          sharedtome: currentconfig.sharedtome,
          modifysharedtome: false,
          template: currentconfig.template,
          modifytemplate: false
        }
        //console.log(config);

        this.func.accountconfig.next(config)

        this.SetLink()
      }, this.donothing, this.article.ownerIndex);


      let headers = {
        ['token']: String(localStorage.getItem('token')),
        ['index']: this.article.ownerIndex,
        ['func']: DBInterface.AccountFunc.GetNameEmailThroughIndex.toString(),
        ['read']: 'true'
      }
      let info: DBInterface.InputforAccount = {
        Header: headers,
        //resultAccount:this.articleOwner
      }
      this.DB.GetAccount(info, () => { this.articleOwner = DBInterface.TmpAccount; }, this.donothing)

      //   //开始设置链接
      
    }
  }

  ngOnInit(): void {
    this.DB.GetArticleFulllist(this.ArticleFullList)
  }

  downloadAppendix(filename: string): void {
    // console.log(filename); 
    this.DB.GetFile(this.article.index, filename)
  }

  donothing(): void {
  }

  AddToMyFolder() { //favorite
    if (this.article.index > 0) {
      let config = this.func.accountconfig.getValue()
      var myfolder = config.favorite;
      myfolder = myfolder + `<br><a href="${this.func.BuildLink("article", this.article.index)}">${this.article.title}</a>`

      localStorage.setItem('favorite', myfolder)

      var index = Number(localStorage.getItem('account_index'))

      var next: Global.accountconfig = {
        accountindex: index,
        modifyfavorite: true,
        favorite: myfolder,
        modifyhistory: false,
        sharedtome: config.sharedtome,
        modifysharedtome: false,
        history: config.history,
        modifytemplate: false,
        template: config.template
      }

      this.func.accountconfig.next(next)
      // console.log(this.func.accountconfig.getValue());      
      // console.log(this.func.Accountconfig);      
    }
  }

  AddToMyTemplate() {
    if (this.article.index > 0) {

      var value = localStorage.getItem('template')
      var template: Global.simpleArticle[] = []
      if (value) {
        var value1 = JSON.parse(value);
        template = value1.list
      }
      let simpleArticle: Global.simpleArticle = this.Buildsimplearticle()
      if (template && template.length > 0) {
        for (let item of template) {
          if (item.index === simpleArticle.index) {
            template.splice(template.indexOf(item), 1)
            break
          }
        }
      }

      if (template && template.length > 0)
        template.splice(0, 0, simpleArticle)
      else template = [simpleArticle]
      localStorage.setItem('template', JSON.stringify({ list: template }))

      let config = this.func.accountconfig.getValue()
      //myfolder = myfolder + `<br><a href="${this.func.BuildLink("article",this.article.index)}">${this.article.title}</a>`      

      var index = Number(localStorage.getItem('account_index'))
      var next: Global.accountconfig = {
        accountindex: index,
        modifyfavorite: false,
        favorite: config.favorite,
        modifyhistory: false,
        sharedtome: config.sharedtome,
        modifysharedtome: false,
        history: config.history,
        modifytemplate: true,
        template: template
      }

      this.func.accountconfig.next(next)
      // console.log(this.func.accountconfig.getValue());      
      // console.log(this.func.Accountconfig);      
    }
  }

  Fullscreen() {
    this.func.preview.next(this.article)
  }

  SetLink(): void {
    //设置article.contenthtml, 来源this.ArticleFullList
    if (this.article.contenthtml.length === 0 || this.ArticleFullList.articles.length === 0) return;
    // console.log(this.article.contenthtml);
    // console.log(this.ArticleFullList.articles);

    for (let tmptitle of this.ArticleFullList.articles) {
        let currenttitle =tmptitle.title;
        if(currenttitle!==this.article.title){
        this.article.contenthtml = this.article.contenthtml.replace(new RegExp(currenttitle,'i'), 
          "<a target=\"blank\" href=\"" + this.func.BuildLink('article', tmptitle.index) + "\">" + currenttitle + "</a>")
        }
    }
    // console.log(this.article.contenthtml);
    
    // for(const {index, value} of this.ArticleFullList.map((value, index) => ({index,value})))
    // {
    //   this.article.contenthtml = this.article.contenthtml.replace(this.ArticleFullList.articles[i],)
    // }
  }

  ShowArticleOrList(index: number): void { //index of LinkDict:number[][]
    console.log("ok");
  }

  StartEdit(): void {
    this.func.Route('new', this.article.index, false)
  }
  width = '100%'
  fixedpagewidth() {
    if (this.width === '100%') this.width = Global.FixedWidth
    else this.width = '100%'
  }

  remove(email: string): void {
    const index = this.shareEmails.indexOf(email);

    if (index >= 0) {
      this.shareEmails.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.shareEmails.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  InputEmails = ''
  sharemessage = ''
  addtheseemail() {
    console.log('enter');

    this.InputEmails = this.InputEmails.trim()
    let list = this.InputEmails.split(';')
    for (let email of list) {
      email = email.trim();
      this.shareEmails.push(email)
    }
    this.InputEmails = ''
  }

  ShareTo() {
    if (this.article.index <= 0) {
      this.func.ShowPublicDialog({
        title: 'Error',
        content: 'You have not opened any article!'
      })
      return
    }
    if (this.shareEmails.length < 1) {
      this.func.ShowPublicDialog({
        title: 'Error',
        content: 'Please input emails!'
      })
      return
    }
    this.DB.ShareArticle(this.article, this.shareEmails)
  }
}
