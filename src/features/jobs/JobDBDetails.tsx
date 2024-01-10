import {
  Divider,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HeaderBox from 'components/HeaderBox'
import { format } from 'date-fns'
import { Box } from '@mui/system'
import { BilboMDJob } from 'types/interfaces'

interface JobDBDetailsProps {
  job: BilboMDJob
}

interface ConformationInfo {
  stepSize: number
  numSteps: number
  numConformations: number
  rgList: number[]
}

const JobDBDetails = (props: JobDBDetailsProps) => {
  const { job } = props

  const getNumConformations = (): ConformationInfo => {
    const rgMin: number = job.mongo.rg_min
    const rgMax: number = job.mongo.rg_max
    const conformationalSampling: number = job.mongo.conformational_sampling
    let numSteps: number = 0
    const rgList: number[] = []
    const stepSize = Math.round((rgMax - rgMin) / 5)
    for (let rg: number = rgMin; rg <= rgMax; rg += stepSize) {
      numSteps += 1
      rgList.push(rg)
    }
    const numConformations: number = conformationalSampling * 200 * numSteps
    return { stepSize, numSteps, numConformations, rgList }
  }

  const { stepSize, numSteps, numConformations, rgList } = getNumConformations()

  // Helper function for conditional rendering
  const renderJobProperty = (label, value, suffix = '') => {
    if (value) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={'bold'}>{label}:</Typography>
          <Typography>
            {value}
            {suffix}
          </Typography>
        </Box>
      )
    }
    return null
  }

  return (
    <Grid item xs={12}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
          sx={{
            backgroundColor: '#888',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            pl: 0
          }}
        >
          <HeaderBox sx={{ py: 0 }}>
            <Typography>Job Database Details</Typography>
          </HeaderBox>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={1}>
              <Typography>
                <b>Submitted: </b>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              {job?.mongo?.time_submitted && (
                <Typography sx={{ ml: 1 }}>
                  {format(new Date(job.mongo.time_submitted), 'MM/dd/yyyy HH:mm:ss')}
                </Typography>
              )}
            </Grid>
            <Grid item xs={1}>
              <Typography>
                <b>Started: </b>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              {job?.mongo?.time_started && (
                <Typography sx={{ ml: 1 }}>
                  {format(new Date(job.mongo.time_started), 'MM/dd/yyyy HH:mm:ss')}
                </Typography>
              )}
            </Grid>
            <Grid item xs={1}>
              <Typography>
                <b>Completed: </b>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              {job?.mongo?.time_completed && (
                <Typography sx={{ ml: 1 }}>
                  {format(new Date(job.mongo.time_completed), 'MM/dd/yyyy HH:mm:ss')}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',

                  ml: 0,
                  mr: 3,
                  my: 2
                }}
              >
                <div>
                  {/* Always displayed properties */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography>
                      <b>Job type:</b>
                    </Typography>
                    <Typography>{job.mongo.__t ?? 'unavailable'}</Typography>
                  </div>

                  {/* Conditionally displayed properties */}
                  {renderJobProperty('SAXS data', job.mongo.data_file)}
                  {renderJobProperty('PSF file', job.mongo.psf_file)}
                  {renderJobProperty('CRD file', job.mongo.crd_file)}
                  {renderJobProperty('PDB file', job.mongo.pdb_file)}
                  {renderJobProperty('CHARMM constraint file', job.mongo.const_inp_file)}
                  {renderJobProperty('Rg min', job.mongo.rg_min, 'Å')}
                  {renderJobProperty('Rg max', job.mongo.rg_max, 'Å')}
                  {renderJobProperty('Rg step size', stepSize, 'Å')}
                  {renderJobProperty('Number of MD Runs', numSteps)}
                  <Typography>
                    {rgList.map((rgValue, index) => (
                      <span key={index}>
                        {rgValue}&#8491; {index < rgList.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </Typography>
                  {renderJobProperty('Number of conformations', numConformations)}
                </div>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ ml: 0 }}>
            <b>MongoDB ID:</b> {job.mongo.id}
          </Typography>
          <Typography sx={{ ml: 0 }}>
            <b>UUID:</b> {job.mongo.uuid}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default JobDBDetails
