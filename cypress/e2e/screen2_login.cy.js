describe('Screen 2 - Login page', () =>{

    beforeEach(() =>{
        cy.visit('/login')
    })
    it('LOGIN-1: Submit button is in disabled state until e-mail is valid and password is filled', () =>{
        cy.get('button[type=submit]').should('not.be.enabled')
        cy.get('input[type="email"]').type('testemail').blur()
        cy.get('input[type="password"]').type('testpassword')
        cy.get('button[type="submit"]').should('not.be.enabled')
        
        cy.get('input[type="email"]').clear().type('realemail@test.com')
        cy.get('input[type="password"]').clear()
        cy.get('button[type="submit"]').should('not.be.enabled')
        
        cy.get('input[type="password"]').type('testpassword')
        cy.get('button[type="submit"]').should('be.enabled')
    })
    
    it('LOGIN-2: Successful login sets authentication cookie and redirects to /dashboard', () =>{
        cy.fixture('credentials').then((user) => {
        cy.login(user.email, user.password)
      })
        cy.url().should('include', '/dashboard')
        cy.getCookie('token').should('have.property', 'value')
        
    })
    
    it('LOGIN-3: Alert message from api (401) is shown with invalid credentials ', ()=>{
        cy.intercept('POST', '/api/auth/login').as('loginRequest')
        cy.get('input[type="email"]').type('fake@email.com')
        cy.get('input[type=password]').type('wrongpassword123')
        cy.get('button[type="submit"]').click()
        
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 401)
        cy.get('[role=alert]').should('be.visible')
    })
    
    it('LOGIN-4: Register link navigates to /register', ()=>{
        cy.contains('a', /register/i).click()
        cy.url().should('include', '/register')
    })
    
    it('LOGIN-5: Entering invalid e-mail format shows inline validation error', ()=>{
        const invalidEmails = ['abc', 'abc@', '@b.com']
        
        invalidEmails.forEach((email) =>{
            cy.get('input[type="email"]').clear().type(email).blur()
            cy.contains(/Please enter a valid email address/i).should('be.visible')
        })
    })

    it('LOGIN-6: Error alert is shown on 500 response from API', () =>{
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 500,
            body: {message: 'Server error'}
        }).as('loginError')

        cy.get('input[type="email"]').type('fake@email.com')
        cy.get('input[type=password]').type('wrongpassword123')
        cy.get('button[type="submit"]').click()
        
        cy.wait('@loginError').its('response.statusCode').should('eq', 500)
        cy.get('[role="alert"]').should('be.visible')

        
    })
    
})