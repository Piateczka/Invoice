import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { InvoiceSearchComponent } from './invoice-search/invoice-search.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [InvoiceComponent, InvoiceSearchComponent, InvoiceDetailsComponent, AddInvoiceComponent,],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class InvoiceModule { }
