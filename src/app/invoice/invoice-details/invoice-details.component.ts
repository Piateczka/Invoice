import { Component, Inject } from '@angular/core';
import { InvoiceService } from '../../invoice.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Invoice } from '../../models/invoice';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'invoice-details',
    templateUrl: './invoice-details.component.html'
})
export class InvoiceDetailsComponent {
    invoice: any[];
    invoiceData: Invoice;
    invoiceForm: FormGroup;
    client: FormGroup;
    paymentType;
    id;
    group: FormGroup[];
    numberPattern = "^[0-9.]*$";
    // postalCodePattern = "^\d{2}(-\d{3})?$"
    constructor(private inv: InvoiceService, private activateRoute: ActivatedRoute,
        private fb: FormBuilder, private _snackBar: MatSnackBar) {
        this.inv.getPaymentType().pipe().subscribe(paymentType => {
            this.paymentType = paymentType;

        })
        this.id = this.activateRoute.snapshot.params['id'];
        this.inv.getDetails(this.id).subscribe((data) => {
            this.invoiceForm = this.fb.group({
                client: this.fb.group({
                    name: [data.client.name, Validators.required],
                    nip: [data.client.nip, [Validators.required, Validators.pattern(this.numberPattern)]],
                    street: [data.client.street, Validators.required],
                    buildingNumber: [data.client.buildingNumber],
                    premiseNumber: [data.client.premiseNumber, [Validators.required, Validators.pattern(this.numberPattern)]],
                    postalcode: [data.client.postalCode, Validators.required],
                    city: [data.client.city, Validators.required],
                    country: [data.client.country, Validators.required],
                    clientId: [data.client.clientId, Validators.required]
                }),
                invoiceId: [data.invoiceId, Validators.required],
                sellDate: [data.sellDate, Validators.required],
                issueDate: [data.issueDate, Validators.required],
                month: [data.month, Validators.required],
                year: [data.year, Validators.required],
                number: [data.number, Validators.required],
                paymentTime: [data.paymentTime, Validators.required],
                paymentType: [data.paymentType, Validators.required],
                invoiceRow: this.fb.array(data.invoiceRow.map(row => this.fb.group({
                    invoiceRowId: [row.invoiceRowId],
                    name: [row.name, Validators.required],
                    unit: [row.unit, [Validators.required, Validators.pattern(this.numberPattern)]],
                    quantity: [row.quantity, [Validators.required, Validators.pattern(this.numberPattern)]],
                    varRate: [row.varRate, [Validators.required, Validators.maxLength(2), Validators.pattern(this.numberPattern)]],
                    isEditable: [false]
                }), Validators.minLength(1)))
            });
            this.setOptionValue('paymentType', data.paymentType)

        })
    }
    compareFn(optionOne, optionTwo): boolean {
        return optionOne.paymentTypeId === optionTwo.paymentTypeId;
    }
    ngOnInit(): void {
        this.updateForm()
        console.log(this.invoiceForm.touched)
    }
    gen() {
        this.inv.getDetails(this.id).pipe().subscribe(data => {
            this.invoiceData = data
            this.generatePdf(this.invoiceData)
        })
    }
    generatePdf(invoice: Invoice) {

        const documentDefinition = {

            content: [
                {
                    text: this.invoiceForm.value.number + "/" + this.invoiceForm.value.month + "/" + this.invoiceForm.value.year,
                    bold: true,
                    fontSize: 20,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                {
                    columns: [
                        [
                            {
                                text: "Sprzedawca",
                               
                            },
                            {
                                text: "Maciej Szostak",
                                style: 'name'
                            },
                            {
                                text: "Ulica 1",
                            },
                            {
                                text: "00-000 Miasto 1",
                            },
                            {
                                text: "NIP: 1111111111",
                            }
                        ],
                        [
                            {
                                text: "Nabywca",
                                margin: [80, 0, 0,0]
                            },
                            {
                                text: invoice.client.name,
                                style: 'name',
                                margin: [80, 0, 0, 0]
                            },
                            {
                                text: invoice.client.street,
                                margin: [80, 0, 0, 0]
                            },
                            {
                                text: invoice.client.postalCode + " " + invoice.client.city,
                                margin: [80, 0, 0, 0]
                            },
                            {
                                text: "NIP:" + invoice.client.nip,
                                margin: [80, 0, 0, 0]
                            }
                        ]
                    ]

                },
                {
                    text: 'Pozycje',
                    bold: true,
                    fontSize: 20,
                    alignment: 'center',
                    margin: [20, 20, 20, 20]
                },
                this.getinvoiceRowsObject(invoice.invoiceRow),
                {
                    columns: [
                        [
                            {
                                text: "Forma zapłaty: " + invoice.paymentType.paymentTypeName,
                                margin: [0, 50, 0, 0]
                            },
                            {
                                text: "Termin płatnosci: " + invoice.paymentTime + "dni",
                                
                                
                            }
                            
                        ],
                        [
                            {
                                text: "Razem: " +this.getSum(this.invoiceForm.value.invoiceRow) + " zł",
                                margin: [80, 50, 0, 0]
                            }
                        ]
                    ]
                },

            ],
            info: {
                title: invoice.number + "/" + invoice.month + "/" + invoice.year,
            },
            styles: {
                name: {
                    fontSize: 16,
                    bold: true
                }
            }
        };
        pdfMake.createPdf(documentDefinition).download(invoice.number + "/" + invoice.month
            + "/" + invoice.year + "-" + invoice.client.name);
    }
    getinvoiceRowsObject(data) {
        var NettoSum = 0;
        var GrossSum = 0;
        var VatSum = 0;
        return {
            table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*'],

                body: [
                    ['Nazwa', 'Cena netto', 'Cena brutto', 'Stawka vat'],
                    ...data.map(i => {

                        VatSum =  (i.quantity * i.unit) * i.varRate / 100;
                        NettoSum = (i.quantity * i.unit);
                        GrossSum = Math.round(NettoSum * 100) / 100 + Math.round(VatSum * 100) / 100;
                        return [i.name, Math.round(NettoSum * 100) / 100 + " zł", Math.round(GrossSum * 100) / 100 + " zł", i.varRate + "%"];
                    })
                ],
                margin: [0, 0, 0, 50]
            }
        };

        //};
    }
    getSum(data) {
        var NettoSum = 0;
        var GrossSum = 0;
        var VatSum = 0;
        data.map(i => {
            VatSum = VatSum + (i.quantity* i.unit ) * i.varRate / 100;
            NettoSum = NettoSum + (i.quantity * i.unit );
        })
        GrossSum = Math.round(NettoSum * 100) / 100 + Math.round(VatSum * 100) / 100;
        return GrossSum;
    }
    get getFormControls() {
        const control = this.invoiceForm.get('invoiceRow') as FormArray;
        return control;
    }
     setOptionValue(type: string, object) {
        return this.invoiceForm.get(type).patchValue(object)
    }

