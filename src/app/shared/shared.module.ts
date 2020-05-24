import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PrefixCurrencyPipe } from '../prefix-currency.pipe';



@NgModule({
  declarations: [PrefixCurrencyPipe],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule



  ],
  exports: [
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    PrefixCurrencyPipe

  ]

})
export class SharedModule { }
