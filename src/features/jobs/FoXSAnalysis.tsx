import { useMemo } from 'react'
import FoXSChart from 'features/scoperjob/FoXSChart'
import { Alert, AlertTitle, Grid } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { useGetFoxsAnalysisByIdQuery } from 'features/jobs/jobsApiSlice'
import CircularProgress from '@mui/material/CircularProgress'
import FoXSEnsembleCharts from 'features/foxs/FoXSEnsembleCharts'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

const prepData = (data: FoxsDataPoint[]): FoxsDataPoint[] =>
  data
    .filter((item) => item.exp_intensity > 0 && item.model_intensity > 0)
    .map((item) => ({
      q: parseFloat(item.q.toFixed(4)),
      exp_intensity: parseFloat(item.exp_intensity.toFixed(4)),
      model_intensity: parseFloat(item.model_intensity.toFixed(4)),
      error: parseFloat(item.error.toFixed(4))
    }))

const combineFoxsData = (foxsDataArray: FoxsData[]): CombinedFoxsData[] => {
  if (foxsDataArray.length < 2) {
    console.error('Not enough data to process.')
    return []
  }

  // Initially map over the base data to calculate model intensities and residuals
  let baseData: CombinedFoxsData[] = foxsDataArray[0].data.map(
    (point, index) => {
      const q = point.q != null ? parseFloat(point.q.toFixed(4)) : 0
      const exp_intensity =
        point.exp_intensity != null
          ? parseFloat(point.exp_intensity.toFixed(4))
          : 0
      const error =
        point.error != null
          ? Math.max(parseFloat(point.error.toFixed(4)), 0)
          : 1 // avoid division by 0

      const combinedData: CombinedFoxsData = { q, exp_intensity, error }

      foxsDataArray.slice(1).forEach((foxsData, dataIndex) => {
        const modelIntensityKey = `model_intensity_${dataIndex + 1}`
        const residualKey = `residual_${dataIndex + 1}`
        const currentPoint = foxsData.data[index]

        if (currentPoint) {
          const model_intensity =
            currentPoint.model_intensity != null
              ? Math.max(parseFloat(currentPoint.model_intensity.toFixed(4)), 0)
              : 0
          combinedData[modelIntensityKey] = model_intensity

          combinedData[residualKey] =
            error !== 0
              ? parseFloat(
                  ((exp_intensity - model_intensity) / error).toFixed(4)
                )
              : 0 // handle potential division by 0
        }
      })

      return combinedData
    }
  )

  // Filter the baseData array to exclude any data points with negative exp_intensity values
  baseData = baseData.filter((dataPoint) => dataPoint.exp_intensity > 0)

  return baseData
}

const calculateResiduals = (dataPoints: FoxsDataPoint[]) => {
  return dataPoints.map((item) => ({
    q: parseFloat(item.q.toFixed(4)),
    res: parseFloat(
      ((item.exp_intensity - item.model_intensity) / item.error).toFixed(4)
    )
  }))
}

const FoXSAnalysis = ({ id }: ScoperFoXSAnalysisProps) => {
  const { data, isLoading, isError } = useGetFoxsAnalysisByIdQuery(id, {
    pollingInterval: 0,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const foxsData: FoxsData[] = data as FoxsData[]
  // console.log('id:', id, '\n', 'foxsData -->', foxsData)
  // Prepare original data to reduce the number of digits after the decimal point
  // and filter out negative values
  const origData = useMemo(
    () => (foxsData ? prepData(foxsData[0].data) : []),
    [foxsData]
  )
  const ensembleData = useMemo(
    () => (foxsData ? combineFoxsData(foxsData) : []),
    [foxsData]
  )

  // Calculate residual values for both datasets
  const origResiduals = useMemo(
    () => (foxsData ? calculateResiduals(origData) : []),
    [origData, foxsData]
  )

  // Define a Memoized calculation for min and max Y axis values
  const { minYAxis, maxYAxis } = useMemo(() => {
    const maxY = Math.max(...origResiduals.map((r) => Math.abs(r.res)))
    return { minYAxis: -maxY, maxYAxis: maxY }
  }, [origResiduals])

  // Handle loading and error states
  if (isLoading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </div>
    )

  if (isError || !data)
    return (
      <Alert severity='info' variant='outlined'>
        <AlertTitle>FoXS data is unavailable for this job.</AlertTitle>
      </Alert>
    )

  // Pull out the other info needed for the FoXS plots
  // const origPDBFile = foxsData[0].filename
  const origChiSq = foxsData[0].chisq
  const origC1 = foxsData[0].c1
  const origC2 = foxsData[0].c2

  // console.log('data:', data)

  return (
    <Item>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FoXSChart
            title={`Original Model`}
            data={origData}
            residualsData={origResiduals}
            chisq={origChiSq}
            c1={origC1}
            c2={origC2}
            minYAxis={minYAxis}
            maxYAxis={maxYAxis}
          />
        </Grid>
        <Grid item xs={6}>
          <FoXSEnsembleCharts
            combinedData={ensembleData}
            foxsData={foxsData}
            minYAxis={minYAxis}
            maxYAxis={maxYAxis}
          />
        </Grid>
      </Grid>
    </Item>
  )
}

export default FoXSAnalysis
