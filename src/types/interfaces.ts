export interface Chain {
  id: string
  atoms: number
  first_res: number
  last_res: number
  num_res: number
  type: string
  domains: { start: number; end: number }[]
}

export interface RigidDomain {
  chainid: string
  start: number
  end: number
}

export interface RigidBody {
  id: string
  domains: RigidDomain[]
}

export interface Atom {
  serial: number // Atom serial number
  name: string // Atom name
  altLoc: string // Alternate location indicator
  resName: string // Residue name
  chainID: string // Chain identifier
  resSeq: number // Residue sequence number
  iCode: string // Code for insertion of residues
  x: number // Orthogonal coordinates for X in Angstroms
  y: number // Orthogonal coordinates for Y in Angstroms
  z: number // Orthogonal coordinates for Z in Angstroms
  occupancy: number // Occupancy
  tempFactor: number // Temperature factor
  element: string // Element symbol
  charge: string // Charge on the atom
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

interface IStepStatus {
  status: string
  message: string
}

interface IBilboMDSteps {
  pdb2crd: IStepStatus
  pae: IStepStatus
  autorg: IStepStatus
  minimize: IStepStatus
  initfoxs: IStepStatus
  heat: IStepStatus
  md: IStepStatus
  dcd2pdb: IStepStatus
  foxs: IStepStatus
  multifoxs: IStepStatus
  results: IStepStatus
  email: IStepStatus
  nersc_prepare_slurm_batch?: IStepStatus
  nersc_submit_slurm_batch?: IStepStatus
  nersc_job_status?: IStepStatus
  nersc_copy_results_to_cfs?: IStepStatus
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
  steps: IBilboMDSteps
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
  numEnsembles: number
}

export type BilboMDAlphaFoldResults = {
  numEnsembles: number
}

export type BilboMDScoperSteps = {
  reduce: string
  rnaview: string
  kgs: string
  kgsConformations: number
  kgsFiles: number
  foxs: string
  foxsProgress: number
  foxsTopFile: string
  foxsTopScore: number
  createdFeatures: boolean
  IonNet: string
  predictionThreshold: number
  multifoxs: string
  multifoxsEnsembleSize: number
  multifoxsScore: number
  scoperPdb: string
  scoper: string
  results: string
  email: string
}

export type BilboMDBullMQ = {
  position: number
  queuePosition: string
  bilbomdStep: BilboMDSteps | BilboMDScoperSteps
  bilbomdLastStep: string
  bullmq: BullMQJob
}

export type BilboMDJob = {
  id: string
  username: string
  mongo: Job
  bullmq: BilboMDBullMQ
  scoper?: BilboMDScoperSteps
  classic?: BilboMDSteps
  auto?: BilboMDSteps
  alphafold?: BilboMDAlphaFoldResults
}
