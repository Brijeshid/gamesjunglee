import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[boxHighlight]'
})
export class BoxHighlightDirective {

  @Input() public boxHighlight: any;
  constructor(public elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges){
    if (changes.boxHighlight && changes.boxHighlight.currentValue != changes.boxHighlight.previousValue) {
      this.elementRef.nativeElement.classList.add('light');
        setTimeout(()=>{
          this.elementRef.nativeElement.classList.remove('light');
        },1000)
    }
  }

}
