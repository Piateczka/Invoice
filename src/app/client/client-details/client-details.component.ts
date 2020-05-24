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
                name: [data.name, [Validators.required]],
                nip: [data.nip, [Validators.required]],
                street: [data.street, [Validators.required]],
                buildingNumber: [data.buildingNumber],
                premiseNumber: [data.premiseNumber, [Validators.required]],
                postalcode: [data.postalCode, Validators.required],
                city: [data.city, [Validators.required]],
                country: [data.country, [Validators.required]],
            })
        })

    }


    updateForm() {
        this.clientForm = this.fb.group({
            name: ['', [Validators.required]],
            street: ['', [Validators.required]],
            buildingNumber: [''],
            premiseNumber: ['', [Validators.required]],
            postalcode: ['', Validators.required],
            city: ['', [Validators.required]],
            country: ['', [Validators.required]],
            nip: ['', [Validators.required]],
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
