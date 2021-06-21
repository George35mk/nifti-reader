import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slices-grid',
  templateUrl: './slices-grid.component.html',
  styleUrls: ['./slices-grid.component.scss']
})
export class SlicesGridComponent implements OnInit {

  @Input() slices: ImageData[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
