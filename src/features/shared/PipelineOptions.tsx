import {
  List,
  Paper,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material'
import { green } from '@mui/material/colors'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

interface PipelineType {
  title: string
  description: string
  imagePath: {
    light: string
    dark: string
  }
}

interface PipelineOptionsProps {
  pipelines: PipelineType[]
  isLightMode: boolean
}

const PipelineOptions = ({ pipelines, isLightMode }: PipelineOptionsProps) => (
  <List>
    {pipelines.map((pipeline, index) => (
      <Paper
        key={index}
        className='bilbomd-pipeline'
        sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
      >
        <ListItem
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ backgroundColor: green[700] }}>
              <RocketLaunchIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={pipeline.title}
            secondary={pipeline.description}
            sx={{ flex: '1 1 auto', minWidth: '200px' }}
          />
          <img
            src={
              isLightMode ? pipeline.imagePath.light : pipeline.imagePath.dark
            }
            alt={`Overview of ${pipeline.title}`}
            style={{
              maxWidth: '65%',
              maxHeight: '200px',
              objectFit: 'contain'
            }}
          />
        </ListItem>
      </Paper>
    ))}
  </List>
)

export default PipelineOptions
