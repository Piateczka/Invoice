import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Client } from '../../models/client';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../client.service';
import { ValidationService } from 'src/app/validation.service';
@Component({
    selector: 'client-details',
    templateUrl: './client-details.component.html'
})

export class ClientDetailsComponent {

    clients : Client;
    clientForm: FormGroup;
     id;
    ngOnInit() {

        this.updateForm()


    }
    constructor(private fb: FormBuilder,  private c: ClientService,  private activateRoute: ActivatedRoute,
        private validation : ValidationService, private _snackBar: MatSnackBar) {


         this.id = this.activateRoute.snapshot.params['id'];



        this.c.getClient(this.id).subscribe((data) => {
            this.clientForm = this.fb.group({
                name: [data.name, [Validators.required, Validators.pattern(this.validation.charPattern)]],
                nip: [data.nip, [Validators.required, Validators.pattern(this.validation.numberPattern)]],
                street: [data.street, [Validators.required, Validators.pattern(this.validation.charPattern)]],
                buildingNumber: [data.buildingNumber],
                premiseNumber: [data.premiseNumber, [Validators.required, Validators.pattern(this.validation.numberPattern)]],
                postalcode: [data.postalCode, Validators.required],
                city: [data.city, [Validators.required,Validators.pattern(this.validation.charPattern)]],
                country: [data.country, [Validators.required, Validators.pattern(this.validation.charPattern)]],
            })
        })

    }


    updateForm() {
        this.clientForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern(this.validation.charPattern)]],
            street: ['', [Validators.required, Validators.pattern(this.validation.charPattern)]],
            buildingNumber: [''],
            premiseNumber: ['', [Validators.required, Validators.pattern(this.validation.numberPattern)]],
            postalcode: ['', Validators.required],
            city: ['', [Validators.required,Validators.pattern(this.validation.charPattern)]],
            country: ['', [Validators.required, Validators.pattern(this.validation.charPattern)]],
            nip: ['', [Validators.required, Validators.pattern(this.validation.numberPattern)]],
        });
    }
    openSnackBar(message) {
        this._snackBar.open(message, '', {
            duration: 2000,
        });
    }
    submitForm() {
        console.log(this.clientForm.value)
        this.c.updateClient(this.clientForm.value as Client,this.id, (data) => this.openSnackBar("Update Client"), (data) => this.openSnackBar(data));

    }
}
