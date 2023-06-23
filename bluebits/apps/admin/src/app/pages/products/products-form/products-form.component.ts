/* eslint-disable @nx/enforce-module-boundaries */
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Product, ProductService } from '@bluebits/products';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html',
    styles: []
})
export class ProductsFormComponent implements OnInit {
    form: FormGroup;
    isSubmitted = false;
    editMode = false;
    categories = [];
    imageDisplay: string | ArrayBuffer;
    currentProductId: string;

    constructor(
        private location: Location,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private categoriesService: CategoriesService,
        private productsService: ProductService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._getCategories();
        this._checkEditMode();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            brand: ['', Validators.required],
            price: ['', Validators.required],
            category: ['', Validators.required],
            countInStock: ['', Validators.required],
            description: ['', Validators.required],
            richDescription: [''],
            image: ['', Validators.required],
            isFeatured: [false]
        });
    }

    isLoading = false;
    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }

        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;

            const productFormData = new FormData();
            Object.keys(this.productForm).map((key) => {
                productFormData.append(key, this.productForm[key].value);
            });
                       
            if (this.editMode) {
                this._updateProduct(productFormData);
            } else {
                this._addProduct(productFormData);
            }
        }, 700);
    }

    onCancel() {
        this.location.back();
    }

    private _getCategories() {
        this.categoriesService.getCategories().subscribe((categories) => {
            this.categories = categories;
        });
    }

    private _addProduct(productData: FormData) {
        this.productsService.createProduct(productData).subscribe(
            (product: Product) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `Product ${product.name} is created!` });
                timer(500)
                    .toPromise()
                    .then(() => {
                        this.location.back();
                    });
            },
            () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product is not created!' });
            }
        );
    }

    private _updateProduct(productFormData: FormData) {
        this.productsService.updateProduct(productFormData, this.currentProductId).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product is updated!'
                });
                timer(500)
                    .toPromise()
                    .then(() => {
                        this.location.back();
                    });
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Product is not updated!'
                });
            }
        );
    }

    private _checkEditMode() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.editMode = true;
                this.currentProductId = params.id;
                this.productsService.getProduct(params.id).subscribe((product) => {
                    this.productForm.name.setValue(product.name);
                    this.productForm.category.setValue(product.category.id);
                    this.productForm.brand.setValue(product.brand);
                    this.productForm.price.setValue(product.price);
                    this.productForm.countInStock.setValue(product.countInStock);
                    this.productForm.isFeatured.setValue(product.isFeatured);
                    this.productForm.description.setValue(product.description);
                    this.productForm.richDescription.setValue(product.richDescription);
                    this.imageDisplay = product.image;
                    this.productForm.image.setValidators([]);
                    this.productForm.image.updateValueAndValidity();
                });
            }
        });
    }

    onImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.form.patchValue({ image: file });
            this.form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    get productForm() {
        return this.form.controls;
    }
}
