import { render, screen, waitFor } from '@testing-library/react';
import ProductDetail from '../../components/ProductDetail';
import productService from '../../services/productService';

// Mock productService
jest.mock('../../services/productService');

describe('ProductDetail Integration Tests', () => {
  const mockProduct = {
    id: 1,
    name: 'Laptop Dell',
    description: 'High performance laptop',
    price: 1500.00,
    quantity: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Hien thi chi tiet san pham thanh cong', async () => {
    productService.getProductById.mockResolvedValue(mockProduct);

    render(<ProductDetail productId={1} />);

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByTestId('product-detail')).toBeInTheDocument();
    });

    // Verify all fields are displayed
    expect(screen.getByTestId('product-id')).toHaveTextContent('1');
    expect(screen.getByTestId('product-name')).toHaveTextContent('Laptop Dell');
    expect(screen.getByTestId('product-description')).toHaveTextContent('High performance laptop');
    expect(screen.getByTestId('product-price')).toHaveTextContent('$1500');
    expect(screen.getByTestId('product-quantity')).toHaveTextContent('10');

    // Verify service was called with correct ID
    expect(productService.getProductById).toHaveBeenCalledWith(1);
  });

  test('Hien thi loading khi dang tai du lieu', () => {
    productService.getProductById.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockProduct), 100))
    );

    render(<ProductDetail productId={1} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('Hien thi thong bao loi khi API that bai', async () => {
    productService.getProductById.mockRejectedValue(new Error('API Error'));

    render(<ProductDetail productId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load product details')).toBeInTheDocument();
    });

    // Verify service was called
    expect(productService.getProductById).toHaveBeenCalledWith(1);
  });

  test('Hien thi thong bao khi khong co product ID', () => {
    render(<ProductDetail />);

    expect(screen.getByTestId('no-id')).toBeInTheDocument();
    expect(screen.getByText('No product ID provided')).toBeInTheDocument();

    // Service should not be called
    expect(productService.getProductById).not.toHaveBeenCalled();
  });

  test('Hien thi N/A khi description null', async () => {
    const productWithoutDesc = {
      ...mockProduct,
      description: null
    };
    productService.getProductById.mockResolvedValue(productWithoutDesc);

    render(<ProductDetail productId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-description')).toHaveTextContent('N/A');
    });
  });

  test('Reload khi productId thay doi', async () => {
    productService.getProductById
      .mockResolvedValueOnce(mockProduct)
      .mockResolvedValueOnce({ ...mockProduct, id: 2, name: 'Different Product' });

    const { rerender } = render(<ProductDetail productId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-name')).toHaveTextContent('Laptop Dell');
    });

    // Change productId
    rerender(<ProductDetail productId={2} />);

    await waitFor(() => {
      expect(screen.getByTestId('product-name')).toHaveTextContent('Different Product');
    });

    // Verify service was called twice
    expect(productService.getProductById).toHaveBeenCalledTimes(2);
    expect(productService.getProductById).toHaveBeenNthCalledWith(1, 1);
    expect(productService.getProductById).toHaveBeenNthCalledWith(2, 2);
  });
});
