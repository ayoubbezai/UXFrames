import api from "../../utils/api";

export const projectsServices = {
    async getAllProjects() {
        try {    
            const response = await api.get("/projects")
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return e
        }
    },

    async getProjectById(projectId) {
        try {    
            const response = await api.get(`/projects/${projectId}`)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: 'Failed to fetch project',
                data: null
            }
        }
    },

    async addProjects(formData) {
        try {    
            const response = await api.post("/projects", formData)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return e
        }
    },

    async updateProject(projectId, formData) {
        try {    
            const response = await api.post(`/projects/${projectId}`, formData)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: 'Failed to update project',
                data: null
            }
        }
    },

    async deleteProject(projectId) {
        try {    
            const response = await api.delete(`/projects/${projectId}`)
            console.log(response?.data);
            return response.data
        } catch(e) {
            console.log(e);
            return {
                success: false,
                message: 'Failed to delete project',
                data: null
            }
        }
    }
}