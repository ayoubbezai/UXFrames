import api from "../../utils/api";

export const categoriesServices ={


    async addCategory(name,description,id){
        try{    
            const response = await api.post(`/projects/${id}/categories`,{name,description})
            console.log(response?.data);
            return response.data

        }catch(e){
            console.log(e);
            return e
        }
    }

}