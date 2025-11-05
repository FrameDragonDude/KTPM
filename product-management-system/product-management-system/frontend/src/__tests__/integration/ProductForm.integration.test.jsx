import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductForm from '../../components/ProductForm';
import productService from '../../services/productService';

// Mock productService
jest.mock('../../services/productService');

describe('ProductForm Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Tao san pham moi voi du lieu hop le', async () => {
    const mockOnSuccess = jest.fn();
    productService.createProduct.mockResolvedValue({
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      quantity: 5
    });

    render(<ProductForm onSuccess={mockOnSuccess} />);

    // Fill form
    await userEvent.type(screen.getByTestId('name-input'), 'Test Product');
    await userEvent.type(screen.getByTestId('description-input'), 'Test Description');
    await userEvent.type(screen.getByTestId('price-input'), '100');
    await userEvent.type(screen.getByTestId('quantity-input'), '5');

    // Submit form
    fireEvent.click(screen.getByTestId('submit-btn'));

    // Wait for service call
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 5
      });
    });

    // Verify success callback
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  test('Cap nhat san pham da ton tai', async () => {
    const mockOnSuccess = jest.fn();
    const existingProduct = {
      id: 1,
      name: 'Existing Product',
      description: 'Old description',
      price: 50,
      quantity: 10
    };

    productService.getProductById.mockResolvedValue(existingProduct);
    productService.updateProduct.mockResolvedValue({
      ...existingProduct,
      name: 'Updated Product'
    });

    render(<ProductForm productId={1} onSuccess={mockOnSuccess} />);

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByTestId('name-input')).toHaveValue('Existing Product');
    });

    // Update name
    const nameInput = screen.getByTestId('name-input');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Product');

    // Submit form
    fireEvent.click(screen.getByTestId('submit-btn'));

    // Wait for update service call
    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith(1, {
        name: 'Updated Product',
        description: 'Old description',
        price: 50,
        quantity: 10
      });
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  test('Hien thi loi validation khi ten qua ngan', async () => {
    render(<ProductForm />);

    // Enter short name
    await userEvent.type(screen.getByTestId('name-input'), 'AB');
    await userEvent.type(screen.getByTestId('price-input'), '100');

    // Submit form
    fireEvent.click(screen.getByTestId('submit-btn'));

    // Check validation error
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
    });

    // Service should not be called
    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  test('Hien thi loi validation khi gia khong hop le', async () => {
    render(<ProductForm />);

    await userEvent.type(screen.getByTestId('name-input'), 'Valid Name');
    await userEvent.type(screen.getByTestId('price-input'), '0');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('price-error')).toBeInTheDocument();
      expect(screen.getByText('Price must be greater than 0')).toBeInTheDocument();
    });

    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  test('Hien thi loi validation khi so luong am', async () => {
    render(<ProductForm />);

    await userEvent.type(screen.getByTestId('name-input'), 'Valid Name');
    await userEvent.type(screen.getByTestId('price-input'), '100');
    await userEvent.type(screen.getByTestId('quantity-input'), '-5');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('quantity-error')).toBeInTheDocument();
      expect(screen.getByText('Quantity cannot be negative')).toBeInTheDocument();
    });

    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  test('Hien thi thong bao loi khi API that bai', async () => {
    productService.createProduct.mockRejectedValue(new Error('API Error'));

    render(<ProductForm />);

    await userEvent.type(screen.getByTestId('name-input'), 'Test Product');
    await userEvent.type(screen.getByTestId('price-input'), '100');
    await userEvent.type(screen.getByTestId('quantity-input'), '5');

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText('Failed to save product')).toBeInTheDocument();
    });
  });

  test('Hien thi loading khi dang tai san pham de chinh sua', () => {
    productService.getProductById.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({}), 100))
    );

    render(<ProductForm productId={1} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
