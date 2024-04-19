import { useMemo } from 'react'
import FoXSChart from './FoXSChart'
import { Alert, AlertTitle, Grid } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { useGetFoxsAnalysisByIdQuery } from 'features/jobs/jobsApiSlice'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

interface FoxsDataPoint {
  q: number
  exp_intensity: number
  model_intensity: number
  error: number
}

interface FoxsData {
  filename: string
  chisq: number
  c1: number
  c2: number
  data: FoxsDataPoint[]
}

interface ScoperFoXSAnalysisProps {
  id: string
}

const prepData = (data: FoxsDataPoint[]): FoxsDataPoint[] =>
  data
    .filter((item) => item.exp_intensity > 0 && item.model_intensity > 0)
    .map((item) => ({
      q: parseFloat(item.q.toFixed(4)),
      exp_intensity: parseFloat(item.exp_intensity.toFixed(4)),
      model_intensity: parseFloat(item.model_intensity.toFixed(4)),
      error: parseFloat(item.error.toFixed(4))
    }))

const calculateResiduals = (dataPoints: FoxsDataPoint[]) => {
  return dataPoints.map((item) => ({
    q: parseFloat(item.q.toFixed(4)),
    res: parseFloat(
      ((item.exp_intensity - item.model_intensity) / item.error).toFixed(4)
    )
  }))
}

const ScoperFoXSAnalysis = ({ id }: ScoperFoXSAnalysisProps) => {
  const { data, isLoading, isError } = useGetFoxsAnalysisByIdQuery(id, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const foxsData: FoxsData[] = data as FoxsData[]

  // Prepare original data to reduce the number of digits after the decimal point
  // and filter out negative values
  const origData = useMemo(
    () => (foxsData ? prepData(foxsData[0].data) : []),
    [foxsData]
  )
  const scopData = useMemo(
    () => (foxsData ? prepData(foxsData[1].data) : []),
    [foxsData]
  )

  // Calculate residual values for both datasets
  const origResiduals = useMemo(
    () => (foxsData ? calculateResiduals(origData) : []),
    [origData, foxsData]
  )
  const scopResiduals = useMemo(
    () => (foxsData ? calculateResiduals(scopData) : []),
    [scopData, foxsData]
  )

  // Define a Memoized calculation for min and max Y axis values
  const { minYAxis, maxYAxis } = useMemo(() => {
    const maxY = Math.max(...origResiduals.map((r) => Math.abs(r.res)))
    return { minYAxis: -maxY, maxYAxis: maxY }
  }, [origResiduals])

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>
  if (isError || !data)
    return (
      <Alert severity='info' variant='outlined'>
        <AlertTitle>FoXS data is unavailable for this job.</AlertTitle>
      </Alert>
    )

  // Pull out the other info needed for the FoXS plots
  const origPDBFile = foxsData[0].filename
  const scopPDBFile = foxsData[1].filename
  const origChiSq = foxsData[0].chisq
  const scopChiSq = foxsData[1].chisq
  const origC1 = foxsData[0].c1
  const scopC1 = foxsData[1].c1
  const origC2 = foxsData[0].c2
  const scopC2 = foxsData[1].c2

  return (
    <Item>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FoXSChart
            title={`Original Model - ${origPDBFile}`}
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
          <FoXSChart
            title={`Scoper Model - ${scopPDBFile}`}
            data={scopData}
            residualsData={scopResiduals}
            chisq={scopChiSq}
            c1={scopC1}
            c2={scopC2}
            minYAxis={minYAxis}
            maxYAxis={maxYAxis}
          />
        </Grid>
      </Grid>
    </Item>
  )
}

export default ScoperFoXSAnalysis
