import { useMemo, Fragment } from 'react'
import FoXSChart from 'features/scoperjob/FoXSChart'
import { Alert, AlertTitle, Grid, TableHead, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { useGetFoxsAnalysisByIdQuery } from 'features/jobs/jobsApiSlice'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
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

// interface ResidualDataPoints {
//   q: number
//   [key: `res_${number}`]: number
// }

interface FoxsData {
  filename: string
  chisq: number
  c1: number
  c2: number
  data: FoxsDataPoint[]
}

interface CombinedFoxsData {
  q: number
  exp_intensity: number
  error: number
  [key: `model_intensity_${number}`]: number
  [key: `residual_${number}`]: number
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

const combineFoxsData = (foxsDataArray: FoxsData[]): CombinedFoxsData[] => {
  if (foxsDataArray.length < 2) {
    console.error('Not enough data to process.')
    return []
  }

  // Initially map over the base data to calculate model intensities and residuals
  let baseData: CombinedFoxsData[] = foxsDataArray[0].data.map((point, index) => {
    const q = parseFloat(point.q.toFixed(4))
    const exp_intensity = parseFloat(point.exp_intensity.toFixed(4))
    const error = Math.max(parseFloat(point.error.toFixed(4)), 0)

    const combinedData: CombinedFoxsData = { q, exp_intensity, error }

    foxsDataArray.slice(1).forEach((foxsData, dataIndex) => {
      const modelIntensityKey = `model_intensity_${dataIndex + 1}`
      const residualKey = `residual_${dataIndex + 1}`
      const currentPoint = foxsData.data[index]

      if (currentPoint) {
        const model_intensity = Math.max(
          parseFloat(currentPoint.model_intensity.toFixed(4)),
          0
        )
        combinedData[modelIntensityKey] = model_intensity
        combinedData[residualKey] = parseFloat(
          ((exp_intensity - model_intensity) / error).toFixed(4)
        )
      }
    })

    return combinedData
  })

  // Filter the baseData array to exclude any data points with negative exp_intensity values
  baseData = baseData.filter((dataPoint) => dataPoint.exp_intensity > 0)

  return baseData
}

const calculateResiduals = (dataPoints: FoxsDataPoint[]) => {
  return dataPoints.map((item) => ({
    q: parseFloat(item.q.toFixed(4)),
    res: parseFloat(((item.exp_intensity - item.model_intensity) / item.error).toFixed(4))
  }))
}

const colors = [
  '#4e79a7', // muted blue
  '#f28e2b', // muted safety orange
  '#59a14f', // muted asparagus green
  '#e15759', // muted brick red
  '#b07aa1', // muted purple
  '#9c755f', // muted chestnut brown
  '#f1b7b1', // muted raspberry yogurt pink
  '#bab0ac', // muted middle gray
  '#bdbf20', // muted curry yellow-green
  '#76b7b2' // muted blue-teal
]

const getUniqueColor = (index) => {
  return colors[index % colors.length]
}

const FoXSAnalysis = ({ id }: ScoperFoXSAnalysisProps) => {
  const { data, isLoading, isError } = useGetFoxsAnalysisByIdQuery(id, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  const foxsData: FoxsData[] = data as FoxsData[]
  console.log('id:', id, 'foxsData -->', foxsData)
  // Prepare original data to reduce the number of digits after the decimal point
  // and filter out negative values
  const origData = useMemo(() => (foxsData ? prepData(foxsData[0].data) : []), [foxsData])
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
  if (isLoading) return <div>Loading...</div>
  if (isError || !data)
    return (
      <Alert severity="info" variant="outlined">
        <AlertTitle>FoXS data is unavailable for this job.</AlertTitle>
      </Alert>
    )

  // Pull out the other info needed for the FoXS plots
  const origPDBFile = foxsData[0].filename
  const origChiSq = foxsData[0].chisq
  const origC1 = foxsData[0].c1
  const origC2 = foxsData[0].c2

  console.log(ensembleData)

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
          <Typography sx={{ pl: 2, m: 1 }}>{`Ensemble Models - I vs. q`}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ensembleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis yAxisId="left" scale="log" type="number" domain={['auto', 'auto']} />
              <Tooltip />
              <Legend
                iconType="line"
                verticalAlign="bottom"
                height={30}
                layout="horizontal"
                align="center"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="exp_intensity"
                name="Exp Intensity"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                dot={{ strokeWidth: 1 }}
              />
              {data.slice(1).map((_, index) => (
                <Fragment key={index}>
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={`model_intensity_${index + 1}`}
                    name={`Ens. Size ${index + 1}`}
                    stroke={getUniqueColor(index + 1)}
                    dot={{ strokeWidth: 1 }}
                  />
                </Fragment>
              ))}
            </LineChart>
          </ResponsiveContainer>
          <Typography sx={{ pl: 2, m: 1, mt: 3 }}>Ensemble Models - residuals</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ensembleData}>
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis domain={[minYAxis, maxYAxis]} />
              <Tooltip />
              <Legend
                iconType="line"
                verticalAlign="bottom"
                height={30}
                layout="horizontal"
                align="center"
              />
              {data.slice(1).map((_, index) => (
                <Fragment key={index}>
                  <Line
                    type="monotone"
                    dataKey={`residual_${index + 1}`}
                    name={`Ens. Size ${index + 1}`}
                    stroke={getUniqueColor(index + 1)}
                  />
                </Fragment>
              ))}
              <ReferenceLine y={0} stroke="black" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-end">
          <Grid item xs={6} sx={{ pl: 6 }}>
            {/* <TableContainer component={Paper}> */}
            <TableContainer>
              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: '1rem' }}>Filename</TableCell>
                    <TableCell style={{ fontSize: '1rem' }}>Chi^2 Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foxsData.map((model, index) => (
                    <TableRow
                      key={index}
                      style={{ backgroundColor: getUniqueColor(index) }}
                    >
                      <TableCell style={{ fontSize: '1rem' }}>{model.filename}</TableCell>
                      <TableCell style={{ fontSize: '1rem' }}>
                        {model.chisq.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Item>
  )
}

export default FoXSAnalysis
