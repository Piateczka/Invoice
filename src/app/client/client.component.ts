import { Component } from '@angular/core';
import { ClientService } from '../client.service';

@Component({
    selector: 'client',
    templateUrl: './client.component.html'
})

export class ClientComponent {
    clients;
    constructor(private c: ClientService) {
       
       
    }
    deleteRow(index: number) {
        this.c.deleteClient(index);

    }
    ngOnInit(): void {
        this.clients = this.c.getClientsStream();
    }
}
