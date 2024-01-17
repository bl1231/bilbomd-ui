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

const ScoperFoXSAnalysis = ({ id }: ScoperFoXSAnalysisProps) => {
  const { data, isLoading, isError } = useGetFoxsAnalysisByIdQuery(id, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>
  if (isError || !data) return <div>Error loading data</div>

  const origPDBFile = data[0].filename
  const scopPDBFile = data[1].filename
  const origData = data[0].data
  const scopData = data[1].data
  const origChiSq = data[0].chisq
  const scopChiSq = data[1].chisq
  const origC1 = data[0].c1
  const scopC1 = data[1].c1
  const origC2 = data[0].c2
  const scopC2 = data[1].c2

  //
  const trimData = (data) =>
    data.map((item) => ({
      q: parseFloat(item.q.toFixed(3)),
      exp_intensity: parseFloat(item.exp_intensity.toFixed(3)),
      model_intensity: parseFloat(item.model_intensity.toFixed(3)),
      error: parseFloat(item.error.toFixed(3))
    }))
  const origDataTrimmed = trimData(origData)
  const scopDataTrimmed = trimData(scopData)
  // Calculate residuals
  const calculateResiduals = (dataPoints) => {
    return dataPoints.map((item) => ({
      q: parseFloat(item.q.toFixed(3)), // Adjust as needed
      res: parseFloat(
        ((item.exp_intensity - item.model_intensity) / item.error).toFixed(3)
      ) // Adjust as needed
    }))
  }

  const origResiduals = calculateResiduals(data[0].data)
  const scopResiduals = calculateResiduals(data[1].data)

  // Define a min/max values for the residuals plots
  const maxYAxis = Math.max(...origResiduals.map((r) => Math.abs(r.res)))
  const minYAxis = -maxYAxis
  console.log(minYAxis, maxYAxis)

  // Define label positions for the Chi^2 and C1/C2 values
  const labelXPosition = 75 // X position of the label
  const labelYPosition = 20 // Y position of the label

  // eslint-disable-next-line react/prop-types
  const ChiSquaredChartLabel = ({ chisq, c1, c2, x, y }: CustomChartLabelProps) => {
    return (
      <>
        <text x={x} y={y} fill="black" fontSize={13}>
          Chi²: {chisq.toFixed(2)}
        </text>
        <text x={x} y={y + 16} fill="black" fontSize={13}>
          C
          <tspan dy="3" fontSize="10">
            1
          </tspan>
          :{' '}
          <tspan dy="-3" fontSize="13">
            {c1}
          </tspan>
        </text>
        <text x={x} y={y + 32} fill="black" fontSize={13}>
          C
          <tspan dy="3" fontSize="10">
            2
          </tspan>
          :{' '}
          <tspan dy="-3" fontSize="13">
            {c2}
          </tspan>
        </text>
      </>
    )
  }

  return (
    <Item>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>
            Original Model - <strong>{origPDBFile}</strong>
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={origDataTrimmed}>
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
          <Typography>
            Scoper Model - <strong>{scopPDBFile}</strong>
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scopDataTrimmed}>
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
