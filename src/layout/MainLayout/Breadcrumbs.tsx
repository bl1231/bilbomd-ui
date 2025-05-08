import { Breadcrumbs, Link, Typography } from '@mui/material'
import { useLocation, Link as RouterLink, useParams } from 'react-router'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useGetJobByIdQuery } from '../../slices/jobsApiSlice'

// Optional label mapping
const labelMap: Record<string, string> = {
  jobs: 'Jobs',
  admin: 'Admin',
  config: 'Config',
  upload: 'Upload',
  dashboard: 'Dashboard',
  welcome: 'Home'
  // fallback to path segment if not defined
}

export default function AppBreadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(Boolean)
  const { id } = useParams()
  const { data: job } = useGetJobByIdQuery(id!, { skip: !id })
  // console.log('breadcrumbs job:', JSON.stringify(job))
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
          // const label = labelMap[segment] || decodeURIComponent(segment)
          let label = labelMap[segment] || decodeURIComponent(segment)
          if (segment === id && job?.mongo.title) {
            label = job.mongo.title
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
