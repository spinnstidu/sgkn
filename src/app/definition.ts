'use strict';

import { Byte } from "@angular/compiler/src/util";

// localStorage.setItem("token", "0"); 
// localStorage.setItem('account_index', '0');
// localStorage.setItem('account_name', 'empty');
// localStorage.setItem('account_company', 'empty');
// localStorage.setItem('account_department', 'empty');
// localStorage.setItem('account_role', 'empty');
// localStorage.setItem('account_region', 'empty');
// localStorage.setItem('account_authority', '0');
// localStorage.setItem('account_email','empty');
// export enum ArticleType{
//     Knowledge,
//     Record,
//     Manage,
//     Template
// }

export const FixedWidth = '700px'

export const CurentShowing:Article = {
    index:-1,
    title:'', //不允许重复，以免出现链接bug
    description:'', //描述，帮助搜索
    contenthtml:'', //全文
    contenttext:'', //用于搜索        
    ownerIndex:'', //accountName, not email
    otherauthors:'', //OwnerID OwnerID OwnerID ...... 方便搜索。分隔符在程序中定义, 此项可以缺省
    region:'', //生成的时候跟随作者
    department:'', //生成的时候跟随作者
    group:'', //团队;可以缺省，用于对应特定的团队，比如项目团队，部门子团队。
    forotherdepartment :'',
    forotherregion:'', 
    forothergroup :'',
    authority:0, //账号不低于此值的才能看到文档，
    appendix:[], //附件的文档,在FS中的Index, 以分隔符分开
    comment:'', //comment总是以6个信息节组成：Index(唯一）书写人accountIndex, 书写人名字，comment内容，comment时间，comment对象（可以为正文，就是0，也可以为其他comment Index)
    onlyforowner:false, //是否个人专属，比如是作为个人的收藏夹使用
    createtime:'', 
    lastedittime:'', 
    read:0, //记录文章被读取多少次
    result:'', //仅作为网络通讯的信息传递
    newarticle:true,
    articletype: 'Knowledge',//ArticleType.Knowledge.toString(),
    actived:false
}

export const CurentEditing:Article = {
    index:-1,
    title:'', //不允许重复，以免出现链接bug
    description:'', //描述，帮助搜索
    contenthtml:'', //全文
    contenttext:'', //用于搜索        
    ownerIndex:'', //accountName, not email
    otherauthors:'', //OwnerID OwnerID OwnerID ...... 方便搜索。分隔符在程序中定义, 此项可以缺省
    region:'', //生成的时候跟随作者
    department:'', //生成的时候跟随作者
    group:'', //团队;可以缺省，用于对应特定的团队，比如项目团队，部门子团队。
    forotherdepartment :'',
    forotherregion:'', 
    forothergroup :'',
    authority:0, //账号不低于此值的才能看到文档，
    appendix:[], //附件的文档,在FS中的Index, 以分隔符分开
    comment:'', //comment总是以6个信息节组成：Index(唯一）书写人accountIndex, 书写人名字，comment内容，comment时间，comment对象（可以为正文，就是0，也可以为其他comment Index)
    onlyforowner:false, //是否个人专属，比如是作为个人的收藏夹使用
    createtime:'', 
    lastedittime:'', 
    read:0, //记录文章被读取多少次
    result:'', //仅作为网络通讯的信息传递
    newarticle:true,
    articletype:'Knowledge',//ArticleType.Knowledge.toString(),
    actived:false
}

export interface Account{
    Index:number
    name:string
    Company:string
    Department:string
    Role:string //customer 0, service partner 20, staff 40 , admin 100, super admin 200
    Region:string
    Createtime:string
    Endtime:string
    Authority:number
    Password:string
    Email:string
}

export const emptyaccount:Account = {
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

export enum Role
{
    customer,
    servicepartner,
    sungrow_low,
    sungrow,
    sungorw_high,
    admin,
    globe_admin,
    super_admin
}

export interface accountconfig{
    accountindex:number
    modifyfavorite:boolean
    favorite:string //html
    modifyhistory:boolean
    history:simpleArticle[]
    modifysharedtome:boolean
    sharedtome:simpleArticle[] //使用其中的comment来传输信息，比如从谁转来的
    modifytemplate:boolean
    template:simpleArticle[]
}

export interface Article{
     index:number
     title:string //不允许重复，以免出现链接bug
     description:string //描述，帮助搜索
     contenthtml:string //全文
     contenttext:string //用于搜索        
     ownerIndex:string //accountName, not email
     otherauthors:string //OwnerID OwnerID OwnerID ...... 方便搜索。分隔符在程序中定义, 此项可以缺省
     region:string //生成的时候跟随作者
     department:string //生成的时候跟随作者
     group:string //团队;可以缺省，用于对应特定的团队，比如项目团队，部门子团队。
     forotherdepartment :string
     forotherregion:string 
     forothergroup :string
     authority:number //账号不低于此值的才能看到文档，
     appendix:string[] //附件的文档,在FS中的Index, 以分隔符分开
     comment:string //comment总是以6个信息节组成：Index(唯一）书写人accountIndex, 书写人名字，comment内容，comment时间，comment对象（可以为正文，就是0，也可以为其他comment Index)
     onlyforowner:boolean //是否个人专属，比如是作为个人的收藏夹使用
     createtime:string 
     lastedittime:string 
     read:number //记录文章被读取多少次
     result:string //仅作为网络通讯的信息传递
     newarticle:boolean
     articletype:string
     actived:boolean
}

export interface fileinbyte{
    file:string
    length:number
}

export interface simpleArticle{
    index:number
    title:string //不允许重复，以免出现链接bug
    description:string //描述，帮助搜索
    contenttext:string //用于搜索        
    ownerIndex:string //accountName, not email
    otherauthors:string //OwnerID OwnerID OwnerID ...... 方便搜索。分隔符在程序中定义, 此项可以缺省
    region:string //生成的时候跟随作者
    department:string //生成的时候跟随作者
    group:string //团队;可以缺省，用于对应特定的团队，比如项目团队，部门子团队。
    forotherdepartment :string
    forotherregion:string 
    forothergroup :string
    authority:number //账号不低于此值的才能看到文档，
    comment:string //comment总是以6个信息节组成：Index(唯一）书写人accountIndex, 书写人名字，comment内容，comment时间，comment对象（可以为正文，就是0，也可以为其他comment Index)
    onlyforowner:boolean //是否个人专属，比如是作为个人的收藏夹使用
    createtime:string 
    lastedittime:string 
    read:number //记录文章被读取多少次
}

export interface FileInfo{[key:string]:string}
export interface FileResult{
    token:string
    index:string
    title:string //不允许重复，以免出现链接bug
    description:string //描述，帮助搜索
    file:File //全文
    ownerIndex:string //accountName, not email
    otherauthors:string //OwnerID OwnerID OwnerID ...... 方便搜索。分隔符在程序中定义, 此项可以缺省
    region:string //生成的时候跟随作者
    department:string //生成的时候跟随作者
    group:string //团队;可以缺省，用于对应特定的团队，比如项目团队，部门子团队。
    forotherdepartment:string
    forotherregion:string 
    forothergroup:string
    authority:string //账号不低于此值的才能看到文档， 
    onlyforowner:string //是否个人专属，比如是作为个人的收藏夹使用
    result:string //仅作为网络通讯的信息传递
}

export interface ShareArticleIO{
    message:string
    article:simpleArticle
    emails:string[]
}

