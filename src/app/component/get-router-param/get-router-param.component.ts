import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuncClass } from 'src/app/myFunc';
import * as funcclass from 'src/app/myFunc';

@Component({
  selector: 'app-get-router-param',
  templateUrl: './get-router-param.component.html',
  styleUrls: ['./get-router-param.component.css']
})
export class GetRouterParamComponent implements OnInit {

  constructor(private router:ActivatedRoute, private func:FuncClass) { 
    this.router.queryParams.subscribe(param=>{
      // console.log(param['index']);
      let index = Number(param['articleindex'])
      let page = String(param['page'])
      console.log(param);      
      console.log('forwarding to page ' + page);
      console.log('article index ' + index);
            
      this.func.route.next({
        articleindex: index,
        page:page,
      })
    })
  }
  // public a:number=1
  ngOnInit(): void {
    // this.func.function.subscribe(d=>{
    //   this.a=d.articleindex
    // })
  }

  // test():void{
    
  //   this.func.function.next({
  //     articleindex:this.func.function.value.articleindex+1,
  //     page:'ok',
  //     NewTab:true
  //   })
  //   console.log(this.func.function.value.articleindex);
    
  // }

}
