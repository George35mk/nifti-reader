export const NIFTI_1 = {
  // datatype codes
  TYPE_NONE            : 0,
  TYPE_BINARY          : 1,
  TYPE_UINT8           : 2,
  TYPE_INT16           : 4,
  TYPE_INT32           : 8,
  TYPE_FLOAT32         : 16,
  TYPE_COMPLEX64       : 32,
  TYPE_FLOAT64         : 64,
  TYPE_RGB24           : 128,
  TYPE_INT8            : 256,
  TYPE_UINT16          : 512,
  TYPE_UINT32          : 768,
  TYPE_INT64           : 1024,
  TYPE_UINT64          : 1280,
  TYPE_FLOAT128        : 1536,
  TYPE_COMPLEX128      : 1792,
  TYPE_COMPLEX256      : 2048,

  // transform codes
  XFORM_UNKNOWN        : 0,
  XFORM_SCANNER_ANAT   : 1,
  XFORM_ALIGNED_ANAT   : 2,
  XFORM_TALAIRACH      : 3,
  XFORM_MNI_152        : 4,

  // unit codes
  SPATIAL_UNITS_MASK    : 0x07,
  TEMPORAL_UNITS_MASK   : 0x38,
  UNITS_UNKNOWN         : 0,
  UNITS_METER           : 1,
  UNITS_MM              : 2,
  UNITS_MICRON          : 3,
  UNITS_SEC             : 8,
  UNITS_MSEC            : 16,
  UNITS_USEC            : 24,
  UNITS_HZ              : 32,
  UNITS_PPM             : 40,
  UNITS_RADS            : 48,

  // nifti1 codes
  MAGIC_COOKIE          : 348,
  STANDARD_HEADER_SIZE  : 348,
  MAGIC_NUMBER_LOCATION : 344,
  MAGIC_NUMBER          : [0x6E, 0x2B, 0x31],  // n+1 (.nii)
  MAGIC_NUMBER2         : [0x6E, 0x69, 0x31],  // ni1 (.hdr/.img)
  EXTENSION_HEADER_SIZE : 8
};
