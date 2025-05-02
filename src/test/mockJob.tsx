import { BilboMDJob } from 'types/interfaces'

export const createMockBilboMDJob = (
  overrides: Partial<BilboMDJob> = {}
): BilboMDJob => {
  const baseJob: BilboMDJob = {
    mongo: {
      id: '123',
      __t: 'BilboMdPDB',
      uuid: 'abc-123',
      time_submitted: new Date(),
      time_started: new Date(),
      time_completed: new Date(),
      data_file: 'example.dat',
      pdb_file: 'example.pdb',
      psf_file: 'example.psf',
      crd_file: 'example.crd',
      const_inp_file: 'const.inp',
      rg: 25,
      rg_min: 20,
      rg_max: 30,
      conformational_sampling: 1
    },
    bullmq: {
      status: 'completed',
      progress: 100
    }
  }

  return {
    mongo: { ...baseJob.mongo, ...(overrides.mongo || {}) },
    bullmq: { ...baseJob.bullmq, ...(overrides.bullmq || {}) }
  }
}
