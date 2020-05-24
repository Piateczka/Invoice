import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { InvoiceModule } from './invoice/invoice.module';
import { ClientModule } from './client/client.module';
import { HomeComponent } from './home/home.component';
import { InvoiceRoutingModule } from './invoice/invoice-routing.module';
import { ClientRoutingModule } from './client/client-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    InvoiceModule,
    ClientModule,
    InvoiceRoutingModule,
    ClientRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
