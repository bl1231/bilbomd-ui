import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import JobSummary from '../JobSummary'
import { renderWithProviders } from 'test/rendersWithProviders'
import { BilboMDJob, MongoWithIdString } from 'types/interfaces'
import {
  IBilboMDCRDJob,
  IUser,
  JobStatusEnum
} from '@bl1231/bilbomd-mongodb-schema'

function createMockCRDJob(
  overrides: Partial<MongoWithIdString<IBilboMDCRDJob>> = {}
): MongoWithIdString<IBilboMDCRDJob> {
  return {
    _id: 'mongo-id',
    id: 'mongo-id',
    uuid: 'mock-uuid',
    title: '51-crd-test',
    user: { username: 'scott', id: 'user-id' } as IUser,
    const_inp_file: 'const.inp',
    crd_file: 'pro_dna_complex.crd',
    psf_file: 'pro_dna_complex.psf',
    data_file: 'pro_dna_saxs.dat',
    conformational_sampling: 1,
    rg: 27,
    rg_min: 22,
    rg_max: 41,
    status: 'Completed',
    time_submitted: new Date('2025-05-01T22:48:55.154Z'),
    cleanup_in_progress: false,
    progress: 100,
    __t: 'BilboMdCRD',
    ...overrides
  } as MongoWithIdString<IBilboMDCRDJob>
}

const baseJob: BilboMDJob = {
  id: '6813fa574cc02e4a465ab1b7',
  username: 'scott',
  mongo: createMockCRDJob(),
  bullmq: {
    position: 0,
    queuePosition: '0',
    bilbomdStep: {
      minimize: 'Success',
      heat: 'Success',
      md: 'Success',
      foxs: 'Success',
      pae: 'Success',
      multifoxs: 'Success',
      results: 'Success',
      email: 'Success',
      numEnsembles: 1
    },
    bilbomdLastStep: 'step1',
    bullmq: {
      id: 123,
      progress: '100%',
      name: 'job-name',
      data: {
        type: 'mock-type',
        title: 'mock-title',
        uuid: 'mock-uuid'
      }
    }
  }
}

describe('JobSummary', () => {
  it('renders job title', () => {
    renderWithProviders(<JobSummary job={baseJob} />)
    expect(screen.getByText(/51-crd-test/i)).toBeInTheDocument()
  })

  it('renders JobDetails component', () => {
    renderWithProviders(<JobSummary job={baseJob} />)

    expect(screen.getByRole('link', { name: /details/i })).toBeInTheDocument()
  })

  it('renders DeleteJob when job is not running or submitted', () => {
    renderWithProviders(<JobSummary job={baseJob} />)
    expect(screen.getByRole('button', { name: /trash/i })).toBeInTheDocument()
  })

  it('disables DeleteJob with tooltip when job is running', async () => {
    const runningJob = {
      ...baseJob,
      mongo: { ...baseJob.mongo, status: 'Running' as JobStatusEnum }
    }
    renderWithProviders(<JobSummary job={runningJob} />)
    const deleteButton = screen.getByRole('button', { name: /trash/i })
    expect(deleteButton).toBeDisabled()
  })

  it('disables DeleteJob with tooltip when job is submitted', async () => {
    const submittedJob = {
      ...baseJob,
      mongo: { ...baseJob.mongo, status: 'Submitted' as JobStatusEnum }
    }
    renderWithProviders(<JobSummary job={submittedJob} />)
    const deleteButton = screen.getByRole('button', { name: /trash/i })
    expect(deleteButton).toBeDisabled()
  })
})
