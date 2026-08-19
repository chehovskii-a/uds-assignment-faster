import * as React from 'react'
import Dialog from './dialog'

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

describe('Dialog', () => {
  it('opens on trigger click and closes on Dialog.Close', () => {
    cy.mount(<DeleteProjectDialog />)

    cy.contains('Delete project?').should('not.exist')
    cy.contains('Delete project').click()
    cy.contains('Delete project?').should('be.visible')
    cy.contains('Cancel').click()
    cy.contains('Delete project?').should('not.exist')
  })
})

