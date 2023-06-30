/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Product } from '../models/products';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    apiURLProducts = environment.apiUrl + 'products';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiURLProducts);
        // return this.http.get<Product[]>('http://localhost:3000/api/v1/categories/');
    }

    getProduct(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
        // return this.http.get<Product>(`http://localhost:3000/api/v1/categories/${productId}`);
    }

    createProduct(productData: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiURLProducts, productData);
        // return this.http.post<Product>('http://localhost:3000/api/v1/categories/', category);
    }

    updateProduct(productData: FormData, productId: string): Observable<Product> {
        return this.http.put<Product>(`${this.apiURLProducts}/${productId}`, productData);
        // return this.http.put<Product>(`http://localhost:3000/api/v1/categories/${productId}`, productData);
    }

    deleteProduct(productId: string): Observable<object> {
        return this.http.delete<object>(`${this.apiURLProducts}/${productId}`);
        // return this.http.delete<object>(`http://localhost:3000/api/v1/categories/${productId}`);
    }

    getProductsCount(): Observable<number> {
        return this.http.get<number>(`${this.apiURLProducts}/get/count`).pipe(map((objectValue: any) => objectValue.productCount));
    }
}
