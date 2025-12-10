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
    cy.viewport('iphone-x'); // Use valid preset
    // Mock logged in state
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('loggedIn', 'true');
    });
    productPage.visit();
  });

  // a) Test Create product (0.5 điểm)
  it('Nên tạo sản phẩm mới thành công', () => {
    productPage.clickAddNew();
    productPage.fillProductForm({
      name: 'Laptop Dell',
      description: 'Laptop Dell XPS 13',
      price: '1500',
      quantity: '10',
      category: 'Điện tử'
    });
    productPage.submitForm();
    
    // Check toast appears
    productPage.getSuccessMessage().should('be.visible');
    // Check product in list
    productPage.getProductInList('Laptop Dell')
      .should('exist');
  });

  // b) Test Read/List products (0.5 điểm)
  it('Nên hiển thị danh sách sản phẩm', () => {
    // Check default products exist
    cy.get('[data-testid="product-item"]')
      .should('have.length.at.least', 1);
    cy.get('[data-testid="product-price"]').first()
      .should('exist');
    cy.get('[data-testid="product-quantity"]').first()
      .should('exist');
  });

  // c) Test Update product (0.5 điểm)
  it('Nên cập nhật sản phẩm thành công', () => {
    // Click edit on first product
    cy.get('[data-testid="product-item"]').first().within(() => {
      cy.get('.edit').click();
    });
    
    // Update name
    cy.get('[data-testid="product-name-input"]').clear().type('Updated Product');
    cy.get('[data-testid="product-submit-btn"]').click();
    
    // Verify update
    cy.contains('Updated Product').should('exist');
  });

  // d) Test Delete product (0.5 điểm)
  it('Nên xóa sản phẩm thành công', () => {
    const productName = 'Đồng hồ thông minh';
    
    // Find and delete product
    cy.contains('[data-testid="product-item"]', productName).within(() => {
      cy.get('.delete').click();
    });
    
    // Confirm delete (window.confirm is auto-confirmed in Cypress)
    cy.on('window:confirm', () => true);
    
    // Verify deletion - product should not exist
    cy.contains('[data-testid="product-item"]', productName).should('not.exist');
  });

  // e) Test Search/Filter functionality (0.5 điểm)
  it('Nên tìm kiếm/filter sản phẩm thành công', () => {
    cy.get('[data-testid="search-input"]').type('thông minh');
    cy.get('[data-testid="product-item"]')
      .should('have.length.at.least', 1);
    cy.get('[data-testid="product-item"]').each(($el) => {
      cy.wrap($el).should('contain', 'thông minh');
    });
  });
});
