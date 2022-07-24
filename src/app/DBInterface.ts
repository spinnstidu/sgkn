import { HttpClient,HttpEventType,HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Byte } from '@angular/compiler/src/util';
import { Injectable, OnInit } from '@angular/core';
import * as Global from './definition';
import { tap } from 'rxjs/operators';
import { Subscription, Observable, ReplaySubject } from 'rxjs';
import {FuncClass} from './myFunc';

//let url = 'http://localhost:27199/api/DBAccess/';
let url = 'https://sgknbackend.azurewebsites.net/api/DBAccess/'
let ArticleFullList:articlefulllist = {
    accountindex : Number(localStorage.getItem('account_index')),
    articles:[]
    //articleindex:[]
  }

export let TmpAccount:Global.Account = {
    Index: -1,
    name:'empty',
    Company:'empty',
    Department:'empty',
    Role:'empty',
    Region:'empty',
    Authority:0,
    Password:'empty',
    Email:'empty',
    Createtime:'empty',
    Endtime:'empty'
}

@Injectable()
export class BackEnd implements OnInit{

    private subscription = new Subscription();

    constructor(private http:HttpClient, private func:FuncClass){
        //this.GetArticleFulllist(ArticleFullList)
        //if(window.location.hostname !== 'localhost')
        //    url = `https://${window.location.hostname}/backend/api/DBAccess/`
        //url = 'https://sgknbackend.azurewebsites.net/api/DBAccess/'
    }

    ngOnInit(): void {

    }

    CheckLoginStatus():void{                 
    let token = Number(localStorage.getItem('token'));
    
    if(token<1) {
        loginstatus.login = false;
        loginstatus.logout = true;
        return
    }
    else{loginstatus.login = true;
        loginstatus.logout = false;}
 
    //let params = new HttpParams().set('token', token);
    let headers = new HttpHeaders().set('token', token.toString()); 
    this.http.get<boolean>(url + "CheckLoginStatus", {headers}).subscribe(result =>{
        loginstatus.login = result;
        loginstatus.logout = !result;
        if(loginstatus.logout) localStorage.setItem('token','0')
        else this.GetAccountConfig(true)
        return  
      });
    }

    GetNewAccount():Global.Account{
        let result:Global.Account = {
            Index:0,
            name:'',
            Company:'',
            Department:'',
            Role:'', //customer 0, service partner 20, staff 40 , admin 100, super admin 200
            Region:'',
            Createtime:'',
            Endtime:'',
            Authority:0,
            Password:'',
            Email:','
        }
        return result;
    }

    GetAccount(Info:InputforAccount, callback:()=>void, callbackwhenfailed:()=>void):void
    {
        let urlstr = url + 'Account';
        let headers = new HttpHeaders(Info.Header);       
        let options = {headers};
        this.http.get<accountresult>(urlstr, options).subscribe(result =>{                
            var func=Info.Header['func'];    


            if(func === 'Login'){ 
                localStorage.setItem('token', result.token||'0');
                localStorage.setItem('account_index', result.index.toString());
                localStorage.setItem('account_name', result.name);
                localStorage.setItem('account_company', result.company);
                localStorage.setItem('account_department', result.department);
                localStorage.setItem('account_role', result.role);
                localStorage.setItem('account_region', result.region);
                localStorage.setItem('account_authority', result.authority.toString());
                localStorage.setItem('account_email', result.email);
                localStorage.setItem('account_createtime', result.createtime);
                localStorage.setItem('account_endtime', result.endtime);
               
                if(result.result){
                    this.GetArticleFulllist(ArticleFullList);
                    console.log('loading account config');
                                        
                    console.log('Loging successful,recording account info');}

                this.func.account.next({
                    Index: result.index,
                    name: result.name,
                    Company:result.company,
                    Department:result.department,
                    Role:result.role,
                    Region:result.region,
                    Authority:result.authority,
                    Password:'',
                    Email:result.email,
                    Createtime:result.createtime,
                    Endtime:result.endtime
                })         
                console.log('loading config after login');
                
                this.GetAccountConfig(true)     
            }
            else if(func === 'GetNameEmailThroughIndex'){   
                console.log('getting owner account');
                console.log(result.name);
                
                TmpAccount.Index = result.index       
                TmpAccount.Authority = result.authority
                TmpAccount.Company = result.company
                TmpAccount.Createtime = result.createtime
                TmpAccount.Department = result.department
                TmpAccount.Email = result.email
                TmpAccount.Endtime = result.endtime
                TmpAccount.Index = result.index
                TmpAccount.Region = result.region
                TmpAccount.Role = result.role
                TmpAccount.name = result.name             
            }            
            
        callback();
        }, error => {
            callbackwhenfailed();
            console.log(error)});
    }

