import React from 'react'
import { useNavigate } from 'react-router-dom'

const mockProjects = [
    {
        id: 1,
        name: 'Test Project',
        logo_url: null,
        description: 'This is a test project for demonstration purposes.',
        status: 'in_progress',
        figma_url: 'https://www.figma.com/file/your-project-id',
        docs_url: 'https://github.com/your-org/project-repo',
        live_url: 'https://example.com/my-project',
    },
    // Add more projects as needed
]

const statusMap = {
    in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
}

const ScreensPage = () => {
    const navigate = useNavigate()

    const getProjectLogo = (project) => {
        if (project.logo_url) {
            return <img src={project.logo_url} alt={project.name} className="w-9 h-9 rounded-full object-cover border border-blue-100 shadow" />
        }
        const initials = project.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        return (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-base shadow">
                {initials}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white">
            <div className="px-4 md:px-8 py-10">
                <div className="pb-4 mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Projects</h1>
                    <p className="text-gray-500">Manage and organize your design projects here.</p>
                </div>
                <div className={`grid  grid-cols-3 gap-6 items-stretch`}>
                    {mockProjects.map(project => (
                        <div key={project.id} className="h-full w-full min-w-0 bg-white rounded-xl shadow-md p-5 flex flex-col border border-blue-100 hover:shadow-lg transition">
                            <div className="flex items-center mb-2 gap-3">
                                {getProjectLogo(project)}
                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-gray-800 truncate flex-1">{project.name}</h2>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${statusMap[project.status]?.color || 'bg-gray-100 text-gray-800'}`}>{statusMap[project.status]?.label || project.status}</span>
                                </div>
                            </div>
                            <p className="text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                            <div className="flex gap-3 mb-4">
                                {project.figma_url && <a href={project.figma_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">Figma</a>}
                                {project.docs_url && <a href={project.docs_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">Docs</a>}
                                {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">Live</a>}
                            </div>
                            <button
                                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                                onClick={() => navigate(`/projects/${project.id}`)}
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ScreensPage 