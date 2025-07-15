import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projectsServices } from '../services/projectsServices'
import { screenServices } from '../services/screenServices'
import { categoryServices } from '../services/categoryServices'
import AddScreenModal from '../models/AddScreenModal'
import AddCategoryModel from '../models/AddCategoryModel'
import EditProjectModal from '../models/EditProjectModal'
import EditScreenModal from '../models/EditScreenModal'
import EditCategoryModal from '../models/EditCategoryModal'
import DeleteConfirmationModal from '../models/DeleteConfirmationModal'
import toast from 'react-hot-toast'

const ProjectDetailPage = () => {
    const { projectId } = useParams()
    const [project, setProject] = useState(null)
    const [screens, setScreens] = useState([])
    const [categories, setCategories] = useState([])
    const [activeTab, setActiveTab] = useState('overview')
    const [isLoading, setIsLoading] = useState(true)
    const [isScreenModalOpen, setIsScreenModalOpen] = useState(false)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false)
    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false)
    const [editScreenId, setEditScreenId] = useState(null)
    const [deleteScreenId, setDeleteScreenId] = useState(null)
    const [editCategoryId, setEditCategoryId] = useState(null)
    const [deleteCategoryId, setDeleteCategoryId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                // Fetch project details
                const projectResponse = await projectsServices.getProjectById(projectId)
                if (projectResponse.success) {
                    setProject(projectResponse.data)
                }

                // Fetch screens for this project
                const screensResponse = await screenServices.getScreensByProject(projectId)
                if (screensResponse.success) {
                    setScreens(screensResponse.data)
                }

                // Fetch categories for this project
                const categoriesResponse = await categoryServices.getCategoriesByProject(projectId)
                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data)
                }

                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching project data:', error)
                setIsLoading(false)
            }
        }

        fetchProjectData()
    }, [projectId])

    const getStatusColor = (status) => {
        const statusMap = {
            completed: 'bg-green-100 text-green-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            draft: 'bg-gray-100 text-gray-800'
        }
        return statusMap[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusLabel = (status) => {
        const statusMap = {
            completed: 'Completed',
            in_progress: 'In Progress',
            draft: 'Draft'
        }
        return statusMap[status] || status
    }

    const getProjectLogo = (project) => {
        if (project?.logo_url) {
            return <img src={`http://127.0.0.1:8000/storage/${project.logo_url}`} alt={project.name} className="w-12 h-12 rounded-full object-cover border border-blue-100 shadow" />
        }
        const initials = project?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'P'
        return (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-lg shadow">
                {initials}
            </div>
        )
    }

    const parseJsonField = (jsonString) => {
        try {
            return JSON.parse(jsonString)
        } catch (error) {
            return []
        }
    }

    const refreshData = async () => {
        // Refresh screens
        const screensResponse = await screenServices.getScreensByProject(projectId)
        if (screensResponse.success) {
            setScreens(screensResponse.data)
        }

        // Refresh categories
        const categoriesResponse = await categoryServices.getCategoriesByProject(projectId)
        if (categoriesResponse.success) {
            setCategories(categoriesResponse.data)
        }
    }

    // Group screens by category
    const screensByCategory = screens.reduce((acc, screen) => {
        const categoryId = screen.category_id
        if (!acc[categoryId]) {
            acc[categoryId] = []
        }
        acc[categoryId].push(screen)
        return acc
    }, {})

    const handleDeleteProject = async () => {
        setIsDeleting(true)
        try {
            const response = await projectsServices.deleteProject(projectId)
            if (response.success) {
                toast.success('Project deleted successfully!')
                window.history.back()
            } else {
                toast.error(response.message || 'Failed to delete project')
            }
        } catch (error) {
            console.error('Error deleting project:', error)
            toast.error('Failed to delete project')
        } finally {
            setIsDeleting(false)
            setIsDeleteProjectModalOpen(false)
        }
    }

    const handleDeleteScreen = async () => {
        setIsDeleting(true)
        try {
            const response = await screenServices.deleteScreen(deleteScreenId)
            if (response.success) {
                toast.success('Screen deleted successfully!')
                refreshData()
            } else {
                toast.error(response.message || 'Failed to delete screen')
            }
        } catch (error) {
            console.error('Error deleting screen:', error)
            toast.error('Failed to delete screen')
        } finally {
            setIsDeleting(false)
            setDeleteScreenId(null)
        }
    }

    const handleDeleteCategory = async () => {
        setIsDeleting(true)
        try {
            const response = await categoryServices.deleteCategory(deleteCategoryId)
            if (response.success) {
                toast.success('Category deleted successfully!')
                refreshData()
            } else {
                toast.error(response.message || 'Failed to delete category')
            }
        } catch (error) {
            console.error('Error deleting category:', error)
            toast.error('Failed to delete category')
        } finally {
            setIsDeleting(false)
            setDeleteCategoryId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-700">Loading project...</span>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
                    <p className="text-gray-600">The project you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="px-4 md:px-8 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        {getProjectLogo(project)}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(project.status)}`}>
                                    {getStatusLabel(project.status)}
                                </span>
                                <span className="text-sm text-gray-500">Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCategoryModalOpen(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Category
                            </button>
                            <button
                                onClick={() => setIsScreenModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Screen
                            </button>
                            {/* <button
                                onClick={() => setIsEditProjectModalOpen(true)}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition flex items-center gap-2 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={() => setIsDeleteProjectModalOpen(true)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition flex items-center gap-2 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button> */}
                            {project.figma_url && (
                                <a href={project.figma_url} target="_blank" rel="noopener noreferrer"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                                    View in Figma
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-3 px-1 font-medium transition ${activeTab === 'overview'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('screens')}
                            className={`pb-3 px-1 font-medium transition ${activeTab === 'screens'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Screens ({screens.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`pb-3 px-1 font-medium transition ${activeTab === 'categories'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Categories ({categories.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('links')}
                            className={`pb-3 px-1 font-medium transition ${activeTab === 'links'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Links
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-8 py-8">
                {activeTab === 'overview' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                                    <p className="text-gray-700 leading-relaxed text-lg">{project.description}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Screens</span>
                                            <span className="font-bold text-2xl text-blue-600">{screens.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Categories</span>
                                            <span className="font-bold text-2xl text-green-600">{categories.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Mobile Screens</span>
                                            <span className="font-bold text-xl text-purple-600">
                                                {screens.filter(screen => screen.type === 'mobile').length}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Web Screens</span>
                                            <span className="font-bold text-xl text-orange-600">
                                                {screens.filter(screen => screen.type === 'web').length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                                            {getStatusLabel(project.status)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Created</span>
                                        <span className="font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Last Updated</span>
                                        <span className="font-medium">{new Date(project.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Project created on {new Date(project.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Last updated on {new Date(project.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    {screens.length > 0 && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                            <span className="text-sm text-gray-600">{screens.length} screens added</span>
                                        </div>
                                    )}
                                    {categories.length > 0 && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                            <span className="text-sm text-gray-600">{categories.length} categories created</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'screens' && (
                    <div className="max-w-6xl mx-auto">
                        {screens.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No screens yet</h3>
                                <p className="text-gray-500 mb-6">Get started by adding your first screen to this project.</p>
                                <button
                                    onClick={() => setIsScreenModalOpen(true)}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                >
                                    Add First Screen
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {categories.map(category => {
                                    const categoryScreens = screensByCategory[category.id] || []
                                    if (categoryScreens.length === 0) return null

                                    return (
                                        <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h2>
                                                    <p className="text-gray-600">{category.description}</p>
                                                </div>
                                                <span className="text-sm text-gray-500">{categoryScreens.length} screens</span>
                                            </div>

                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {categoryScreens.map((screen) => (
                                                    <div key={screen.id} className="relative group bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200">
                                                        <Link to={`/screens/${screen.id}`} className="block p-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${screen.type === 'mobile' ? 'bg-blue-100 text-blue-800' :
                                                                    screen.type === 'web' ? 'bg-purple-100 text-purple-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                    {screen.type}
                                                                </span>
                                                            </div>
                                                            <h3 className="font-semibold text-gray-900 mb-2">{screen.title}</h3>
                                                            <p className="text-sm text-gray-600 mb-4">{screen.purpose}</p>
                                                            {/* Screen Preview */}
                                                            <div className={`bg-gray-100 rounded-lg p-4 mb-4 ${screen.type === 'mobile'
                                                                ? 'w-40 h-64 mx-auto'
                                                                : 'w-full h-32'
                                                                }`}>
                                                                {screen.image_url ? (
                                                                    <div className={`${screen.type === 'mobile'
                                                                        ? 'w-32 h-56 mx-auto'
                                                                        : 'w-full h-24'
                                                                        }`}>
                                                                        <img
                                                                            src={`http://127.0.0.1:8000/storage/${screen.image_url}`}
                                                                            alt={screen.title}
                                                                            className="w-full h-full object-contain rounded-lg border border-gray-200"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className={`bg-white rounded-lg border border-gray-200 ${screen.type === 'mobile'
                                                                        ? 'w-32 h-56 mx-auto'
                                                                        : 'w-full h-24'
                                                                        }`}>
                                                                        <div className="h-full p-2 flex flex-col justify-center">
                                                                            <div className="text-center">
                                                                                <h4 className="font-semibold text-gray-900 text-xs mb-1">{screen.title}</h4>
                                                                                <div className="space-y-1">
                                                                                    {screen.inputs && parseJsonField(screen.inputs).length > 0 && (
                                                                                        <div className="text-xs text-gray-500">
                                                                                            {parseJsonField(screen.inputs).length} input{parseJsonField(screen.inputs).length !== 1 ? 's' : ''}
                                                                                        </div>
                                                                                    )}
                                                                                    {screen.actions && parseJsonField(screen.actions).length > 0 && (
                                                                                        <div className="text-xs text-gray-500">
                                                                                            {parseJsonField(screen.actions).length} action{parseJsonField(screen.actions).length !== 1 ? 's' : ''}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {screen.actions && parseJsonField(screen.actions).length > 0 && (
                                                                    <div className="text-xs text-gray-500">
                                                                        <strong>Actions:</strong> {parseJsonField(screen.actions).length}
                                                                    </div>
                                                                )}
                                                                {screen.inputs && parseJsonField(screen.inputs).length > 0 && (
                                                                    <div className="text-xs text-gray-500">
                                                                        <strong>Inputs:</strong> {parseJsonField(screen.inputs).length}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Link>
                                                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    setEditScreenId(screen.id)
                                                                }}
                                                                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                                title="Edit Screen"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    setDeleteScreenId(screen.id)
                                                                }}
                                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                                title="Delete Screen"
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
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="max-w-4xl mx-auto">
                        {categories.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                                <p className="text-gray-500 mb-6">Create categories to organize your screens.</p>
                                <button
                                    onClick={() => setIsCategoryModalOpen(true)}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                                >
                                    Add First Category
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map(category => {
                                    const categoryScreens = screensByCategory[category.id] || []
                                    return (
                                        <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{categoryScreens.length} screens</span>
                                            </div>
                                            <p className="text-gray-600 mb-4">{category.description}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsScreenModalOpen(true)}
                                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm"
                                                >
                                                    Add Screen
                                                </button>
                                                <button
                                                    onClick={() => setEditCategoryId(category.id)}
                                                    className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-all duration-200 shadow-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteCategoryId(category.id)}
                                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200 shadow-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Project Links</h2>
                            <div className="space-y-6">
                                {project.figma_url && (
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Figma Design</h3>
                                            <p className="text-sm text-gray-600">Main design file</p>
                                        </div>
                                        <a
                                            href={project.figma_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                        >
                                            Open
                                        </a>
                                    </div>
                                )}

                                {project.docs_url && (
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Documentation</h3>
                                            <p className="text-sm text-gray-600">Project documentation and guides</p>
                                        </div>
                                        <a
                                            href={project.docs_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                                        >
                                            Open
                                        </a>
                                    </div>
                                )}

                                {project.live_url && (
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Live Demo</h3>
                                            <p className="text-sm text-gray-600">Live version of the project</p>
                                        </div>
                                        <a
                                            href={project.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                                        >
                                            Open
                                        </a>
                                    </div>
                                )}

                                {project.other_url && (
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Other Resources</h3>
                                            <p className="text-sm text-gray-600">Additional project resources</p>
                                        </div>
                                        <a
                                            href={project.other_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                                        >
                                            Open
                                        </a>
                                    </div>
                                )}

                                {!project.figma_url && !project.docs_url && !project.live_url && !project.other_url && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No links added yet</h3>
                                        <p className="text-gray-500">Add project links to keep everything organized.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Screen Modal */}
            {isScreenModalOpen && (
                <AddScreenModal
                    isOpen={isScreenModalOpen}
                    onClose={() => setIsScreenModalOpen(false)}
                    projectId={projectId}
                    refresh={refreshData}
                />
            )}

            {/* Add Category Modal */}
            {isCategoryModalOpen && (
                <AddCategoryModel
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                    projectId={projectId}
                    refresh={refreshData}
                />
            )}

            {/* Edit Project Modal */}
            {isEditProjectModalOpen && project && (
                <EditProjectModal
                    isOpen={isEditProjectModalOpen}
                    onClose={() => setIsEditProjectModalOpen(false)}
                    project={project}
                    refresh={refreshData}
                />
            )}

            {/* Edit Screen Modal */}
            {editScreenId && (
                <EditScreenModal
                    isOpen={!!editScreenId}
                    onClose={() => setEditScreenId(null)}
                    screenId={editScreenId}
                    projectId={projectId}
                    refresh={refreshData}
                />
            )}

            {/* Edit Category Modal */}
            {editCategoryId && (
                <EditCategoryModal
                    isOpen={!!editCategoryId}
                    onClose={() => setEditCategoryId(null)}
                    categoryId={editCategoryId}
                    projectId={projectId}
                    refresh={refreshData}
                />
            )}

            {/* Delete Project Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteProjectModalOpen}
                onClose={() => setIsDeleteProjectModalOpen(false)}
                onConfirm={handleDeleteProject}
                title="Delete Project"
                message="Are you sure you want to delete this project"
                itemName={project?.name}
                isLoading={isDeleting}
            />

            {/* Delete Screen Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={!!deleteScreenId}
                onClose={() => setDeleteScreenId(null)}
                onConfirm={handleDeleteScreen}
                title="Delete Screen"
                message="Are you sure you want to delete this screen"
                itemName={screens.find(s => s.id === deleteScreenId)?.title}
                isLoading={isDeleting}
            />

            {/* Delete Category Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={!!deleteCategoryId}
                onClose={() => setDeleteCategoryId(null)}
                onConfirm={handleDeleteCategory}
                title="Delete Category"
                message="Are you sure you want to delete this category"
                itemName={categories.find(c => c.id === deleteCategoryId)?.name}
                isLoading={isDeleting}
            />
        </div>
    )
}

export default ProjectDetailPage 