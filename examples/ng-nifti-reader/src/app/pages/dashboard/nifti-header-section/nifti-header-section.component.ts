import { Component, Input, OnInit } from '@angular/core';
import { Nifti, NiftiHeader } from '../../../../../../../dist';

@Component({
  selector: 'app-nifti-header-section',
  templateUrl: './nifti-header-section.component.html',
  styleUrls: ['./nifti-header-section.component.scss']
})
export class NiftiHeaderSectionComponent implements OnInit {

  @Input() nifti: Nifti | undefined;
  @Input() niftiHeader: NiftiHeader | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
