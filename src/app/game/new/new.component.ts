import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  title:string = 'New Game';
  dataGame = "";
  gameForm: FormGroup;

  constructor(private fb: FormBuilder, private api:ApiService, private router:Router) {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required, Validators.min(12)]],
      author: ['', [Validators.required]],
      price: ['', [Validators.required]],
      release_date: ['', [Validators.required]],
      data: ['', [Validators.required, Validators.min(18)]],
    });
  }
  onSubmit() {
    if (this.gameForm.valid) {
      console.log('Formulario válido:', this.gameForm.value);
      const newGame = this.gameForm.value;
      newGame.release_date = new Date().toISOString();
      newGame.author =  {
        connect: {
          id: 1,
        }
      };
      newGame.data = this.dataGame;
      console.log(newGame)
      this.api.createGame(newGame).subscribe(
        (res) => {
          console.log(res);
          // this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error al enviar los datos:', error);
        })
    } else {
      console.log('Formulario inválido');
    }
  }
  
  // OBTENER LOS DATOS DEL INPUT 
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    
    if (inputElement.files && inputElement.files.length > 0) {
      const file: File = inputElement.files[0];
      console.log('Archivo seleccionado:', file);
      // Si deseas leer el contenido del archivo:
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Contenido del archivo:', reader.result);
        // this.gameForm.patchValue({ data: fileContent});
        const fileContent = reader.result as string;
        this.dataGame = fileContent;
      };
      reader.readAsText(file); // Puedes usar readAsDataURL(file) para imágenes
    }
  }
}
