export interface Chain {
  id: string
  atoms: number
  first_res: number
  last_res: number
  num_res: number
  domains: { start: number; end: number }[]
}

interface RigidDomain {
  chainid: string
  start: number
  end: number
}

interface BullMQData {
  type: string
  title: string
  uuid: string
}

export interface BullMQJob {
  id: number
  progress: string
  name: string
  data: BullMQData
  failedReason?: string
}

export interface RigidBody {
  id: string
  domains: RigidDomain[]
}

export interface Job {
  id: string
  _id: string
  __t: string
  conformational_sampling: number
  const_inp_file: string
  crd_file: string
  createdAt: string
  data_file: string
  psf_file: string
  pdb_file: string
  rg_max: number
  rg_min: number
  status: string
  time_completed: string
  time_started: string
  time_submitted: string
  title: string
  updatedAt: string
  user: string
  uuid: string
}

export interface Queue {
  name: string
  queue_name: string
  active_count: number
  waiting_count: number
}

export type BilboMDSteps = {
  pae?: string
  autorg?: string
  minimize: string
  heat: string
  md: string
  foxs: string
  multifoxs: string
  results: string
  email: string
}

// export type ScoperSteps = {
//   scoper: string
//   results: string
//   email: string
// }

export type BilboMDBullMQ = {
  position: number
  queuePosition: string
  bilbomdStep: BilboMDSteps | BilboMDScoperSteps
  bilbomdLastStep: string
  bullmq: BullMQJob
}

export type BilboMDScoperSteps = {
  addHydrogens: boolean
  runRNAview: boolean
  KGSConformations: number
  KGSFiles: number
  FoXS: string
  FoXSProgress: number
  FoXSTopFile: string
  FoXSTopScore: number
  createdFeatures: boolean
  predictionThreshold: number
  MultiFoXS: string
  MultiFoXSEnsembleSize: number
  MultiFoXSScore: number
  scoper: string
  results: string
  email: string
}

export type BilboMDJob = {
  id: string
  mongo: Job
  bullmq: BilboMDBullMQ
  scoper?: BilboMDScoperSteps
  username: string
}
