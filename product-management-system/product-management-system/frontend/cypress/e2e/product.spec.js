// E2E Test Scenarios cho Product (Câu 6.2.2 - 2.5 điểm)
// Viết automated tests cho CRUD operations:
// a) Test Create product (0.5 điểm)
// b) Test Read/List products (0.5 điểm)
// c) Test Update product (0.5 điểm)
// d) Test Delete product (0.5 điểm)
// e) Test Search/Filter functionality (0.5 điểm)

import ProductPage from '../support/ProductPage';

describe('Product E2E Tests', () => {
  const productPage = new ProductPage();

  beforeEach(() => {
    cy.viewport('testarea', 'Test123'); // Custom command
    productPage.visit();
  });

  // a) Test Create product (0.5 điểm)
  it('Nên tạo sản phẩm mới thành công', () => {
    productPage.clickAddNew();
    productPage.fillProductForm({
      name: 'Laptop Dell',
      price: '15000000',
      quantity: '10'
    });
    productPage.submitForm();
    
    productPage.getSuccessMessage()
      .should('contain', 'thành công');
    productPage.getProductInList('Laptop Dell')
      .should('exist');
  });

  // b) Test Read/List products (0.5 điểm)
  it('Nên hiển thị danh sách sản phẩm', () => {
    productPage.getProductInList('Laptop Dell')
      .should('exist');
    cy.get('[data-testid="product-price"]').first()
      .should('exist');
    cy.get('[data-testid="product-quantity"]').first()
      .should('exist');
  });

  // c) Test Update product (0.5 điểm)
  it('Nên cập nhật sản phẩm thành công', () => {
    productPage.getProductInList('Laptop Dell').click();
    cy.get('[data-testid="product-price"]').clear().type('14000000');
    productPage.submitForm();
    
    cy.get('[data-testid="product-price"]')
      .should('contain', '14,000,000');
  });

  // d) Test Delete product (0.5 điểm)
  it('Nên xóa sản phẩm thành công', () => {
    productPage.getProductInList('Laptop Dell').click();
    cy.get('[data-testid="delete-btn"]').click();
    cy.get('[data-testid="confirm-delete"]').click();
    
    productPage.getProductInList('Laptop Dell')
      .should('not.exist');
  });

  // e) Test Search/Filter functionality (0.5 điểm)
  it('Nên tìm kiếm/filter sản phẩm thành công', () => {
    cy.get('[data-testid="search-input"]').type('Laptop');
    cy.get('[data-testid="product-item"]')
      .should('have.length.at.least', 1);
    cy.get('[data-testid="product-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'Laptop');
    });
  });
});
