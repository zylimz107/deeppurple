import axios from "axios";

const API_BASE_URL = "http://localhost:8080/emotion"; // Adjust as per your backend setup

const API_MOD_URL = "http://localhost:8080/models";

// Create a new category
export const createCategory = async (modelId, name) => {
    return axios.post("http://localhost:8080/emotion/category", null, {
      params: {
        modelId,
        name,
      },
    });
  };
  
  // Get categories by model ID
  export const getCategoriesByModel = async (modelId) => {
    return axios.get("http://localhost:8080/emotion/category", {
      params: { modelId },
    });
  };
  
  // Update category
  export const updateCategory = async (id, name) => {
    return axios.put(`http://localhost:8080/emotion/category/${id}`, null, {
      params: { name },
    });
  };
  
  // Delete category
  export const deleteCategory = async (id) => {
    return axios.delete(`http://localhost:8080/emotion/category/${id}`);
  };

export const createWordAssociation = (word, emotionCategoryId) =>
  axios.post(`${API_BASE_URL}/word-association`, null, {
    params: { word, emotionCategoryId },
  });

export const deleteWordAssociation = (id) =>
  axios.delete(`${API_BASE_URL}/word-association/${id}`);

export const getAllModels = () => axios.get(API_MOD_URL);
export const createModel = (name) => axios.post(API_MOD_URL, null, { params: { name } });
export const deleteModel = (id) => axios.delete(`${API_MOD_URL}/${id}`);

// user login
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post("http://localhost:8080/users/login", {username, password});
        return response.data;
    } catch (error) {
        console.error("Error logging in", error.response?.data || error.message);
        throw error;
    }
}

// user register
export const registerUser = async (username, password) => {
    try{
        const response = await axios.post("http://localhost:8080/users/register", {username, password});
        return response.data;
    } catch (error) {
        console.error("Error registering", error.response?.data || error.message);
        throw error;
    }
}
