import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nifti-file-info',
  templateUrl: './nifti-file-info.component.html',
  styleUrls: ['./nifti-file-info.component.scss']
})
export class NiftiFileInfoComponent implements OnInit {

  @Input() file: File | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
