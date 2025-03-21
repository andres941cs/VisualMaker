import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { RouterOutlet } from '@angular/router';
//IMPORTACIONES PARA LOS FORMULARIOS
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  // imports: [RouterOutlet, ReactiveFormsModule],
  imports: [ ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'Login';
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth:AuthService, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(18)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario válido:', this.loginForm.value);
      this.auth.loginUser(this.loginForm.value).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error al enviar los datos:', error);
        })
    } else {
      console.log('Formulario inválido');
    }
  }
}
