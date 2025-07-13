import api from "../../utils/api";

export const projectsServices ={
    async getAllProjects(){
        try{    
            const response = await api.get("/projects")
            console.log(response?.data);
            return response.data

        }catch(e){
            console.log(e);
            return e
        }
    },

    async addProjects(formData){
        try{    
            const response = await api.post("/projects",formData)
            console.log(response?.data);
            return response.data

        }catch(e){
            console.log(e);
            return e
        }
    }

}