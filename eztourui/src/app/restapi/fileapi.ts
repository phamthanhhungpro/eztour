import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../model/base-response';

export interface FileItem {
    name: string;
    type: 'folder' | 'file';
    size?: string;
    children?: FileItem[];
    url?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FileApi {
    private baseUrl = `${environment.apiUrl}/FileManager`;

    constructor(private http: HttpClient) { }

    getFiles() {
        return this.http.get<FileItem[]>(`${this.baseUrl}`);
    }

    uploadFile(file: File, folderPath: string) {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<any>(`${this.baseUrl}/upload?folderPath=${folderPath}`, formData);
    }

}