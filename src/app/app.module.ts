import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomepageModule } from './homepage/homepage.module';
import { AuthenModule } from './authen/authen.module';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomepageModule,
    AuthenModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
