/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    apiURLOrders = environment.apiUrl + 'orders';

    constructor(private http: HttpClient) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiURLOrders);
    }

    getOrder(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiURLOrders, order);
    }

    updateOrder(orderStatus: { status: string }, orderId: string): Observable<Order> {
        return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStatus);
    }

    deleteOrder(orderId: string): Observable<object> {
        return this.http.delete<object>(`${this.apiURLOrders}/${orderId}`);
    }

    getOrdersCount(): Observable<number> {
        return this.http.get<number>(`${this.apiURLOrders}/get/count`).pipe(map((objectValue: any) => objectValue.orderCount));
    }

    getTotalSales(): Observable<number> {
        return this.http.get<number>(`${this.apiURLOrders}/get/totalsales`).pipe(map((objectValue: any) => objectValue.totalsales));
    }
}
