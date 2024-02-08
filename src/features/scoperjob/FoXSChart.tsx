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
import { Typography } from '@mui/material'

interface DataPoint {
  q: number
  exp_intensity: number
  model_intensity: number
  error: number
}

interface ResidualDataPoint {
  q: number
  res: number
}

interface FoXSChartProps {
  title: string
  data: DataPoint[]
  residualsData: ResidualDataPoint[]
  chisq: number
  c1: number
  c2: number
  minYAxis: number
  maxYAxis: number
}

interface CustomChartLabelProps {
  chisq: number
  c1: number
  c2: number
  x: number
  y: number
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

const FoXSChart = ({
  title,
  data,
  residualsData,
  chisq,
  c1,
  c2,
  minYAxis,
  maxYAxis
}: FoXSChartProps) => {
  const labelXPosition = 75
  const labelYPosition = 20

  return (
    <>
      <Typography sx={{ pl: 2, m: 1 }}>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="q" scale="linear" type="number" />
          <YAxis yAxisId="left" scale="log" type="number" domain={['auto', 'auto']} />
          <Tooltip />
          <Legend
            iconType="line"
            verticalAlign="bottom"
            height={30}
            layout="horizontal"
          />
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
      <Typography sx={{ pl: 2, m: 1, mt: 3 }}>{title} - residuals</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={residualsData}>
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
          <Line type="monotone" dataKey="res" name="Residuals" stroke="#82ca9d" />
          <ReferenceLine
            y={0}
            stroke="black"
            label={
              <ChiSquaredChartLabel
                chisq={chisq}
                c1={c1}
                c2={c2}
                x={labelXPosition}
                y={labelYPosition}
              />
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

export default FoXSChart
