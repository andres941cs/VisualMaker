import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  title:string = 'Edit Game';
  id: string | null = null;
  data:any;
  dataGame = "";
  gameForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private api:ApiService, private router:Router) {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required, Validators.min(12)]],
      author: ['', [Validators.required]],
      price: ['', [Validators.required]],
      release_date: ['', [Validators.required]],
      data: [''],
    });
  }

  ngOnInit(): void {
    // Obtener el parámetro 'id' de la URL
    this.id = this.route.snapshot.paramMap.get('id');
    this.api.getGame(this.id!).subscribe((res)=>{
      console.log(res)
      this.data = res;
      this.dataGame = JSON.parse(res.data);
      this.gameForm.setValue({
        name:res.name,
        author:res.authorId,
        price:res.price,
        release_date:res.release_date,
        data:'',
      })
      // this.gameForm.patchValue({ name: this.data.name });
    });
  }
  onSubmit() {
    if (this.gameForm.valid) {
      const editGame = this.gameForm.value;
      delete editGame.data;
      Object.assign(this.data, editGame);
      delete this.data.author;

      this.api.updateGame(this.data).subscribe(
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
