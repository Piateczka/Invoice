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
    postalCodePattern = "^\d{2}(-\d{3})?$"
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
                name: [data.name],
                nip: [data.nip],
                street: [data.street],
                buildingNumber: [data.buildingNumber],
                premiseNumber: [data.premiseNumber],
                postalcode: [data.postalCode, Validators.required, Validators.pattern(this.postalCodePattern)],
                city: [data.city],
                country: [data.country]
            })
        })

    }


    updateForm() {
        this.clientForm = this.fb.group({
            name: ['', Validators.required],
            street: ['', Validators.required],
            buildingNumber: ['', Validators.required],
            premiseNumber: ['', Validators.required],
            postalcode: ['', Validators.required, Validators.pattern(this.postalCodePattern)],
            city: ['', Validators.required],
            country: ['', Validators.required],
            nip: ['', Validators.required]
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
