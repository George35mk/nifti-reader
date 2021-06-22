export class Nifti2 {

  public littleEndian = false;
  public dim_info = 0;
  public dims = [];
  public intent_p1 = 0;
  public intent_p2 = 0;
  public intent_p3 = 0;
  public intent_code = 0;
  public datatypeCode = 0;
  public numBitsPerVoxel = 0;
  public slice_start = 0;
  public slice_end = 0;
  public slice_code = 0;
  public pixDims = [];
  public vox_offset = 0;
  public scl_slope = 1;
  public scl_inter = 0;
  public xyzt_units = 0;
  public cal_max = 0;
  public cal_min = 0;
  public slice_duration = 0;
  public toffset = 0;
  public description = "";
  public aux_file = "";
  public intent_name = "";
  public qform_code = 0;
  public sform_code = 0;
  public quatern_b = 0;
  public quatern_c = 0;
  public quatern_d = 0;
  public qoffset_x = 0;
  public qoffset_y = 0;
  public qoffset_z = 0;
  public affine = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  public magic = 0;
  public extensionFlag = [0, 0, 0, 0];

  constructor() {
      
  }
}
