import { NIFTI_1 } from "./consts/NIFTI1";
import { NiftiUtils } from "./nifti-utils";

export class Nifti1 {

  littleEndian      = false;
  dim_info          = 0;
  dims: number[]    = [];
  intent_p1         = 0;
  intent_p2         = 0;
  intent_p3         = 0;
  intent_code       = 0;
  datatypeCode      = 0;
  numBitsPerVoxel   = 0;
  slice_start       = 0;
  slice_end         = 0;
  slice_code        = 0;
  pixDims: number[] = [];
  vox_offset        = 0;
  scl_slope         = 1;
  scl_inter         = 0;
  xyzt_units        = 0;
  cal_max           = 0;
  cal_min           = 0;
  slice_duration    = 0;
  toffset           = 0;
  description       = "";
  aux_file          = "";
  intent_name       = "";
  qform_code        = 0;
  sform_code        = 0;
  quatern_b         = 0;
  quatern_c         = 0;
  quatern_d         = 0;
  qoffset_x         = 0;
  qoffset_y         = 0;
  qoffset_z         = 0;
  affine            = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  magic: any        = 0;
  isHDR             = false;
  extensionFlag     = [0, 0, 0, 0];
  extensionSize     = 0;
  extensionCode     = 0;

  constructor() {
      
  }

  readHeader(data: ArrayBuffer) {
    const rawData = new DataView(data);
    let magicCookieVal = NiftiUtils.getIntAt(rawData, 0, this.littleEndian);
    let ctr;
    let ctrOut;
    let ctrIn;
    let index;

    if (magicCookieVal !== NIFTI_1.MAGIC_COOKIE) {  // try as little endian
      this.littleEndian = true;
      magicCookieVal = NiftiUtils.getIntAt(rawData, 0, this.littleEndian);
    }

    if (magicCookieVal !== NIFTI_1.MAGIC_COOKIE) {
      throw new Error("This does not appear to be a NIFTI file!");
    }

    this.dim_info = NiftiUtils.getByteAt(rawData, 39);

    for (ctr = 0; ctr < 8; ctr += 1) {
      index = 40 + (ctr * 2);
      this.dims[ctr] = NiftiUtils.getShortAt(rawData, index, this.littleEndian);
    }

    this.intent_p1 = NiftiUtils.getFloatAt(rawData, 56, this.littleEndian);
    this.intent_p2 = NiftiUtils.getFloatAt(rawData, 60, this.littleEndian);
    this.intent_p3 = NiftiUtils.getFloatAt(rawData, 64, this.littleEndian);
    this.intent_code = NiftiUtils.getShortAt(rawData, 68, this.littleEndian);

    this.datatypeCode = NiftiUtils.getShortAt(rawData, 70, this.littleEndian);
    this.numBitsPerVoxel = NiftiUtils.getShortAt(rawData, 72, this.littleEndian);

    this.slice_start = NiftiUtils.getShortAt(rawData, 74, this.littleEndian);

    for (ctr = 0; ctr < 8; ctr += 1) {
      index = 76 + (ctr * 4);
      this.pixDims[ctr] = NiftiUtils.getFloatAt(rawData, index, this.littleEndian);
    }

    this.vox_offset = NiftiUtils.getFloatAt(rawData, 108, this.littleEndian);

    this.scl_slope = NiftiUtils.getFloatAt(rawData, 112, this.littleEndian);
    this.scl_inter = NiftiUtils.getFloatAt(rawData, 116, this.littleEndian);

    this.slice_end = NiftiUtils.getShortAt(rawData, 120, this.littleEndian);
    this.slice_code = NiftiUtils.getByteAt(rawData, 122);

    this.xyzt_units = NiftiUtils.getByteAt(rawData, 123);

    this.cal_max = NiftiUtils.getFloatAt(rawData, 124, this.littleEndian);
    this.cal_min = NiftiUtils.getFloatAt(rawData, 128, this.littleEndian);

    this.slice_duration = NiftiUtils.getFloatAt(rawData, 132, this.littleEndian);
    this.toffset = NiftiUtils.getFloatAt(rawData, 136, this.littleEndian);

    this.description = NiftiUtils.getStringAt(rawData, 148, 228);
    this.aux_file = NiftiUtils.getStringAt(rawData, 228, 252);

    this.qform_code = NiftiUtils.getShortAt(rawData, 252, this.littleEndian);
    this.sform_code = NiftiUtils.getShortAt(rawData, 254, this.littleEndian);

    this.quatern_b = NiftiUtils.getFloatAt(rawData, 256, this.littleEndian);
    this.quatern_c = NiftiUtils.getFloatAt(rawData, 260, this.littleEndian);
    this.quatern_d = NiftiUtils.getFloatAt(rawData, 264, this.littleEndian);
    this.qoffset_x = NiftiUtils.getFloatAt(rawData, 268, this.littleEndian);
    this.qoffset_y = NiftiUtils.getFloatAt(rawData, 272, this.littleEndian);
    this.qoffset_z = NiftiUtils.getFloatAt(rawData, 276, this.littleEndian);

    for (ctrOut = 0; ctrOut < 3; ctrOut += 1) {
      for (ctrIn = 0; ctrIn < 4; ctrIn += 1) {
        index = 280 + (((ctrOut * 4) + ctrIn) * 4);
        this.affine[ctrOut][ctrIn] = NiftiUtils.getFloatAt(rawData, index, this.littleEndian);
      }
    }

    this.affine[3][0] = 0;
    this.affine[3][1] = 0;
    this.affine[3][2] = 0;
    this.affine[3][3] = 1;

    this.intent_name = NiftiUtils.getStringAt(rawData, 328, 344);
    this.magic = NiftiUtils.getStringAt(rawData, 344, 348);

    this.isHDR = (this.magic === NIFTI_1.MAGIC_NUMBER2);

    if (rawData.byteLength > NIFTI_1.MAGIC_COOKIE) {
      this.extensionFlag[0] = NiftiUtils.getByteAt(rawData, 348);
      this.extensionFlag[1] = NiftiUtils.getByteAt(rawData, 348 + 1);
      this.extensionFlag[2] = NiftiUtils.getByteAt(rawData, 348 + 2);
      this.extensionFlag[3] = NiftiUtils.getByteAt(rawData, 348 + 3);

      if (this.extensionFlag[0]) {
        this.extensionSize = this.getExtensionSize(rawData);
        this.extensionCode = this.getExtensionCode(rawData);
      }
    }
  }

