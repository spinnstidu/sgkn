import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {BackEnd} from '../../DBInterface';
import * as DBInterface from '../../DBInterface';
import { DatePipe } from '@angular/common';

export interface Account {
  email: string;
}

@Component({
  selector: 'app-accountadmin',
  templateUrl: './accountadmin.component.html',
  styleUrls: ['./accountadmin.component.css']
})


export class AccountadminComponent implements OnInit {

  optau = 0;
  constructor(private DB:BackEnd, public datepipe: DatePipe) {
    this.optau = Number(localStorage.getItem('account_authority'))
   }

   addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON] as const;

  addaccount_company = ''
  addaccount_department = ''
  addaccount_role = ''
  addaccount_region = ''
  addaccount_enddateactived = false
  addaccount_enddate = Date()
  InputEmails = ''
  addaccount_emails:Account[] = []
  ngOnInit(): void {
  }

  remove(account: Account): void {
    const index = this.addaccount_emails.indexOf(account);

    if (index >= 0) {
      this.addaccount_emails.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.addaccount_emails.push({email: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  addtheseemail(){
    console.log('enter');
    
    this.InputEmails = this.InputEmails.trim()
    let list = this.InputEmails.split(';')
    for(let email of list)
    {
      email = email.trim();
      this.addaccount_emails.push({email: email})
    }
    this.InputEmails = ''
  }

  addaccount()
{
  console.log('Start to add account');
  
  for(let account of this.addaccount_emails)
  {
    console.log('Current account');
    console.log(account.email);    
    
    let token = String(localStorage.getItem('token'))
    let enddate = this.datepipe.transform(this.addaccount_enddate, 'yyyy-MM-dd')
    if(enddate === null) enddate = ''
    let info:DBInterface.InputforAccount = {
      Header:{
      'func':DBInterface.AccountFunc[DBInterface.AccountFunc.AddAccount],
       'token':token,
       'email':account.email, 
       'company':this.addaccount_company.trim(),
       'department':this.addaccount_department.trim(),
       'region':this.addaccount_region.trim(),
       'role':this.addaccount_role,
       'enddateactived': this.addaccount_enddateactived.toString(),
       'enddate':enddate,
      }, //用于token, email, password, 等关于账号的参数       
      //resultAccount:this.DB.GetNewAccount()     
    }
    this.DB.PostAccount(info, ()=>{
      console.log('successful');      
      this.addaccount_emails.splice(this.addaccount_emails.indexOf(account), 1)
    }, ()=>{
      console.log('Failed');      
    }
    )
  }
}

}
