import * as pako from 'pako';
import { NiftiUtils } from './nifti-utils';
import { NIFTI1 } from './NIFTI1';

export class Nifti {

  public littleEndian = true;
  public GUNZIP_MAGIC_COOKIE1 = 31;
  public GUNZIP_MAGIC_COOKIE2 = 139;

  constructor() {}

  public getExtensionLocation(): number {
    return NIFTI1.MAGIC_COOKIE + 4;
  }

  public getExtensionSize(data: DataView): number {
    return NiftiUtils.getIntAt(data, this.getExtensionLocation(), this.littleEndian);
  }

  public getExtensionCode(data: DataView): number {
    return NiftiUtils.getIntAt(data, this.getExtensionLocation() + 4, this.littleEndian);
  }

  public isCompressed(buffer: ArrayBuffer): boolean {
    let buf;
    let magicCookie1;
    let magicCookie2;

    if (buffer) {
      buf = new DataView(buffer);

      magicCookie1 = buf.getUint8(0);
      magicCookie2 = buf.getUint8(1);

      if (magicCookie1 === this.GUNZIP_MAGIC_COOKIE1) {
        return true;
      }

      if (magicCookie2 === this.GUNZIP_MAGIC_COOKIE2) {
        return true;
      }
    }

    return false;
  }

  public decompress(buffer: ArrayBuffer): ArrayBuffer {
    return pako.inflate(buffer as pako.Data).buffer;
  }

  public isNIFTI(data: ArrayBuffer): boolean {
    return (NiftiUtils.isNIFTI1(data) || NiftiUtils.isNIFTI2(data));
  }

  public getHeader(buffer: ArrayBuffer): NiftiHeader {

    const header = {} as NiftiHeader;
    const dataView = new DataView(buffer);

    header.sizeof_hdr      = NiftiUtils.getIntAt(dataView, 0, this.littleEndian);
    header.data_type_10    = NiftiUtils.getStringAt(dataView, 4, 14);
    header.db_name_18      = NiftiUtils.getStringAt(dataView, 14, 32);
    header.extents         = NiftiUtils.getFloatAt(dataView, 32, this.littleEndian);
    header.session_error   = NiftiUtils.getShortAt(dataView, 36, this.littleEndian);
    header.regular         = NiftiUtils.getStringAt(dataView, 38, 39);
    header.dim_info        = NiftiUtils.getByteAt(dataView, 39);

    const dim_8            = new Int16Array(buffer, 40, 16);
    header.dims            = Array.from(dim_8.slice(0, 8));

    header.intent_p1       = NiftiUtils.getFloatAt(dataView, 56, this.littleEndian);
    header.intent_p2       = NiftiUtils.getFloatAt(dataView, 60, this.littleEndian);
    header.intent_p3       = NiftiUtils.getFloatAt(dataView, 64, this.littleEndian);
    header.intent_code     = NiftiUtils.getShortAt(dataView, 68, this.littleEndian);

    header.datatype        = NiftiUtils.getShortAt(dataView, 70, this.littleEndian);
    header.numBitsPerVoxel = NiftiUtils.getShortAt(dataView, 72, this.littleEndian);
    header.slice_start     = NiftiUtils.getShortAt(dataView, 74, this.littleEndian);

    const pixdim_8         = new Float32Array(buffer, 76, 32);
    header.pixDims         = Array.from(pixdim_8.slice(0, 8));

    header.vox_offset      = NiftiUtils.getFloatAt(dataView, 108, this.littleEndian);

    header.scl_slope       = NiftiUtils.getFloatAt(dataView, 112, this.littleEndian);
    header.scl_inter       = NiftiUtils.getFloatAt(dataView, 116, this.littleEndian);

    header.slice_end       = NiftiUtils.getFloatAt(dataView, 120, this.littleEndian);
    header.slice_code      = NiftiUtils.getByteAt(dataView, 122);

    header.xyzt_units      = NiftiUtils.getByteAt(dataView, 123);

    header.cal_max         = NiftiUtils.getFloatAt(dataView, 124, this.littleEndian);
    header.cal_min         = NiftiUtils.getFloatAt(dataView, 128, this.littleEndian);

    header.slice_duration  = NiftiUtils.getFloatAt(dataView, 132, this.littleEndian);
    header.toffset         = NiftiUtils.getFloatAt(dataView, 136, this.littleEndian);

    header.description     = NiftiUtils.getStringAt(dataView, 148, 228);
    header.aux_file        = NiftiUtils.getStringAt(dataView, 228, 252);

    header.qform_code      = NiftiUtils.getShortAt(dataView, 252, this.littleEndian);
    header.sform_code      = NiftiUtils.getShortAt(dataView, 254, this.littleEndian);

    header.quatern_b       = NiftiUtils.getFloatAt(dataView, 256, this.littleEndian);
    header.quatern_c       = NiftiUtils.getFloatAt(dataView, 260, this.littleEndian);
    header.quatern_d       = NiftiUtils.getFloatAt(dataView, 264, this.littleEndian);
    header.qoffset_x       = NiftiUtils.getFloatAt(dataView, 268, this.littleEndian);
    header.qoffset_y       = NiftiUtils.getFloatAt(dataView, 272, this.littleEndian);
    header.qoffset_z       = NiftiUtils.getFloatAt(dataView, 276, this.littleEndian);

    const srow_x_4         = new Float32Array(buffer, 280, 16);
    const srow_y_4         = new Float32Array(buffer, 296, 16);
    const srow_z_4         = new Float32Array(buffer, 312, 16);

    header.srow_x = Array.from(srow_x_4.slice(0, 4));
    header.srow_y = Array.from(srow_y_4.slice(0, 4));
    header.srow_z = Array.from(srow_z_4.slice(0, 4));

    header.affine = [
      header.srow_x,
      header.srow_y,
      header.srow_z,
      [0, 0, 0, 1]
    ];

    header.intent_name = NiftiUtils.getStringAt(dataView, 328, 344);
    header.magic = NiftiUtils.getStringAt(dataView, 344, 348) as any;

    header.isHDR = (header.magic === NIFTI1.MAGIC_NUMBER2);

    header.extensionFlag = [];

    if (dataView.byteLength > NIFTI1.MAGIC_COOKIE) {
      header.extensionFlag[0] = NiftiUtils.getByteAt(dataView, 348);
      header.extensionFlag[1] = NiftiUtils.getByteAt(dataView, 348 + 1);
      header.extensionFlag[2] = NiftiUtils.getByteAt(dataView, 348 + 2);
      header.extensionFlag[3] = NiftiUtils.getByteAt(dataView, 348 + 3);

      if (header.extensionFlag[0]) {
        header.extensionSize = this.getExtensionSize(dataView);
        header.extensionCode = this.getExtensionCode(dataView);
      }
    }

    header.littleEndian = this.littleEndian;

    return header;
  }

