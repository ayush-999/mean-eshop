/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { ProductService } from '@bluebits/products';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit {
    products = [];

    constructor(private productsService: ProductService) {}

    ngOnInit(): void {
        this._getProducts();
    }

    isLoading = false;

    deletingProductId: string | null = null;
    deleteProduct(productId: string) {
        this.isLoading = true;
        this.deletingProductId = productId;
        setTimeout(() => {
            this.isLoading = false;
            this.deletingProductId = null;
        }, 700);
    }

    updateProductId: string | null = null;
    updateProduct(productId: string) {
        this.isLoading = true;
        this.updateProductId = productId;
        setTimeout(() => {
            this.isLoading = false;
            this.updateProductId = null;
        }, 700);
    }

    _getProducts() {
        this.productsService.getProducts().subscribe((products) => {
            this.products = products;
        });
    }
}
