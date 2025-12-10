// Page Object Model cho Product pages (Câu 6.2.1 - Setup Page Object Model)
// Ví dụ Page Object: ProductPage.js

class ProductPage {
  visit() {
    cy.visit('/products');
  }

  clickAddNew() {
    cy.get('[data-testid="add-product-btn"]').click();
  }

  fillProductForm(product) {
    cy.get('[data-testid="product-name-input"]').type(product.name);
    if (product.description) {
      cy.get('[data-testid="product-desc-input"]').type(product.description);
    }
    cy.get('[data-testid="product-price-input"]').type(product.price);
    cy.get('[data-testid="product-stock-input"]').type(product.quantity);
    if (product.category) {
      cy.get('[data-testid="product-category-input"]').type(product.category);
    }
  }

  submitForm() {
    cy.get('[data-testid="product-submit-btn"]').click();
  }

  getSuccessMessage() {
    return cy.get('[data-testid="success-message"]');
  }

  getProductInList(name) {
    return cy.contains('[data-testid="product-item"]', name);
  }
}

export default ProductPage;
