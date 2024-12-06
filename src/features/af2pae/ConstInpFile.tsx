import { Box, Typography } from '@mui/material'
import CopyToClipboardButton from 'components/Common/CopyToClipboardButton'

interface ConstInpFileProps {
  constfile: string
}

const ConstInpFile = (props: ConstInpFileProps) => {
  const { constfile } = props
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'start',
        borderRadius: '4px',
        p: 2,
        my: 1,
        backgroundColor: '#bae0ff',
        color: 'black'
      }}
    >
      <Typography style={{ whiteSpace: 'pre-line' }}>{constfile}</Typography>
      <Box>
        <CopyToClipboardButton text={constfile} />
      </Box>
    </Box>
  )
}

export default ConstInpFile
