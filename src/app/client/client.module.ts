import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client.component';
import { AddClientComponent } from './add-client/add-client.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientSearchComponent } from './client-search/client-search.component';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [ClientComponent, AddClientComponent, ClientDetailsComponent, ClientSearchComponent],
  imports: [
    CommonModule,
    SharedModule

  ]
})
export class ClientModule { }
