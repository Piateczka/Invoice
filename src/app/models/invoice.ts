import { Client } from './client';
import { InvoiceRows } from  './invoice-rows'
import { PaymentType } from './payment-type';

export interface Invoice {
    invoiceId: number;
    client: Client;
    sellDate: Date;
    issueDate: Date;
    paymentTime: number;
    month: string
    year: string
    number: string
    invoiceRow: Array<InvoiceRows>
    nettoValue: number
    grossValue: number
    paymentType: PaymentType
}
