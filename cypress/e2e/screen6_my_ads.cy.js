describe('My Ads Page', () => {

    beforeEach(() => {
        cy.fixture('credentials').then((users) => {
            cy.loginAPI(users.email, users.password)
        })
    })

    after(() => {
      cy.visit('/dashboard')
      cy.clearSystemState()
    })

    it('MYADS-1: Filtered ads load', () => {
        cy.createAD()
        cy.intercept('GET', '/api/ads?mine=true').as('getMyAds')
        cy.visit('/dashboard?mine=true')
        cy.wait('@getMyAds').its('response.statusCode').should('eq', 200)

        cy.fixture('credentials').then((users) => {
            cy.get('[class*="MuiCardContent-root"]').each(($card) => {
                cy.wrap($card).within(() => {
                    cy.get('p.MuiTypography-body2').should('contain.text', `by ${users.name}`).should('not.contain.text', `by ${users.otherUser.name}`)
                })
            })
        })
    })

    it('MYADS-2: Empty state shows that user has no ads yet', () => {
      cy.intercept('GET', '/api/ads?mine=true', 
          { body: [] })
          .as('getMyAdsEmpty')
      cy.visit('/dashboard?mine=true')
      cy.wait('@getMyAdsEmpty')

      cy.contains("You haven't posted any ads yet.").should('be.visible')
    })

    it('MYADS-3: Title shows My Ads instead of All Listings', () => {
      cy.visit('/dashboard?mine=true')
      cy.get('h4.MuiTypography-h4').should('contain.text', 'My Ads')
    })
})