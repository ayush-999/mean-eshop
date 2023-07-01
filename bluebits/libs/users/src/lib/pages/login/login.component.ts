import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
    selector: 'users-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    loginFormGroup: FormGroup;
    isSubmitted = false;
    authError = false;
    authMessage = 'Email or Password are wrong';

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private localstorageService: LocalstorageService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this._initLoginForm();
        this.checkAdminLoggedIn(); // Check if admin is already logged in
    }

    private _initLoginForm() {
        this.loginFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    isLoading = false;
    onSubmit() {
        this.isSubmitted = true;
        if (this.loginFormGroup.invalid) {
            return;
        }

        this.isLoading = true;

        setTimeout(() => {
            this.isLoading = false;

            this.auth.login(this.loginForm.email.value, this.loginForm.password.value).subscribe(
                (user) => {
                    this.authError = false;
                    this.localstorageService.setToken(user.token);
                    // this.router.navigate(['/']);
                    this.router.navigate(['/dashboard']);
                },
                (error: HttpErrorResponse) => {
                    this.authError = true;
                    if (error.status !== 400) {
                        this.authMessage = 'Error in the Server, please try again later!';
                    }
                }
            );
        }, 2000);
    }

    get loginForm() {
        return this.loginFormGroup.controls;
    }

    checkAdminLoggedIn() {
        const token = this.localstorageService.getToken();
        if (token) {
            const tokenDecode = JSON.parse(atob(token.split('.')[1]));
            if (tokenDecode.isAdmin) {
                this.router.navigate(['/dashboard']);
            }
        }
    }
}