    PostAccount(Info:InputforAccount, callback:()=>void, callbackwhenfailed:()=>void):void
    {
        let urlstr = url + 'AccountModify';
        let headers = new HttpHeaders(Info.Header);       
        let options = {headers};
        
        this.http.post<accountresult>(urlstr,urlstr, options).subscribe(result =>{
            //console.log(res);        
            // localStorage.setItem('token', result.token||'0');
            
            // if(Info.Header['func'] === 'Login' && result.result){   
            //     console.log('Loging successful,recording account info');                

            // localStorage.setItem('account_index', result.index.toString());
            // localStorage.setItem('account_name', result.name);
            // localStorage.setItem('account_company', result.company);
            // localStorage.setItem('account_department', result.department);
            // localStorage.setItem('account_role', result.role);
            // localStorage.setItem('account_region', result.region);
            // localStorage.setItem('account_authority', result.authority.toString());
            // localStorage.setItem('account_email', result.email);
            // localStorage.setItem('account_createtime', result.createtime);
            // localStorage.setItem('account_endtime', result.endtime);
        // }
        callback();
        }, error => {
            callbackwhenfailed();
            console.log(error)});
    }

    GetNewArticle():Global.Article{
        let article:Global.Article = {
     index:0,
     title:'', //不允许重复，以免出现链接bug
     description:'', //描述，帮助搜索
     contenthtml:'', //全文
     contenttext:'', //用于搜索        
     ownerIndex:'', //accountName, not email
     otherauthors:'', //OwnerID OwnerID OwnerID ...... 方便搜索。分隔符在程序中定义, 此项可以缺省
     region:'', //生成的时候跟随作者
     department:'', //生成的时候跟随作者
     group:'', //团队;可以缺省，用于对应特定的团队，比如项目团队，部门子团队。
     forotherdepartment:'Readonly',
     forotherregion:'Readonly', 
     forothergroup:'Readonly',
     authority:0, //账号不低于此值的才能看到文档，
     appendix:[], //附件的文档,在FS中的Index, 以分隔符分开
     comment:'', //comment总是以6个信息节组成：Index(唯一）书写人accountIndex, 书写人名字，comment内容，comment时间，comment对象（可以为正文，就是0，也可以为其他comment Index)
     onlyforowner:false, //是否个人专属，比如是作为个人的收藏夹使用
     createtime:'', 
     lastedittime:'', 
     read:0, //记录文章被读取多少次
     result:'', //仅作为网络通讯的信息传递
     newarticle:true,
     articletype:'Knowledge',
     actived:false
        }
        return article;
    }

    GetArticle(Info:Global.Article, callback:(message:string)=>void, callbackwhenfailed:(message:string)=>void, ownerindex:string):void{
        if(Info.index < 0) return;
        let urlstr = url + 'GetArticle';
        let headers = new HttpHeaders({'token': String(localStorage.getItem('token')), 'read': 'true'});   
        let params = new HttpParams().set('index',Info.index);
        let options = {headers, params};
        console.log('getting article');
        
        this.http.get<Global.Article>(urlstr, options).subscribe(result =>{
            console.log('article title '+ result.title);      
            console.log(result.authority);
                  
            Info.appendix = result.appendix
            Info.authority = result.authority
            Info.comment = result.comment
            Info.contenthtml = result.contenthtml
            Info.contenttext = result.contenttext
            Info.createtime = result.createtime
            Info.department = result.department
            Info.description = result.description
            Info.forotherdepartment = result.forotherdepartment
            Info.forothergroup = result.forothergroup
            Info.forotherregion = result.forotherregion
            Info.group = result.group
            Info.lastedittime = result.lastedittime
            Info.onlyforowner = result.onlyforowner
            Info.otherauthors = result.otherauthors
            Info.ownerIndex = result.ownerIndex
            Info.read = result.read
            Info.region = result.region
            Info.result = result.result
            Info.title = result.title
            Info.newarticle = false
            if(ownerindex!=='')
                result.ownerIndex = ownerindex
            let info:InputforAccount = {
                Header:{'func':AccountFunc[AccountFunc.GetNameEmailThroughIndex],
                 'token':String(localStorage.getItem('token')), 'index':result.ownerIndex}, //用于token, email, password, 等关于账号的参数            
                 //resultAccount:this.OwnerAccount     
                }
            this.GetAccount(info, ()=>{

            }, ()=>{}) 
            callback(result.result);
        }, error => {
            callbackwhenfailed(error);
            console.log(error)})
    }

