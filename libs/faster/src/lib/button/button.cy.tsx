import * as React from 'react'
import Button from './button'


describe(Button.name, () => {
  it('renders', () => {
    cy.mount(<Button />)
  })
})

