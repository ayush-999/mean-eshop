import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    apiURLCategories = environment.apiUrl + 'categories';

    constructor(private http: HttpClient) {}
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiURLCategories);
        // return this.http.get<Category[]>('http://localhost:3000/api/v1/categories/');
    }

    getCategory(categoryId: string): Observable<Category> {
        return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`);
        // return this.http.get<Category>(`http://localhost:3000/api/v1/categories/${categoryId}`);
    }

    createCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(this.apiURLCategories, category);
        // return this.http.post<Category>('http://localhost:3000/api/v1/categories/', category);
    }

    updateCategory(category: Category): Observable<Category> {
        return this.http.put<Category>(`${this.apiURLCategories}/${category.id}`, category);
        // return this.http.put<Category>('http://localhost:3000/api/v1/categories/', category);
    }

    deleteCategory(categoryId: string): Observable<object> {
        return this.http.delete<object>(`${this.apiURLCategories}/${categoryId}`);
        // return this.http.delete<object>(`http://localhost:3000/api/v1/categories/${categoryId}`);
    }
}
