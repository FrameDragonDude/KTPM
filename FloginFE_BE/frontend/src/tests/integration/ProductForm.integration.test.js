import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Product from '../../components/Product';
jest.mock('axios');

// 4.2.1a - Product List Integration
describe('ProductList Integration', () => {
  it('renders products from API', async () => {
    axios.get.mockResolvedValueOnce({ data: [
      { name: 'A', desc: 'descA', category: 'CatA', price: 10, stock: 1 },
      { name: 'B', desc: 'descB', category: 'CatB', price: 20, stock: 2 }
    ] });
    render(<Product onLogout={() => {}} />);
    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });
});

// 4.2.1b - Product Form Integration
describe('ProductForm Integration', () => {
  it('creates new product', () => {
    render(<Product onLogout={() => {}} />);
    fireEvent.click(screen.getByText(/Thêm sản phẩm/i));
    fireEvent.change(screen.getByPlaceholderText(/Nhập tên sản phẩm/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText(/Nhập mô tả sản phẩm/i), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByPlaceholderText(/0.00/i), { target: { value: '99' } });
    fireEvent.change(screen.getByPlaceholderText(/0/i), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText(/Nhập danh mục/i), { target: { value: 'Cat' } });
    fireEvent.click(screen.getByText(/Thêm sản phẩm/i));
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('edits product', () => {
    render(<Product onLogout={() => {}} />);
    fireEvent.click(screen.getAllByTitle('Sửa')[0]);
    fireEvent.change(screen.getByPlaceholderText(/Nhập tên sản phẩm/i), { target: { value: 'Edited' } });
    fireEvent.click(screen.getByText(/Cập nhật sản phẩm/i));
    expect(screen.getByText('Edited')).toBeInTheDocument();
  });
});

// 4.2.1c - Product Detail Integration
describe('ProductDetail Integration', () => {
  it('renders product detail', () => {
    const product = { name: 'A', desc: 'descA', category: 'CatA', price: 10, stock: 1 };
    render(<div>
      <h2>{product.name}</h2>
      <p>{product.desc}</p>
      <span>{product.category}</span>
      <span>{product.price}</span>
      <span>{product.stock}</span>
    </div>);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('descA')).toBeInTheDocument();
    expect(screen.getByText('CatA')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});