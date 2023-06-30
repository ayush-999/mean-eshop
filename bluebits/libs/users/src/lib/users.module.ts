import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, DividerModule],
    declarations: [LoginComponent]
})
export class UsersModule {}
