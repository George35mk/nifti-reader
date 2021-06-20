import { NIFTI1 } from './NIFTI1';
import { NIFTI2 } from './NIFTI2';

// add docs for each method

export class NiftiUtils {
  static getByteAt(data: DataView, start: number): number {
    return data.getInt8(start);
  }

  static getShortAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getInt16(start, littleEndian);
  }

  static getIntAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getInt32(start, littleEndian);
  }

  static getFloatAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getFloat32(start, littleEndian);
  }

  static getDoubleAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getFloat64(start, littleEndian);
  }

  static getStringAt(data: DataView, start: number, end: number): string {
    let str = '';
    let ctr;
    let ch;

    for (ctr = start; ctr < end; ctr += 1) {
      ch = data.getUint8(ctr);

      if (ch !== 0) {
        str += String.fromCharCode(ch);
      }
    }

    return str;
  }

  static isNIFTI1(data: ArrayBuffer): boolean {
    let mag1;
    let mag2;
    let mag3;

    if (data.byteLength < NIFTI1.STANDARD_HEADER_SIZE) {
      return false;
    }

    const dataView = new DataView(data);

    if (dataView) {
      mag1 = dataView.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION);
      mag2 = dataView.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION + 1);
      mag3 = dataView.getUint8(NIFTI1.MAGIC_NUMBER_LOCATION + 2);
    }

    return !!((mag1 === NIFTI1.MAGIC_NUMBER[0]) && (mag2 === NIFTI1.MAGIC_NUMBER[1]) && (mag3 === NIFTI1.MAGIC_NUMBER[2]));
  }

  static isNIFTI2(data: ArrayBuffer): boolean {
    if (data.byteLength < NIFTI1.STANDARD_HEADER_SIZE) {
      return false;
    }

    const dataView = new DataView(data);
    const mag1 = dataView.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION);
    const mag2 = dataView.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION + 1);
    const mag3 = dataView.getUint8(NIFTI2.MAGIC_NUMBER_LOCATION + 2);

    return !!((mag1 === NIFTI2.MAGIC_NUMBER[0]) && (mag2 === NIFTI2.MAGIC_NUMBER[1]) && (mag3 === NIFTI2.MAGIC_NUMBER[2]));
  }
}
