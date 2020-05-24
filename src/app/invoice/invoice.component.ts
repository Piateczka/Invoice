import { Component, Inject } from '@angular/core';;
import { InvoiceService } from '../invoice.service';
import { InvoiceRows } from '../models/invoice-rows';


@Component({
    selector: 'invoice',
    templateUrl: './invoice.component.html'
})
export class InvoiceComponent {
    public invoices;
    inv: InvoiceRows [];
    constructor(private invoice: InvoiceService) {
        this.invoices = this.invoice.getInvoicesStream();
    }
    deleteRow(index: number) {
        this.invoice.deleteInvoice(index);

    }

    ngOnInit(): void {
        this.invoices = this.invoice.getInvoicesStream();


    }
}

