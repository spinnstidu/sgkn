import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ControlValueAccessor } from '@angular/forms';
// import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClipboardModule } from 'ngx-clipboard';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { MeComponent } from './component/home/me/me.component';
import { DialogContentWarnSaveDialog, NewArticleComponent } from './component/home/new-article/new-article.component';
import { ShowArticleComponent } from './component/home/show-article/show-article.component';
import { FuncClass } from './myFunc';
import { SafeHtmlPipe } from './myFunc';
import { ArticleComponent } from './component/home/article/article.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GetRouterParamComponent } from './component/get-router-param/get-router-param.component';
import { PublicdialogComponent } from './component/Dialog/publicdialog/publicdialog.component';
import { AccountadminComponent } from './component/accountadmin/accountadmin.component';
import { SinglearticleinfoComponent } from './component/home/Smallcomponent/singlearticleinfo/singlearticleinfo.component';
import { BackEnd } from './DBInterface';
import { InputemailsComponent } from './component/Dialog/inputemails/inputemails.component';
import { ArticletypeselectionComponent } from './component/home/Smallcomponent/articletypeselection/articletypeselection.component';
import { InputimagesforhtmlComponent } from './component/Dialog/inputimagesforhtml/inputimagesforhtml.component';
import { AutocompletetitleComponent } from './component/home/Smallcomponent/autocompletetitle/autocompletetitle.component';

const appRoutes: Routes = [
  //{path: 'route', component: AppComponent},
  //{ path: 'route', component: GetRouterParamComponent },
  { path: '', component: GetRouterParamComponent },
  //{ path: 'route', component: GetRouterParamComponent }
  // {path: 'root/:index', component: AppComponent},
  // {path: 'home', component: HomeComponent},
  // {path: 'me', component:MeComponent},
  // {path: 'new', component:NewArticleComponent},
  // {path: 'new/:index', component:NewArticleComponent},
  // {path: 'search', component:ShowArticleComponent},
  // {path: 'search/:title', component:ShowArticleComponent},
  // {path: 'article', component:ArticleComponent},
  // {path: 'article/:index', component:ArticleComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MeComponent,
    NewArticleComponent,
    ShowArticleComponent,
    ArticleComponent,
    DialogContentWarnSaveDialog,
    GetRouterParamComponent,
    PublicdialogComponent,
    AccountadminComponent,
    SinglearticleinfoComponent,
    SafeHtmlPipe,
    InputemailsComponent,
    ArticletypeselectionComponent,
    InputimagesforhtmlComponent,
    AutocompletetitleComponent,
  ],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatGridListModule,
    MatDialogModule,
    MatChipsModule,
    MatDividerModule,
    MatTreeModule,
    MatListModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    ClipboardModule,
    TextFieldModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    BrowserAnimationsModule,
  ],
  providers: [FuncClass, DatePipe, BackEnd,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
