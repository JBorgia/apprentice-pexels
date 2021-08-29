import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { InfiniteScrollDirective } from '../directives/scrollable.directive';
import { ModalModule } from '../library/modal/modal.module';
import { BackToTopModule } from '../library/back-to-top/back-to-top.module';
import { DebounceClickDirective } from '../directives/debounceClick.directive';

@NgModule({
  declarations: [
    HomeComponent,
    InfiniteScrollDirective,
    DebounceClickDirective
  ],
  exports: [
    InfiniteScrollDirective,
    DebounceClickDirective
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ModalModule,
    BackToTopModule
  ],
})
export class HomeModule {}
