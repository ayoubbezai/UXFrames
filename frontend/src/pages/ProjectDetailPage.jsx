import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { projectsServices } from '../services/projectsServices'

const ProjectDetailPage = () => {
    const { projectId } = useParams()
    const [project, setProject] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Mock data for now - replace with actual API call
                const mockProject = {
                    id: projectId,
                    name: 'E-commerce Mobile App',
                    description: 'A comprehensive mobile application for online shopping with advanced features like real-time inventory, secure payments, and personalized recommendations.',
                    status: 'in_progress',
                    figma_url: 'https://www.figma.com/file/example',
                    docs_url: 'https://github.com/example/docs',
                    live_url: 'https://example.com',
                    other_url: 'https://example.com/other',
                    logo_url: null,
                    created_at: '2024-01-15',
                    updated_at: '2024-01-20',
                    sections: [
                        {
                            id: 1,
                            name: 'Authentication',
                            description: 'User login, registration, and profile management screens',
                            screens: [
                                {
                                    id: 1,
                                    name: 'Login Screen',
                                    description: 'Clean and intuitive login interface with social media options',
                                    type: 'mobile',
                                    image_url: 'https://via.placeholder.com/300x600/3B82F6/FFFFFF?text=Login+Screen',
                                    status: 'completed',
                                    figma_link: 'https://www.figma.com/file/example/login',
                                    notes: 'Includes biometric authentication option'
                                },
                                {
                                    id: 2,
                                    name: 'Registration Screen',
                                    description: 'Multi-step registration process with validation',
                                    type: 'mobile',
                                    image_url: 'https://via.placeholder.com/300x600/10B981/FFFFFF?text=Register+Screen',
                                    status: 'in_progress',
                                    figma_link: 'https://www.figma.com/file/example/register',
                                    notes: 'Step 2 needs email verification flow'
                                }
                            ]
                        },
                        {
                            id: 2,
                            name: 'Product Catalog',
                            description: 'Product browsing, search, and filtering functionality',
                            screens: [
                                {
                                    id: 3,
                                    name: 'Product List',
                                    description: 'Grid layout with filtering and sorting options',
                                    type: 'mobile',
                                    image_url: 'https://via.placeholder.com/300x600/F59E0B/FFFFFF?text=Product+List',
                                    status: 'completed',
                                    figma_link: 'https://www.figma.com/file/example/products',
                                    notes: 'Infinite scroll implemented'
                                },
                                {
                                    id: 4,
                                    name: 'Product Detail',
                                    description: 'Detailed product view with images, specs, and reviews',
                                    type: 'mobile',
                                    image_url: 'https://via.placeholder.com/300x600/EF4444/FFFFFF?text=Product+Detail',
                                    status: 'completed',
                                    figma_link: 'https://www.figma.com/file/example/product-detail',
                                    notes: 'Image gallery needs optimization'
                                },
                                {
                                    id: 5,
                                    name: 'Desktop Product Grid',
                                    description: 'Responsive product grid for desktop users',
                                    type: 'desktop',
                                    image_url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Desktop+Grid',
                                    status: 'draft',
                                    figma_link: 'https://www.figma.com/file/example/desktop-grid',
                                    notes: 'Needs responsive breakpoints'
                                }
                            ]
                        },
                        {
                            id: 3,
                            name: 'Shopping Cart',
                            description: 'Cart management and checkout process',
                            screens: [
                                {
                                    id: 6,
                                    name: 'Cart View',
                                    description: 'Shopping cart with quantity controls and price summary',
                                    type: 'mobile',
                                    image_url: 'https://via.placeholder.com/300x600/06B6D4/FFFFFF?text=Cart+View',
                                    status: 'in_progress',
                                    figma_link: 'https://www.figma.com/file/example/cart',
                                    notes: 'Need to add save for later feature'
                                }
                            ]
                        }
                    ]
                }
                setProject(mockProject)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching project:', error)
                setIsLoading(false)
            }
        }

        fetchProject()
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
        if (project.logo_url) {
            return <img src={project.logo_url} alt={project.name} className="w-12 h-12 rounded-full object-cover border border-blue-100 shadow" />
        }
        const initials = project.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        return (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-lg shadow">
                {initials}
            </div>
        )
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
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
                            {project.figma_url && (
                                <a href={project.figma_url} target="_blank" rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
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
                            Screens
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
                    <div className="max-w-4xl">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Project Description</h2>
                            <p className="text-gray-700 leading-relaxed">{project.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Sections</span>
                                        <span className="font-medium">{project.sections.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Screens</span>
                                        <span className="font-medium">
                                            {project.sections.reduce((total, section) => total + section.screens.length, 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mobile Screens</span>
                                        <span className="font-medium">
                                            {project.sections.reduce((total, section) =>
                                                total + section.screens.filter(screen => screen.type === 'mobile').length, 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Desktop Screens</span>
                                        <span className="font-medium">
                                            {project.sections.reduce((total, section) =>
                                                total + section.screens.filter(screen => screen.type === 'desktop').length, 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Project created on {new Date(project.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Last updated on {new Date(project.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'screens' && (
                    <div className="max-w-6xl">
                        {project.sections.map((section) => (
                            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">{section.name}</h2>
                                        <p className="text-gray-600">{section.description}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">{section.screens.length} screens</span>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {section.screens.map((screen) => (
                                        <div key={screen.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${screen.type === 'mobile' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {screen.type === 'mobile' ? 'Mobile' : 'Desktop'}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(screen.status)}`}>
                                                    {getStatusLabel(screen.status)}
                                                </span>
                                            </div>

                                            <h3 className="font-semibold text-gray-900 mb-2">{screen.name}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{screen.description}</p>

                                            {screen.image_url && (
                                                <div className="mb-4">
                                                    <img
                                                        src={screen.image_url}
                                                        alt={screen.name}
                                                        className={`rounded-lg border border-gray-200 ${screen.type === 'mobile' ? 'w-full max-w-[200px] mx-auto' : 'w-full'
                                                            }`}
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                {screen.figma_link && (
                                                    <a
                                                        href={screen.figma_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        View in Figma →
                                                    </a>
                                                )}
                                                {screen.notes && (
                                                    <p className="text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                                                        <strong>Notes:</strong> {screen.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="max-w-4xl">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Project Links</h2>
                            <div className="space-y-4">
                                {project.figma_url && (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Figma Design</h3>
                                            <p className="text-sm text-gray-600">Main design file</p>
                                        </div>
                                        <a
                                            href={project.figma_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                        >
                                            Open
                                        </a>
                                    </div>
                                )}

                                {project.docs_url && (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Documentation</h3>
                                            <p className="text-sm text-gray-600">Project documentation and guides</p>
                                        </div>
                                        <a
                                            href={project.docs_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                                        >
                                            Open
                                        </a>
                                    </div>
                                )}

                                {project.live_url && (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Live Demo</h3>
                                            <p className="text-sm text-gray-600">Live version of the project</p>
                                        </div>
                                        <a
                                            href={project.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                                        >
                                            Open
                                        </a>
                                    </div>
                                )}

                                {project.other_url && (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Other Resources</h3>
                                            <p className="text-sm text-gray-600">Additional project resources</p>
                                        </div>
                                        <a
                                            href={project.other_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                                        >
                                            Open
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectDetailPage 