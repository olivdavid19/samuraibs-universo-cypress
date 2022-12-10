import signupPage from '../support/pages/signup'

describe('enrollment', function () {
    context('when user is new', function () {
        const user = {
            name: 'David Oliveira',
            email: 'davidoliveira@samuraibs.com',
            password: 'pwd123'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })//limpa os dados na base antes para podermos analisar depois
        })

        it('must enroll a new user with success', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

            //cy.intercept('POST', '/users', {
            //    statusCode:200
            //}).as('postUser')//estamos simulando a resposta da api... no caso era status code 400 

            //cy.wait('@postUser')//alias
        })
    })

    context('when the email aready exists', function () {
        const user = {
            name: 'João Mateus',
            email: 'joaomateus@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })//limpa os dados na base antes para podermos analisar depois

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })//cadastra a massa previamente pela API

        })

        it('must not allow to enroll a new user', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('when email is invalid', function () {
        const user = {
            name: 'Rodrigo Vasconcelos',
            email: 'rodrigov.gmail.com',
            password: 'pwd123',
            is_provider: true
        }

        it('must exibit alert message', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('when password has less than 6 characters', function () {
        const passwords = ['1', '2a', '3ab', '4abc', '5abcd']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            const user = {
                name: 'Rodrigo Vasconcelos',
                email: 'rodrigo@gmail.com',
                password: p,
                is_provider: true
            }

            it(`must not enroll with password: ${p}`, function () {
                signupPage.form(user)
                signupPage.submit()
                signupPage.alertHaveText('Pelo menos 6 caracteres')
            })
        })
    })

    context.only('when I dont fill one of the mandatory fields', function () {
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function(){
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function(alert){
            it('must exibit' + alert.toLowerCase(), function() {
                signupPage.alertHaveText(alert)
            })
        })
    })
})
