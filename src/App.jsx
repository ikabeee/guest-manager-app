import { Routes, Route } from "react-router-dom"
import Friends from "./pages/Friends"
import Login from "./pages/Login"
import Layout from "./layout/Layout"
import Guests from "./pages/Guests"
import Invite  from "./pages/Invite"


function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="invite" element={<Invite/>}/>
      <Route path="/admin" element={<Layout />}>
        <Route index element={<Friends />} />
        <Route path="guests" element={<Guests/>} />
      </Route>
    </Routes>
  )
}

export default App
