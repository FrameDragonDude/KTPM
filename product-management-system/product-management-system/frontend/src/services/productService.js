/**
 * Product Service - Xử lý tất cả API calls liên quan đến Product
 * Sử dụng axios để gọi REST API của backend
 */
import axios from 'axios';

// Base URL của Product API (backend chạy ở port 8080)
const API_URL = 'http://localhost:8080/api/products';

/**
 * Product Service Object chứa các methods để tương tác với Product API
 * Tất cả methods đều là async và return Promise
 */
const productService = {
  /**
   * Lấy danh sách tất cả sản phẩm
   * GET /api/products
   * 
   * @returns {Promise<Array>} Promise resolve với mảng products
   * @throws {Error} Nếu API call thất bại
   */
  getAllProducts: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết 1 sản phẩm theo ID
   * GET /api/products/:id
   * 
   * @param {number} id - ID của sản phẩm cần lấy
   * @returns {Promise<Object>} Promise resolve với product object
   * @throws {Error} Nếu không tìm thấy hoặc API call thất bại
   */
  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Tạo sản phẩm mới
   * POST /api/products
   * 
   * @param {Object} product - Object chứa thông tin sản phẩm (name, description, price, quantity)
   * @returns {Promise<Object>} Promise resolve với product vừa tạo (có ID)
   * @throws {Error} Nếu validation fail hoặc API call thất bại
   */
  createProduct: async (product) => {
    const response = await axios.post(API_URL, product);
    return response.data;
  },

  /**
   * Cập nhật thông tin sản phẩm
   * PUT /api/products/:id
   * 
   * @param {number} id - ID của sản phẩm cần update
   * @param {Object} product - Object chứa thông tin mới
   * @returns {Promise<Object>} Promise resolve với product đã update
   * @throws {Error} Nếu không tìm thấy, validation fail, hoặc API call thất bại
   */
  updateProduct: async (id, product) => {
    const response = await axios.put(`${API_URL}/${id}`, product);
    return response.data;
  },

  /**
   * Xóa sản phẩm theo ID
   * DELETE /api/products/:id
   * 
   * @param {number} id - ID của sản phẩm cần xóa
   * @returns {Promise<void>} Promise resolve khi xóa thành công
   * @throws {Error} Nếu không tìm thấy hoặc API call thất bại
   */
  deleteProduct: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default productService;
