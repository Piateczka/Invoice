import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, startWith, tap, catchError, retry } from 'rxjs/operators';
import { Invoice } from './models/invoice';
import { Observable, Subject, from, throwError } from 'rxjs';
import { PaymentType } from './models/payment-type';
@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    apiAddress = "https://localhost:44331"
    invoices;

    invoiceStream = new Subject();
    postId;
    headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
    constructor(private http: HttpClient) {

    }


    getInvoicesStream() {
        return from(this.invoiceStream).pipe(startWith(this.invoices))
    }

    getInvoices() {
        return this.http.get(this.apiAddress + '/invoice/GetInvoices').pipe(
            map((response: Invoice) => response))
    }
    getPaymentType() {
        return this.http.get(this.apiAddress + '/invoice/GetPaymentType').pipe(
            map((response: PaymentType) => response))
    }
    getDetails(id): Observable<Invoice> {
        return this.http.get<Invoice>(this.apiAddress + '/invoice/GetDetails/' + id).pipe(
            retry(1),
            catchError(this.errorHandl)
        )
    }
    updateInvoices(object: Invoice, id, onSuccess: (data) => void, onError: (data) => void = null) {

        var o = JSON.stringify(object);
        console.log(o);
        console.log(object as Invoice);

        this.http.put<Invoice>(this.apiAddress + '/invoice/UpdateInvoice/' + id, o, this.headers).subscribe(data => {
            onSuccess(data)

        },

            err => {
                onError(err.message);
            })
    }
    addInvoices(object: Invoice, onSuccess: (data) => void, onError: (data) => void = null) {

        var o = JSON.stringify(object);
        console.log(o);
        console.log(object as Invoice);

        this.http.post<Invoice>(this.apiAddress + '/invoice/AddInvoice', o, this.headers).subscribe(data => {
            onSuccess(data)

        },

            err => {
                onError(err.message);
            })
    }
    deleteInvoice(id) {
        return this.http.delete(this.apiAddress + '/invoice/DeleteInvoice/' + id, this.headers).pipe(
            map((response: Invoice) => {

                return response
            })).subscribe(invoices => {
                this.invoices = invoices
                this.invoiceStream.next(this.invoices)
            })
    }

    searchInvoiceByNumber(query) {
        this.http.get(this.apiAddress + '/invoice/FindInvoiceByNumber&query=' + query).pipe(
            map((response: Invoice) => {
                return response;

            })).subscribe(invoices => {
                this.invoices = invoices
                console.log(invoices as Invoice)
                this.invoiceStream.next(this.invoices)
            })
    }

    errorHandl(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
    }

}
