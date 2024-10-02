export interface NewSANSJobFormValues {
  title: string
  pdb_file: string
  dat_file: string
  rg_min: number
  rg_max: number
  inp_file: string
  d2o_fraction: number
  [key: `deuteration_fraction_${string}`]: number
  email: string
}
