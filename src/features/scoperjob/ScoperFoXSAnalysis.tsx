import { useMemo } from 'react'
import FoXSChart from './FoXSChart'
import { Grid } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { useGetFoxsAnalysisByIdQuery } from 'features/jobs/jobsApiSlice'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

interface DataPoint {
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
  data: DataPoint[]
}

interface ScoperFoXSAnalysisProps {
  id: string
}

const trimData = (data: DataPoint[]): DataPoint[] =>
  data.map((item) => ({
    q: parseFloat(item.q.toFixed(3)),
    exp_intensity: parseFloat(item.exp_intensity.toFixed(3)),
    model_intensity: parseFloat(item.model_intensity.toFixed(3)),
    error: parseFloat(item.error.toFixed(3))
  }))

const calculateResiduals = (dataPoints: DataPoint[]) => {
  return dataPoints.map((item) => ({
    q: parseFloat(item.q.toFixed(3)), // Adjust as needed
    res: parseFloat(((item.exp_intensity - item.model_intensity) / item.error).toFixed(3)) // Adjust as needed
  }))
}

const ScoperFoXSAnalysis = ({ id }: ScoperFoXSAnalysisProps) => {
  const { data, isLoading, isError } = useGetFoxsAnalysisByIdQuery(id, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const foxsData: FoxsData[] = data as FoxsData[]

  // Trim the original data to reduce the number of digits after the decimal point
  const origData = useMemo(() => (foxsData ? trimData(foxsData[0].data) : []), [foxsData])
  const scopData = useMemo(() => (foxsData ? trimData(foxsData[1].data) : []), [foxsData])

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
  if (isError || !data) return <div>Error loading data</div>

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
            title={`Original Model - ${origPDBFile} - I vs. q`}
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
            title={`Scoper Model - ${scopPDBFile} - I vs. q`}
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
