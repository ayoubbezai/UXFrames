import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ScreensPage from './pages/ScreensPage'

function App() {
  const [currentPage, setCurrentPage] = useState('screens')
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} expanded={expanded} setExpanded={setExpanded} />
      <main className={`flex-1 transition-all duration-150 `}>
        {currentPage === 'screens' && <ScreensPage />}
      </main>
    </div>
  )
}

export default App
