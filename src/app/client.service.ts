import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, catchError, startWith } from 'rxjs/operators';
import {  throwError, Observable, from, Subject } from 'rxjs';
import { Client } from './models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  apiAddress = "https://localhost:44331"
  clients;
  clientsStream = new Subject();
  headers = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
  }
  constructor(private http: HttpClient) {

  }
  getClientsStream() {
      return from(this.clientsStream).pipe(startWith(this.clients))
  }
  getClients() {
      return this.http.get(this.apiAddress + '/client/GetClients').pipe(
          map((response: Client) => response))
  }

  getClient(id): Observable<Client> {
      return this.http.get<Client>(this.apiAddress + '/client/GetClient/' + id).pipe(
          retry(1),
          catchError(this.errorHandl)
      )
  }
  deleteClient(id) {
      let headers = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      }
      return this.http.delete(this.apiAddress + '/client/DeleteClient/' + id, headers).pipe(
          map((response: Client) => {

              return response
          })).subscribe(clients => {
              this.clients = clients
              console.log(clients)
              this.clientsStream.next(this.clients)
          })
  }
  searchClientByName(query) {
      this.http.get(this.apiAddress + '/client/FindClientByName&query=' + query).pipe(
          map((response: Client) => {
              return response;

          })).subscribe(clients => {
              this.clients = clients
              console.log(clients)
              this.clientsStream.next(this.clients)
          })
  }
  searchClientByNip(query) {
      this.http.get(this.apiAddress + '/client/FindClientByNip&query=' + query).pipe(
          map((response: Client) => {
              return response;

          })).subscribe(clients => {
              this.clients = clients
              console.log(clients as Client)
              this.clientsStream.next(this.clients)
          })
  }
  addClient(object: Client, onSuccess: (data) => void, onError: (data) => void = null) {
      var o = JSON.stringify(object);
      let headers = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      }
      return this.http.post<Client>(this.apiAddress + '/client/AddClient', o, headers).subscribe(data => {
          onSuccess(data);
      },
          err => {
              onError(err.message);
          }
      )
  }
  updateClient(object: Client, id, onSuccess: (data) => void, onError: (data) => void = null) {
      var o = JSON.stringify(object);
      let headers = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      }
      return this.http.put<Client>(this.apiAddress + '/client/UpdateClient/' + id, o, headers).subscribe(data => {
          onSuccess(data);
      },
          err => {
              onError(err.message);
          }
      )
  }
  errorHandl(error) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
      } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log(errorMessage);
      return throwError(errorMessage);
  }
}
