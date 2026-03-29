import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Editor from './pages/Editor'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
      </Route>
    </Routes>
  )
}

export default App
