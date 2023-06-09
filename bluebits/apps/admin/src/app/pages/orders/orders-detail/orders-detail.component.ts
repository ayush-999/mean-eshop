/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';
import { MessageService } from 'primeng/api';
import { ORDER_STATUS } from '../order.constants';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'admin-orders-detail',
    templateUrl: './orders-detail.component.html',
    styles: []
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
    order: Order;
    orderStatuses = [];
    selectedStatus: any;
    endsubs$: Subject<any> = new Subject();

    constructor(private orderService: OrdersService, private messageService: MessageService, private route: ActivatedRoute, private location: Location) {}

    ngOnInit(): void {
        this._mapOrderStatus();
        this._getOrder();
    }

    ngOnDestroy() {
        this.endsubs$.next(undefined);
        this.endsubs$.complete();
    }

    private _mapOrderStatus() {
        this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
            return {
                id: key,
                name: ORDER_STATUS[key].label
            };
        });
    }

    private _getOrder() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.orderService
                    .getOrder(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((order) => {
                        this.order = order;
                        this.selectedStatus = order.status;
                    });
            }
        });
    }

    onStatusChange(event) {
        this.orderService
            .updateOrder({ status: event.value }, this.order.id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Order is updated!'
                    });
                    timer(1000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Order is not updated!'
                    });
                }
            );
    }
}
