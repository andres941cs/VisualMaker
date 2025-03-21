import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  // INYECCCION DE DEPENDENCIAS
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};


/*

inject():  Dado que ahora trabajamos con una función y no con una clase, necesitamos usar la función inject() para inyectar dependencias como AuthService y Router.  inject() nos permite acceder a los servicios dentro de la función del Guard.

*/

