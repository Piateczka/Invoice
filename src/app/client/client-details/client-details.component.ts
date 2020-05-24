import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Client } from '../../models/client';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../client.service';
@Component({
    selector: 'client-details',
    templateUrl: './client-details.component.html'
})

export class ClientDetailsComponent {
    numberPattern = "^[0-9]*$";
    charPattern = "^[a-zA-Z]+$";
    clients : Client;
    clientForm: FormGroup;
     id;
    ngOnInit() {

        this.updateForm()


    }
    constructor(private fb: FormBuilder,  private c: ClientService,  private activateRoute: ActivatedRoute, private _snackBar: MatSnackBar) {


         this.id = this.activateRoute.snapshot.params['id'];



        this.c.getClient(this.id).subscribe((data) => {
            this.clientForm = this.fb.group({
                name: [data.name, [Validators.required, Validators.pattern(this.charPattern)]],
                nip: [data.nip, [Validators.required, Validators.pattern(this.numberPattern)]],
                street: [data.street, [Validators.required, Validators.pattern(this.charPattern)]],
                buildingNumber: [data.buildingNumber],
                premiseNumber: [data.premiseNumber, [Validators.required, Validators.pattern(this.numberPattern)]],
                postalcode: [data.postalCode, Validators.required],
                city: [data.city, [Validators.required,Validators.pattern(this.charPattern)]],
                country: [data.country, [Validators.required, Validators.pattern(this.charPattern)]],
            })
        })

    }


    updateForm() {
        this.clientForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern(this.charPattern)]],
            street: ['', [Validators.required, Validators.pattern(this.charPattern)]],
            buildingNumber: [''],
            premiseNumber: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
            postalcode: ['', Validators.required],
            city: ['', [Validators.required,Validators.pattern(this.charPattern)]],
            country: ['', [Validators.required, Validators.pattern(this.charPattern)]],
            nip: ['', [Validators.required, Validators.pattern(this.numberPattern)]],
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