  toFormattedString() {
    const fmt = NiftiUtils.formatNumber;
    let str = "";

    str += ("Dim Info = " + this.dim_info + "\n");

    str += ("Image Dimensions (1-8): " +
        this.dims[0] + ", " +
        this.dims[1] + ", " +
        this.dims[2] + ", " +
        this.dims[3] + ", " +
        this.dims[4] + ", " +
        this.dims[5] + ", " +
        this.dims[6] + ", " +
        this.dims[7] + "\n");

    str += ("Intent Parameters (1-3): " +
        this.intent_p1 + ", " +
        this.intent_p2 + ", " +
        this.intent_p3) + "\n";

    str += ("Intent Code = " + this.intent_code + "\n");
    str += ("Datatype = " + this.datatypeCode +  " (" + this.getDatatypeCodeString(this.datatypeCode) + ")\n");
    str += ("Bits Per Voxel = " + this.numBitsPerVoxel + "\n");
    str += ("Slice Start = " + this.slice_start + "\n");
    str += ("Voxel Dimensions (1-8): " +
           fmt(this.pixDims[0]) + ", " +
           fmt(this.pixDims[1]) + ", " +
           fmt(this.pixDims[2]) + ", " +
           fmt(this.pixDims[3]) + ", " +
           fmt(this.pixDims[4]) + ", " +
           fmt(this.pixDims[5]) + ", " +
           fmt(this.pixDims[6]) + ", " +
           fmt(this.pixDims[7]) + "\n");

    str += ("Image Offset = " + this.vox_offset + "\n");
    str += ("Data Scale:  Slope = " + fmt(this.scl_slope) + "  Intercept = " + fmt(this.scl_inter) + "\n");
    str += ("Slice End = " + this.slice_end + "\n");
    str += ("Slice Code = " + this.slice_code + "\n");
    str += ("Units Code = " + this.xyzt_units + " (" + this.getUnitsCodeString(NIFTI_1.SPATIAL_UNITS_MASK & this.xyzt_units) + ", " + this.getUnitsCodeString(NIFTI_1.TEMPORAL_UNITS_MASK & this.xyzt_units) + ")\n");
    str += ("Display Range:  Max = " + fmt(this.cal_max) + "  Min = " + fmt(this.cal_min) + "\n");
    str += ("Slice Duration = " + this.slice_duration + "\n");
    str += ("Time Axis Shift = " + this.toffset + "\n");
    str += ("Description: \"" + this.description + "\"\n");
    str += ("Auxiliary File: \"" + this.aux_file + "\"\n");
    str += ("Q-Form Code = " + this.qform_code + " (" + this.getTransformCodeString(this.qform_code) + ")\n");
    str += ("S-Form Code = " + this.sform_code + " (" + this.getTransformCodeString(this.sform_code) + ")\n");
    str += ("Quaternion Parameters:  " +
        "b = " + fmt(this.quatern_b) + "  " +
        "c = " + fmt(this.quatern_c) + "  " +
        "d = " + fmt(this.quatern_d) + "\n");

    str += ("Quaternion Offsets:  " +
        "x = " + this.qoffset_x + "  " +
        "y = " + this.qoffset_y + "  " +
        "z = " + this.qoffset_z + "\n");

    str += ("S-Form Parameters X: " +
         fmt(this.affine[0][0]) + ", " +
         fmt(this.affine[0][1]) + ", " +
         fmt(this.affine[0][2]) + ", " +
         fmt(this.affine[0][3]) + "\n");

    str += ("S-Form Parameters Y: " +
         fmt(this.affine[1][0]) + ", " +
         fmt(this.affine[1][1]) + ", " +
         fmt(this.affine[1][2]) + ", " +
         fmt(this.affine[1][3]) + "\n");

    str += ("S-Form Parameters Z: " +
         fmt(this.affine[2][0]) + ", " +
         fmt(this.affine[2][1]) + ", " +
         fmt(this.affine[2][2]) + ", " +
         fmt(this.affine[2][3]) + "\n");

    str += ("Intent Name: \"" + this.intent_name + "\"\n");

    if (this.extensionFlag[0]) {
      str += ("Extension: Size = " + this.extensionSize + "  Code = " + this.extensionCode + "\n");

    }

    return str;
  };

