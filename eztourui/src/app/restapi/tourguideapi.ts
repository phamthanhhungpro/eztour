import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../model/base-response';

export interface TourGuide {
    id?: string;
    name?: string;
    city?: string;
    rate?: number;
    image?: string;
    phone?: string;
    address?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TourGuideApi {
    private baseUrl = `${environment.apiUrl}/TourGuide`;

    constructor(private http: HttpClient) { }

    getGuides() {
        return this.http.get<TourGuide[]>(`${this.baseUrl}`);
    }

    createGuide(request: any) {
        return this.http.post(`${this.baseUrl}`, request);
    }

    deleteGuide(id?: string) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    updateGuide(request: any) {
        return this.http.put(`${this.baseUrl}/${request.id}`, request);
    }
}