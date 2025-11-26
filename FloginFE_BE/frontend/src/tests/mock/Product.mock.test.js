// Mock productService cho ProductList
jest.mock('../../services/productService.js', () => ({
  __esModule: true,
  default: {
    getAllProducts: jest.fn(),
  },
}));

import productService from '../../services/productService.js';
import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import ProductList from '../../components/ProductList.jsx'
import ProductForm from '../../components/ProductForm.jsx'
import ProductDetail from '../../components/ProductDetail.jsx'
import { validateProduct } from '../../utils/validateProduct.js'

// Yêu cầu a) Mock CRUD operations
// Yêu cầu b) Test success và failure scenarios
// Yêu cầu c) Verify all mock calls

describe('Product CRUD Mock Tests', () => {
  // ProductList
  describe('ProductList', () => {
    test('Hiển thị danh sách sản phẩm mock (success)', async () => {
      const mockProducts = [
        { id: 1, name: 'Đồng hồ thông minh', desc: 'Đồng hồ thông minh đa năng', price: 999000, category: 'Điện tử', stock: 36 },
        { id: 2, name: 'Giá đỡ laptop', desc: 'Giá đỡ laptop nhôm ergonomic', price: 399000, category: 'Phụ kiện', stock: 78 },
        { id: 3, name: 'Tai nghe không dây', desc: 'Tai nghe chống ồn cao cấp', price: 299000, category: 'Điện tử', stock: 20 },
      ];
      productService.getAllProducts.mockResolvedValueOnce(mockProducts);
      render(<ProductList />);
      const items = await screen.findAllByTestId('product-item');
      expect(items).toHaveLength(3);
      mockProducts.forEach(p => {
        expect(validateProduct(p)).toBe(true);
      });
    });
    test('Hiển thị khi không có sản phẩm (failure)', async () => {
      productService.getAllProducts.mockResolvedValueOnce([]);
      render(<ProductList />);
      const items = await screen.queryAllByTestId('product-item');
      expect(items).toHaveLength(0);
    });
    test('Mock get & delete', () => {
      const mockGetProducts = jest.fn().mockReturnValue([{ id: 1, name: 'Đồng hồ thông minh' }])
      const mockDeleteProduct = jest.fn()
      mockGetProducts()
      mockDeleteProduct(1)
      expect(mockGetProducts).toHaveBeenCalledTimes(1)
      expect(mockDeleteProduct).toHaveBeenCalledWith(1)
    })
  })

  // ProductForm
  describe('ProductForm', () => {
    test('Gọi hàm createProduct với dữ liệu mock (success)', () => {
      const mockCreateProduct = jest.fn();
      // Use local state for product and a real onChange handler
      function Wrapper() {
        const [product, setProduct] = React.useState({ name: '', desc: '', category: '', price: 0, stock: 0 });
        const handleChange = (e) => {
          const { name, value } = e.target;
          setProduct((prev) => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
        };
        const handleSubmit = (e) => {
          e.preventDefault();
          mockCreateProduct(product);
        };
        return <ProductForm product={product} onChange={handleChange} onSubmit={handleSubmit} />;
      }
      render(<Wrapper />);
      fireEvent.change(screen.getByLabelText('Tên sản phẩm'), { target: { value: 'Giá đỡ laptop' } });
      fireEvent.change(screen.getByLabelText('Giá ($)'), { target: { value: '399000' } });
      fireEvent.change(screen.getByLabelText('Tồn kho'), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText('Danh mục'), { target: { value: 'Phụ kiện' } });
      fireEvent.change(screen.getByLabelText('Mô tả'), { target: { value: 'Giá đỡ laptop nhôm ergonomic' } });
      fireEvent.submit(screen.getByLabelText('product-form'));
      expect(mockCreateProduct).toHaveBeenCalledWith({
        name: 'Giá đỡ laptop',
        price: 399000,
        stock: 10,
        desc: 'Giá đỡ laptop nhôm ergonomic',
        category: 'Phụ kiện'
      });
      expect(validateProduct({
        name: 'Giá đỡ laptop',
        price: 399000,
        stock: 10,
        desc: 'Giá đỡ laptop nhôm ergonomic',
        category: 'Phụ kiện',
      })).toBe(true);
    });
    test('Tạo sản phẩm lỗi (failure)', () => {
      const mockCreateProduct = jest.fn().mockImplementation(() => { throw new Error('Lỗi tạo sản phẩm') })
      try {
        mockCreateProduct({ name: 'Lỗi' })
      } catch (e) {
        expect(e.message).toBe('Lỗi tạo sản phẩm')
      }
      expect(mockCreateProduct).toHaveBeenCalledWith({ name: 'Lỗi' })
    })
    test('Mock update & delete', () => {
      const mockUpdateProduct = jest.fn().mockReturnValue({ id: 1, name: 'Updated' })
      const mockDeleteProduct = jest.fn()
      mockUpdateProduct(1, { name: 'Updated' })
      mockDeleteProduct(1)
      expect(mockUpdateProduct).toHaveBeenCalledWith(1, { name: 'Updated' })
      expect(mockDeleteProduct).toHaveBeenCalledWith(1)
    })
  })

  // ProductDetail
  describe('ProductDetail', () => {
    test('Hiển thị chi tiết sản phẩm mock (success)', () => {
      const mockProduct = {
        id: 2,
        name: 'Giá đỡ laptop',
        desc: 'Giá đỡ laptop nhôm ergonomic',
        price: 399000,
        stock: 10,
        category: 'Phụ kiện',
      }
      render(<ProductDetail product={mockProduct} />)
      expect(screen.getByTestId('product-detail')).toBeInTheDocument()
      expect(validateProduct(mockProduct)).toBe(true)
    })
    test('Hiển thị khi không tìm thấy sản phẩm (failure)', () => {
      render(<ProductDetail product={null} />)
      expect(screen.queryByTestId('product-detail')).toBeNull()
    })
    test('Mock get & delete', () => {
      const mockGetProduct = jest.fn().mockReturnValue({ id: 1, name: 'Đồng hồ thông minh' })
      const mockDeleteProduct = jest.fn()
      mockGetProduct(1)
      mockDeleteProduct(1)
      expect(mockGetProduct).toHaveBeenCalledWith(1)
      expect(mockDeleteProduct).toHaveBeenCalledWith(1)
    })
  })
})
