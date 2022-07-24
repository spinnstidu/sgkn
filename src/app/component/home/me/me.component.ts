import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams} from '@angular/common/http';
import * as Global from '../../../definition';
import * as DBInterface from '../../../DBInterface';
import { FuncClass } from 'src/app/myFunc';
// import {PublicdialogComponent} from '../../Dialog/publicdialog/publicdialog.component'
// import * as dialogdata from '../../Dialog/publicdialog/publicdialog.component'
// import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css']
})
export class MeComponent implements OnInit {
  @Output() Logout = new EventEmitter();
  Index = Number(localStorage.getItem('account_index')?.toString()||'-1');
  Name = localStorage.getItem('account_name')?.toString()||'';
  Company = localStorage.getItem('account_company')?.toString()||'';
  Department = localStorage.getItem('account_department')?.toString()||'';
  Role = localStorage.getItem('account_role')?.toString()||'';
  Region = localStorage.getItem('account_region')?.toString()||'';
  Createtime = localStorage.getItem('account_createtime')?.toString();
  Endtime = localStorage.getItem('account_endtime')?.toString();
  Authority = Number(localStorage.getItem('account_authority')?.toString()||'0');
  Email = localStorage.getItem('account_email')?.toString()||'';


  // Createtime:any = ''
  // Endtime:any = ''
  Password = ''
  NewPassword1 = ''
  NewPassword2 = ''
  //account:any

  message:string = ''

  hide1 = true
  hide2 = true
  hide3 = true

  nameinput = this.Name.trim() === ''
  companyinput = this.Company.trim() === ''
  departmentinput = this.Department.trim() ===''
  regioninput = this.Region.trim() === ''
  modify:boolean = this.nameinput||this.companyinput||this.departmentinput||this.regioninput

  modifypasswordmessage = ''

  constructor(private http:HttpClient, private DB:DBInterface.BackEnd, private Func:FuncClass) { 
    //this.LoadAccount();
  }  

  ngOnInit(): void {
    this.Func.account.subscribe(d=>{
      if(d.Index === 0 || d.Email === 'empty') return;
      this.Name = d.name
      this.Authority = d.Authority
      this.Company = d.Company
      this.Createtime = d.Createtime
      this.Email = d.Email
      this.Endtime = d.Endtime
      this.Index = d.Index
      this.Region = d.Region
      this.Role = d.Role
      this.Department = d.Department

      this.nameinput = this.Name === ''
      this.companyinput = this.Company === ''
      this.departmentinput = this.Department ===''
      this.regioninput = this.Region === ''
      this.modify = this.nameinput||this.companyinput||this.departmentinput||this.regioninput||this.Authority>=150
    })
    console.log(this.modify);
    
    // if(Number(localStorage.getItem('token'))<=0) this.Func.Route('login');
  }

  ChangePassword():void{
    this.NewPassword1 = this.NewPassword1.trim();
    this.NewPassword2 = this.NewPassword2.trim();
    this.message = ''
    if(this.NewPassword1!==this.NewPassword2) {this.message = "Please input same new password"; return;}

    let token:string = String(localStorage.getItem('token'));

    let info:DBInterface.InputforAccount = {
      Header:{'func':DBInterface.AccountFunc[DBInterface.AccountFunc.ChangePassword],
       'token':token,'email':this.Email,'oldpassword': this.Password.trim(), 'newpassword': this.NewPassword1}, //用于token, email, password, 等关于账号的参数            
       //resultAccount:this.DB.GetNewAccount()     
      }
   
  this.DB.PostAccount(info,()=>{
    localStorage.setItem('token','0'); this.Logout.emit();},
    ()=> {console.log('Failed to reset password');}
    );
  }

  Modify():void{
    let token = String(localStorage.getItem('token'))
    let info:DBInterface.InputforAccount = {
      Header:{
      'func':DBInterface.AccountFunc[DBInterface.AccountFunc.UpdateAccount],
       'token':token,
       'company':this.Company.trim(),
       'department':this.Department.trim(),
       'region':this.Region.trim(),
       'name':this.Name.trim(),
      }, //用于token, email, password, 等关于账号的参数       
      //resultAccount:this.DB.GetNewAccount()     
    }
    this.DB.PostAccount(info, ()=>{
      this.Func.ShowPublicDialog({
        title:'Successful!',
        content: 'Account updated, please re-login to refresh!'
      })          
    }, ()=>{
      this.Func.ShowPublicDialog({
        title:'Failed!',
        content: 'Account update failed'
      })       

      this.Name = String(localStorage.getItem('account_name'))
      this.Company = String(localStorage.getItem('account_company'))
      this.Department = String(localStorage.getItem('account_department'))
      this.Region = String(localStorage.getItem('account_region'))
    }
    )
  }
}

