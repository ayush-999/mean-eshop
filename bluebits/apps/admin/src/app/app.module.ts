import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CategoriesListComponent } from './categories/categories-list/categories-list.component';
import { CategoriesFormComponent } from './categories/categories-form/categories-form.component';
//
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CategoriesService } from '@bluebits/products';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
const UX_MODULE = [CardModule, ToolbarModule, ButtonModule, TableModule, InputTextModule, ToastModule, ConfirmDialogModule];

@NgModule({
    declarations: [AppComponent, DashboardComponent, ShellComponent, SidebarComponent, CategoriesListComponent, CategoriesFormComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
        ...UX_MODULE
    ],
    providers: [CategoriesService, MessageService, ConfirmationService],
    bootstrap: [AppComponent]
})
export class AppModule {}