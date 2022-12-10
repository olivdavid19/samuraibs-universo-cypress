import { el } from './elements'
import toast from '../../components/toast'

class SignupPage {
    
    constructor(){
        this.toast = toast
    }
    
    go() {
        cy.visit('/signup')
    }
    form(user) {
        cy.get(el.name)//^ significa 'começa com'
            .type(user.name)
        cy.get(el.email)//$ significa 'termina com'
            .type(user.email)
        cy.get(el.password)//* significa 'contém'
            .type(user.password)
    }

    submit(){
        cy.contains(el.signupButton)
        .click()
    }

    alertHaveText(text){
        cy.contains('.alert-error', text) 
                .should('be.visible')
    }
}

export default new SignupPage() //exporta a classe ja instanciada