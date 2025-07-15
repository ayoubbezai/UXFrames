import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectsServices } from '../services/projectsServices'
import AddProjectModel from '../models/AddProjectModel'
import EditProjectModal from '../models/EditProjectModal'
import DeleteConfirmationModal from '../models/DeleteConfirmationModal'
import toast from 'react-hot-toast'

const statusMap = {
    in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
}

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProjectId, setEditProjectId] = useState(null);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleGetProjects = async () => {
        const data = await projectsServices.getAllProjects();
        console.log(data);
        if (data.success) {
            setProjects(data?.data);
        } else {
            console.log("error happen", data?.message);
        }
    }

    useEffect(() => {
        handleGetProjects();
    }, []);

    const navigate = useNavigate()

    const handleDeleteProject = async () => {
        setIsDeleting(true)
        try {
            const response = await projectsServices.deleteProject(deleteProjectId)
            if (response.success) {
                toast.success('Project deleted successfully!')
                handleGetProjects()
            } else {
                toast.error(response.message || 'Failed to delete project')
            }
        } catch (error) {
            console.error('Error deleting project:', error)
            toast.error('Failed to delete project')
        } finally {
            setIsDeleting(false)
            setDeleteProjectId(null)
        }
    }

    const getProjectLogo = (project) => {
        if (project.logo_url) {
            return <img src={`http://127.0.0.1:8000/storage/${project.logo_url}`} alt={project.name} className="w-9 h-9 rounded-full object-cover border border-blue-100 shadow" />
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
                <div className="pb-4 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Projects</h1>
                        <p className="text-gray-500">Manage and organize your design projects here.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Project
                    </button>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch`}>
                    {projects.map(project => (
                        <div key={project.id} className="h-full w-full min-w-0 bg-white rounded-xl shadow-md p-5 flex flex-col border border-blue-100 hover:shadow-lg transition-all duration-200 group">
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
                            <div className="flex gap-2 mt-auto">
                                <button
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => setEditProjectId(project.id)}
                                    className="px-3 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition shadow-sm"
                                    title="Edit Project"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setDeleteProjectId(project.id)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition shadow-sm"
                                    title="Delete Project"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <AddProjectModel
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    refresh={handleGetProjects}
                />
            )}

            {/* Edit Project Modal */}
            {editProjectId && (
                <EditProjectModal
                    isOpen={!!editProjectId}
                    onClose={() => setEditProjectId(null)}
                    project={projects.find(p => p.id === editProjectId)}
                    refresh={handleGetProjects}
                />
            )}

            {/* Delete Project Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={!!deleteProjectId}
                onClose={() => setDeleteProjectId(null)}
                onConfirm={handleDeleteProject}
                title="Delete Project"
                message="Are you sure you want to delete this project"
                itemName={projects.find(p => p.id === deleteProjectId)?.name}
                isLoading={isDeleting}
            />
        </div>
    )
}

export default ProjectsPage 