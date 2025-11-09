import Main from "./Components/Main"
import { Routes,Route } from "react-router-dom"
import { SignupLogin } from "./Components/SignupLogin"
import { Dashboard } from "./Components/Dashboard"
import { Canvas } from "./Components/Canvas"

export default function App()
{
  return(
    <>
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/SignupLogin" element={<SignupLogin/>}/>
      <Route path="/Dashboard" element={<Dashboard/>}/>
      <Route path="/Canvas/:Roomid" element={<Canvas/>}/>
    </Routes>
    </>
  )
}