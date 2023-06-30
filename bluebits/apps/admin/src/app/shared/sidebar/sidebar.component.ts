import { Component, OnInit } from '@angular/core';
import { AuthService } from '@bluebits/users';

@Component({
    selector: 'admin-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    constructor(private authService: AuthService) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    logoutUser() {
        this.authService.logout();
    }
}