  public getImage(header: NiftiHeader, buffer: ArrayBuffer): ArrayBuffer {
    const imageOffset = header.vox_offset;

    let timeDim = 1;
    let statDim = 1;

    if (header.dims[4]) {
      timeDim = header.dims[4];
    }

    if (header.dims[5]) {
      statDim = header.dims[5];
    }

    const imageSize = header.dims[1] * header.dims[2] * header.dims[3] * timeDim * statDim * (header.numBitsPerVoxel / 8);
    return buffer.slice(imageOffset, imageOffset + imageSize);
  }

  public computeTypedData(niftiHeader: NiftiHeader, niftiImage: ArrayBuffer) {
    let typedData;

    // extract method: getTypedData(niftiImage)
    switch (niftiHeader.datatype) {
      case NIFTI1.TYPE_UINT8:   typedData = new Uint8Array(niftiImage); break;
      case NIFTI1.TYPE_INT16:   typedData = new Int16Array(niftiImage); break;
      case NIFTI1.TYPE_INT32:   typedData = new Int32Array(niftiImage); break;
      case NIFTI1.TYPE_FLOAT32: typedData = new Float32Array(niftiImage); break;
      case NIFTI1.TYPE_FLOAT64: typedData = new Float64Array(niftiImage); break;
      case NIFTI1.TYPE_INT8:    typedData = new Int8Array(niftiImage); break;
      case NIFTI1.TYPE_UINT16:  typedData = new Uint16Array(niftiImage); break;
      case NIFTI1.TYPE_UINT32:  typedData = new Uint32Array(niftiImage); break;
      default:
        console.warn('Unknown type');
        break;
    }
    return typedData;
  }

  // saggital yz
  public getCoronalSlice(typedData: TypedData, cols: number, rows: number, slice: number, slices: number) {
    const imageData = new ImageData(cols, rows);

    // offset to specified slice
    const sliceSize = cols * rows;
    const sliceOffset = sliceSize * slices;

    // Transverse axis
    if (typedData) {

      let imageDataIndex = 0;
      for (let i = slice; i < sliceOffset; i += cols) {
        imageData.data[imageDataIndex]     = typedData[i];
        imageData.data[imageDataIndex + 1] = typedData[i];
        imageData.data[imageDataIndex + 2] = typedData[i];
        imageData.data[imageDataIndex + 3] = 0xff;
        imageDataIndex += 4;
      }

    }

    return imageData;
  }

