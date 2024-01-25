import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material'
import { BilboMDScoperSteps } from 'types/interfaces'

interface BilboMDScoperTableProps {
  scoper: BilboMDScoperSteps
}

const BilboMDScoperTable = ({ scoper }: BilboMDScoperTableProps) => {
  const rows = [
    { key: 'KGS Number of Conformations to Generate', value: scoper.kgsConformations },
    { key: 'KGS Progress', value: scoper.kgsFiles },
    // { key: 'FoXS Top File', value: scoper.foxsTopFile },
    // { key: 'FoXS Top Score', value: scoper.foxsTopScore },
    // { key: 'IonNet threshold', value: scoper.predictionThreshold },
    { key: 'Number of predicted Mg ions', value: scoper.multifoxsEnsembleSize }
    // { key: 'MultiFoXS Best Chi2 Score', value: scoper.multifoxsScore }
  ]

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key}>
              <TableCell component="th" scope="row">
                {row.key}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export { BilboMDScoperTable }
