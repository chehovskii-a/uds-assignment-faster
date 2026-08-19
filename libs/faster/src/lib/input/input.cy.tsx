import * as React from 'react'
import Input from './input'

describe('Input', () => {
  it('renders and accepts typed input', () => {
    cy.mount(<Input placeholder="Search" />)

    cy.get('input').type('hello').should('have.value', 'hello')
  })

  it('shows the clear control only while focused and non-empty', () => {
    cy.mount(<Input placeholder="Search" clearable clearIcon="clear" />)

    cy.contains('button', 'clear').should('not.exist')
    cy.get('input').type('hello')
    cy.contains('button', 'clear').should('be.visible').click()
    cy.get('input').should('have.value', '')
  })

  it('does not accept input when disabled', () => {
    cy.mount(<Input placeholder="Search" disabled />)

    cy.get('input').should('be.disabled')
  })

  it('marks the field invalid and links help text', () => {
    cy.mount(<Input placeholder="Email" invalid helpText="Enter a valid email" />)

    cy.get('input').should('have.attr', 'aria-invalid', 'true')
    cy.contains('Enter a valid email').should('be.visible')
  })
})