    ArticleFulllist():articlefulllist{
        if(ArticleFullList && ArticleFullList.accountindex!== 0 && ArticleFullList.articles.length>0)
        return ArticleFullList;
        else{            
            this.GetArticleFulllist(ArticleFullList)
            return ArticleFullList
        }
    }

    GetArticleFulllist(Articlefulllist:articlefulllist):void{
        let token = Number(localStorage.getItem('token'));
        if(token<1) return;
        let urlstr = url + 'GetAvailableArticle';
        let headers = new HttpHeaders({'token': String(token)});   
        let options = {headers};
        //console.log('getting full article list');        
        this.http.get<articlefulllist>(urlstr, options).subscribe(result =>{
            //console.log('article title ');      
            //console.log(headers);     
            console.log('article full list count: ' + result);             
            Articlefulllist.accountindex = result.accountindex
            //Articlefulllist.articleindex = result.articleindex
            Articlefulllist.articles = result.articles
            Articlefulllist.articles.sort((a,b)=>b.title.length-a.title.length);
            //console.log(result);
            
        }, error => {            
            console.log(error)})
    }

    GetSimpleArticleList(simpleArticlelist:Global.simpleArticle[], func:number, callback:()=>void){
        //func: 0 = newrelease, 1=mineown, 2=iposted, 3=template
        let token = Number(localStorage.getItem('token'));
        if(token<1) return;
        let urlstr = url + 'SearchSimpleArticle';
        let headers = new HttpHeaders({'token': String(token)});   
        let params = new HttpParams().set('searchfunc', func).set('limit', 20)
        let options = {headers, params};
        //console.log('getting full article list');        
        this.http.get<Global.simpleArticle[]>(urlstr, options).subscribe(result =>{
            simpleArticlelist.splice(0,simpleArticlelist.length)
            for(let sa of result)
                simpleArticlelist.push(sa)
            
            callback();

        }, error => {            
            console.log(error)})
    }

    SearchArticle(searchInfo:searcharticle,articlelist:Global.simpleArticle[], callback:()=>void):void{ // 
        let urlstr = url + 'SearchArticle';
        let headers = new HttpHeaders({'token': String(localStorage.getItem('token'))});
        let params = new HttpParams({fromObject: searchInfo})
        let options = {headers, params};
        console.log('searching article');
        console.log(options);
        
        this.http.get<Global.simpleArticle[]>(urlstr, options).subscribe(result =>{
            //articlelist = result
            for(let item of result)
                articlelist.push(item);//.splice(0,articlelist.length);
            console.log(articlelist[0]);
            callback();
        }, error => {console.log(error)})
        //this.http.get<any>(url+'test')
    }

