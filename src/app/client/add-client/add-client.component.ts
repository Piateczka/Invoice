import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClientService } from '../../client.service';
import { Client } from '../../models/client';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'add-client',
    templateUrl: './add-client.component.html'
})

export class AddClientComponent {
    client: Client;
    numberPattern = "^[0-9]*$";
    charPattern = "^[a-zA-Z]+$";

    clientForm: FormGroup;
    constructor(private fb: FormBuilder, private c: ClientService, private _snackBar: MatSnackBar) {

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
        this.c.addClient(this.clientForm.value as Client, (data) => this.openSnackBar("Added Client"), (data) => this.openSnackBar(data));

    }


}
