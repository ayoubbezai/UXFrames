import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'

function App() {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <main className={`flex-1 transition-all duration-150`}>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
