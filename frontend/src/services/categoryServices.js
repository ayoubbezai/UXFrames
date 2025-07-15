import api from "../../utils/api";

export const categoryServices = {
    // Get all categories for a project
    async getCategoriesByProject(projectId) {
        try {
            const response = await api.get(`/categories?project_id=${projectId}`)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: 'Failed to fetch categories',
                data: []
            }
        }
    },

    // Add a new category
    async addCategory(formData) {
        try {
            const response = await api.post("/categories", formData)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: 'Failed to add category',
                data: null
            }
        }
    },

    // Get a single category by ID
    async getCategoryById(categoryId) {
        try {
            const response = await api.get(`/categories/${categoryId}`)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: 'Failed to fetch category',
                data: null
            }
        }
    },

    // Update a category
    async updateCategory(categoryId, formData) {
        try {
            const response = await api.put(`/categories/${categoryId}`, formData)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: 'Failed to update category',
                data: null
            }
        }
    },

    // Delete a category
    async deleteCategory(categoryId) {
        try {
            const response = await api.delete(`/categories/${categoryId}`)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: 'Failed to delete category',
                data: null
            }
        }
    }
} 