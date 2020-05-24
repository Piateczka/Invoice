import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddClientComponent } from './add-client/add-client.component';
import { ClientComponent } from './client.component';
import { ClientDetailsComponent } from './client-details/client-details.component';



const clientRoutes: Routes = [  
  { path: 'addclient', component: AddClientComponent },
  { path: 'client', component: ClientComponent },
  { path: 'client/detail/:id', component: ClientDetailsComponent }
  ];

  @NgModule({
    imports: [RouterModule.forChild(clientRoutes)],
    exports: [RouterModule]
  })
export class ClientRoutingModule { }
