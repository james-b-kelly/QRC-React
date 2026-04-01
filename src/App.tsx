import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import EditorLayout from './components/EditorLayout'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import Terms from './pages/Terms'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
      </Route>
      <Route element={<EditorLayout />}>
        <Route path="/editor" element={<Editor />} />
      </Route>
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  )
}

export default App
