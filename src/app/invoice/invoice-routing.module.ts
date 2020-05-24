import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';

const invoiceRoutes: Routes = [  
{ path: 'invoice', component: InvoiceComponent },
{ path: 'invoice/detail/:id', component: InvoiceDetailsComponent },
{ path: 'addinvoice', component: AddInvoiceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(invoiceRoutes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
