import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../../components/ProductList';
import productService from '../../services/productService';

// Mock productService
jest.mock('../../services/productService');

describe('ProductList Integration Tests', () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', description: 'Dell laptop', price: 1500.00, quantity: 10 },
    { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 20.00, quantity: 50 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Tao san pham moi thanh cong', async () => {
    // Setup mock
    productService.getAllProducts.mockResolvedValue(mockProducts);

    // Render component
    render(<ProductList />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByTestId('product-table')).toBeInTheDocument();
    });

    // Verify products are displayed
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
  });

  test('Hien thi loading khi dang tai du lieu', () => {
    // Setup mock with delay
    productService.getAllProducts.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockProducts), 100))
    );

    render(<ProductList />);

    // Check loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('Hien thi thong bao loi khi API that bai', async () => {
    // Setup mock to reject
    productService.getAllProducts.mockRejectedValue(new Error('API Error'));

    render(<ProductList />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    });
  });

  test('Hien thi thong bao khi khong co san pham', async () => {
    // Setup mock with empty array
    productService.getAllProducts.mockResolvedValue([]);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-message')).toBeInTheDocument();
      expect(screen.getByText('No products available')).toBeInTheDocument();
    });
  });

  test('Xoa san pham thanh cong', async () => {
    // Setup mocks
    productService.getAllProducts
      .mockResolvedValueOnce(mockProducts)
      .mockResolvedValueOnce([mockProducts[1]]); // After delete
    productService.deleteProduct.mockResolvedValue();

    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<ProductList />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    // Click delete button
    const deleteBtn = screen.getByTestId('delete-btn-1');
    fireEvent.click(deleteBtn);

    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this product?');

    // Verify delete service was called
    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    });

    // Verify product list was reloaded
    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalledTimes(2);
    });
  });

  test('Huy xoa san pham khi nguoi dung khong xac nhan', async () => {
    productService.getAllProducts.mockResolvedValue(mockProducts);
    productService.deleteProduct.mockResolvedValue();

    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTestId('delete-btn-1');
    fireEvent.click(deleteBtn);

    // Verify delete service was NOT called
    expect(productService.deleteProduct).not.toHaveBeenCalled();
  });
});
