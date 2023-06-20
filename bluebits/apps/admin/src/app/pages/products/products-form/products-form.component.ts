/* eslint-disable @nx/enforce-module-boundaries */
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '@bluebits/products';

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

    constructor(private location: Location, private formBuilder: FormBuilder, private categoriesService: CategoriesService) {}

    ngOnInit(): void {
        this._initForm();
        this._getCategories();
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
        }, 700);
    }

    onCancel() {
        this.location.back();
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
            image: [''],
            isFeatured: ['']
        });
    }

    private _getCategories() {
        this.categoriesService.getCategories().subscribe((categories) => {
            this.categories = categories;
        });
    }

    get productForm() {
        return this.form.controls;
    }
}
