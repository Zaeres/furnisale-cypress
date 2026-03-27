describe('Ads API Tests', () => {

    let token

    before(() => {
        cy.fixture('credentials').then((users) => {
            cy.request('POST', '/api/auth/login', {
                email: users.email,
                password: users.password
            }).then((response) => {
                token = response.headers['set-cookie'][0].split(';')[0]
            })
        })
    })

    after(() => {
        cy.fixture('credentials').then((users) => {
            cy.loginAPI(users.email, users.password)
            cy.visit('/dashboard')
            cy.clearSystemState()
        })
    })

    it('API-7: GET /api/ads returns 401 without valid token', () => {
        cy.clearCookie('token')
        cy.request({
            method: 'GET',
            url: '/api/ads',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401)
        })
    })

    it('API-8: POST /api/ads returns 400 if required fields are missing', () => {
        cy.request({
            method: 'POST',
            url: '/api/ads',
            headers: { cookie: token },
            body: {},
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
        })
    })

    it('API-9: POST /api/ads returns 400 if images array is empty', () => {
        cy.request({
            method: 'POST',
            url: '/api/ads',
            headers: { cookie: token },
            body: {
                title: 'Test Ad',
                description: 'Test Description',
                price: 100,
                phoneNumber: '+1 555 123456',
                purchaseDate: '2023-05-01',
                images: []
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
        })
    })

    it('API-10: POST /api/ads returns 400 if more than 6 images', () => {
        cy.request({
            method: 'POST',
            url: '/api/ads',
            headers: { cookie: token },
            body: {
                title: 'Test Ad',
                description: 'Test Description',
                price: 100,
                phoneNumber: '+1 555 123456',
                purchaseDate: '2023-05-01',
                images: Array(7).fill({ url: 'http://test.com/test-image1.jpeg', isThumbnail: false })
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
        })
    })

    it('API-11: POST /api/ads returns 400 if price is negative', () => {
        cy.request({
            method: 'POST',
            url: '/api/ads',
            headers: { cookie: token },
            body: {
                title: 'Test Ad',
                description: 'Test Description',
                price: -100,
                phoneNumber: '+1 555 123456',
                purchaseDate: '2023-05-01',
                images: [{ url: 'http://test.com/image.jpg', isThumbnail: true }]
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400)
        })
    })
})