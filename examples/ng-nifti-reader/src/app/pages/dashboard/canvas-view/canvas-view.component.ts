import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-canvas-view',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.scss']
})
export class CanvasViewComponent implements OnInit {

  @Input() imageData: ImageData | undefined;

  @ViewChild('myCanvas', { static: true }) canvas: ElementRef<HTMLCanvasElement> | undefined;

  constructor() { }

  ngOnInit(): void {
    if (this.canvas && this.imageData) {
      this.canvas.nativeElement.width = this.imageData.width;
      this.canvas.nativeElement.height = this.imageData.height;
      const ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      ctx.putImageData(this.imageData, 0, 0);
      // ctx.rotate(90 * Math.PI/180);
      // ctx.restore();
    }
  }

}
