import { Link } from 'react-router-dom'

const MissingJob = () => {
  return (
    <article style={{ padding: '100px' }}>
      <h1>Oops!</h1>
      <p>Job Not Found</p>
      <div className="flexGrow">
        <Link to=".">Visit Our Job List Page</Link>
      </div>
    </article>
  )
}

export default MissingJob