  getDatatypeCodeString(code: any) {
    if (code === NIFTI_1.TYPE_UINT8) {
      return "1-Byte Unsigned Integer";
    } else if (code === NIFTI_1.TYPE_INT16) {
      return "2-Byte Signed Integer";
    } else if (code === NIFTI_1.TYPE_INT32) {
      return "4-Byte Signed Integer";
    } else if (code === NIFTI_1.TYPE_FLOAT32) {
      return "4-Byte Float";
    } else if (code === NIFTI_1.TYPE_FLOAT64) {
      return "8-Byte Float";
    } else if (code === NIFTI_1.TYPE_RGB24) {
      return "RGB";
    } else if (code === NIFTI_1.TYPE_INT8) {
      return "1-Byte Signed Integer";
    } else if (code === NIFTI_1.TYPE_UINT16) {
      return "2-Byte Unsigned Integer";
    } else if (code === NIFTI_1.TYPE_UINT32) {
      return "4-Byte Unsigned Integer";
    } else if (code === NIFTI_1.TYPE_INT64) {
      return "8-Byte Signed Integer";
    } else if (code === NIFTI_1.TYPE_UINT64) {
      return "8-Byte Unsigned Integer";
    } else {
      return "Unknown";
    }
  };


  getTransformCodeString(code: any) {
    if (code === NIFTI_1.XFORM_SCANNER_ANAT) {
      return "Scanner";
    } else if (code === NIFTI_1.XFORM_ALIGNED_ANAT) {
      return "Aligned";
    } else if (code === NIFTI_1.XFORM_TALAIRACH) {
      return "Talairach";
    } else if (code === NIFTI_1.XFORM_MNI_152) {
      return "MNI";
    } else {
      return "Unknown";
    }
  };

  getUnitsCodeString(code: any) {
    if (code === NIFTI_1.UNITS_METER) {
      return "Meters";
    } else if (code === NIFTI_1.UNITS_MM) {
      return "Millimeters";
    } else if (code === NIFTI_1.UNITS_MICRON) {
      return "Microns";
    } else if (code === NIFTI_1.UNITS_SEC) {
      return "Seconds";
    } else if (code === NIFTI_1.UNITS_MSEC) {
      return "Milliseconds";
    } else if (code === NIFTI_1.UNITS_USEC) {
      return "Microseconds";
    } else if (code === NIFTI_1.UNITS_HZ) {
      return "Hz";
    } else if (code === NIFTI_1.UNITS_PPM) {
      return "PPM";
    } else if (code === NIFTI_1.UNITS_RADS) {
      return "Rads";
    } else {
      return "Unknown";
    }
  };