    PostArticle(Info:Global.Article, Filelist:File[], ioresult:IOresult, callback:()=>void):void{
        ioresult.successful = false;
        ioresult.message = "Failed"
        let urlstr = url + 'UpdateArticle';
        let token = String(localStorage.getItem('token'))
        let headers = new HttpHeaders({'token': token});
        console.log('uploading article');
        // console.log(Info);        
        // console.log(Info.appendix);
        if(!(Info.index>0))Info.index = 0;
        Info.contenttext = Info.title + ' ' + Info.description + ' ' + Info.contenttext + ' ' + Info.comment + ' '
        Info.contenttext.replace('&nbsp;', ' ') //删除空格，减少字符串总长度
        for(let filename of Info.appendix)
            Info.contenttext = Info.contenttext + filename
        let options = {headers};
        console.log(Info);
        
        this.http.post<Global.Article>(urlstr, Info, options).subscribe(result =>{
            Info.index = result.index;
            Info.createtime = result.createtime;
            Info.lastedittime = result.lastedittime;
            Info.read = result.read;
            Info.newarticle = Info.index < 0
                // this.article.createtime = message.createtime||'';
    // this.article.lastedittime = message.lastedittime||'';
    // this.article.read = message.read||0;
   
            if(Info.index>0){
                console.log('Uploading Files');
                
            for(let file of Filelist){
                 this.PostFile(token, Info.index, file, ()=>{
                    Filelist.splice(Filelist.indexOf(file),1)
                 });                                         
            }
            ioresult.successful = true;
            ioresult.message = "Sucessful"
        }            
        callback();
        }, error => {
            
            console.log(error)})    
    }

    
    // convertFile(file : File) : string {
    //     const result = new ReplaySubject<string>(1);
    //     const reader = new FileReader();
    //     reader.readAsBinaryString(file);
    //     reader.onload = (event) => {
    //         if(event.target?.result)
    //             return btoa(event.target.result.toString());
    //         }
    //     return ''
    //   }
    TestFileconvert(file:File){
        console.log('start converting');
        //let str = this.convertFile(file)
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (event) => {
            if(event.target?.result)
                { 
                var newstr = event.target.result;
                console.log(newstr);
                                
                //let b64:string = (newstr)
                let b64:BlobPart[] = [newstr]
                
                //let buffer:BlobPart[] = new (newstr.valueOf.length)
//                 const byteCharacters = atob(b64);
//                 const byteNumbers = new Array(b64.length);
// for (let i = 0; i < b64.length; i++) {
//   byteNumbers[i] = b64.charCodeAt(i);
// }
// const byteArray = new Uint8Array(byteNumbers);

                const downloadFile = new Blob([newstr]//,{type:file.type}
                    );
                    const a = document.createElement('a');
                    a.setAttribute('style','display:none'); 
                    document.body.appendChild(a);
                    a.download = file.name;//'demo.pdf';
                    a.href = URL.createObjectURL(downloadFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);     
                }
            }
              
                     
        //const reader = new FileReader();
        //   reader.onload = (e: any) => {
        //     console.log('event start');
              
        //       const imgBase64Path = e.target.result.toString();
        //         console.log(imgBase64Path);                
        //       const downloadFile = new Blob([imgBase64Path],{type:file.type}
        //         );
        //         const a = document.createElement('a');
        //         a.setAttribute('style','display:none');
        //         document.body.appendChild(a);
        //         a.download = file.name;//'demo.pdf';
        //         a.href = URL.createObjectURL(downloadFile);
        //         a.target = '_blank';
        //         a.click();
        //         document.body.removeChild(a);             
        //   }
        //   reader.readAsBinaryString(file);
    }
    PostFile(token:string, index:number, file:File, callback:()=>void):void{        
        if(file){    
            const formData = new FormData();
            formData.append('file', file);

            let headers = new HttpHeaders().set('index', index.toString()).set('token', token ).set('Access-Control-Allow-Origin', '*')       
            // let options = {headers}
            // this.http.post<string>(url+"PostFile", formData, options).subscribe(result =>{
            //     console.log("file uploaded");       
            //     callback();         
            // }, error => {console.log(error)});

            const req = new HttpRequest('POST',url+"PostFile", formData, 
            {
                headers,
                reportProgress:true
            });
            this.http.request(req).subscribe(event =>{
                if(event.type===HttpEventType.UploadProgress){
                    if(event.total){
                    const persentdone = Math.round(100*event.loaded/event.total)
                    console.log(persentdone);                        
                }
                else if (event instanceof HttpResponse){
                    console.log('file uploaded');                    
                }
                }
            })
         }

    }
    GetFile(articleindex:number, filename:string):void{
        var params = new HttpParams().set('articleindex', articleindex).set('filename', filename)
        let headers = new HttpHeaders({'token': String(localStorage.getItem('token'))});  

           this.http.get<Global.fileinbyte>(url + 'GetFile',{headers, params}).subscribe(result =>{

            var binary_string = window.atob(result.file);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }                               
                const downloadFile = new Blob([bytes.buffer]);
                
                const a = document.createElement('a');
                a.setAttribute('style','display:none'); 
                document.body.appendChild(a);
                a.download = filename;//'demo.pdf';
                a.href = URL.createObjectURL(downloadFile);
                a.target = '_blank';
                a.click();
                document.body.removeChild(a);     
            })
    //         this.subscription.add(
    //      this.http.get(url + 'GetFile', 
    //      {headers, params, responseType: 'blob'})
    //     .pipe(
    //         tap((data:Blob) =>{
    //         if(data && data.type === 'application/all'){
    //             console.log("start download process");  
    //             console.log(data);
                              
