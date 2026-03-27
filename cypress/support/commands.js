// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/')
    cy.intercept('POST', '/api/auth/login').as('loginRequest')
    cy.get('input[type=email]').type(email)
    cy.get('input[type=password]').type(password)
    cy.get('button[type=submit]').click()
    
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/dashboard')
    cy.getCookie('token').should('have.property', 'value')
})

Cypress.Commands.add('loginAPI', (email, password) => {
    cy.session([email, password], ()=>{
        cy.request('POST', '/api/auth/login', {email, password})
    })

})

Cypress.Commands.add('createAD', () => {
    cy.visit('/dashboard/post')
    cy.get('input[type="text"]').first().type('testAD')
    cy.get('textarea').first().type('TestAD1')
    cy.get('input[type="number"]').type('250')
    cy.get('input[type="date"]').type('2023-05-01')
    cy.get('input[type="tel"]').type('+1 555 123456')
    cy.contains('Click or drag images here')
        .selectFile('cypress/fixtures/test-image1.jpeg', {
            action: 'drag-drop'
        })
    cy.get('button[type=submit]').click()
})

Cypress.Commands.add('clearSystemState', () => {
    cy.contains('.MuiListItemButton-root', 'Clear System State').click()
    cy.contains('.MuiButton-containedError', 'Clear All').click()
})

Cypress.Commands.add('fillForm', () =>{
    cy.get('input[type="text"]').first().type('iPhone 16 Pro')
    cy.get('textarea').first().type('Barely used')
    cy.get('input[type="number"]').type('250')
    cy.get('input[type="date"]').type('2023-05-01')
    cy.get('input[type="tel"]').type('+1 555 123456')
    cy.contains('Click or drag images here')
        .selectFile('cypress/fixtures/test-image1.jpeg', {
            action: 'drag-drop'
        })
})
