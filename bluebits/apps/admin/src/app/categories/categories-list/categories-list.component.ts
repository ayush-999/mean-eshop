import { Component, OnInit } from '@angular/core';
import { CategoriesService, Category } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html',
    styles: []
})
export class CategoriesListComponent implements OnInit {
    categories: Category[] = [];

    constructor(private categoriesService: CategoriesService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit(): void {
        this._getCategories();
    }

    isLoading = false;
    deletingCategoryId: string | null = null;
    deleteCategory(categoryId: string) {
        this.isLoading = true;
        this.deletingCategoryId = categoryId;
        setTimeout(() => {
            this.isLoading = false;
            this.deletingCategoryId = null;

            this.confirmationService.confirm({
                message: 'Do you want to Delete this category?',
                header: 'Delete Category',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.categoriesService.deleteCategory(categoryId).subscribe(
                        () => {
                            this._getCategories();
                            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category is deleted!' });
                        },
                        () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category is not deleted!' });
                        }
                    );
                }
            });
        }, 700);
    }

    private _getCategories() {
        this.categoriesService.getCategories().subscribe((cats) => {
            this.categories = cats;
        });
    }
}
