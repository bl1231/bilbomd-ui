import { Breadcrumbs, Link, Typography } from '@mui/material'
import { useLocation, Link as RouterLink } from 'react-router'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { selectJobById } from 'slices/jobsApiSlice'
import { selectUserById } from 'slices/usersApiSlice'
import { useSelector } from 'react-redux'
import type { RootState } from 'app/store'

// Map of path segments to labels
// This is used to convert the path segments to human-readable labels
const labelMap: Record<string, string> = {
  jobs: 'Jobs',
  admin: 'Admin',
  config: 'Config',
  upload: 'Upload',
  dashboard: 'Dashboard',
  welcome: 'Home',
  about: 'About',
  alphafold: 'AlphaFold',
  classic: 'Classic',
  auto: 'Auto',
  multimd: 'MultiMD',
  sans: 'SANS',
  scoper: 'Scoper',
  constinp: 'INP Jiffy',
  af2pae: 'PAE Jiffy',
  users: 'Users'
}

export default function AppBreadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(Boolean)

  const maybeId = pathnames.at(-1)
  const parentSegment = pathnames.at(-2)

  const isJob = parentSegment === 'jobs'
  const isUser = parentSegment === 'users'

  const job = useSelector((state: RootState) => selectJobById(state, maybeId!))
  const user = useSelector((state: RootState) =>
    selectUserById(state, maybeId!)
  )

  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      separator={<NavigateNextIcon fontSize='small' />}
      sx={{ mb: 2 }}
    >
      <Link component={RouterLink} to='/welcome'>
        Home
      </Link>

      {pathnames
        .filter((segment, i) => !(i === 0 && segment === 'welcome'))
        .map((segment, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`

          let label = labelMap[segment] || decodeURIComponent(segment)

          if (segment === maybeId) {
            if (isJob && job?.mongo?.title) label = job.mongo.title
            if (isUser && user?.username) label = user.username
          }

          const isLast = index === pathnames.length - 1
          return isLast ? (
            <Typography key={to} color='text.primary'>
              {label}
            </Typography>
          ) : (
            <Link component={RouterLink} to={to} key={to}>
              {label}
            </Link>
          )
        })}
    </Breadcrumbs>
  )
}
