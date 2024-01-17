import { useMemo } from 'react'
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
import { Grid, Typography } from '@mui/material'
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

interface CustomChartLabelProps {
  chisq: number
  c1: number
  c2: number
  x: number
  y: number
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

const ChiSquaredChartLabel = ({ chisq, c1, c2, x, y }: CustomChartLabelProps) => {
  return (
    <>
      <text x={x} y={y} fill="black" fontSize={14}>
        Chi²: {chisq.toFixed(2)}
      </text>
      <text x={x} y={y + 18} fill="black" fontSize={14}>
        C
        <tspan dy="3" fontSize={10}>
          1
        </tspan>
        :{' '}
        <tspan dy="-3" fontSize={14}>
          {c1}
        </tspan>
      </text>
      <text x={x} y={y + 36} fill="black" fontSize={14}>
        C
        <tspan dy="3" fontSize={10}>
          2
        </tspan>
        :{' '}
        <tspan dy="-3" fontSize={14}>
          {c2}
        </tspan>
      </text>
    </>
  )
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

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>
  if (isError || !data) return <div>Error loading data</div>

  // Pull out the other info for adding info to the FoXS plots
  const origPDBFile = foxsData[0].filename
  const scopPDBFile = foxsData[1].filename
  const origChiSq = foxsData[0].chisq
  const scopChiSq = foxsData[1].chisq
  const origC1 = foxsData[0].c1
  const scopC1 = foxsData[1].c1
  const origC2 = foxsData[0].c2
  const scopC2 = foxsData[1].c2

  // Define a min/max values for the residuals plots
  const maxYAxis = Math.max(...origResiduals.map((r) => Math.abs(r.res)))
  const minYAxis = -maxYAxis
  console.log(minYAxis, maxYAxis)

  // Define label positions for the Chi^2 and C1/C2 values
  const labelXPosition = 75 // X position of the label
  const labelYPosition = 20 // Y position of the label

  return (
    <Item>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography sx={{ m: 1 }}>
            Original Model - <strong>{origPDBFile}</strong> - I vs. q
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={origData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis yAxisId="left" scale="log" type="number" domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="exp_intensity"
                name="Exp Intensity"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="model_intensity"
                name="Model Intensity"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
          <Typography sx={{ m: 1, mt: 3 }}>
            Original Model - <strong>{origPDBFile}</strong> - residuals
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={origResiduals}>
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis domain={[minYAxis, maxYAxis]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="res" name="Residuals" stroke="#82ca9d" />
              <ReferenceLine
                y={0}
                stroke="black"
                label={
                  <ChiSquaredChartLabel
                    chisq={origChiSq}
                    c1={origC1}
                    c2={origC2}
                    x={labelXPosition}
                    y={labelYPosition}
                  />
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ m: 1 }}>
            Scoper Model - <strong>{scopPDBFile}</strong> - I vs. q
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scopData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis yAxisId="left" scale="log" type="number" domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="exp_intensity"
                name="Exp Intensity"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="model_intensity"
                name="Model Intensity"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
          <Typography sx={{ m: 1, mt: 3 }}>
            Scoper Model - <strong>{scopPDBFile}</strong> - residuals
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={scopResiduals}>
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis domain={[minYAxis, maxYAxis]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="res" name="Residuals" stroke="#82ca9d" />
              <ReferenceLine
                y={0}
                stroke="black"
                label={
                  <ChiSquaredChartLabel
                    chisq={scopChiSq}
                    c1={scopC1}
                    c2={scopC2}
                    x={labelXPosition}
                    y={labelYPosition}
                  />
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Item>
  )
}

export default ScoperFoXSAnalysis
