/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { ProductService } from '@bluebits/products';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit {
    products = [];
    endsubs$: Subject<any> = new Subject();

    constructor(
        private productsService: ProductService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this._getProducts();
    }

    ngOnDestroy() {
        this.endsubs$.next(undefined);
        this.endsubs$.complete();
    }

    isLoading = false;

    deletingProductId: string | null = null;
    deleteProduct(productId: string) {
        this.isLoading = true;
        this.deletingProductId = productId;
        setTimeout(() => {
            this.isLoading = false;
            this.deletingProductId = null;
            this.confirmationService.confirm({
                message: 'Do you want to delete this Product?',
                header: 'Delete Product',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.productsService
                        .deleteProduct(productId)
                        .pipe(takeUntil(this.endsubs$))
                        .subscribe(
                            () => {
                                this._getProducts();
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Product is deleted!'
                                });
                            },
                            () => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Product is not deleted!'
                                });
                            }
                        );
                }
            });
        }, 700);
    }

    updateProductId: string | null = null;
    updateProduct(productId: string) {
        this.isLoading = true;
        this.updateProductId = productId;
        setTimeout(() => {
            this.isLoading = false;
            this.updateProductId = null;
            this.router.navigateByUrl(`products/form/${productId}`);
        }, 700);
    }

    _getProducts() {
        this.productsService
            .getProducts()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((products) => {
                this.products = products;
            });
    }
}
