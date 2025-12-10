describe('Login E2E Tests', () => {

  const baseUrl = 'http://localhost:3000';       // FE
  const apiUrl = 'http://localhost:8080/api/auth/login';  // BE

  beforeEach(() => {
    cy.visit(baseUrl + '/login');
  });

  // a) Complete login flow
  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', apiUrl, {
      statusCode: 200,
      body: {
        token: 'dummy-jwt-token',
        user: { email: 'test@example.com' }
      }
    }).as('loginRequest');

    cy.get('#email').type('test@example.com');
    cy.get('#password').type('123456');
    cy.get('#loginBtn').click();

    cy.wait('@loginRequest');

    cy.url().should('include', '/dashboard');
  });

  // b) Validation tests
  it('should show validation errors when fields are empty', () => {
    cy.get('#loginBtn').click();

    cy.get('.error-message').should('contain', 'Email is required');
    cy.get('.error-message').should('contain', 'Password is required');
  });

  it('should show email format error', () => {
    cy.get('#email').type('invalid_email');
    cy.get('#password').type('123456');
    cy.get('#loginBtn').click();

    cy.get('.error-message').should('contain', 'Invalid email format');
  });

  // c) Test error flow từ backend
  it('should show error message on invalid credentials', () => {
    cy.intercept('POST', apiUrl, {
      statusCode: 401,
      body: {
        message: 'Invalid credentials'
      }
    }).as('loginFail');

    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('wrongpass');
    cy.get('#loginBtn').click();

    cy.wait('@loginFail');

    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  // d) UI interactions
  it('should allow typing into email and password fields', () => {
    cy.get('#email').type('abc@test.com').should('have.value', 'abc@test.com');
    cy.get('#password').type('mypassword').should('have.value', 'mypassword');
  });
});
