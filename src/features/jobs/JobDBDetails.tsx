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
// import Paper from '@mui/material/Paper'
// import { styled } from '@mui/material/styles'
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
            <Typography>Job Details</Typography>
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
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  ml: 0,
                  mr: 6,
                  my: 2
                }}
              >
                <div>
                  <Typography>
                    <b>Job type:</b>
                  </Typography>
                  <Typography>
                    <b>SAXS data:</b>
                  </Typography>
                  <Typography>
                    <b>PSF file:</b>
                  </Typography>
                  <Typography>
                    <b>CRD file:</b>
                  </Typography>
                  <Typography>
                    <b>CHARMM constraint file:</b>
                  </Typography>
                  <Typography>
                    <b>Rg min:</b>
                  </Typography>
                  <Typography>
                    <b>Rg max:</b>
                  </Typography>
                  <Typography>
                    <b>Rg step size:</b>
                  </Typography>
                  <Typography>
                    <b>Number of MD Runs:</b>
                  </Typography>
                  <Typography>
                    <b>List of Rg runs:</b>
                  </Typography>
                  <Typography>
                    <b>Number of conformations:</b>
                  </Typography>
                </div>
                <div>
                  <Typography>{job.mongo.__t ?? 'unavailable'}</Typography>
                  <Typography>{job.mongo.data_file}</Typography>
                  <Typography>{job.mongo.psf_file}</Typography>
                  <Typography>{job.mongo.crd_file}</Typography>
                  <Typography>{job.mongo.const_inp_file}</Typography>
                  <Typography>{job.mongo.rg_min}&#8491;</Typography>
                  <Typography>{job.mongo.rg_max}&#8491;</Typography>
                  <Typography>{stepSize}&#8491;</Typography>
                  <Typography>{numSteps}</Typography>
                  <Typography>
                    {rgList.map((rgValue, index) => (
                      <span key={index}>
                        {rgValue}&#8491; {index < rgList.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </Typography>
                  <Typography>{numConformations}</Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box padding={2}>
                {/* Content for the right box */}
                <Typography>BullMQ Logs to go here eventually.</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ ml: 0 }}>
            <b>ID:</b> {job.mongo.id}
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
