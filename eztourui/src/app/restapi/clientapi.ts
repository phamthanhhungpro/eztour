import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Client {
    id?: string;
    name?: string;
    banner?: string;
    phone?: string;
    address?: string;
    email?: string;
    viewUserName?: string;
    viewPassword?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientApi {
    private baseUrl = `${environment.apiUrl}/Client`;

    constructor(private http: HttpClient) { }

    getData() {
        return this.http.get<Client[]>(`${this.baseUrl}`);
    }

    create(request: any) {
        return this.http.post(`${this.baseUrl}`, request);
    }

    delete(id?: string) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    update(request: any) {
        return this.http.put(`${this.baseUrl}/${request.id}`, request);
    }
}