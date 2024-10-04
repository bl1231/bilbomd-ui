import {
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Scatter,
  Legend,
  Label
} from 'recharts'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'

interface FeedbackChartProps {
  data: {
    q_ranges: number[]
    chi_squares_of_regions: number[]
    residuals_of_regions: number[]
  }
}

const FeedbackChart: React.FC<FeedbackChartProps> = ({ data }) => {
  // Prepare the data points to center the values within each region
  const q_midpoints = [
    (data.q_ranges[0] + data.q_ranges[1]) / 2,
    (data.q_ranges[1] + data.q_ranges[2]) / 2,
    (data.q_ranges[2] + data.q_ranges[3]) / 2
  ]

  // Prepare data for chi-squares and residuals
  const chartData = q_midpoints.map((q_mid, index) => ({
    q: q_mid,
    chi_square: data.chi_squares_of_regions[index],
    residual: data.residuals_of_regions[index]
  }))

  // Calculate the maximum value in chi_squares_of_regions and residuals_of_regions
  const maxChiSquare = Math.max(...data.chi_squares_of_regions) + 1
  const maxResidual = Math.max(...data.residuals_of_regions) + 1

  return (
    <Box>
      <Typography sx={{ fontSize: '1.7em' }}>
        {`Chi\u00B2`} and Residuals vs. Q Ranges
      </Typography>

      <ScatterChart
        width={600}
        height={350}
        data={chartData}
        margin={{ top: 30, right: 50, left: 20, bottom: 10 }}
        style={{ fontSize: '1.1em' }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='q'
          type='number'
          domain={[data.q_ranges[0], data.q_ranges[3]]}
          label={{
            value: `q (Å\u207B\u00B9)`,
            position: 'insideBottom',
            offset: -6,
            fill: '#000'
          }}
        />
        {/* Left Y-Axis for Chi-Square */}
        <YAxis
          yAxisId='left'
          domain={[0, maxChiSquare]}
          label={{
            value: `Chi\u00B2`,
            angle: -90,
            position: 'insideLeft',
            style: { fontSize: '1.4em' }
          }}
        />
        {/* Right Y-Axis for Residual */}
        <YAxis
          yAxisId='right'
          orientation='right'
          domain={[0, maxResidual]}
          label={{
            value: 'Residuals',
            angle: 90,
            position: 'insideRight',
            offset: 0,
            style: { fontSize: '1.4em' }
          }}
        />
        <Tooltip />
        <Legend
          verticalAlign='top'
          height={46}
          wrapperStyle={{ fontSize: '1.2em' }}
        />

        {/* Background color for the low q region (0.01 < q < 0.1) */}
        <ReferenceArea
          x1={data.q_ranges[0]}
          x2={data.q_ranges[1]}
          y1={0}
          y2={maxChiSquare}
          fill='rgba(255, 0, 0, 0.1)'
          yAxisId='left'
        >
          <Label value='LOW' offset={5} position='top' />
        </ReferenceArea>

        {/* Background color for the mid q region (0.1 < q < 0.2) */}
        <ReferenceArea
          x1={data.q_ranges[1]}
          x2={data.q_ranges[2]}
          y1={0}
          y2={maxChiSquare}
          fill='rgba(0, 255, 0, 0.1)'
          yAxisId='left'
        >
          <Label value='MID' offset={5} position='top' />
        </ReferenceArea>

        {/* Background color for the high q region (0.2 < q < 0.4) */}
        <ReferenceArea
          x1={data.q_ranges[2]}
          x2={data.q_ranges[3]}
          y1={0}
          y2={maxChiSquare}
          fill='rgba(0, 0, 255, 0.1)'
          yAxisId='left'
        >
          <Label value='HIGH' offset={5} position='top' />
        </ReferenceArea>

        {/* Vertical reference lines for the region boundaries */}
        <ReferenceLine x={data.q_ranges[1]} stroke='red' yAxisId='left' />
        <ReferenceLine x={data.q_ranges[2]} stroke='red' yAxisId='left' />

        {/* Scatter plot for chi-square values (Left Y-Axis) */}
        <Scatter
          name={`Chi\u00B2`}
          data={chartData}
          dataKey='chi_square'
          line
          fill='#8884d8'
          yAxisId='left'
        />

        {/* Scatter plot for residual values (Right Y-Axis) */}
        <Scatter
          name='Residuals'
          data={chartData}
          dataKey='residual'
          line
          fill='#82ca9d'
          yAxisId='right'
        />
      </ScatterChart>
    </Box>
  )
}

export default FeedbackChart
