import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InvoiceService } from '../../invoice.service';
import { filter, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../client.service'
import { Invoice } from '../../models/invoice';
import { ValidationService } from 'src/app/validation.service';



@Component({
    selector: 'add-invoice',
    templateUrl: './add-invoice.component.html'
})
export class AddInvoiceComponent {

    
    clientsAutoComplete;

    clientsNipAutoComplete;
    paymentType;
    invoiceForm: FormGroup;
    control: FormArray;
    mode: boolean;
    touchedinvoiceRow: any;
    constructor(private fb: FormBuilder, private inv: InvoiceService, private _snackBar: MatSnackBar,
        private validation: ValidationService, private c: ClientService) {
        this.inv.getPaymentType().pipe().subscribe(paymentType => {
            this.paymentType = paymentType;

        })
        this.touchedinvoiceRow = [];
        this.invoiceForm = this.fb.group({
            client: this.fb.group({
                name: ['', [Validators.required, Validators.pattern(this.validation.charPattern)]],
                nip: ['', [Validators.required, Validators.pattern(this.validation.numberPattern)]],
                street: ['', Validators.required],
                buildingNumber: [''],
                premiseNumber: ['', [Validators.required,Validators.pattern(this.validation.numberPattern)]],
                postalcode: ['', [Validators.required]],
                country: ['',[Validators.required, Validators.pattern(this.validation.charPattern)]],
                city: ['', [Validators.required, Validators.pattern(this.validation.charPattern)]],
            }),
            sellDate: ['', Validators.required],
            issueDate: ['', Validators.required],
            paymentType: ['', Validators.required],
            paymentTime: ['', Validators.required],
            invoiceRow: this.fb.array([
                this.fb.group({
                    name: ['', [Validators.required, Validators.pattern(this.validation.charPattern)]],
                    unit: ['', [Validators.required, Validators.pattern(this.validation.numberPattern)]],
                    quantity: ['', [Validators.required, Validators.pattern(this.validation.numberPattern)]],
                    varRate: ['', [Validators.required, Validators.maxLength(2), Validators.pattern(this.validation.numberPattern)]],
                    isEditable: [true]

                })
            ], Validators.required )
        });
        this.invoiceForm.get('client.name').valueChanges.pipe(
            filter(query => query.length >= 3),
            distinctUntilChanged(),
            debounceTime(300)
          ).subscribe(query => {
              this.c.searchClientByName(query);
          })
        this.invoiceForm.get('client.nip').valueChanges.pipe(
            filter(query => query.length >= 3),
            distinctUntilChanged(),
            debounceTime(300)
        ).subscribe(query => {
            this.c.searchClientByNip(query);
        })



    }


    ngOnInit(): void {
        this.clientsAutoComplete = this.c.getClientsStream();
        this.clientsNipAutoComplete = this.c.getClientsStream();
    }
    ngAfterOnInit() {
        this.control = this.invoiceForm.get('invoiceRow') as FormArray;
    }

    initiateForm() {
        return this.fb.group({
            name: ['', Validators.required],
            unit: ['', [Validators.required]],
            quantity: ['', [Validators.required]],
            varRate: ['', [Validators.required, Validators.maxLength(2)]],
            isEditable: [true]
        });
    }

    addRow() {
        const control = this.invoiceForm.get('invoiceRow') as FormArray;
        control.push(this.initiateForm());
    }

    deleteRow(index: number) {
        const control = this.invoiceForm.get('invoiceRow') as FormArray;
        control.removeAt(index);
    }
    openSnackBar(message) {
        this._snackBar.open(message,'' ,{
            duration: 2000,
        });
    }

    editRow(group: FormGroup) {
        group.get('isEditable').setValue(true);
    }

    doneRow(group: FormGroup) {
        group.get('isEditable').setValue(false);
    }

    saveUserDetails() {
        console.log(this.invoiceForm.value);
    }

    get getFormControls() {
        const control = this.invoiceForm.get('invoiceRow') as FormArray;
        return control;
    }

    submitForm() {
        let object = this.invoiceForm.value as Invoice
        object.nettoValue = 0;
        object.grossValue = 0;
        let rows = object.invoiceRow;
        for (let i = 0; i < object.invoiceRow.length; i++) {
            object.invoiceRow[i].quantity = Number(rows[i].quantity)
            object.invoiceRow[i].unit = Number(rows[i].unit)
            object.invoiceRow[i].varRate = Number(rows[i].varRate)
            let vat = (Number(rows[i].unit) * Number(rows[i].quantity)) * Number(rows[i].varRate) / 100
            let netto = (Number(rows[i].unit) * Number(rows[i].quantity))
            let gross = netto + vat;
            object.nettoValue = object.nettoValue + netto;
            object.grossValue = object.grossValue + gross;
        }
        this.inv.addInvoices(object, (data) => this.openSnackBar("Added Invoice"), (data) => this.openSnackBar(data));
    }

}
