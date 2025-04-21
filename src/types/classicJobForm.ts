export type BilboMDClassicJobFormValues = {
  bilbomd_mode: 'pdb' | 'crd_psf'
  title: string
  psf_file: File | string
  crd_file: File | string
  pdb_file: File | string
  inp_file: File | string
  dat_file: File | string
  num_conf: string
  rg: string
  rg_min: string
  rg_max: string
}
