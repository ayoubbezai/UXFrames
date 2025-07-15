import api from "../../utils/api"

export const screenServices = {
    // Get all screens for a project
    getScreensByProject: async (projectId) => {
        try {
            const response = await api.get(`/screens?project_id=${projectId}`)
            return response.data
        } catch (error) {
            console.error('Error fetching screens:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch screens',
                data: []
            }
        }
    },

    // Get a single screen by ID
    getScreenById: async (screenId) => {
        try {
            const response = await api.get(`/screens/${screenId}`)
            return response.data
        } catch (error) {
            console.error('Error fetching screen:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch screen',
                data: null
            }
        }
    },

    // Add a new screen
    addScreen: async (screenData) => {
        try {
            const formData = new FormData()
            
            // Add basic fields
            formData.append('project_id', screenData.project_id)
            formData.append('category_id', screenData.category_id)
            formData.append('title', screenData.title)
            formData.append('type', screenData.type)
            formData.append('purpose', screenData.purpose)
            
            // Add JSON fields - they should already be JSON strings from the modal
            if (screenData.actions) {
                formData.append('actions', screenData.actions)
            }
            if (screenData.inputs) {
                formData.append('inputs', screenData.inputs)
            }
            if (screenData.static_content) {
                formData.append('static_content', screenData.static_content)
            }
            if (screenData.navigations) {
                formData.append('navigations', screenData.navigations)
            }
            if (screenData.states) {
                formData.append('states', screenData.states)
            }
            if (screenData.data) {
                formData.append('data', screenData.data)
            }
            
            // Add image if provided
            if (screenData.image) {
                formData.append('image', screenData.image)
            }

            const response = await api.post('/screens', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error adding screen:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add screen',
                data: null
            }
        }
    },

    // Update a screen
    updateScreen: async (screenId, screenData) => {
        try {
            const formData = new FormData()
            
            // Add basic fields
            if (screenData.title) formData.append('title', screenData.title)
            if (screenData.type) formData.append('type', screenData.type)
            if (screenData.purpose) formData.append('purpose', screenData.purpose)
            if (screenData.category_id) formData.append('category_id', screenData.category_id)
            
            // Add JSON fields - they should already be JSON strings
            if (screenData.actions) {
                formData.append('actions', screenData.actions)
            }
            if (screenData.inputs) {
                formData.append('inputs', screenData.inputs)
            }
            if (screenData.static_content) {
                formData.append('static_content', screenData.static_content)
            }
            if (screenData.navigations) {
                formData.append('navigations', screenData.navigations)
            }
            if (screenData.states) {
                formData.append('states', screenData.states)
            }
            if (screenData.data) {
                formData.append('data', screenData.data)
            }
            
            // Add image if provided
            if (screenData.image) {
                formData.append('image', screenData.image)
            }

            // Laravel compatibility: use POST with _method=PUT for file uploads
            formData.append('_method', 'PUT');
            const response = await api.post(`/screens/${screenId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating screen:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update screen',
                data: null
            }
        }
    },

    // Delete a screen
    deleteScreen: async (screenId) => {
        try {
            const response = await api.delete(`/screens/${screenId}`)
            return response.data
        } catch (error) {
            console.error('Error deleting screen:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete screen',
                data: null
            }
        }
    }
}
