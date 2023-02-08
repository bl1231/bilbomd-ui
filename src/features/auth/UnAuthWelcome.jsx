import { Link } from 'react-router-dom'

const Welcome = () => {
  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(
    date
  )

  const content = (
    <section className="welcome">
      <p>{today}</p>

      <h1>Welcome!</h1>

      <p>
        <Link to="/dashboard/jobs">View BilboMD Jobs</Link>
      </p>

      <p>
        <Link to="/dashboard/jobs/new">Add New Job</Link>
      </p>

      <p>
        <Link to="/dashboard/users">View User Settings</Link>
      </p>

      <p>
        <Link to="/dashboard/users/new">Add New User</Link>
      </p>
    </section>
  )

  return content
}
export default Welcome
