import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../model/base-response';

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface CreateUserRequest {
  userName: string;
  password: string;
  email?: string;
  fullName?: string;
}

export interface LoginReponse {
  token: string;
  message: string;
  user: any;
}

export interface User {
  id?: string;
  userName: string;
  fullName?: string;
  email?: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private baseUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginReponse> {
    return this.http.post<LoginReponse>(`${this.baseUrl}/login`, request);
  }

  createUser(request: CreateUserRequest): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.baseUrl}/register`, request);
  }

  getUsers() {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  deleteUser(id?: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateUser(request: any) {
    return this.http.put(`${this.baseUrl}/${request.id}`, request);
  }
}