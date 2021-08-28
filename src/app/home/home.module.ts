import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { InfiniteScrollDirective } from '../directives/scrollable.directive';
import { ModalModule } from '../library/modal/modal.module';
import { BackToTopModule } from '../library/back-to-top/back-to-top.module';

@NgModule({
  declarations: [
    HomeComponent,
    InfiniteScrollDirective
  ],
  exports: [
    InfiniteScrollDirective
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ModalModule,
    BackToTopModule
  ],
})
export class HomeModule {}
