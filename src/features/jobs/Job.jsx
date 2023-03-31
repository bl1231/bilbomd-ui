import React from 'react'
import { useParams } from 'react-router-dom'
//import EditNoteForm from './EditNoteForm'
import { useGetJobsQuery } from './jobsApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
//import useAuth from 'hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
//import { Box, Container, Stack } from '@mui/system'
// import { green } from '@ant-design/colors'
import { Button, Chip, Divider, Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import axios from 'app/api/axios'
//import { LoadingButton } from '@mui/lab'
import { format, parseISO } from 'date-fns'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.primary,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary
}))

const HeaderThingee = {
  textTransform: 'uppercase',
  fontSize: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  fontWeight: 500,
  padding: '0.5rem',
  background: '#888',
  color: '#fff',
  letterSpacing: '1px'
}

const SingleJobPage = () => {
  useTitle('BilboMD: Job Details')

  const { id } = useParams()
  //console.log('id', id)

  //const { username, isManager, isAdmin } = useAuth()

  const { job } = useGetJobsQuery('jobsList', {
    selectFromResult: ({ data }) => ({
      job: data?.entities[id]
    })
  })
  //console.log('job', job)

  const { users } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id])
    })
  })

  if (!job || !users?.length) return <PulseLoader color={'#FFF'} />

  // if (!isManager && !isAdmin) {
  //   if (job.username !== username) {
  //     return <p className="errmsg">No access</p>
  //   }
  // }

  const handleDownload = async (id) => {
    // console.log('download id:', id)
    await axios
      .get(`jobs/${id}/results`, { responseType: 'blob' })
      .catch((error) => {
        console.error('download results.tar.gz error:', error)
      })
      .then((response) => {
        console.log(response)
        // if (!response.data) {
        //   console.error('no data')
        //   return
        // }
        const url = window.URL.createObjectURL(new Blob([response.data]))
        //console.log('url:', url)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'results.tar.gz')
        // 3. Append to html page
        document.body.appendChild(link)
        // 4. Force download
        link.click()
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link)
      })
  }

  const content = (
    <React.Fragment>
      <Grid container spacing={2} rowSpacing={2}>
        <Grid item xs={9}>
          <Typography sx={HeaderThingee}>JOB TITLE</Typography>
          <Item>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.title}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={HeaderThingee}>STATUS</Typography>
          <Item>
            <Typography variant="h3" sx={{ ml: 1 }}>
              {job.status}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>DETAILS</Typography>
          <Item>
            <Grid container>
              <Grid item xs={1}>
                <Typography>
                  <b>Time Submitted:</b>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {format(new Date(job.time_submitted), 'MM/dd/yyyy HH:mm:ss')}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>
                  <b>Time Started:</b>
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {job.time_started
                    ? format(new Date(job.time_started), 'MM/dd/yyyy HH:mm:ss')
                    : job.status}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>
                  <b>Time Completed:</b>{' '}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {job.time_completed
                    ? format(new Date(job.time_completed), 'MM/dd/yyyy HH:mm:ss')
                    : job.status}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />

            <Typography sx={{ ml: 1 }}>
              <b>data:</b> {job.data_file}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>psf_file:</b> {job.psf_file}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>crd_file:</b> {job.crd_file}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>const_inp_file:</b> {job.const_inp_file}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>rg_min:</b> {job.rg_min}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>rg_max:</b> {job.rg_max}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ ml: 1 }}>
              <b>ID:</b> {job.id}
            </Typography>
            <Typography sx={{ ml: 1 }}>
              <b>UUID:</b> {job.uuid}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={HeaderThingee}>RESULTS</Typography>
          <Item>
            {job.status === 'Completed' ? (
              <Button
                variant="contained"
                onClick={() => {
                  handleDownload(job.id)
                }}
                sx={{ my: 2 }}
              >
                Download Results
              </Button>
            ) : (
              <Typography variant="h5" sx={{ m: 1 }}>
                Pending...
              </Typography>
            )}
          </Item>
        </Grid>
      </Grid>
    </React.Fragment>
  )

  return content
}

export default SingleJobPage