  public getQformMat() {
    return this.convertNiftiQFormToNiftiSForm(this.quatern_b, 
                                              this.quatern_c, 
                                              this.quatern_d, 
                                              this.qoffset_x, 
                                              this.qoffset_y, 
                                              this.qoffset_z, 
                                              this.pixDims[1], 
                                              this.pixDims[2], 
                                              this.pixDims[3], 
                                              this.pixDims[0]);
  };

  public convertNiftiQFormToNiftiSForm(qb: number, qc: number, qd: number, qx: number, qy: number, qz: number, dx: number, dy: number, dz: number, qfac: number) {
    var R = [
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0], 
      [0, 0, 0, 0]
    ],
    a,
    b = qb,
    c = qc,
    d = qd,
    xd,
    yd,
    zd;

    // last row is always [ 0 0 0 1 ]
    R[3][0] = R[3][1] = R[3][2] = 0.0;
    R[3][3] = 1.0;

    // compute a parameter from b,c,d
    a = 1.0 - (b * b + c * c + d * d);
    if (a < 0.0000001) {                   /* special case */

    a = 1.0 / Math.sqrt(b * b + c * c + d * d);
    b *= a;
    c *= a;
    d *= a;        /* normalize (b,c,d) vector */
    a = 0.0;                        /* a = 0 ==> 180 degree rotation */
    } else {

    a = Math.sqrt(a);                     /* angle = 2 * arccos(a) */
    }

    // load rotation matrix, including scaling factors for voxel sizes
    xd = (dx > 0.0) ? dx : 1.0;       /* make sure are positive */
    yd = (dy > 0.0) ? dy : 1.0;
    zd = (dz > 0.0) ? dz : 1.0;

    if (qfac < 0.0) {
    zd = -zd;         /* left handedness? */
    }

    R[0][0] =       (a * a + b * b - c * c - d * d) * xd;
    R[0][1] = 2.0 * (b * c - a * d) * yd;
    R[0][2] = 2.0 * (b * d + a * c) * zd;
    R[1][0] = 2.0 * (b * c + a * d) * xd;
    R[1][1] =       (a * a + c * c - b * b - d * d) * yd;
    R[1][2] = 2.0 * (c * d - a * b) * zd;
    R[2][0] = 2.0 * (b * d - a * c) * xd;
    R[2][1] = 2.0 * (c * d + a * b) * yd;
    R[2][2] =       (a * a + d * d - c * c - b * b) * zd;

    // load offsets
    R[0][3] = qx;
    R[1][3] = qy;
    R[2][3] = qz;

