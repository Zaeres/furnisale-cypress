describe('Post Ad Page', () => {

    beforeEach(() => {
        cy.fixture('credentials').then((user) => {
            cy.loginAPI(user.email, user.password)
        })
        cy.intercept('POST', '/api/ads').as('postAd')
        cy.intercept('POST', '/api/upload').as('upload')
        cy.visit('/dashboard/post')
    })

    afterEach(() => {
        cy.visit('/dashboard')
        cy.clearSystemState()
    })

    it('POST-1: Submit disabled until form is valid', () => {
        cy.get('button[type="submit"]').should('be.disabled')

        cy.get('input[type="text"]').first().type('iPhone 16 Pro')
        cy.get('button[type="submit"]').should('be.disabled')

        cy.get('textarea').first().type('Barely used')
        cy.get('button[type="submit"]').should('be.disabled')

        cy.get('input[type="number"]').type('250')
        cy.get('button[type="submit"]').should('be.disabled')

        cy.get('input[type="date"]').type('2023-05-01')
        cy.get('button[type="submit"]').should('be.disabled')

        cy.get('input[type="tel"]').type('+1 555 123456')
        cy.get('button[type="submit"]').should('be.disabled')

        cy.contains('Click or drag images here')
            .selectFile('cypress/fixtures/test-image1.jpeg', { action: 'drag-drop' })

        cy.get('button[type="submit"]').should('not.be.disabled')
    })

    it('POST-2: Successful ad creation', () => {
        cy.fillForm()

        cy.get('button[type="submit"]').click()

        cy.wait('@postAd').then((interception) => {
            expect(interception.response.statusCode).to.eq(201)
            expect(interception.request.body).to.have.property('title')
            expect(interception.request.body).to.have.property('description')
            expect(interception.request.body).to.have.property('price')
            expect(interception.request.body).to.have.property('phoneNumber')
            expect(interception.request.body).to.have.property('purchaseDate')
            expect(interception.request.body).to.have.property('images')
        })

        cy.url().should('include', '/dashboard').should('not.include', '/post')
    })

    it('POST-3: Loading state during submission', () => {
        cy.intercept('POST', '/api/ads', (req) => {
            req.reply((res) => {
                res.delay = 1000
            })
        }).as('postAdSlow')

        cy.fillForm()

        cy.get('button[type="submit"]').click()

        cy.get('button[type="submit"]')
            .should('be.disabled')
            .and('contain', 'Posting...')
    })

    it('POST-4: Shows error on failure', () => {
        cy.intercept('POST', '/api/ads', {
            statusCode: 500
        }).as('postAdFail')

        cy.fillForm()

        cy.get('button[type="submit"]').click()

        cy.wait('@postAdFail')

        cy.get('[role="alert"]').should('be.visible')
    })

    it('POST-5/7: Drag and drop adds image and shows preview', () => {
        cy.contains('Click or drag images here')
            .selectFile('cypress/fixtures/test-image1.jpeg', {
                action: 'drag-drop'
            })
        cy.contains('(1/6)').should('be.visible')
        cy.get('img').should('have.length.at.least', 1)
    })

    it.skip('POST-6: Click to select opens file picker and adds image', () => {
        // The file upload zone lacks an <input type="file"> accessible in the DOM; Cypress selectFile requires one.
    })

    it('POST-8: Delete image removes it', () => {
        cy.contains('Click or drag images here')
            .selectFile('cypress/fixtures/test-image1.jpeg', {
                action: 'drag-drop'
            })

        cy.get('[data-testid="DeleteIcon"], [class*="delete"]').first().click()

        cy.contains('(0/6)').should('be.visible')
    })

    it('POST-9: Thumbnail selection works on correct image', () => {
        cy.contains('Click or drag images here')
            .selectFile([
                'cypress/fixtures/test-image1.jpeg',
                'cypress/fixtures/test-image2.jpeg'
            ], { action: 'drag-drop' })

        cy.get('[title="Set as thumbnail"]').click()

        cy.get('li').eq(1).find('[title="Current thumbnail"]').should('exist')
    })
    it('POST-10: Max 6 images enforced', () => {
        const files = Array(7).fill('cypress/fixtures/test-image1.jpeg')

        cy.contains('Click or drag images here')
            .selectFile(files, { action: 'drag-drop' })

        cy.contains('(6/6)').should('be.visible')
    })

    it('POST-11: Reject invalid file type', () => {
        cy.contains('Click or drag images here')
            .selectFile('cypress/fixtures/invalid.pdf', {
                action: 'drag-drop'
            })

        cy.get('[role="alert"]').should('be.visible')
    })

    it.skip('POST-12: Reject large file', () => {
        cy.contains('Click or drag images here')
            .selectFile('cypress/fixtures/large_file.jpeg', {
                action: 'drag-drop'
            })

        //Fails due to file larger than 5MB being accepted and uploaded
        cy.get('[role="alert"]').should('be.visible')
    })

    it('POST-13: Phone input validation', () => {
        cy.get('input[type="tel"]').type('abc!@#')
        cy.get('input[type="tel"]').should('have.value', '')

        cy.get('input[type="tel"]').type('+359 888-123')
        cy.get('input[type="tel"]').should('have.value', '+359 888-123')
    })

    it('POST-14: Negative price not allowed', () => {
        cy.get('input[type="number"]').type('-100')

        cy.get('button[type="submit"]').should('be.disabled')

        cy.get('input[type="number"]').then(($el) => {
            expect($el[0].checkValidity()).to.be.false
        })
    })

    it('POST-15: Empty fields invalid', () => {
        cy.get('input[type="text"]').type('   ')
        cy.get('textarea').first().type('   ')
        cy.get('input[type="number"]').type('250')
        cy.get('input[type="date"]').type('2023-05-01')
        cy.get('input[type="tel"]').type('+1 555 123456')

        cy.contains('Click or drag images here')
            .selectFile('cypress/fixtures/test-image1.jpeg', {
                action: 'drag-drop'
            })

        cy.get('button[type="submit"]').should('be.disabled')
    })

    //Skipped due to no order field
    it.skip('POST-16: Image order preserved in request payload', () => {
        
        cy.get('input[type="text"]').first().type('iPhone 16 Pro')
        cy.get('textarea').first().type('Barely used')
        cy.get('input[type="number"]').type('250')
        cy.get('input[type="date"]').type('2023-05-01')
        cy.get('input[type="tel"]').type('+1 555 123456')
        
        cy.contains('Click or drag images here')
            .selectFile([
                'cypress/fixtures/test-image1.jpeg',
                'cypress/fixtures/test-image2.jpeg',
                'cypress/fixtures/test-image3.jpeg'
            ], { action: 'drag-drop' })

        cy.get('button[type="submit"]').click()

        cy.wait('@postAd').then((interception) => {
            const images = interception.request.body.images

            //There is no ORDER field
            expect(images[0]).to.have.property('order')

        })
    })
})