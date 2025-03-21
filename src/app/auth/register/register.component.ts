import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//IMPORTACIONES PARA LOS FORMULARIOS
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  title = 'Register';
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private auth:AuthService) {
    this.registerForm = this.fb.group({
      // nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(18)]],
      confirmPassword: ['', [Validators.required, Validators.min(18)]],
    });
  }

  onSubmit() {
    // LOGICA DEL FORMULARIO
    if (this.registerForm.valid) {
      console.log('Formulario válido:', this.registerForm.value);
      this.auth.registerUser(this.registerForm.value).subscribe(
        (res) => {
          // Solo admite respuestas de tipo json sino salta error
          console.log('Respuesta de la API:', res);
        },
        (error) => {
          console.error('Error al enviar los datos:', error);
        })
    } else {
      console.log('Formulario inválido');
    }
  }
}
