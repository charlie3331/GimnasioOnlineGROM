import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ContraValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';

  //esta es la expresión regular que define las reglas para una contraseña válida:
  const regex = /^(?=.[A-Z])(?=.\d)[A-Za-z\d]{8,16}$/;

  // ^(?=.[A-Z])   - debe tener al menos una letra mayúscula
  // (?=.\d)       - necesita tener al menos un dígito
  // [A-Za-z\d]    - solo permite letras (no importa si son mayusculas o minusculas), dígitos o guión bajo
  // {8,16}$        - longitud entre 8 y 16 caracteres

  // aquí se evalua si el valor cumple con la expresión regular
  return regex.test(value)
    ? null
    : {
        invalidPassword: 'Debe tener mayúscula, dígito y solo letras, dígitos o "_"',
      };
}