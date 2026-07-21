import axiosClient from "../api/axiosClient";

const BASE_URL="/api/services";

const serviceCatalogService={

  async getAllServices(){
    const response=await axiosClient.get(`${BASE_URL}/all`);
    return response.data.data;
  },

  async getActiveServices(){
    const response=await axiosClient.get(`${BASE_URL}/active`);
    return response.data.data;
  },

  async addService(service){
    const response=await axiosClient.post(BASE_URL,service);
    return response.data.data;
  },

  async updateService(service){
    const response=await axiosClient.put(BASE_URL,service);
    return response.data.data;
  },

  async deleteService(id){
    const response=await axiosClient.delete(`${BASE_URL}/${id}`);
    return response.data.data;
  }

};

export default serviceCatalogService;