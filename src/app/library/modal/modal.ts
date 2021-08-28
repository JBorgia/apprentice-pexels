import { Component, ViewEncapsulation, ElementRef, Input, OnInit, Renderer2, TemplateRef } from '@angular/core';

@Component({
  selector: 'lib-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Modal implements OnInit {

  @Input() id: string;
  private element: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {

      // close modal on background click
      this.renderer.listen(this.element, 'click', (event) => {
        if(event.target.classList.contains('modal') || event.target.classList.contains('modal__close-btn')) {
          this.close();
        }
      });

  }

  ngOnDestroy(): void {
      this.element.remove();
  }


  // close modal
  close(): void {
      this.renderer.removeClass(document.body, 'modal--is-visible');
      this.renderer.removeClass(this.element.children[0], 'modal--is-visible');

      setTimeout(() => {
        this.element.remove();
      }, 200);
  }

}
