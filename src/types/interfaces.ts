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

interface BilboMDSteps {
  minimize: string
  heat: string
  md: string
  foxs: string
  multifoxs: string
  results: string
  email: string
}

export interface BullMQJob {
  id: number
  progress: number
  name: string
  bilbomdStep: BilboMDSteps
  bilbomdLastStep: string
}

export interface RigidBody {
  id: string
  domains: RigidDomain[]
}

export interface Job {
  id: string
  _id: string
  conformational_sampling: number
  const_inp_file: string
  crd_file: string
  createdAt: string
  data_file: string
  psf_file: string
  rg_max: number
  rg_min: number
  status: string
  time_completed: string
  time_started: string
  time_submitted: string
  title: string
  updatedAt: string
  user: string
  username: string
  uuid: string
  bullmq: BullMQJob
}
