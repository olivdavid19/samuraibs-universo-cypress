it('webb app must be online', function(){
    cy.visit('/')
    cy.title()
        .should('eq', 'Samurai Barbershop by QAninja')
})

