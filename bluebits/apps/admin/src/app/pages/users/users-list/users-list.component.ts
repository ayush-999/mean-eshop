import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserService } from '@bluebits/users';

@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html',
    styles: []
})
export class UsersListComponent implements OnInit {
    users: User[] = [];
    constructor(
        private usersService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getUsers();
    }

    isLoading = false;

    deletingUserId: string | null = null;
    deleteUser(userId: string) {
        this.isLoading = true;
        this.deletingUserId = userId;
        setTimeout(() => {
            this.isLoading = false;
            this.deletingUserId = null;

            this.confirmationService.confirm({
                message: 'Do you want to Delete this User?',
                header: 'Delete User',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.usersService.deleteUser(userId).subscribe(
                        () => {
                            this._getUsers();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'User is deleted!'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'User is not deleted!'
                            });
                        }
                    );
                }
            });
        }, 700);
    }

    updateUserId: string | null = null;
    updateUser(userId: string) {
        this.isLoading = true;
        this.updateUserId = userId;
        setTimeout(() => {
            this.isLoading = false;
            this.updateUserId = null;
            this.router.navigateByUrl(`users/form/${userId}`);
        }, 700);
    }

    private _getUsers() {
        this.usersService.getUsers().subscribe((users) => {
            this.users = users;
        });
    }
}
