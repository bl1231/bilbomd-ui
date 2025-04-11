export interface Entity {
  id: string
  name: string
  sequence: string
  type: string
  copies: number
  seq_length?: number
}

export interface NewAlphaFoldJobFormValues {
  title: string
  dat_file: string
  email: string
  entities: Entity[]
}
