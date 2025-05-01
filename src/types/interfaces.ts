import {
  IBilboMDPDBJob,
  IBilboMDCRDJob,
  IBilboMDAutoJob,
  IBilboMDSANSJob,
  IBilboMDAlphaFoldJob,
  IMultiJob
} from '@bl1231/bilbomd-mongodb-schema'

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

type MongoWithIdString<T> = Omit<T, '_id'> & { _id: string }

export type BilboMDJob = {
  id: string
  username: string
  mongo:
    | MongoWithIdString<IBilboMDPDBJob>
    | MongoWithIdString<IBilboMDCRDJob>
    | MongoWithIdString<IBilboMDAutoJob>
    | MongoWithIdString<IBilboMDSANSJob>
    | MongoWithIdString<IBilboMDAlphaFoldJob>
  bullmq: BilboMDBullMQ
  scoper?: BilboMDScoperSteps
}

export type BilboMDMultiJob = {
  id: string
  username: string
  mongo: IMultiJob
  bullmq: BilboMDBullMQ
}
