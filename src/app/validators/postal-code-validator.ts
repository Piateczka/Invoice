import { AbstractControl } from '@angular/forms'

export function postalCodeValidator(
  control: AbstractControl
): { [key: string]: any } | null {

  const valid = /^\d{2}(-\d{3})?$/.test(control.value)
  return valid
    ? null
    : { invalidPostalCode: { valid: false, value: control.value } }
}