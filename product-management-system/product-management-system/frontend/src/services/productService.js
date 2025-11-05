import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

const productService = {
  // Lấy tất cả sản phẩm
  getAllProducts: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Tạo sản phẩm mới
  createProduct: async (product) => {
    const response = await axios.post(API_URL, product);
    return response.data;
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, product) => {
    const response = await axios.put(`${API_URL}/${id}`, product);
    return response.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default productService;
