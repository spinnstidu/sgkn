import { Component } from '@angular/core';
import * as DBInterface from './DBInterface';
import { BackEnd } from './DBInterface';
import { FuncClass } from './myFunc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BackEnd]
})

export class AppComponent {

  loginstatus: DBInterface.LoginStatus = {
    login: false,
    logout: true
  }

  loginresult: string = ''

  email = "";
  password = "";
  //url = DBInterface.url;
  hide = true;
  verifycode = ""
  MainTabIndex = 0

  logbranch = 0
  //  =  {
  //   login:false,
  //   logout:true
  // }
  // logout = !(Number(localStorage.getItem('token'))>0);
  // login = !this.logout;

  constructor(private DB: BackEnd, private func: FuncClass) {

    this.loginstatus = DBInterface.loginstatus

    console.log('checking status via server now');
    this.DB.CheckLoginStatus()
    console.log('Login status:');
    console.log(this.loginstatus.login);

    // if(this.loginstatus.logout)
    //   Func.Route('login')
    //else Func.Route('home')

  }

  ngOnInit(): void {
    this.func.route.subscribe(d => {
      // this.a=d.articleindex
      let page = d.page
      if (page === 'new' || page === 'fromtemplate')
        this.MainTabIndex = 4
      else if (page === 'article')
        this.MainTabIndex = 3
      else if (page === 'search')
        this.MainTabIndex = 2
      else if (page === 'me')
        this.MainTabIndex = 0
      else if (page === 'home') {
        this.MainTabIndex = 1
      }
    })
    this.func.preview.subscribe(p => {
      this.title = p.title
      this.preview = p.contenthtml
    })
  }

  GetToken(): void {
    // this.message = '';
    let email = this.email.trim();
    // if(email === '') {
    //   this.message = 'Please input email\n';
    // }
    let password = this.password.trim();
    // if(password ===''){
    //   this.message += 'Please input password';
    // }

    let token = localStorage.getItem('token') || '0';

    let info: DBInterface.InputforAccount = {
      Header: {
        'func': DBInterface.AccountFunc[DBInterface.AccountFunc.Login],
        'token': token, 'Email': email, 'Password': password
      }, //用于token, email, password, 等关于账号的参数   
      //resultAccount:this.DB.GetNewAccount()      
    }

    this.DB.GetAccount(info, () => {
      if (Number(localStorage.getItem('token')) > 0) {
        // this.LoginSuccessful.emit();
        this.loginstatus.login = true
        this.loginstatus.logout = false
        DBInterface.loginstatus.login = true
        DBInterface.loginstatus.logout = false
        this.logbranch = Number(localStorage.getItem('account_authority'))
        // this.func.Route('home')
      }
      else this.loginresult = 'Wronguserandpassword' //this.message = 'Failed to login, please check email and password.'
    }, () => { });


    //this.LoginSuccessful.emit();
  }

  GetVerifycode(): void {
    // this.message = '';
    let email = this.email.trim();
    // if(email === '') {
    //   this.message = 'Please input email\n';
    // }

    let token = localStorage.getItem('token') || '0';

    let info: DBInterface.InputforAccount = {
      Header: {
        'func': DBInterface.AccountFunc[DBInterface.AccountFunc.GetVerification],
        'token': token, 'Email': email
      }, //用于token, email, password, 等关于账号的参数     
      //resultAccount:this.DB.GetNewAccount()            
    }

    this.DB.GetAccount(info, () => { },
      () => { }
    );
  }

  ResetPassword(): void {
    // this.message = '';
    let email = this.email.trim();
    // if(email === '') {
    //   this.message = 'Please input email\n';
    // }
    let VerificationCode = this.verifycode.trim();

    let token = localStorage.getItem('token') || '0';

    let info: DBInterface.InputforAccount = {
      Header: {
        'func': DBInterface.AccountFunc[DBInterface.AccountFunc.ResetPassword],
        'token': token, 'Email': email, 'VerificationCode': VerificationCode
      }, //用于token, email, password, 等关于账号的参数       
      //resultAccount:this.DB.GetNewAccount()     
    }
    this.DB.PostAccount(info, () => { }, () => { });

  }

  // route(page:string){
  //   this.Func.Route(page);
  // }

  logout(): void {
    let token = Number(localStorage.getItem('token'));
    if (token > 0) {
      let info: DBInterface.InputforAccount = {
        Header: {
          'func': DBInterface.AccountFunc[DBInterface.AccountFunc.Logout],
          'token': token.toString()
        }, //用于token, email, password, 等关于账号的参数 
        //resultAccount:this.DB.GetNewAccount()                
      }

      this.DB.GetAccount(info, () => { }, () => { });
      // this.loginstatus.login = false;
      // this.loginstatus.logout = true;
    }
    localStorage.setItem('token', '0');
    DBInterface.loginstatus.login = false
    DBInterface.loginstatus.logout = true
    this.loginstatus.login = false
    this.loginstatus.logout = true
    // this.Func.Route('login')

  }

  //previewshow = false
  preview = ''
  title = ''
  previewswitch() {
    this.preview = ''
    this.title = ''
  }
}