    return R;
  };

  convertNiftiSFormToNEMA(R: any) {
    let xi, xj, xk, yi, yj, yk, zi, zj, zk, val, detQ, detP, i, j, k, p, q, r, ibest, jbest, kbest, pbest, qbest, rbest,
        M, vbest, Q, P, iChar, jChar, kChar, iSense, jSense, kSense;
    k = 0;

    Q = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    P = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    /* if( icod == NULL || jcod == NULL || kcod == NULL ) return ; /* bad */

    /* icod = *jcod = *kcod = 0 ; /* this.errorMessage returns, if sh*t happens */

    /* load column vectors for each (i,j,k) direction from matrix */

    /*-- i axis --*/ /*-- j axis --*/ /*-- k axis --*/

    xi = R[0][0];
    xj = R[0][1];
    xk = R[0][2];

    yi = R[1][0];
    yj = R[1][1];
    yk = R[1][2];

    zi = R[2][0];
    zj = R[2][1];
    zk = R[2][2];

    /* normalize column vectors to get unit vectors along each ijk-axis */

    /* normalize i axis */
    val = Math.sqrt(xi * xi + yi * yi + zi * zi);
    if (val === 0.0) {  /* stupid input */
        return null;
    }

    xi /= val;
    yi /= val;
    zi /= val;

    /* normalize j axis */
    val = Math.sqrt(xj * xj + yj * yj + zj * zj);
    if (val === 0.0) {  /* stupid input */
        return null;
    }

    xj /= val;
    yj /= val;
    zj /= val;

    /* orthogonalize j axis to i axis, if needed */
    val = xi * xj + yi * yj + zi * zj;    /* dot product between i and j */
    if (Math.abs(val) > 1.E-4) {
        xj -= val * xi;
        yj -= val * yi;
        zj -= val * zi;
        val = Math.sqrt(xj * xj + yj * yj + zj * zj);  /* must renormalize */
        if (val === 0.0) {              /* j was parallel to i? */
            return null;
        }
        xj /= val;
        yj /= val;
        zj /= val;
    }

    /* normalize k axis; if it is zero, make it the cross product i x j */
    val = Math.sqrt(xk * xk + yk * yk + zk * zk);
    if (val === 0.0) {
        xk = yi * zj - zi * yj;
        yk = zi * xj - zj * xi;
        zk = xi * yj - yi * xj;
    } else {
        xk /= val;
        yk /= val;
        zk /= val;
    }

    /* orthogonalize k to i */
    val = xi * xk + yi * yk + zi * zk;    /* dot product between i and k */
    if (Math.abs(val) > 1.E-4) {
        xk -= val * xi;
        yk -= val * yi;
        zk -= val * zi;
        val = Math.sqrt(xk * xk + yk * yk + zk * zk);
        if (val === 0.0) {    /* bad */
            return null;
        }
        xk /= val;
        yk /= val;
        zk /= val;
    }

    /* orthogonalize k to j */
    val = xj * xk + yj * yk + zj * zk;    /* dot product between j and k */
    if (Math.abs(val) > 1.e-4) {
        xk -= val * xj;
        yk -= val * yj;
        zk -= val * zj;
        val = Math.sqrt(xk * xk + yk * yk + zk * zk);
        if (val === 0.0) {     /* bad */
            return null;
        }
        xk /= val;
        yk /= val;
        zk /= val;
    }

    Q[0][0] = xi;
    Q[0][1] = xj;
    Q[0][2] = xk;
    Q[1][0] = yi;
    Q[1][1] = yj;
    Q[1][2] = yk;
    Q[2][0] = zi;
    Q[2][1] = zj;
    Q[2][2] = zk;

    /* at this point, Q is the rotation matrix from the (i,j,k) to (x,y,z) axes */

    detQ = this.nifti_mat33_determ(Q);
    if (detQ === 0.0) { /* shouldn't happen unless user is a DUFIS */
        return null;
    }

    /* Build and test all possible +1/-1 coordinate permutation matrices P;
     then find the P such that the rotation matrix M=PQ is closest to the
     identity, in the sense of M having the smallest total rotation angle. */

    /* Despite the formidable looking 6 nested loops, there are
     only 3*3*3*2*2*2 = 216 passes, which will run very quickly. */

    vbest = -666.0;
    ibest = pbest = qbest = rbest = 1;
    jbest = 2;
    kbest = 3;

    for (i = 1; i <= 3; i += 1) {     /* i = column number to use for row #1 */
      for (j = 1; j <= 3; j += 1) {    /* j = column number to use for row #2 */
        if (i !== j) {
          for (k = 1; k <= 3; k += 1) {  /* k = column number to use for row #3 */
            if (!(i === k || j === k)) {
              P[0][0] = P[0][1] = P[0][2] = P[1][0] = P[1][1] = P[1][2] = P[2][0] = P[2][1] = P[2][2] = 0.0;
              for (p = -1; p <= 1; p += 2) {    /* p,q,r are -1 or +1      */
                for (q = -1; q <= 1; q += 2) {   /* and go into rows #1,2,3 */
                  for (r = -1; r <= 1; r += 2) {
                    P[0][i - 1] = p;
                    P[1][j - 1] = q;
                    P[2][k - 1] = r;
                    detP = this.nifti_mat33_determ(P);           /* sign of permutation */
                    if ((detP * detQ) > 0.0) {
                      M = this.nifti_mat33_mul(P, Q);

                      /* angle of M rotation = 2.0*acos(0.5*sqrt(1.0+trace(M)))       */
                      /* we want largest trace(M) == smallest angle == M nearest to I */

                      val = M[0][0] + M[1][1] + M[2][2]; /* trace */
                      if (val > vbest) {
                        vbest = val;
                        ibest = i;
                        jbest = j;
                        kbest = k;
                        pbest = p;
                        qbest = q;
                        rbest = r;
                      }
                    }  /* doesn't match sign of Q */
                  }
                }
              }
            }
          }
        }
      }
    }

    /* At this point ibest is 1 or 2 or 3; pbest is -1 or +1; etc.

     The matrix P that corresponds is the best permutation approximation
     to Q-inverse; that is, P (approximately) takes (x,y,z) coordinates
     to the (i,j,k) axes.

     For example, the first row of P (which contains pbest in column ibest)
     determines the way the i axis points relative to the anatomical
     (x,y,z) axes.  If ibest is 2, then the i axis is along the y axis,
     which is direction P2A (if pbest > 0) or A2P (if pbest < 0).

     So, using ibest and pbest, we can assign the output code for
     the i axis.  Mutatis mutandis for the j and k axes, of course. */

    iChar = jChar = kChar = iSense = jSense = kSense = 0;

    switch (ibest * pbest) {
        case 1: /*i = NIFTI_L2R*/
            iChar = 'X';
            iSense = '+';
            break;
        case -1: /*i = NIFTI_R2L*/
            iChar = 'X';
            iSense = '-';
            break;
        case 2: /*i = NIFTI_P2A*/
            iChar = 'Y';
            iSense = '+';
            break;
        case -2: /*i = NIFTI_A2P*/
            iChar = 'Y';
            iSense = '-';
            break;
        case 3: /*i = NIFTI_I2S*/
            iChar = 'Z';
            iSense = '+';
            break;
        case -3: /*i = NIFTI_S2I*/
            iChar = 'Z';
            iSense = '-';
            break;
    }

    switch (jbest * qbest) {
        case 1: /*j = NIFTI_L2R*/
            jChar = 'X';
            jSense = '+';
            break;
        case -1: /*j = NIFTI_R2L*/
            jChar = 'X';
            jSense = '-';
            break;
        case 2: /*j = NIFTI_P2A*/
            jChar = 'Y';
            jSense = '+';
            break;
        case -2: /*j = NIFTI_A2P*/
            jChar = 'Y';
            jSense = '-';
            break;
        case 3: /*j = NIFTI_I2S*/
            jChar = 'Z';
            jSense = '+';
            break;
        case -3: /*j = NIFTI_S2I*/
            jChar = 'Z';
            jSense = '-';
            break;
    }

    switch (kbest * rbest) {
        case 1: /*k = NIFTI_L2R*/
            kChar = 'X';
            kSense = '+';
            break;
        case -1: /*k = NIFTI_R2L*/
            kChar = 'X';
            kSense = '-';
            break;
        case 2: /*k = NIFTI_P2A*/
            kChar = 'Y';
            kSense = '+';
            break;
        case -2: /*k = NIFTI_A2P*/
            kChar = 'Y';
            kSense = '-';
            break;
        case 3: /*k = NIFTI_I2S*/
            kChar = 'Z';
            kSense = '+';
            break;
        case -3: /*k = NIFTI_S2I*/
            kChar = 'Z';
            kSense = '-';
            break;
    }

    return (iChar + jChar + kChar + iSense + jSense + kSense);
  };


  nifti_mat33_mul(A: any, B: any) {
    const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let i;
    let j;

    for (i = 0; i < 3; i += 1) {
      for (j = 0; j < 3; j += 1) {
        C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
      }
    }

    return C;
  };

  nifti_mat33_determ = function (R) {
    var r11, r12, r13, r21, r22, r23, r31, r32, r33;
    /*  INPUT MATRIX:  */
    r11 = R[0][0];
    r12 = R[0][1];
    r13 = R[0][2];
    r21 = R[1][0];
    r22 = R[1][1];
    r23 = R[1][2];
    r31 = R[2][0];
    r32 = R[2][1];
    r33 = R[2][2];

    return (r11 * r22 * r33 - r11 * r32 * r23 - r21 * r12 * r33 + r21 * r32 * r13 + r31 * r12 * r23 - r31 * r22 * r13);
  };

  public getExtensionLocation(): number {
    return NIFTI_1.MAGIC_COOKIE + 4;
  };

  public getExtensionSize(data: DataView): number {
    return NiftiUtils.getIntAt(data, this.getExtensionLocation(), this.littleEndian);
  };


  /**
   * @param data 
   * @returns the extension code.
   */
  public getExtensionCode(data: DataView): number {
    return NiftiUtils.getIntAt(data, this.getExtensionLocation() + 4, this.littleEndian);
  };

}
