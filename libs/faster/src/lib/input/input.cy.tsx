import * as React from 'react'
import Input from './input'


describe(Input.name, () => {
  it('renders', () => {
    cy.mount(<Input />)
  })
})

