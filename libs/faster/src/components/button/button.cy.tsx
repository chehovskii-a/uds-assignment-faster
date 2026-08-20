import * as React from 'react'
import Button from './button'

describe('Button', () => {
  it('renders and fires onClick', () => {
    const onClick = cy.stub().as('onClick')
    cy.mount(<Button onClick={onClick}>Save</Button>)

    cy.contains('Save').click()
    cy.get('@onClick').should('have.been.calledOnce')
  })

  it('does not fire onClick when disabled', () => {
    const onClick = cy.stub().as('onClick')
    cy.mount(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )

    cy.contains('Save').click({ force: true })
    cy.get('@onClick').should('not.have.been.called')
  })

  it('composes render prop onto a custom element', () => {
    cy.mount(
      <Button render={<a href="/settings">Settings</a>} nativeButton={false}>
        Settings
      </Button>,
    )

    cy.contains('Settings').should('have.prop', 'tagName', 'A')
  })
})

