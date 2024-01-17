import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
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

  // Calculate residuals
  const calculateResiduals = (dataPoints) => {
    return dataPoints.map((item) => ({
      q: item.q,
      res: (item.exp_intensity - item.model_intensity) / item.error
    }))
  }
  const origResiduals = calculateResiduals(data[0].data)
  const scopResiduals = calculateResiduals(data[1].data)

  // Define label positions (modify these values based on your chart's layout)
  const labelXPosition = 80 // X position of the label
  const labelYPosition = 20 // Y position of the label

  // eslint-disable-next-line react/prop-types
  const ChiSquaredChartLabel = ({ chisq, x, y }: CustomChartLabelProps) => {
    return (
      <text x={x} y={y} fill="black" fontSize={14}>
        Chi²: {chisq.toFixed(2)}
      </text>
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
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={origResiduals}>
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Label value="1.2345" position="bottom" />
              <Line type="monotone" dataKey="res" name="Residuals" stroke="#82ca9d" />
              <ReferenceLine
                y={0}
                stroke="black"
                label={
                  <ChiSquaredChartLabel
                    chisq={origChiSq}
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
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={scopResiduals}>
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="res" name="Residuals" stroke="#82ca9d" />
              <ReferenceLine
                y={0}
                stroke="black"
                label={
                  <ChiSquaredChartLabel
                    chisq={scopChiSq}
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
