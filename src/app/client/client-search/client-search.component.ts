import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ClientService } from '../../client.service';

@Component({
    selector: 'client-search',
    templateUrl: './client-search.component.html'
})

export class ClientSearchComponent {
    clients;
    clientFindForm: FormGroup;
    constructor(private fb: FormBuilder, private c: ClientService) {

        this.clientFindForm = this.fb.group({
            nip: ['']
        });
        this.clientFindForm.get('nip').valueChanges.pipe(
            filter(query => query.length >= 3),
            distinctUntilChanged(),
            debounceTime(300)
        ).subscribe(query => {
            this.c.searchClientByNip(query);
        })
        this.c.getClients().subscribe(clients => {
            this.clients = clients
        }, error => console.error(error));
    }

    ngOnInit(): void {}
}
