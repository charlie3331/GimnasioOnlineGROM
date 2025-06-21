import { Component } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/data-access/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario3',
  standalone: true,
  templateUrl: './formulario3.component.html',
  styleUrls: ['./formulario3.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class Formulario3Component {
  nuevo = {
    clase: '',
    fecha: '',
    hora: '',
    alumno: ''
  };

  clases = ['Cardio', 'Funcional', 'Spinning', 'Box', 'CrossFit'];
  userName: string | null = null;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.authService.userName$.subscribe((name) => {
      this.userName = name;
    });
  }

  async guardar() {
  if (!this.userName) {
    Swal.fire('Error', 'No se pudo obtener el nombre del usuario.', 'error');
    return;
  }

  this.nuevo.alumno = this.userName;

  if (!this.nuevo.clase || !this.nuevo.fecha || !this.nuevo.hora) {
    Swal.fire('Campos incompletos', 'Por favor llena todos los campos.', 'warning');
    return;
  }

  try {
    const colRef = collection(this.firestore, 'asistencias');
    await addDoc(colRef, this.nuevo);

    Swal.fire('Éxito', 'Asistencia guardada correctamente', 'success');

    // Obtener usuario autenticado
    const user = await this.authService.getCurrentUser();
    const email = user?.email || null;
    const telefono = user?.phoneNumber || null;

    const mensaje = `Gracias por registrar tu asistencia.
Clase: ${this.nuevo.clase}
Fecha: ${this.nuevo.fecha}
Hora: ${this.nuevo.hora}`;

    if (email) {
      this.enviarCorreo();
      
    } else if (telefono) {
      this.enviarSMS(telefono, mensaje);
    } else {
      console.warn('Usuario sin email ni teléfono para notificación.');
    }

  } catch (error) {
    console.error('Error al guardar:', error);
    Swal.fire('Error', 'Error al guardar la asistencia', 'error');
  }
}


enviarSMS(telefono: string, mensaje: string) {
  // Aquí llamarías tu backend o Firebase Function que envía el SMS
  this.http.post('http://localhost:3000/enviar-sms', { telefono, mensaje })
    .subscribe({
      next: () =>  Swal.fire('Éxito', 'Se envio SMS', 'success'),
      error: (err) =>  Swal.fire('Error', 'No se envio SMS', 'error')
    });
    this.nuevo = {
        clase: '',
        fecha: '',
        hora: '',
        alumno: ''
      };
}

  async enviarCorreo() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user && user.email) {
    const correoDestino = user.email;
    const nombre = user.displayName || this.userName || 'Usuario';

    console.log('Datos que se enviarán al backend:', {
  correo: correoDestino,
  nombre: nombre,
  clase: this.nuevo.clase,
  fecha: this.nuevo.fecha,
  hora: this.nuevo.hora
});
    this.http.post('http://localhost:3000/enviar-asistencia', {
      correo: correoDestino,
      nombre: nombre,
      clase: this.nuevo.clase,
      fecha: this.nuevo.fecha,
      hora: this.nuevo.hora
    }).subscribe({
      next: () => {
        Swal.fire('Correo enviado', 'Se ha enviado el correo correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'Error al enviar el correo.', 'error');
      }
    });
  } else {
    Swal.fire('Error', 'No hay usuario autenticado o el usuario no tiene un correo.', 'error');
  }
   this.nuevo = {
        clase: '',
        fecha: '',
        hora: '',
        alumno: ''
      };
}


}