    //             const downloadFile = new Blob([data],{
    //                 type:data.type
    //             });
    //             const a = document.createElement('a');
    //             a.setAttribute('style','display:none');
    //             document.body.appendChild(a);
    //             a.download = filename;//'demo.pdf';
    //             a.href = URL.createObjectURL(downloadFile);
    //             a.target = '_blank';
    //             a.click();
    //             document.body.removeChild(a);
    //         }
    //     })
    //     )
    //     .subscribe()
    // );
    }

    PostAccountConfig(config:Global.accountconfig, callback:()=>void){
    if(config.modifyfavorite || config.modifyhistory || config.modifysharedtome || config.modifytemplate){
        
        let headers = new HttpHeaders({'token': String(localStorage.getItem('token'))});
        this.http.post<string>(url + 'PostConfig', config, {headers}).subscribe(result =>{    
    //         if(config.modifyfavorite)localStorage.setItem('favorite', config.favorite)
    //         if(config.modifyhistory)localStorage.setItem('history', JSON.stringify({list:config.history}))
    //         if(config.modifysharedtome)localStorage.setItem('sharedtome', JSON.stringify({list:config.sharedtome}))    
    //         if(config.modifysharedtome)localStorage.setItem('template', JSON.stringify({list:config.template}))          
                
    // this.func.accountconfig.next({accountindex:config.accountindex,
    //     modifyfavorite:false,
    //     favorite:config.modifyfavorite?config.favorite:'',
    //     modifyhistory:false,
    //     sharedtome:config.modifysharedtome?config.sharedtome:[],
    //     modifysharedtome:false,
    //     history:config.modifyhistory?config.history:[],
    //     modifytemplate:false,
    //     template:config.modifytemplate?config.template:[]
    //   })
      
            callback()

        }, error => {console.log(error)
        console.log('error with config');
        console.log(config);        
        })   
    } 
    }

    GetAccountConfig(forcerefresh?:boolean){
        let new_releases:Global.simpleArticle[] = []
        this.GetSimpleArticleList(new_releases, 0, ()=>{
            localStorage.setItem('new_releases', JSON.stringify({list:new_releases}))
            this.func.Loadsimplearticlelist.next('new_releases')
        })
        let mineown:Global.simpleArticle[] = []
        this.GetSimpleArticleList(mineown, 1, ()=>{localStorage.setItem('mineown', JSON.stringify({list:mineown}))
        this.func.Loadsimplearticlelist.next('mineown')
        })
        let iposted:Global.simpleArticle[] = []
        this.GetSimpleArticleList(iposted, 2, ()=>{localStorage.setItem('iposted', JSON.stringify({list:iposted}))
        this.func.Loadsimplearticlelist.next('iposted')
        })

        let headers = new HttpHeaders({'token': String(localStorage.getItem('token'))});
        this.http.get<Global.accountconfig>(url + 'GetConfig', {headers}).subscribe(result =>{      
            if(result.accountindex <= 0) //空的，需要新建
            {
                 var accountconfig = {
                    accountindex:0,
                    history:[],
                    favorite:'',
                    sharedtome:[],    
                    template:[]
                }
                //localStorage.setItem('new_releases', JSON.stringify({accountconfig:accountconfig}))
                // localStorage.setItem('new_releases','')
                // localStorage.setItem('mineown','')
                // localStorage.setItem('iposted','')                
            }   
            else{
            // config.accountindex = result.accountindex
            // config.favorite = result.favorite
            // config.history = result.history
            // config.sharedtome = result.sharedtome  
            //localStorage.setItem('new_releases', JSON.stringify({accountconfig:result}))
            } 
            
            localStorage.setItem('history', JSON.stringify({list:result.history}))
            localStorage.setItem('favorite', result.favorite)
            localStorage.setItem('sharedtome', JSON.stringify({list:result.sharedtome}))
            localStorage.setItem('template', JSON.stringify({list:result.template}))
            let refresh = false;
            console.log(forcerefresh);            
            if(forcerefresh) refresh = true;
            result.modifyfavorite = refresh;
            result.modifyhistory = refresh;
            result.modifysharedtome = refresh;
            result.modifytemplate = refresh;
            
            this.func.accountconfig.next(result)  

            //callback()
        }, error => {console.log(error)})    
    }

    ShareArticle(article:Global.simpleArticle, userlist:string[]){
        if(article.index<=0 || userlist.length<=0) return;
        var info:Global.ShareArticleIO = {
            message:'',
            article:article,
            emails:userlist
        }
        let headers = new HttpHeaders({'token': String(localStorage.getItem('token'))});
        this.http.post<Global.ShareArticleIO>(url + 'ShareArticle', info, {headers}).subscribe(result =>{    
            if(result.emails && result.emails.length>0){
                var emails = ''
                for(let email of result.emails)
                    emails = emails + email + '; '
                this.func.ShowPublicDialog({
                    title:'Share article',
                    content:'Failed to share to following accounts:' + emails
                })
            }
            else{
                this.func.ShowPublicDialog({
                    title:'Share article',
                    content:'Successfully shared'
                })
            }
        }, error => {console.log(error);        
        })   
    }
} 

