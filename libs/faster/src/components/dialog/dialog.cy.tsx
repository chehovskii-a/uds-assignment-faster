import * as React from 'react'
import Dialog from './dialog'
import Button from '../button/button'

function DeleteProjectDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Delete project</Dialog.Trigger>
      <Dialog.Content size="small">
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Close aria-label="Close">×</Dialog.Close>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close>Delete</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function DeleteProjectDialogWithButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="ghost" />}>Delete project</Dialog.Trigger>
      <Dialog.Content size="small">
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="ghost" size="medium" />}>Cancel</Dialog.Close>
          <Dialog.Close render={<Button variant="primary" size="medium" />}>Delete</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

describe('Dialog', () => {
  it('opens on trigger click and closes on Dialog.Close', () => {
    cy.mount(<DeleteProjectDialog />)

    cy.get('dialog').should('not.have.attr', 'open')
    cy.contains('button', 'Delete project').click()
    cy.get('dialog').should('have.attr', 'open')
    cy.contains('Cancel').click()
    cy.get('dialog').should('not.have.attr', 'open')
  })

  it('composes with Button via render', () => {
    cy.mount(<DeleteProjectDialogWithButton />)

    cy.contains('button', 'Delete project').should('have.prop', 'tagName', 'BUTTON').click()
    cy.get('dialog').should('have.attr', 'open')
    cy.contains('button', /^Delete$/).should('have.prop', 'tagName', 'BUTTON').click()
    cy.get('dialog').should('not.have.attr', 'open')
  })
})

