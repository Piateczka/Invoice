import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  numberPattern = "^[0-9]*$";
  charPattern = "^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]";
  constructor() { }
}