export interface FileResult{
    Filename:string,
    bytes:Array<Byte>
}

export interface articlefulllist{
    accountindex:number,
    articles:Global.Article[]//{[key:string]:string}
    //string[],
    //articleindex:number[]
}

export interface LoginStatus{
    login:boolean
    logout:boolean
}

export const loginstatus:LoginStatus = {
    login:false,
    logout:true
}

export interface accountresult{ 
    token:string,
    message:string,
    result:boolean,
    //Account:Global.Account 和后台的接口，必须用小写！！！
    index:number
    name:string
    company:string
    department:string
    role:string //customer 0, service partner 20, staff 40 , admin 100, super admin 200
    region:string
    createtime:string
    endtime:string
    authority:number
    password:string
    email:string
}

export interface InputforAccount{ //账号信息都放在Header，所以不会用UrlParam
    //func:AccountFunc,
    Header:{[key:string]:string}
    //resultAccount:Global.Account
    //UrlParam:{[key:string]:string}
    //Body:{[key:string]:string}
}

export interface Body{
    [key:string]:string
}

export interface output{
    [key:string]:string
}

export enum AccountFunc{    
    CheckLoginStatus,
    Login,
    Logout,
    AddAccount,
    UpdateAccount,
    GetAccount,
    GetVerification,
    ResetPassword,
    ChangePassword,
    GetNameEmailThroughIndex
}

export enum ArticleFunc{
    GetOne,
    Search,
    Update,
}

export interface searcharticle{
    [key:string]:any
    //searchstr:string
    // searchtitle:true
    // searchdescription:boolean
    // searchcontent:boolean
    // morefilter:boolean
    // searchfromactived:boolean
    // searchfrom:Date
    // searchuntilactived:boolean
    // searchunitl:Date
    // fromsameregion:boolean
    // fromsamedepartment:boolean
    // onlyforme:boolean
    // maxCount:number
}

export interface IOresult{
    successful:boolean,
    message:string
}
export const ioresult:IOresult = {
    successful:true,
    message:''
}
//正确例子：
//如果是类似字典：
// let body = { a: 1 };
// this.http.post<any>(this.url, body, options).subscribe(res => {
//   this.data = res;
// });
//如果是字符串：
// let headers = new HttpHeaders({
//     'Content-Type': 'text/json'
//   });
//   let options = {
//     headers
//   };
  
//   let body = JSON.stringify('test');
//   this.http.post<any>(this.url, body, options)
//     .subscribe((data) => {
//       this.data = data;
//     });

// this.http.get(this.url, {observe: 'response', responseType: 'text'}) //此处get后面不可以用<any>
//   .subscribe((res) => {
//     let response: HttpResponse<any> = res;
//     this.data = res.body;
//   });