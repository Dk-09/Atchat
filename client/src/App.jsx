import Register from "@/components/Register"
import axios from "axios"

function App() {

  axios.defaults.baseURL = "http://localhost:4000/"
  axios.defaults.withCredentials = false

  return (
    <div>
      <Register />
    </div>
  )
}

export default App
