import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient) { this.checkAuthStatus() }

  // AUTHENTICATE
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        console.log(res)
        localStorage.setItem('user', JSON.stringify(res.user));
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUserData(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    this.isLoggedInSubject.next(!!token); // Si el token es null lo vuelve false
  }
}

/*

BehaviorSubject<T>:  BehaviorSubject es un tipo especial de Observable (un flujo de datos reactivo) que tiene la capacidad de almacenar un valor actual y
emitirlo inmediatamente a cualquier nuevo observador que se suscriba.  Además, cada vez que el valor cambia, notifica a todos los observadores.


Observable<T> Es un Observable público que permite a otros componentes o servicios de tu aplicación "escuchar" o "suscribirse" a los cambios en el estado de autenticación. 
El $ al final del nombre es una convención común en Angular para indicar que se trata de un Observable.

asObservable(): Este método crea un nuevo Observable a partir del BehaviorSubject.
La diferencia clave es que este nuevo Observable solo permite la suscripción para recibir notificaciones de cambios.
No permite que se modifique directamente el valor del estado de autenticación.

pipe: Este método se utiliza para encadenar operadores al Observable.
Los operadores permiten transformar, manipular o realizar acciones secundarias con los datos que fluyen a través del Observable.

tap: Este operador permite realizar efectos secundarios (side effects) sin modificar los datos que fluyen a través del Observable.
En este caso, el efecto secundario es almacenar el token y la información del usuario en el localStorage y actualizar el estado de autenticación.
*/