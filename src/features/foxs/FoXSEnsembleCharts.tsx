import { useState, Fragment } from 'react'
import { Checkbox, TableHead, Typography } from '@mui/material'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material'
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

type Props = {
  combinedData: CombinedFoxsData[]
  foxsData: FoxsData[]
  minYAxis: number
  maxYAxis: number
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
const FoXSEnsembleCharts = ({
  combinedData,
  minYAxis,
  maxYAxis,
  foxsData
}: Props) => {
  // console.log('combinedData:', combinedData)
  // console.log('foxsData:', foxsData)
  // Initialize visibility state for each line
  const [visibility, setVisibility] = useState([
    false,
    ...new Array(foxsData.length - 1).fill(true)
  ])
  // Handle checkbox change
  const handleCheckboxChange = (index) => {
    const newVisibility = visibility.slice()
    newVisibility[index] = !newVisibility[index]
    // console.log('Updated visibility:', newVisibility)
    setVisibility(newVisibility)
  }
  return (
    <>
      <Typography
        variant='h5'
        sx={{ pl: 2, m: 1 }}
      >{`Ensemble Models - I vs. q`}</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='q' scale='linear' type='number' />
          <YAxis
            yAxisId='left'
            scale='log'
            type='number'
            domain={['auto', 'auto']}
          />
          <Tooltip />
          <Legend
            iconType='line'
            verticalAlign='bottom'
            height={30}
            layout='horizontal'
            align='center'
          />
          <Line
            yAxisId='left'
            type='monotone'
            dataKey='exp_intensity'
            name='Exp Intensity'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
            dot={{ strokeWidth: 1 }}
          />
          {foxsData.map((_, index) => (
            <Fragment key={index}>
              {visibility[index] && (
                <Line
                  yAxisId='left'
                  type='monotone'
                  dataKey={`model_intensity_${index}`}
                  name={`Ens. Size ${index}`}
                  stroke={getUniqueColor(index)}
                  dot={{ strokeWidth: 1 }}
                />
              )}
            </Fragment>
          ))}
        </LineChart>
      </ResponsiveContainer>
      <Typography variant='h5' sx={{ pl: 2, m: 1, mt: 3 }}>
        Ensemble Models - Chi&sup2; residuals
      </Typography>
      <ResponsiveContainer width='100%' height={200}>
        <LineChart data={combinedData}>
          <XAxis dataKey='q' scale='linear' type='number' />
          <YAxis domain={[minYAxis, maxYAxis]} />
          <Tooltip />
          <Legend
            iconType='line'
            verticalAlign='bottom'
            height={30}
            layout='horizontal'
            align='center'
          />
          {foxsData.map((_, index) => (
            <Fragment key={index}>
              {visibility[index] && (
                <Line
                  type='monotone'
                  dataKey={`residual_${index}`}
                  name={`Ens. Size ${index}`}
                  stroke={getUniqueColor(index)}
                />
              )}
            </Fragment>
          ))}
          <ReferenceLine y={0} stroke='black' />
        </LineChart>
      </ResponsiveContainer>
      <TableContainer>
        <Table size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: '1rem' }}>Show</TableCell>
              <TableCell style={{ fontSize: '1rem' }}>Filename</TableCell>
              <TableCell style={{ fontSize: '1rem' }}>Chi^2 Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foxsData.slice(0).map(
              (model, index) =>
                index !== 0 && (
                  <TableRow
                    key={index}
                    style={{ backgroundColor: getUniqueColor(index) }}
                  >
                    <TableCell>
                      <Checkbox
                        checked={visibility[index]}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </TableCell>
                    <TableCell style={{ fontSize: '1rem' }}>
                      {model.filename}
                    </TableCell>
                    <TableCell style={{ fontSize: '1rem' }}>
                      {model.chisq.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default FoXSEnsembleCharts
