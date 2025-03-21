import { Injectable } from '@angular/core';
// MODULO HTTP PARA REALIZAR LAS PETICIONES
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game, SaveData } from '@data/interfaces';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }

  
  // DATA - GAME
  getGames(): Observable<any> {
    return this.http.get(`${this.baseUrl}/game`);
  }
  
  createGame(data: Game): Observable<any> {
    return this.http.post(`${this.baseUrl}/game`, data);
  }

  updateGame(data: Game): Observable<any> {
    return this.http.put(`${this.baseUrl}/game/${data.id}`, data);
  }

  deleteGame(id:string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/game/${id}`);
  }

  getGame(id:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/game/${id}`);
  }

  searchGame(name:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/game/name/${name}`);
  }
 // DATA - SAVEDATA
  saveGame(data:SaveData): Observable<any> {
    return this.http.post(`${this.baseUrl}/savePoint`, data);
  }

  getSaveGame(idUser:string,idGame:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/savePoint/user/${idUser}/game/${idGame}`);
  }

  // // AUTHENTICATE
  // registerUser(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/register`, data);
  // }
  // loginUser(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/login`, data);
  // }
}
