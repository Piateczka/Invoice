import { Component, Inject } from '@angular/core';
import { InvoiceService } from '../../invoice.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { filter, distinctUntilChanged, debounceTime } from 'rxjs/operators';



@Component({
    selector: 'invoice-search',
    templateUrl: './invoice-search.component.html'
})
export class InvoiceSearchComponent {
    invoices;
    invoiceFindForm: FormGroup;

    constructor(private fb: FormBuilder, private inv: InvoiceService) {
        this.invoiceFindForm = this.fb.group({
            number: ['', Validators.pattern("^[0-9]*$")]
        });
        this.invoiceFindForm.get('number').valueChanges.pipe(
            filter(query => query.length >= 0),
            distinctUntilChanged(),
            debounceTime(300)
        ).subscribe(query => {
            console.log(query.indexOf("/"))
            if (query.indexOf("/") == -1) {
                this.inv.searchInvoiceByNumber(query);
            }

        })
        //this.inv.getInvoices().subscribe(invoices => {
        //    this.invoices = invoices
        //}, error => console.error(error));
    }
    ngOnInit(): void {


    }
}

