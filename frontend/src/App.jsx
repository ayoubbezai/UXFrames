import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ScreenDetailPage from './pages/ScreenDetailPage'

function App() {
  const [expanded, setExpanded] = useState(true)
  // Sidebar width: 208px when expanded, 60px when collapsed
  const sidebarWidth = expanded ? 208 : 60

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div
        className="fixed top-0 left-0 h-screen z-30"
        style={{ width: sidebarWidth }}
      >
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
      </div>
      <main
        className="transition-all duration-150 min-h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/screens/:screenId" element={<ScreenDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