    getControlLabel(type: string) {
        return this.invoiceForm.controls[type].value;
    }
    updateForm() {
        this.invoiceForm = this.fb.group({
            client: this.fb.group({
                name: ['', Validators.required],
                clientId: ['', Validators.required],
                nip: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
                street: ['', Validators.required],
                buildingNumber: [''],
                premiseNumber: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
                postalcode: ['', Validators.required],
                country: ['', Validators.required],
                city: ['', Validators.required]
            }),
            invoiceId: ['', Validators.required],
            sellDate: ['', Validators.required],
            month: ['', Validators.required],
            year: ['', Validators.required],
            number: ['', Validators.required],
            issueDate: ['', Validators.required],
            paymentType: ['', Validators.required],
            paymentTime: ['', Validators.required],
            invoiceRow: this.fb.array([
                this.fb.group({
                    name: ['', Validators.required],
                    unit: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
                    quantity: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
                    varRate: ['', [Validators.required, Validators.maxLength(2), Validators.pattern(this.numberPattern)]],
                    isEditable: [true]
                })
            ], Validators.minLength(1))
        });
    }
    openSnackBar(message) {
        this._snackBar.open(message, '', {
            duration: 2000,
        });
    }
    editRow(group: FormGroup) {
        group.get('isEditable').setValue(true);
    }
    initiateForm() {
        return this.fb.group({
            name: ['', Validators.required],
            unit: ['', [Validators.required], Validators.pattern(this.numberPattern)],
            quantity: ['', [Validators.required], Validators.pattern(this.numberPattern)],
            varRate: ['', [Validators.required, Validators.maxLength(2), Validators.pattern(this.numberPattern)]],
            isEditable: [true]
        });
    }
    addRow() {
        const control = this.invoiceForm.get('invoiceRow') as FormArray;
        control.push(this.initiateForm());
    }
    doneRow(group: FormGroup) {
        group.get('isEditable').setValue(false);
    }

    submitForm() {
        let object = this.invoiceForm.value as Invoice
        object.nettoValue = 0.00;
        object.grossValue = 0.00;
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
        this.inv.updateInvoices(object, this.id, (data) => this.openSnackBar("Update Invoice"), (data) => this.openSnackBar(data));
        
    }
}


