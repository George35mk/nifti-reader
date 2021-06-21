import { NIFTI1 } from './NIFTI1';
import { NIFTI2 } from './NIFTI2';

export class NiftiUtils {

  /**
   * Gets the Int8 value at the specified byte offset
   * @param data the DataView
   * @param start the byte offset
   * @returns an Int8 value
   */
  static getByteAt(data: DataView, start: number): number {
    return data.getInt8(start);
  }

  /**
   * Gets the Int16 value at the specified byte offset.
   * @param data the DataView
   * @param start the byte offset
   * @param littleEndian the little endian
   * @returns an Int16 value
   */
  static getShortAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getInt16(start, littleEndian);
  }

  /**
   * Gets the Int32 value at the specified byte offset.
   * @param data the DataView
   * @param start the byte offset
   * @param littleEndian the little endian
   * @returns an Int32 value
   */
  static getIntAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getInt32(start, littleEndian);
  }

  /**
   * Gets the Float32 value at the specified byte offset.
   * @param data the DataView
   * @param start the byte offset
   * @param littleEndian the little endian
   * @returns an Float32 value
   */
  static getFloatAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getFloat32(start, littleEndian);
  }

  /**
   * Gets the Float64 value at the specified byte offset.
   * @param data the DataView
   * @param start the byte offset
   * @param littleEndian the little endian
   * @returns an Float64 value
   */
  static getDoubleAt(data: DataView, start: number, littleEndian: boolean): number {
    return data.getFloat64(start, littleEndian);
  }

  /**
   * Gets the string part of a specific start - end range
   * @param data the DataView
   * @param start the start offset
   * @param end the end offset
   * @returns a string value
   */
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

  /**
   * Checks if the array buffer is Nifti1
   * @param data the DataView
   * @returns true if the data is Nifti1, else false
   */
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

  /**
   * Checks if the array buffer is Nifti2
   * @param data the DataView
   * @returns true if the data is Nifti2, else false
   */
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
