import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Nifti, NiftiHeader,  SliceAxis } from '../../../../../../../dist';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public nifti: Nifti | undefined;
  public niftiHeader: NiftiHeader | undefined;
  public niftiImage: ArrayBuffer | undefined;

  public sliderMin = 0;
  public sliderMax = 10;
  public sliderValue = 0;

  public file: File | undefined;

  public canvas: HTMLCanvasElement | undefined;

  public axis: SliceAxis = 'sagittal';

  public slicesMap: SlicesMap | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  public handleFileInput(event: Event): void {

    const target = event.target as HTMLInputElement;
    const files  = target.files as FileList;
    const file   = files[0];
    this.file    = file;

    const reader = new FileReader();

    reader.onload = (e) => {

      let buffer = e.target?.result as ArrayBuffer;

      this.nifti = new Nifti();

      if (this.nifti.isCompressed(buffer)) {
        console.log('Buffer is compressed');
        buffer = this.nifti.decompress(buffer);
      }

      if (this.nifti.isNIFTI(buffer)) {
        this.niftiHeader = this.nifti.getHeader(buffer);
        this.niftiImage  = this.nifti.getImage(this.niftiHeader, buffer);

        console.log({
          niftiHeader: this.niftiHeader,
          niftiImage: this.niftiImage
        });

        // the slider should change when a user selects a different axis.
        const slices = this.niftiHeader.dims[3];
        this.sliderMin = 0;
        this.sliderMax = slices - 1;
        this.sliderValue = Math.round(slices / 2);

        this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;

        this.slicesMap = this.nifti.getSlices(this.niftiHeader, this.niftiImage);
        console.log('slicesMap: ', this.slicesMap);

        if (this.canvas) {
          this.drawCanvas(this.canvas, this.sliderValue, this.niftiHeader, this.niftiImage, this.axis);
        }

      } else {
        console.warn('That file is not a NiFti format');
      }

    };

    reader.onerror = (e) => {
      console.error('Error: ', e.type);
    };

    reader.readAsArrayBuffer(file);
  }

  public onSliderChange(event: MatSliderChange): void {
    this.sliderValue = event.value as number;
    if (this.canvas && this.niftiHeader && this.niftiImage) {
      this.drawCanvas(this.canvas, this.sliderValue, this.niftiHeader, this.niftiImage, this.axis);
    }
  }

  public setSliceDirection(axis: SliceAxis) {
    this.axis = axis;

    if (this.niftiHeader) {
      switch (axis) {
        case 'axial': this.sliderMax = this.niftiHeader.dims[1] - 1; break;
        case 'coronal': this.sliderMax = this.niftiHeader.dims[2] - 1; break;
        case 'sagittal': this.sliderMax = this.niftiHeader.dims[3] - 1; break;
        default:
          break;
      }
    }

    if (this.canvas && this.sliderValue && this.niftiHeader && this.niftiImage && this.axis) {
      this.drawCanvas(this.canvas, this.sliderValue, this.niftiHeader, this.niftiImage, this.axis);
    }
  }

  /**
   *
   * @param canvas the canvas
   * @param slice the slice index
   * @param niftiHeader the nifti header
   * @param niftiImage the nifti image
   * @param axis the axis
   */
  public drawCanvas(canvas: HTMLCanvasElement, slice: number, niftiHeader: NiftiHeader, niftiImage: ArrayBuffer, axis: SliceAxis): void {

    const cols   = niftiHeader.dims[1]; // width
    const rows   = niftiHeader.dims[2]; // height
    const slices = niftiHeader.dims[3]; // z axis slices

    canvas.width = cols;
    canvas.height = rows;

    // make canvas image data
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let imageData: ImageData;

    if (this.nifti) {

      // convert raw data to typed array based on nifti datatype
      let typedData = this.nifti.computeTypedData(niftiHeader, niftiImage);

      switch (axis) {
        case 'axial': imageData = this.nifti.getAxialSlice(typedData, cols, rows, slice, slices); break;
        case 'coronal': imageData = this.nifti.getCoronalSlice(typedData, cols, rows, slice, slices); break;
        case 'sagittal': imageData = this.nifti.getSagittalSlice(typedData, cols, rows, slice); break;
        default:
          console.warn('Unknown axis');
          imageData = new ImageData(cols, rows);
        break;
      }

      ctx.putImageData(imageData, 0, 0);
    }

  }

}


interface SlicesMap {
  axialSlices: ImageData[];
  coronalSlices: ImageData[];
  sagittalSlices: ImageData[];
}
