import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@bluebits/ui';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
    declarations: [AppComponent, HomePageComponent, ProductListComponent, HeaderComponent, FooterComponent],
    imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }), UiModule, AccordionModule],
    // imports: [
    //     BrowserModule,
    //     RouterModule.forRoot([
    //         {
    //             path: '',
    //             component: HomePageComponent
    //         },
    //         {
    //             path: 'products',
    //             component: ProductListComponent
    //         }
    //     ])
    // ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
