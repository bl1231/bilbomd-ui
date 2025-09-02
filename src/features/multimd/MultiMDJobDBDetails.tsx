import React from 'react'
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Box
} from '@mui/material'
import Grid from '@mui/material/Grid'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HeaderBox from 'components/HeaderBox'
import { formatDateSafe } from 'utils/dates'
import { BilboMDMultiJob } from 'types/interfaces'
import CopyableChip from 'components/CopyableChip'

interface JobDBDetailsProps {
  job: BilboMDMultiJob
}

type MongoDBProperty = {
  label: string
  value?: string | number | Date
  suffix?: string
  render?: () => React.ReactNode
}

const MultiMDJobDBDetails: React.FC<JobDBDetailsProps> = ({ job }) => {
  // console.log('JobDBDetails: job:', job)

  const properties = [
    { label: 'Pipeline', value: 'BilboMD Multi' },

    {
      label: 'Combined',
      render: () => (
        <Typography>
          {job.mongo.bilbomd_uuids.map((uuid, index) => (
            <Box key={index} sx={{ my: 1 }}>
              <CopyableChip
                label='UUID'
                value={uuid}
                // Should add something like this   url={job.mongo._id as string} by updating the schema to store the object id
              />
            </Box>
          ))}
        </Typography>
      )
    },
    { label: 'Submitted', value: job.mongo.time_submitted },
    { label: 'Started', value: job.mongo.time_started },
    { label: 'Completed', value: job.mongo.time_completed },
    { label: 'Data file from', value: job.mongo.data_file_from },
    { label: 'ID', value: job.mongo.id }
  ]

  const renderProperties = (props: MongoDBProperty[]) => (
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
                {formatDateSafe(value) || String(value)}
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

export default MultiMDJobDBDetails
