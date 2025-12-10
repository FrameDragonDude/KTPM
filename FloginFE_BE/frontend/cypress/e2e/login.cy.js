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
        user: { username: 'admin' }
      }
    }).as('loginRequest');

    cy.get('#username').type('admin');
    cy.get('#password').type('Admin123');
    cy.get('#loginBtn').click();

    cy.wait('@loginRequest');

    cy.url().should('include', '/dashboard');
  });

  // b) Validation tests
  it('should show validation errors when fields are empty', () => {
    cy.get('#loginBtn').click();

    cy.get('.error-message').should('contain', 'Username is required');
  });

  it('should show password required error', () => {
    cy.get('#username').type('testuser');
    cy.get('#loginBtn').click();

    cy.get('.error-message').should('contain', 'Password is required');
  });

  it('should validate username and password', () => {
    cy.intercept('POST', apiUrl, {
      statusCode: 401,
      body: {
        message: 'Invalid credentials'
      }
    }).as('loginFail');

    cy.get('#username').type('testuser');
    cy.get('#password').type('123456');
    cy.get('#loginBtn').click();

    cy.wait('@loginFail');
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  // c) Test error flow từ backend
  it('should show error message on invalid credentials', () => {
    cy.intercept('POST', apiUrl, {
      statusCode: 401,
      body: {
        message: 'Invalid credentials'
      }
    }).as('loginFail');

    cy.get('#username').type('wronguser');
    cy.get('#password').type('wrongpass');
    cy.get('#loginBtn').click();

    cy.wait('@loginFail');

    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  // d) UI interactions
  it('should allow typing into username and password fields', () => {
    cy.get('#username').type('testuser').should('have.value', 'testuser');
    cy.get('#password').type('mypassword').should('have.value', 'mypassword');
  });
});
