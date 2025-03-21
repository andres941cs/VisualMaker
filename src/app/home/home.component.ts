import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLogin:boolean = false;

  constructor(private auth:AuthService,private router:Router){ this.isLogin = this.auth.isLoggedIn(); }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
