export interface Chain {
  id: string
  atoms: number
  first_res: number
  last_res: number
  num_res: number
  domains: { start: number; end: number }[]
}

interface Domain {
  chainid: string
  start: number
  end: number
}

export interface RigidBody {
  id: string
  domains: Domain[]
}
