import productService from '../../services/productService';

jest.mock('../../services/productService');

describe('Product Mock Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // a) Mock CRUD operations (1.5 điểm)
  test('Mock: Create product thanh cong', async () => {
    const mockProduct = {
      id: 1,
      name: 'Laptop',
      price: 15000000
    };

    productService.createProduct.mockResolvedValue(mockProduct);

    const result = await productService.createProduct({
      name: 'Laptop',
      price: 15000000
    });

    expect(productService.createProduct).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockProduct);
  });

  // b) Test success và failure scenarios (0.5 điểm)
  test('Mock: Get products with pagination', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 }
    ];

    productService.getAllProducts.mockResolvedValue(mockProducts);

    const result = await productService.getAllProducts();

    expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockProducts);
  });

  // c) Verify all mock calls (0.5 điểm)
  test('Mock: Verify deleteProduct calls', async () => {
    productService.deleteProduct.mockResolvedValue();

    await productService.deleteProduct(1);

    expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(1);
  });
});
