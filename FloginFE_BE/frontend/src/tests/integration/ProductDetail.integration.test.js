import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom';

// Mock productService
jest.mock('../../services/productService.js', () => ({
  getProductById: jest.fn(),
}))

import { getProductById } from '../../services/productService.js'
import ProductDetail from '../../components/ProductDetail.jsx'
import { validateProduct } from '../../utils/validateProduct.js'

describe('ProductDetail Integration', () => {
  afterEach(() => jest.clearAllMocks())

  test('Hiển thị chi tiết sản phẩm khi load thành công', async () => {
    getProductById.mockResolvedValueOnce({
      id: 1,
      name: 'Đồng hồ thông minh',
      desc: 'Theo dõi sức khỏe với cảm biến nhịp tim',
      price: 990000,
      stock: 36,
      category: 'Điện tử',
    })

    render(<ProductDetail product={{
      id: 1,
      name: 'Đồng hồ thông minh',
      desc: 'Theo dõi sức khỏe với cảm biến nhịp tim',
      price: 990000,
      stock: 36,
      category: 'Điện tử',
    }} />)

    await waitFor(() => {
      expect(screen.getByTestId('product-detail')).toBeInTheDocument()
      expect(screen.getByText('Đồng hồ thông minh')).toBeInTheDocument()
      expect(screen.getByText(/990000/)).toBeInTheDocument()
      const result = validateProduct({
        id: 1,
        name: 'Đồng hồ thông minh',
        desc: 'Theo dõi sức khỏe với cảm biến nhịp tim',
        price: 990000,
        stock: 36,
        category: 'Điện tử',
      })
      expect(result).toBe(true)
    })
  })

  test('Hiển thị lỗi khi API lỗi', async () => {
    getProductById.mockRejectedValueOnce(new Error('Not found'))

    render(<ProductDetail id={99} />)

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/không tìm thấy sản phẩm|có lỗi xảy ra/i)
    })
  })
})