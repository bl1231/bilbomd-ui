import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

//import EditNoteForm from './EditNoteForm'
import { useGetJobsQuery } from './jobsApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
//import useAuth from 'hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from 'hooks/useTitle'
import { Box, Stack } from '@mui/system'
import { green } from '@ant-design/colors'
import { Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'green',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary
}))

const SingleJobPage = () => {
  useTitle('BilboMD: Job Details')

  const { id } = useParams()
  console.log('id', id)

  //const { username, isManager, isAdmin } = useAuth()

  const { job } = useGetJobsQuery('jobsList', {
    selectFromResult: ({ data }) => ({
      job: data?.entities[id]
    })
  })
  console.log('job', job)

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

  const content = (
    <React.Fragment>
      <Box sx={{ backgroundColor: green, minHeight: '600px' }}>
        <Stack spacing={2}>
          <Item>
            <Typography variant="h3">Title: {job.title}</Typography>
          </Item>
          <Item>
            <Typography variant="h6">Status: {job.status}</Typography>
          </Item>
        </Stack>
      </Box>
    </React.Fragment>
  )

  return content
}

export default SingleJobPage
