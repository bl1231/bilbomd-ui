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
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { format } from 'date-fns'
import { Box } from '@mui/system'
import { BilboMDJob } from 'types/interfaces'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

interface JobDBDetailsProps {
  job: BilboMDJob
}

const JobDBDetails = (props: JobDBDetailsProps) => {
  const { job } = props
  // console.log('here--> ', job)
  const getNumConformations = () => {
    const step = Math.round((job.mongo.rg_max - job.mongo.rg_min) / 5)
    const numConformations = job.mongo.conformational_sampling * 200 * step
    // console.log('numConformations', numConformations)
    return numConformations
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
            <Typography>Job Details</Typography>
          </HeaderBox>
        </AccordionSummary>
        <AccordionDetails>
          <Item>
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

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box padding={2}>
                  <Typography sx={{ ml: 1 }}>
                    <b>Job type:</b> {job.mongo.__t ?? 'unavailable'}
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <b>SAXS data:</b> {job.mongo.data_file}
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <b>psf file:</b> {job.mongo.psf_file}
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <b>crd file:</b> {job.mongo.crd_file}
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <b>CHARMM constraint file:</b> {job.mongo.const_inp_file}
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <b>Rg min:</b> {job.mongo.rg_min} &#8491;
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <b>Rg max:</b> {job.mongo.rg_max} &#8491;
                  </Typography>
                  <Typography sx={{ ml: 1 }}>
                    <b>Sampling:</b> {getNumConformations()} conformations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box padding={2}>
                  {/* Content for the right box */}
                  <Typography>BullMQ Logs to go here</Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ ml: 1 }}>
              <b>ID:</b> {job.mongo.id}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>UUID:</b> {job.mongo.uuid}
            </Typography>
          </Item>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default JobDBDetails
