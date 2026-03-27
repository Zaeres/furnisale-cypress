describe('Ads Listing Page', () => {

    beforeEach(() => {
      cy.fixture('credentials').then((user) => {
          cy.loginAPI(user.email, user.password)
      })
      cy.createAD()
    })

    after(() => {
        cy.visit('/dashboard')
        cy.clearSystemState()
    })

    it('LIST-1: Ads load on mount and display ads in a grid', () => {

      cy.intercept('GET', '/api/ads').as('getAds')
      cy.visit('/dashboard')
      cy.wait('@getAds').its('response.statusCode').should('eq', 200)

      // No data-testid available; using MUI class selectors as fallback
      cy.get('[class*="MuiCardContent-root"]').should('have.length.greaterThan', 0)

      // No data-testid available; using MUI class selectors as fallback
      cy.get('[class*="MuiGrid-container"]').first()
        .should('have.css', 'display', 'flex')
        .and('have.css', 'flex-wrap', 'wrap')
  })

    it('LIST-2: Card content is correct', () => {
      cy.intercept('GET', '/api/ads').as('getAds')
      cy.visit('/dashboard')
      cy.wait('@getAds').its('response.statusCode').should('eq', 200)

      // No data-testid available; using MUI class selectors as fallback
      cy.get('[class*="MuiCard-root"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('img.MuiCardMedia-root')
            .should('be.visible')
            .and('have.attr', 'src')
            .and('not.be.empty')

          // No data-testid available; using MUI class selectors as fallback
          cy.get('.MuiTypography-h6')
            .should('be.visible')
            .and(($el) => {
              expect($el.text().trim()).to.not.equal('')
            })

          // No data-testid available; using MUI class selectors as fallback
          cy.get('.MuiTypography-h5')
            .should('be.visible')
            .and(($el) => {
              const text = $el.text().trim()
              expect(text.includes('$')).to.be.true
              expect(/^\$\d+(\.\d{2})?$/.test(text)).to.be.true
            })

          // No data-testid available; using MUI class selectors as fallback
          cy.get('.MuiTypography-body2')
            .should('be.visible')
            .and(($el) => {
              expect($el.text().trim()).to.not.equal('')
            })
          })
      })
    })

    it('LIST-3: Card click navigates to AD and ad ID is present in the URL', () => {
      cy.intercept('GET', '/api/ads').as('getAds')
      cy.visit('/dashboard')
      cy.wait('@getAds').its('response.statusCode').should('eq', 200)

      cy.get('[class*="MuiCardContent-root"]').first().click()

      cy.url().should((url) => {
        expect(url).to.include('/dashboard/ad/')
        const parts = url.split('/dashboard/ad/')
        expect(parts[1]).to.match(/^[a-zA-Z0-9-]+$/)
      })
    })
})