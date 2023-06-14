import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'ngshop-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = 'ngshop';

    constructor(private primengConfig: PrimeNGConfig) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
