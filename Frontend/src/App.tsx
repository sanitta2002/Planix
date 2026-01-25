
import UserRoutes from "./routes/User/UserRoutes"
import { Toaster } from "sonner";


function App() {


  return (
    <>
    <Toaster   richColors position="top-right" />
     <UserRoutes/>
    </>
  )
}

export default App
