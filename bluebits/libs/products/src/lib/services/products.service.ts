import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Product } from '../models/products';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    apiURLCategories = environment.apiUrl + 'products';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiURLCategories);
        // return this.http.get<Product[]>('http://localhost:3000/api/v1/categories/');
    }

    // getCategory(categoryId: string): Observable<Product> {
    //     return this.http.get<Product>(`${this.apiURLCategories}/${categoryId}`);
    //     // return this.http.get<Product>(`http://localhost:3000/api/v1/categories/${categoryId}`);
    // }

    // createCategory(category: Category): Observable<Product> {
    //     return this.http.post<Product>(this.apiURLCategories, category);
    //     // return this.http.post<Product>('http://localhost:3000/api/v1/categories/', category);
    // }

    // updateCategory(category: Category): Observable<Product> {
    //     return this.http.put<Product>(`${this.apiURLCategories}/${category.id}`, category);
    //     // return this.http.put<Product>('http://localhost:3000/api/v1/categories/', category);
    // }

    // deleteCategory(categoryId: string): Observable<object> {
    //     return this.http.delete<object>(`${this.apiURLCategories}/${categoryId}`);
    //     // return this.http.delete<object>(`http://localhost:3000/api/v1/categories/${categoryId}`);
    // }
}
