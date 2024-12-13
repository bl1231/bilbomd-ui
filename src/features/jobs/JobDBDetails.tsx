import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HeaderBox from 'components/HeaderBox'
import { format } from 'date-fns'
import { Box } from '@mui/system'
import { BilboMDJob } from 'types/interfaces'
import CopyableChip from 'components/CopyableChip'

interface JobDBDetailsProps {
  job: BilboMDJob
}

const JobDBDetails: React.FC<JobDBDetailsProps> = ({ job }) => {
  const getNumConformations = () => {
    const { rg_min = 0, rg_max = 0, conformational_sampling } = job.mongo
    const stepSize = Math.max(Math.round((rg_max - rg_min) / 5), 1)
    const rgList: number[] = []
    for (let rg = rg_min; rg <= rg_max; rg += stepSize) {
      rgList.push(rg)
    }
    const numConformations = conformational_sampling * 200 * rgList.length
    return { stepSize, numSteps: rgList.length, numConformations, rgList }
  }

  const { stepSize, numSteps, numConformations, rgList } = getNumConformations()

  // Define properties to render dynamically
  const properties = [
    { label: 'Job Type', value: job.mongo.__t },
    { label: 'Submittedd', value: job.mongo.time_submitted },
    { label: 'Started', value: job.mongo.time_started },
    { label: 'Completed', value: job.mongo.time_completed },
    { label: 'SAXS data', value: job.mongo.data_file },
    { label: 'PSF file', value: job.mongo.psf_file },
    { label: 'CRD file', value: job.mongo.crd_file },
    { label: 'PDB file', value: job.mongo.pdb_file },
    { label: 'CHARMM constraint file', value: job.mongo.const_inp_file },
    { label: 'Rg min', value: job.mongo.rg_min, suffix: 'Å' },
    { label: 'Rg max', value: job.mongo.rg_max, suffix: 'Å' },
    { label: 'Rg step size', value: stepSize, suffix: 'Å' },
    { label: 'Number of CHARMM MD Runs', value: numSteps },
    { label: 'Number of conformations', value: numConformations },
    {
      label: 'Rg List',
      render: () => (
        <Typography>
          {rgList.map((rgValue, index) => (
            <span key={index}>
              {rgValue}&#8491; {index < rgList.length - 1 ? ', ' : ''}
            </span>
          ))}
        </Typography>
      )
    },
    { label: 'ID', value: job.mongo.id }
  ]

  type Property = {
    label: string
    value?: string | number | Date
    suffix?: string
    render?: () => React.ReactNode
  }

  // Helper function to render properties
  const renderProperties = (props: Property[]) => (
    <Stack spacing={1}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography fontWeight='bold'>UUID:</Typography>
        <CopyableChip label='UUID' value={job.mongo.uuid} />
      </Box>

      {props.map(({ label, value, render, suffix = '' }) =>
        render ? (
          <Box
            key={label}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography fontWeight='bold'>{label}:</Typography>
            {render()}
          </Box>
        ) : (
          value !== undefined && (
            <Box
              key={label}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography fontWeight='bold'>{label}:</Typography>
              <Typography>
                {value instanceof Date ||
                (typeof value === 'string' && !isNaN(Date.parse(value)))
                  ? format(new Date(value), 'MM/dd/yyyy HH:mm:ss')
                  : value}
                {suffix}
              </Typography>
            </Box>
          )
        )
      )}
    </Stack>
  )

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
          sx={{
            backgroundColor: '#888',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            pl: 1
          }}
        >
          <HeaderBox sx={{ py: 0 }}>
            <Typography>Details</Typography>
          </HeaderBox>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>{renderProperties(properties)}</Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default JobDBDetails
