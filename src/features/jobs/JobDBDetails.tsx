import React, { useState } from 'react'
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
  Tooltip,
  IconButton,
  Chip
} from '@mui/material'
import { useSnackbar } from 'notistack'
import Grid from '@mui/material/Grid'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CloseIcon from '@mui/icons-material/Close'
import HeaderBox from 'components/HeaderBox'
import { displayPropertiesByJobType } from './JobDBDisplayProperties'
import { format } from 'date-fns'
import { BilboMDJob, AnyBilboJob, MongoWithIdString } from 'types/interfaces'
import CopyableChip from 'components/CopyableChip'
import { useLazyGetFileByIdAndNameQuery } from 'slices/jobsApiSlice'
import { green } from '@mui/material/colors'

interface JobDBDetailsProps {
  job: BilboMDJob
}

type MongoDBProperty = {
  label: string
  value?: string | number | Date
  suffix?: string
  render?: () => React.ReactNode
}

const JobDBDetails: React.FC<JobDBDetailsProps> = ({ job }) => {
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [triggerGetFile, { data: fileContents, isLoading, error }] =
    useLazyGetFileByIdAndNameQuery()

  const handleOpenModal = () => {
    setOpen(true)
    if (
      job.mongo.__t === 'BilboMdPDB' ||
      job.mongo.__t === 'BilboMdCRD' ||
      job.mongo.__t === 'BilboMdAuto' ||
      job.mongo.__t === 'BilboMdSANS'
    ) {
      triggerGetFile({
        id: job.mongo.id,
        filename: job.mongo.const_inp_file || '' // Ensure filename is a string
      })
    }
  }

  const handleCloseModal = () => setOpen(false)

  const handleCopyToClipboard = () => {
    if (fileContents) {
      navigator.clipboard.writeText(fileContents)
      enqueueSnackbar('File contents copied to clipboard!', {
        variant: 'default'
      })
    }
  }

  const jobTypeDisplayName: Record<string, string> = {
    BilboMdPDB: 'BilboMD Classic w/PDB',
    BilboMdAuto: 'BilboMD Auto',
    BilboMdAlphaFold: 'BilboMD AlphaFold',
    BilboMdSANS: 'BilboMD SANS',
    BilboMdCRD: 'BilboMD Classic w/CRD/PSF',
    BilboMdScoper: 'BilboMD Scoper'
  }

  const getJobTypeDisplayName = (type: string | undefined) =>
    type ? jobTypeDisplayName[type] || 'Unknown Job Type' : 'Unknown Job Type'

  const getNumConformations = (job: MongoWithIdString<AnyBilboJob>) => {
    const { rg_min = 0, rg_max = 0, conformational_sampling } = job
    const stepSize = Math.max(Math.round((rg_max - rg_min) / 5), 1)
    const rgList: number[] = []
    for (let rg = rg_min; rg <= rg_max; rg += stepSize) {
      rgList.push(rg)
    }
    const numConformations = conformational_sampling * 200 * rgList.length
    return { stepSize, numSteps: rgList.length, numConformations, rgList }
  }

  const baseProperties: MongoDBProperty[] = [
    { label: 'MongoDB ID', value: job.mongo.id },
    { label: 'Pipeline', value: getJobTypeDisplayName(job.mongo.__t) },
    { label: 'Submitted', value: job.mongo.time_submitted },
    { label: 'Started', value: job.mongo.time_started },
    { label: 'Completed', value: job.mongo.time_completed },
    { label: 'Data file', value: job.mongo.data_file }
  ]

  const getJobSpecificProperties = (): MongoDBProperty[] => {
    const allowedLabels = displayPropertiesByJobType[job.mongo.__t] || []

    // Filter base properties
    const staticProperties = baseProperties.filter((prop) =>
      allowedLabels.includes(prop.label)
    )

    // Add dynamic properties
    const dynamicProperties: MongoDBProperty[] = []
    if (job.mongo.__t === 'BilboMdSANS') {
      const specificJob = job.mongo

      const { stepSize, numSteps, numConformations, rgList } =
        getNumConformations(specificJob)
      dynamicProperties.push(
        { label: 'PDB file', value: specificJob.pdb_file },
        {
          label: 'Solvent D20 Fraction',
          value: specificJob.d2o_fraction,
          suffix: '%'
        },
        {
          label: 'CHARMM constraint file',
          render: () => (
            <Chip
              label={
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '6px' }}>
                    {specificJob.const_inp_file}
                  </span>
                  <Tooltip title={`Open ${specificJob.const_inp_file}`}>
                    <IconButton
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenModal()
                      }}
                      sx={{ padding: 0 }}
                    >
                      <VisibilityIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              variant='outlined'
              sx={{
                fontSize: '0.875rem',
                borderColor: 'primary.main',
                backgroundColor: green[100],
                cursor: 'pointer'
              }}
              onClick={handleOpenModal}
            />
          )
        },
        { label: 'Rg min', value: specificJob.rg_min, suffix: 'Å' },
        { label: 'Rg max', value: specificJob.rg_max, suffix: 'Å' },
        { label: 'Rg step size', value: stepSize, suffix: 'Å' },
        { label: 'Number of CHARMM MD Runs', value: numSteps },
        { label: 'Number of conformations', value: numConformations },
        {
          label: 'Rg List',
          render: () => (
            <Typography>
              {rgList?.map((rgValue, index) => (
                <span key={index}>
                  {rgValue}&#8491; {index < rgList.length - 1 ? ', ' : ''}
                </span>
              ))}
            </Typography>
          )
        }
      )
    }
    if (job.mongo.__t === 'BilboMdScoper') {
      dynamicProperties.push({ label: 'PDB file', value: job.mongo.pdb_file })
    }
    if (
      job.mongo.__t === 'BilboMdPDB' ||
      job.mongo.__t === 'BilboMdCRD' ||
      job.mongo.__t === 'BilboMdAuto'
    ) {
      const specificJob = job.mongo
      const { stepSize, numSteps, numConformations, rgList } =
        getNumConformations(specificJob)
      dynamicProperties.push(
        { label: 'PDB file', value: specificJob.pdb_file },
        { label: 'PSF file', value: specificJob.psf_file },
        { label: 'CRD file', value: specificJob.crd_file },
        {
          label: 'CHARMM constraint file',
          render: () => (
            <Chip
              label={
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '6px' }}>
                    {specificJob.const_inp_file}
                  </span>
                  <Tooltip title={`Open ${specificJob.const_inp_file}`}>
                    <IconButton
                      size='small'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenModal()
                      }}
                      sx={{ padding: 0 }}
                    >
                      <VisibilityIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              variant='outlined'
              sx={{
                fontSize: '0.875rem',
                borderColor: 'primary.main',
                backgroundColor: green[100],
                cursor: 'pointer'
              }}
              onClick={handleOpenModal}
            />
          )
        },
        { label: 'Rg min', value: specificJob.rg_min, suffix: 'Å' },
        { label: 'Rg max', value: specificJob.rg_max, suffix: 'Å' },
        { label: 'Rg step size', value: stepSize, suffix: 'Å' },
        { label: 'Number of CHARMM MD Runs', value: numSteps },
        { label: 'Number of conformations', value: numConformations },
        {
          label: 'Rg List',
          render: () => (
            <Typography>
              {rgList?.map((rgValue, index) => (
                <span key={index}>
                  {rgValue}&#8491; {index < rgList.length - 1 ? ', ' : ''}
                </span>
              ))}
            </Typography>
          )
        }
      )
    }

    return [...staticProperties, ...dynamicProperties]
  }

  const filteredProperties: MongoDBProperty[] = [
    ...baseProperties,
    ...getJobSpecificProperties()
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
            <Grid size={{ xs: 12 }}>
              {renderProperties(filteredProperties)}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        fullWidth
        maxWidth='md'
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: green[100],
            color: 'black'
          }
        }}
      >
        <DialogTitle>
          CHARMM Constraint File
          <Tooltip title='Copy to clipboard'>
            <IconButton
              aria-label='copy-constraint-file'
              onClick={handleCopyToClipboard}
              sx={{
                position: 'absolute',
                right: 64,
                top: 16
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleCloseModal}
          sx={(theme) => ({
            position: 'absolute',
            right: 16,
            top: 16,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px'
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color='error'>Failed to load file contents.</Typography>
          ) : (
            <Typography
              component='pre'
              sx={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontFamily: 'monospace'
              }}
            >
              {fileContents || 'No content available.'}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default JobDBDetails
