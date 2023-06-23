import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ORDER_STATUS } from '../order.constants';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styles: []
})
export class OrdersListComponent implements OnInit {
    orders: Order[] = [];
    orderStatus = ORDER_STATUS;
    constructor(
        private ordersService: OrdersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getOrders();
    }

    _getOrders() {
        this.ordersService.getOrders().subscribe((orders) => {
            this.orders = orders;
        });
    }

    isLoading = false;

    showOrderId: string | null = null;
    showOrder(orderId) {
        this.isLoading = true;
        this.showOrderId = orderId;
        setTimeout(() => {
            this.isLoading = false;
            this.showOrderId = null;
            this.router.navigateByUrl(`orders/${orderId}`);
        }, 700);
    }

    deletingOrderId: string | null = null;
    deleteOrder(orderId: string) {
        this.isLoading = true;
        this.deletingOrderId = orderId;
        setTimeout(() => {
            this.isLoading = false;
            this.deletingOrderId = null;

            this.confirmationService.confirm({
                message: 'Do you want to Delete this Order?',
                header: 'Delete Order',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.ordersService.deleteOrder(orderId).subscribe(
                        () => {
                            this._getOrders();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Order is deleted!'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Order is not deleted!'
                            });
                        }
                    );
                }
            });
        }, 700);
    }
}
