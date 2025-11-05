// E2E test sử dụng Page Object Model cho Product (Cypress)
import ProductPage from './ProductPage';

describe('Product E2E', () => {
  const page = new ProductPage();

  it('should add a new product', () => {
    page.visit();
    page.clickAddNew();
    page.fillProductForm({ name: 'Test', price: '100', quantity: '5' });
    page.submitForm();
    page.getSuccessMessage().should('exist');
    page.getProductInList('Test').should('exist');
  });
});
