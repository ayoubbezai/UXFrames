import React, { useState, useEffect } from 'react'
import { screenServices } from '../services/screenServices'
import { categoryServices } from '../services/categoryServices'
import { toast } from 'react-hot-toast'

const AddScreenModal = ({ isOpen, onClose, projectId, refresh }) => {
    const [formData, setFormData] = useState({
        project_id: projectId,
        category_id: '',
        title: '',
        type: 'mobile',
        purpose: '',
        actions: [],
        inputs: [],
        static_content: [],
        navigations: [],
        states: [],
        data: {},
        image: null
    })
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)

    // Fetch categories when modal opens
    useEffect(() => {
        if (isOpen && projectId) {
            fetchCategories()
        }
    }, [isOpen, projectId])

    const fetchCategories = async () => {
        setIsLoadingCategories(true)
        try {
            const response = await categoryServices.getCategoriesByProject(projectId)
            if (response.success) {
                setCategories(response.data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setIsLoadingCategories(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'image') {
            setFormData(prev => ({
                ...prev,
                image: files[0] || null
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    // Array field handlers
    const addArrayItem = (fieldName, defaultItem = {}) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: [...prev[fieldName], defaultItem]
        }))
    }

    const removeArrayItem = (fieldName, index) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: prev[fieldName].filter((_, i) => i !== index)
        }))
    }

    const updateArrayItem = (fieldName, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: prev[fieldName].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const updateStringArrayItem = (fieldName, index, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: prev[fieldName].map((item, i) =>
                i === index ? value : item
            )
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Prepare the data for submission
            const submitData = {
                ...formData,
                // Ensure arrays are properly converted to JSON strings
                actions: formData.actions.length > 0 ? JSON.stringify(formData.actions) : '[]',
                inputs: formData.inputs.length > 0 ? JSON.stringify(formData.inputs) : '[]',
                static_content: formData.static_content.length > 0 ? JSON.stringify(formData.static_content) : '[]',
                navigations: formData.navigations.length > 0 ? JSON.stringify(formData.navigations) : '[]',
                states: formData.states.length > 0 ? JSON.stringify(formData.states) : '[]',
                data: Object.keys(formData.data).length > 0 ? JSON.stringify(formData.data) : '{}'
            }

            console.log('Screen Data:', submitData)
            console.log('Project ID:', projectId)
            console.log('Category ID:', submitData.category_id)

            const response = await screenServices.addScreen(submitData)

            if (response.success) {
                toast.success('Screen created successfully!')
                // Reset form
                setFormData({
                    project_id: projectId,
                    category_id: '',
                    title: '',
                    type: 'mobile',
                    purpose: '',
                    actions: [],
                    inputs: [],
                    static_content: [],
                    navigations: [],
                    states: [],
                    data: {},
                    image: null
                })
                onClose()
                if (refresh) refresh()
            } else {
                console.error('Screen creation failed:', response)
                toast.error(response.message || 'Failed to create screen')
            }
        } catch (error) {
            console.error('Error creating screen:', error)
            toast.error('An error occurred while creating the screen')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">Add New Screen</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Screen Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Enter screen title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="mobile">Mobile</option>
                                    <option value="web">Web</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                disabled={isLoading || isLoadingCategories}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {isLoadingCategories && (
                                <p className="text-xs text-gray-500 mt-1">Loading categories...</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Purpose
                            </label>
                            <textarea
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Describe the screen's purpose"
                            />
                        </div>

                        {/* Screen Preview */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Screen Preview</h3>
                            <div className={`bg-gray-100 rounded-lg p-4 ${formData.type === 'mobile'
                                ? 'w-48 h-72 mx-auto'
                                : 'w-full h-48'
                                }`}>
                                {formData.image ? (
                                    <div className={`${formData.type === 'mobile'
                                        ? 'w-40 h-64 mx-auto'
                                        : 'w-full h-40'
                                        }`}>
                                        <img
                                            src={URL.createObjectURL(formData.image)}
                                            alt="Screen preview"
                                            className="w-full h-full object-contain rounded-lg border border-gray-200"
                                        />
                                    </div>
                                ) : (
                                    <div className={`bg-white rounded-lg border border-gray-200 ${formData.type === 'mobile'
                                        ? 'w-40 h-64 mx-auto'
                                        : 'w-full h-40'
                                        }`}>
                                        <div className="h-full p-4 flex flex-col justify-center">
                                            <div className="text-center">
                                                <h4 className="font-semibold text-gray-900 mb-2">{formData.title || 'Screen Title'}</h4>
                                                <p className="text-sm text-gray-600">{formData.purpose || 'Screen description will appear here'}</p>
                                                <div className="mt-4 space-y-2">
                                                    {formData.inputs.length > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            {formData.inputs.length} input{formData.inputs.length !== 1 ? 's' : ''}
                                                        </div>
                                                    )}
                                                    {formData.actions.length > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            {formData.actions.length} action{formData.actions.length !== 1 ? 's' : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('actions', { label: '', event: '', target: '' })}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    + Add Action
                                </button>
                            </div>
                            {formData.actions.map((action, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Action {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('actions', index)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Label"
                                            value={action.label || ''}
                                            onChange={(e) => updateArrayItem('actions', index, 'label', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Event"
                                            value={action.event || ''}
                                            onChange={(e) => updateArrayItem('actions', index, 'event', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Target"
                                            value={action.target || ''}
                                            onChange={(e) => updateArrayItem('actions', index, 'target', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inputs Section */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Inputs</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('inputs', { label: '', type: 'text', required: false })}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                >
                                    + Add Input
                                </button>
                            </div>
                            {formData.inputs.map((input, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Input {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('inputs', index)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Label"
                                            value={input.label || ''}
                                            onChange={(e) => updateArrayItem('inputs', index, 'label', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <select
                                            value={input.type || 'text'}
                                            onChange={(e) => updateArrayItem('inputs', index, 'type', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="password">Password</option>
                                            <option value="number">Number</option>
                                            <option value="tel">Phone</option>
                                            <option value="textarea">Textarea</option>
                                            <option value="select">Select</option>
                                            <option value="toggle">Toggle</option>
                                        </select>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={input.required || false}
                                                onChange={(e) => updateArrayItem('inputs', index, 'required', e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700">Required</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Static Content Section */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Static Content</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('static_content', '')}
                                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                                >
                                    + Add Content
                                </button>
                            </div>
                            {formData.static_content.map((content, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Content {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('static_content', index)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter content"
                                        value={content}
                                        onChange={(e) => updateStringArrayItem('static_content', index, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Navigations Section */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Navigations</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('navigations', { label: '', target: '' })}
                                    className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition"
                                >
                                    + Add Navigation
                                </button>
                            </div>
                            {formData.navigations.map((nav, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Navigation {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('navigations', index)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Label"
                                            value={nav.label || ''}
                                            onChange={(e) => updateArrayItem('navigations', index, 'label', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Target"
                                            value={nav.target || ''}
                                            onChange={(e) => updateArrayItem('navigations', index, 'target', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* States Section */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">States</h3>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('states', '')}
                                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                >
                                    + Add State
                                </button>
                            </div>
                            {formData.states.map((state, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">State {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('states', index)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter state name"
                                        value={state}
                                        onChange={(e) => updateStringArrayItem('states', index, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Screen Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Upload an image file (PNG, JPG, GIF)</p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : (
                            'Create Screen'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddScreenModal 