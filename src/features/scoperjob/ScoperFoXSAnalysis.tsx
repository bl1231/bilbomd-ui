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

const ScoperFoXSAnalysis = ({ id }: ScoperFoXSAnalysisProps) => {
  const { data, isLoading, isError } = useGetFoxsAnalysisByIdQuery(id, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>
  if (isError || !data) return <div>Error loading data</div>
  // Calculate residuals
  const calculateResiduals = (dataPoints) => {
    return dataPoints.map((item) => ({
      q: item.q,
      res: (item.exp_intensity - item.model_intensity) / item.error
    }))
  }
  const residualsData1 = calculateResiduals(data[0])
  const residualsData2 = calculateResiduals(data[1])

  // const mergedData = [
  //   ...data[0].map((item) => ({ ...item, series: 'Series1' })),
  //   ...data[1].map((item) => ({ ...item, series: 'Series2' }))
  // ]
  // console.log('mergedData -->', mergedData)
  return (
    <Item>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Original Model</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data[0]}>
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
            <LineChart data={residualsData1}>
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="res" name="Residuals" stroke="#82ca9d" />
              <ReferenceLine
                y={0}
                stroke="black"
                label={{
                  value: 'Y=0',
                  position: 'insideTopLeft',
                  fill: 'grey',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={6}>
          <Typography>Scoper Model</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data[1]}>
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
            <LineChart data={residualsData2}>
              <XAxis dataKey="q" scale="linear" type="number" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="res" name="Residuals" stroke="#82ca9d" />
              <ReferenceLine
                y={0}
                stroke="black"
                label={{
                  value: 'Y=0',
                  position: 'insideTopLeft',
                  fill: 'grey',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Item>
  )
}

export default ScoperFoXSAnalysis
