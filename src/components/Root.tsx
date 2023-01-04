import UserCard from "./User"
import JobList from "./JobList"
export default function Root() {
  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-md-3 col-lg-2 min-vh-100 d-flex flex-column bg-secondary">
          <h3>Navigation</h3>
          <UserCard/>
          </div >
        <div className="col-md-9 col-lg-2 min-vh-100 d-flex flex-column bg-light w-auto">
          <JobList/>
        </div>
      </div>
    </div>
    </>
  )
}