  // coronal xz
  public getAxialSlice(typedData: TypedData, cols: number, rows: number, slice: number, slices: number) {
    const imageData = new ImageData(cols, rows);

    // offset to specified slice
    const sliceSize = cols * rows;
    const sliceOffset = sliceSize * slices;

    // Transverse axis
    if (typedData) {

      let imageDataIndex = 0;
      for (let i = 0; i < sliceOffset; i += sliceSize) {
        for (
          let k = sliceSize - slice * cols;
          k < sliceSize - slice * cols + cols;
          k++
        ) {
          imageData.data[imageDataIndex]     = typedData[k + i];
          imageData.data[imageDataIndex + 1] = typedData[k + i];
          imageData.data[imageDataIndex + 2] = typedData[k + i];
          imageData.data[imageDataIndex + 3] = 0xff;
          imageDataIndex += 4;
        }
      }

    }

    return imageData;
  }

  // transverse xy
  public getSagittalSlice(typedData: TypedData, cols: number, rows: number, slice: number) {

    const imageData = new ImageData(cols, rows);

    // offset to specified slice
    const sliceSize = cols * rows;
    const sliceOffset = sliceSize * slice;

    // Transverse axis
    if (typedData) {

      let imageDataIndex = 0;
      for (let i = sliceOffset; i < sliceOffset + sliceSize; i++) {
        imageData.data[imageDataIndex]     = typedData[i]; // r
        imageData.data[imageDataIndex + 1] = typedData[i]; // g
        imageData.data[imageDataIndex + 2] = typedData[i]; // b
        imageData.data[imageDataIndex + 3] = 0xff; // a
        imageDataIndex += 4;
      }

    }

    return imageData;
  }

  public getSlices(niftiHeader: NiftiHeader, niftiImage: ArrayBuffer) {
    const xAxisSlices: ImageData[] = [];
    const yAxisSlices: ImageData[] = [];
    const zAxisSlices: ImageData[] = [];

    const cols   = niftiHeader.dims[1]; // width
    const rows   = niftiHeader.dims[2]; // height
    const slices = niftiHeader.dims[3]; // z axis slices

    let typedData = this.computeTypedData(niftiHeader, niftiImage);
    let xImageData: ImageData;
    let yImageData: ImageData;
    let zImageData: ImageData;

    for (let slice = 0; slice < slices; slice++) {
      // yz saggital
      xImageData = this.getAxialSlice(typedData, cols, rows, slice, slices);
      xAxisSlices.push(xImageData);

      // xz coronal
      yImageData = this.getCoronalSlice(typedData, cols, rows, slice, slices);
      yAxisSlices.push(yImageData);

      // xy transverse
      zImageData = this.getSagittalSlice(typedData, cols, rows, slice);
      zAxisSlices.push(zImageData);
    }

    return {xAxisSlices, yAxisSlices, zAxisSlices}
  }

}


export interface NiftiHeader {
  sizeof_hdr: number;
  data_type_10: string;
  db_name_18: string;
  extents: number;
  session_error: number;
  regular: string;
  dim_info: number;
  vox_offset: number; //
  dims: number[];
  intent_p1: number;
  intent_p2: number;
  intent_p3: number;
  intent_code: number;
  datatype: number;
  numBitsPerVoxel: number;
  slice_start: number;
  pixDims: number[];
  scl_slope: number;
  scl_inter: number;
  slice_end: number;
  slice_code: number;
  xyzt_units: number;
  cal_max: number;
  cal_min: number;
  slice_duration: number;
  toffset: number;
  description: string;
  aux_file: string;
  qform_code: number;
  sform_code: number;
  quatern_b: number;
  quatern_c: number;
  quatern_d: number;
  qoffset_x: number;
  qoffset_y: number;
  qoffset_z: number;
  srow_x: number[];
  srow_y: number[];
  srow_z: number[];
  affine: number[][];
  intent_name: string;
  magic: any; // string
  isHDR: boolean;
  extensionFlag: number[];
  extensionCode: number | undefined;
  extensionSize: number | undefined;
  littleEndian: boolean;
}


export type TypedData = Uint8Array | Int16Array | Int32Array | Float32Array | Float64Array | Int8Array | Uint16Array | Uint32Array | undefined
