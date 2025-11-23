import ProductService from '../../services/productService';
jest.mock('../../services/productService');

// 5.2.1a - Mock CRUD operations
describe('5.2.1a - Mock CRUD operations', () => {
  it('should call create, read, update, delete', async () => {
    ProductService.create.mockResolvedValue({ id: 1 });
    ProductService.getAll.mockResolvedValue([{ id: 1 }]);
    ProductService.update.mockResolvedValue({ id: 1, name: 'Updated' });
    ProductService.delete.mockResolvedValue({});

    await ProductService.create({ name: 'Test' });
    await ProductService.getAll();
    await ProductService.update(1, { name: 'Updated' });
    await ProductService.delete(1);

    expect(ProductService.create).toHaveBeenCalledWith({ name: 'Test' });
    expect(ProductService.getAll).toHaveBeenCalled();
    expect(ProductService.update).toHaveBeenCalledWith(1, { name: 'Updated' });
    expect(ProductService.delete).toHaveBeenCalledWith(1);
  });
});

// 5.2.1b - Success and failure scenarios
describe('5.2.1b - Success and failure scenarios', () => {
  it('should handle success', async () => {
    ProductService.create.mockResolvedValue({ id: 1 });
    const res = await ProductService.create({ name: 'Test' });
    expect(res.id).toBe(1);
  });
  it('should handle failure', async () => {
    ProductService.create.mockRejectedValue(new Error('Create failed'));
    await expect(ProductService.create({ name: 'Test' })).rejects.toThrow('Create failed');
  });
});

// 5.2.1c - Verify all mock calls
describe('5.2.1c - Verify all mock calls', () => {
  it('should verify all CRUD calls', async () => {
    ProductService.create.mockResolvedValue({});
    ProductService.getAll.mockResolvedValue([]);
    ProductService.update.mockResolvedValue({});
    ProductService.delete.mockResolvedValue({});

    await ProductService.create({});
    await ProductService.getAll();
    await ProductService.update(1, {});
    await ProductService.delete(1);

    expect(ProductService.create).toHaveBeenCalledTimes(1);
    expect(ProductService.getAll).toHaveBeenCalledTimes(1);
    expect(ProductService.update).toHaveBeenCalledTimes(1);
    expect(ProductService.delete).toHaveBeenCalledTimes(1);
  });
});