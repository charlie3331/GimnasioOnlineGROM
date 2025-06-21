import { FormGroup, ValidationErrors } from '@angular/forms';

export function matchContra(group: FormGroup): ValidationErrors | null {
    // aquí se obtiene el valor del campo 'contrasena' del FormGroup
  const pass = group.get('contrasena')?.value;

  //aquí se obtiene el valor del campo 'confirmarContrasena' del FormGroup
  const confirm = group.get('confirmarContrasena')?.value;

    // Compara si ambos valores son iguales
  return pass === confirm
    ? null
    : {
        passwordsMismatch: 'Las contraseñas no coinciden',
      };
}