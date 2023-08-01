import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from "./components/Login"
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
