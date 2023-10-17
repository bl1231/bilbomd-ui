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

interface BilboMDRegSteps {
  minimize: string
  heat: string
  md: string
  foxs: string
  multifoxs: string
  results: string
  email: string
}

interface BilboMDAutoSteps {
  pae: string
  autorg: string
  minimize: string
  heat: string
  md: string
  foxs: string
  multifoxs: string
  results: string
  email: string
}

type BilboMDSteps = BilboMDRegSteps | BilboMDAutoSteps

export interface BullMQJob {
  id: number
  progress: number
  name: string
  bilbomdStep: BilboMDSteps
  bilbomdLastStep: string
  data: BullMQData
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

export interface Queue {
  name: string
  queue_name: string
  active_count: number
  waiting_count: number
}
