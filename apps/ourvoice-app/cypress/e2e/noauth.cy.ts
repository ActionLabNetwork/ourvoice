describe('Create Comment Tab Test', () => {
  it('visits the app noauth url', () => {
    cy.visit('/noauth')
    cy.contains('h2', 'Create Post')
  })

  it('clicks the create comment tab', () => {
    cy.visit('/noauth')
    cy.get('li').contains('Create Comment').click()
    cy.contains('h2', 'Create Comment')
    cy.contains('div', 'Select a comment')
    cy.get('label').contains('Post').click()
    cy.contains('div', 'Select a post')
  })

  it('create comment for comment', () => {
    cy.visit('/noauth')
    cy.get('li').contains('Create Comment').click()
    cy.get('#comments').click()
    cy.get('#comments-multiselect-options li:first').click()
    cy.get('#comment-content').type('This is a test comment for comment')
    cy.get('button').contains('Create Comment').click()

    cy.visit('/noauth')
    cy.get('li').contains('Create Comment').click()
    cy.get('#comments').click()
    cy.get('#comments-multiselect-options li:last').contains('This is a test comment for comment')
  })

  it('create comment for post', () => {
    cy.visit('/noauth')
    cy.get('li').contains('Create Comment').click()
    cy.get('label').contains('Post').click()
    cy.get('#posts').click()
    cy.get('#posts-multiselect-options li:first').click()
    cy.get('#comment-content').type('This is a test comment for post')
    cy.get('button').contains('Create Comment').click()

    cy.visit('/noauth')
    cy.get('li').contains('Create Comment').click()
    cy.get('#comments').click()
    cy.get('#comments-multiselect-options li:last').contains('This is a test comment for post')
  })
})
