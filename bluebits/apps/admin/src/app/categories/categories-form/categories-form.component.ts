import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html',
    styles: []
})
export class CategoriesFormComponent implements OnInit {
    form: FormGroup;

    isSubmitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            icon: ['', Validators.required]
        });
    }

    isLoading = false;
    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }
        this.isLoading = true;

        // Fetching API here
        setTimeout(() => {
            this.isLoading = false;

            const category: Category = {
                name: this.categoryForm.name.value,
                icon: this.categoryForm.icon.value
            };
            this.categoriesService.createCategory(category).subscribe(
                () => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category is created' });
                    timer(1000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category is not created' });
                }
            );
        }, 700);
    }

    get categoryForm() {
        return this.form.controls;
    }
}
