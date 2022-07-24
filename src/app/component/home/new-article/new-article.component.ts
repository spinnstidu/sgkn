import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, NgZone } from '@angular/core';
import * as Global from '../../../definition';
import * as DBInterface from '../../../DBInterface';
import { BackEnd } from '../../../DBInterface';
import E from 'wangeditor';
import { AUTO_STYLE } from '@angular/animations';
import { FuncClass } from 'src/app/myFunc';
import { MatAccordion } from '@angular/material/expansion';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PublicdialogComponent } from '../../Dialog/publicdialog/publicdialog.component'
import { MatTabChangeEvent } from '@angular/material/tabs'

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css'],
})


export class NewArticleComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild("wang") editor!: ElementRef;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;


  @Input() article: Global.Article = {
    index: -1,
    title: '', //标题
    description: '', //描述，帮助搜索
    contenthtml: '', //全文
    contenttext: '', //用于搜索        
    ownerIndex: '', //accountName, not email
    otherauthors: '', //OwnerID OwnerID OwnerID ...... 方便搜索。分隔符在程序中定义, 此项可以缺省
    region: '', //生成的时候跟随作者
    department: '', //生成的时候跟随作者
    group: '', //团队;可以缺省，用于对应特定的团队，比如项目团队，部门子团队。
    forotherdepartment: 'Readonly',
    forotherregion: 'Readonly',
    forothergroup: 'Readonly',
    authority: 0, //账号不低于此值的才能看到文档，
    appendix: [], //附件的文档,在FS中的Index, 以分隔符分开
    comment: '', //comment总是以6个信息节组成：Index(唯一）书写人accountIndex, 书写人名字，comment内容，comment时间，comment对象（可以为正文，就是0，也可以为其他comment Index)
    onlyforowner: false, //是否个人专属，比如是作为个人的收藏夹使用
    createtime: new Date().toLocaleDateString(),
    lastedittime: new Date().toLocaleDateString(),
    read: 0, //记录文章被读取多少次
    result: '',
    newarticle: true,
    articletype: 'Knowledge',
    actived: false
  }

  OwnerAccount: Global.Account = {
    Index: 0,
    name: '',
    Company: '',
    Department: '',
    Role: '', //customer 0, service partner 20, staff 40 , admin 100, super admin 200
    Region: '',
    Createtime: '',
    Endtime: '',
    Authority: 0,
    Password: '',
    Email: ','
  }

  //IamArticleOwner=true;

  @Input() height = AUTO_STYLE;
  @Output() valueChange = new EventEmitter();

  onChange: ((value: string) => {}) | undefined;

  //html = ''
  //Text = ''
  wangEditor: E | undefined;

  OperatorAuthority = Number(localStorage.getItem('account_authority') || 0);
  OperatorIndex = Number(localStorage.getItem('account_index'))
  UploadFile: any | undefined

  accordionStatus: boolean = true;

  //savehtml:SafeHtml = ''

  private subscription = new Subscription();

  constructor(private DB: BackEnd, private func: FuncClass, private _ngZone: NgZone, public dialog: MatDialog) {

    //if(Number(localStorage.getItem('token'))<=0) this.Func.Route('login');

    this.article = this.DB.GetNewArticle();

    //this.ioresult = DBInterface.ioresult;

    // this.article.index = Number(router.snapshot.params['index'])
    if (!(this.article.index > 0)) this.article.index = 0;
    console.log('now article.index');
    console.log(this.article.index);

    this.LoadArticle(this.article.index, this.article.ownerIndex)
    //this.IamArticleOwner = (this.OwnerAccount.Index === );
  }

  LoadArticle(articleindex: number, ownerindex: string) {
    console.log('start to load article: article index ' + articleindex.toString() + ' owner index ' + ownerindex);

    if (this.article.index > 0) {
      this.DB.GetArticle(this.article, () => {
        this.wangEditor?.txt.html(this.article.contenthtml)
        this.article.index = articleindex
        this.article.ownerIndex = String(localStorage.getItem('account_index'))
        this.article.group = String(localStorage.getItem('account_email'))
      }, this.donothing, ownerindex);
      let headers = { ['token']: String(localStorage.getItem('token')), ['index']: this.article.ownerIndex, ['func']: DBInterface.AccountFunc.GetNameEmailThroughIndex.toString() }
      let info: DBInterface.InputforAccount = {
        Header: headers,
        //resultAccount:this.articleOwner
      }
      this.DB.GetAccount(info, () => {
        this.OwnerAccount = DBInterface.TmpAccount
      }, this.donothing)


      //   //开始设置链接 

    }
    else //nerw article
    {
      if (this.article.ownerIndex.trim() === '') this.article.ownerIndex = String(localStorage.getItem('account_index'));
      if (this.article.region.trim() === '') this.article.region = String(localStorage.getItem('account_region'));
      if (this.article.department.trim() === '') this.article.department = String(localStorage.getItem('account_department'));
      if (this.article.group.trim() === '') this.article.group = String(localStorage.getItem('account_email'));
      //if(this.article.index<0) {this.CurrentTask = 'Creating new article'} else {this.CurrentTask = 'Editing article'}
      this.OwnerAccount.Index = Number(this.article.ownerIndex);
      console.log('get account info');

      let info: DBInterface.InputforAccount = {
        Header: {
          'func': DBInterface.AccountFunc[DBInterface.AccountFunc.GetNameEmailThroughIndex],
          'token': String(localStorage.getItem('token')), 'index': this.article.ownerIndex
        }, //用于token, email, password, 等关于账号的参数            
        //resultAccount:this.OwnerAccount     
      }
      //console.log(info);

      // this.DB.GetAccount(info, ()=>{}, ()=>{}) 
      //   this.OwnerAccount.Index = DBInterface.TmpAccount.Index;
      //     this.OwnerAccount.Email = DBInterface.TmpAccount.Email;
      //     this.OwnerAccount.name = DBInterface.TmpAccount.name;
      //     this.article.ownerIndex = this.OwnerAccount.Index.toString();
    }
    this.OperatorIndex = Number(localStorage.getItem('account_index'))
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  MainAttributesShow_Hide: boolean = true;
  ShowMainAttributes(): void { this.MainAttributesShow_Hide = !this.MainAttributesShow_Hide; }
  additionalAttributesShow_Hide: boolean = true;
  ShowadditionalAttributes(): void { this.additionalAttributesShow_Hide = !this.additionalAttributesShow_Hide; }

  ngOnDestroy(): void {
    this.wangEditor?.destroy();
  }
  writeValue(obj: any): void {
    this.article.contenthtml = obj;
    this.wangEditor?.txt.html(this.article.contenthtml)
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  ngOnInit(): void {
    //console.log(String(localStorage.getItem('account_index')));
    this.OwnerAccount = this.func.GetMyAccount();
    setTimeout(() => {
      this.wangEditor = new E(this.editor.nativeElement)
      this.wangEditor.config.zIndex = 500;
      this.wangEditor.config.styleWithCSS = true;
      this.wangEditor.config.height = 700;
      this.wangEditor.config.uploadImgShowBase64 = true
      this.wangEditor.config.uploadImgMaxSize = 4 * 1024 * 1024
      this.wangEditor.config.onchange = (html: any) => {
        this.article.contenthtml = html;
        this.valueChange.emit(html)
        this.ioresult.successful = false;
        DBInterface.ioresult.successful = false;
        if (this.onChange) {
          this.onChange(html);
        }
      }
      this.wangEditor.config.onchangeTimeout = 500;
      this.wangEditor.create();
      this.wangEditor.txt.html(this.article.contenthtml)

      // this.viewer.isEnable = false;
    }, 200);
    this.ioresult.successful = true; //标记着变化已经保存上传


    this.func.route.subscribe(d => {
      if (d.page === 'new') {
        console.log('Info coming');
        console.log('next article index ' + d.articleindex.toString());

        if (this.article.index > 0) {
          if (!this.ioresult.successful) {
            const dialogRef = this.dialog.open(DialogContentWarnSaveDialog);
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.article.index = d.articleindex
                if (this.article.index > 0) {
                  this.LoadArticle(d.articleindex, '')
                }
              }
              else return
            });
          }
        }
        this.article.index = d.articleindex
        if (this.article.index > 0) {
          this.LoadArticle(d.articleindex, '')

        }
      }
      if (d.page === 'fromtemplate') {
        console.log('Info coming: start new article base on template');
        console.log('next article index ' + String(localStorage.getItem('account_index')));

        if (this.article.index > 0) //正在编辑文章
        {
          if (!this.ioresult.successful) {
            const dialogRef = this.dialog.open(DialogContentWarnSaveDialog);
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.article.index = d.articleindex

                if (this.article.index > 0) {
                  this.LoadArticle(0, String(localStorage.getItem('account_index')))

                }
              }
              else return
            });
          }
        }
        this.article.index = d.articleindex
        if (this.article.index > 0) {
          this.LoadArticle(0, String(localStorage.getItem('account_index')))
        }
      }
    })
  }

  selectTabchanged(e: MatTabChangeEvent) {
    if (e.index === 0) {
      this.wangEditor?.txt.html(this.article.contenthtml)
      //console.log('changing');
      //console.log(this.article.contenthtml);      
    }
    else if (e.index === 2) {
      //console.log('working');      
      //this.viewer?.txt.html(this.article.contenthtml)
      //this.savehtml = this.article.contenthtml
    }
  }

  ReadText(): void {
  }

  savingmessage: string = ''
  ioresult: DBInterface.IOresult =
    {
      successful: true,
      message: ''
    }
  // = myFunc.editsaved

  generalauthorty = 'customer'

  fullscreen() {
    this.func.preview.next(this.article)
  }

  Save(backtoarticle: boolean): void {
    //dialogRef.afterClosed().subscribe()

    this.savingmessage = '';
    if (this.article.title.trim() === '') { this.savingmessage = this.savingmessage + 'Please input title\n' }
    //if(this.article.description.trim()===''){this.savingmessage = this.savingmessage + 'Please input description\n'}
    if (this.article.contenthtml.trim() === '') { this.savingmessage = this.savingmessage + 'Please input content' }

    if (this.savingmessage !== '') {
      this.dialog.open(PublicdialogComponent, {
        data: {
          title: 'Error!',
          content: this.savingmessage
        }
      });
    }

    this.article.contenttext = String(this.wangEditor?.txt.text());
    if (this.savingmessage !== '') return;
    console.log('Now post article');

    this.DB.PostArticle(
      this.article,
      this.Filelist,
      this.ioresult,
      backtoarticle ? this.backtoarticle : this.donothing
    )

  }

  backtoarticle() {
    console.log('Routing');

    this.func.Route('Article', this.article.index, false)
  }

  saveandbacktoarticle() {
    this.Save(true)
    //this.backtoarticle()   
  }

  SaveLocally(): void {
    const downloadFile = new Blob([this.article.contenthtml], {
      type: 'application/html'
    });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);
    a.download = 'Article.html';//'demo.pdf';
    a.href = URL.createObjectURL(downloadFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  LoadLocally(): void {
    console.log(this.ioresult.successful);
    if (!this.ioresult.successful) {
      const dialogRef = this.dialog.open(DialogContentWarnSaveDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let loadfile = document.getElementById("loadfile")
          loadfile?.click()
        }
      });
    }
    else {
      let loadfile = document.getElementById("loadfile")
      loadfile?.click()
    }
  }

  LoadTemplate() {
    this.func.Route('home', 6, false)
  }

  width = '100%'
  fixedpagewidth() {
    if (this.width === '100%') this.width = Global.FixedWidth;
    else this.width = '100%'
  }

  NewArticle(): void {
    console.log(this.ioresult.successful);
    if (!this.ioresult.successful) {
      const dialogRef = this.dialog.open(DialogContentWarnSaveDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.article = this.DB.GetNewArticle()
          this.wangEditor?.txt.html(this.article.contenthtml)
        }
      });
    }
    else {
      this.article = this.DB.GetNewArticle()
      this.wangEditor?.txt.html(this.article.contenthtml)
    }
    this.OwnerAccount = this.func.GetMyAccount()
  }

  onLoadFileSelected(event: any): void { //读取本地存储的html，返回到编辑器当中
    const file: File = event.target.files[0];
    
    file.text().then((res) => {
      this.article.contenthtml = res;
      this.wangEditor?.txt.html(res);
      //嵌入图片
      console.log('check if there is img');
    
      if (res.includes('<img')) {
        console.log('load images');
        
        let loadfile = document.getElementById("loadimg")
        loadfile?.click()
      }
    });
  }

  onImgSelected(event: any) {

    // const file: File = event.target.files[0];
    // this.Filelist.push(file);
    // this.article.appendix.push(file.name);

    let imgtmpstr = this.article.contenthtml.split('<img')
    if (!this.article.contenthtml.startsWith('<img'))//如果不是一开始就有图片，那么数组的第一元素不包含图片，可以删除
      imgtmpstr.splice(0, 1)
    //let tmpimg = imgtmpstr[0]
    for (let tmpimg of imgtmpstr) //现在每一个元素都以图片为开始
    {
      //<img width=794 height=523 src="power%20Stack%20replacement%20_v1.11_EN.files/image001.jpg">
      let tmpimgfilename = tmpimg.split('src=\"')[1]
      tmpimgfilename = tmpimgfilename.split('\"/>')[0]
      //tmpimgfilename = tmpimgfilename.replace('%20', ' ')
      //console.log(tmpimgfilename);      
      let tmpimgpurenames = tmpimgfilename.split('/')
      let currentimg = tmpimgpurenames[tmpimgpurenames.length - 1]
      //console.log(currentimg);      
      for (let imgfile of event.target.files) {
        let file: File = imgfile
        //console.log(file.name);        
        if (file.name === currentimg) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
              const imgBase64Path = e.target.result;
              this.article.contenthtml = this.article.contenthtml.replace(tmpimgfilename, imgBase64Path);
              //this.cardImageBase64 = imgBase64Path;                    
            };
          }
          reader.readAsDataURL(imgfile);
          break
        }
      }

    }

    this.wangEditor?.txt.html(this.article.contenthtml);
  }

  //Filelist:[{[key:string]:File}] = [{}];
  Filelist: File[] = []

  ShowMessage(message: string): void {
    console.log(message);
    //console.log(this.article);
    // this.article.index = message.index;
    // this.article.createtime = message.createtime||'';
    // this.article.lastedittime = message.lastedittime||'';
    // this.article.read = message.read||0;
  }
  donothing(): void { }

  deleteappendixfile(file: File): void {
    //console.log(file);
    let index = this.Filelist.findIndex(x => x === file)
    this.Filelist.splice(index, 1);
    this.article.appendix.splice(index, 1)
  }

  AddAppendix(): void {
    let loadfile = document.getElementById("appendixselect")
    loadfile?.click()
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.Filelist.push(file);
    this.article.appendix.push(file.name);// =  this.article.appendix + file.name+ ':'
    //this.DB.TestFileconvert(file)
  }
  UploadAppendix(): void {
    console.log(this.UploadFile);
  }
  SaveAsPDF(){
    //console.log(document.getElementById('previewDIV'));    
    this.func.ConvertToPDF(document.getElementById('previewDIV'), 'page.pdf')
  }
}

@Component({
  selector: 'WarnSave',
  templateUrl: './WarnSave.html',
})
export class DialogContentWarnSaveDialog {
}

