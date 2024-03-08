import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"

const AdminPanel = () => {
  const navigate = useNavigate()
  const bullBoardUrl = "/admin/bullmq"

  const navigateToBullMQ = () => {
    navigate(bullBoardUrl)
  }

  return (
    <div>
      <h2>Admin Panel - Job Queue Management</h2>
      <Button variant="contained" color="primary" onClick={navigateToBullMQ}>
        Go to BullMQ Admin
      </Button>
      <iframe
        src={bullBoardUrl}
        width="100%"
        height="800" // Adjust the height as necessary
        style={{ border: "none" }}
        title="BullBoard"
      ></iframe>
    </div>
  )
}

export default AdminPanel
