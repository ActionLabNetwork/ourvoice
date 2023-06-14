// Please seed the db with the following command before running the test:
// pnpm seed:api:all
describe('Moderate Post', () => {
  beforeEach(() => {
    cy.session('login', cy.login)
  })

  describe('Moderation Post List', () => {
    beforeEach(() => {
      cy.visit('/moderation/posts')
    })

    it('should contain navbar', () => {
      // Assert
      cy.get('[data-cy="ourvoice-navbar"]').should('exist')
    })

    it('should display the moderation post list', () => {
      // Assert
      cy.get('.moderation-page').children().should('have.length', 3)

      cy.get('[data-cy="accepted-tab"]').click()
      cy.get('.moderation-page').children().should('have.length', 4)

      cy.get('[data-cy="rejected-tab"]').click()
      cy.get('.moderation-page').children().should('have.length', 3)
    })

    it('should display moderate button only on pending posts', () => {
      // Assert
      cy.get('.moderation-page')
        .children()
        .first()
        .find('[data-cy="moderate-button"]')
        .should('exist')

      cy.get('[data-cy="accepted-tab"]').click()
      cy.get('.moderation-page')
        .children()
        .first()
        .find('[data-cy="moderate-button"]')
        .should('not.exist')

      cy.get('[data-cy="rejected-tab"]').click()
      cy.get('.moderation-page')
        .children()
        .last()
        .find('[data-cy="moderate-button"]')
        .should('not.exist')
    })

    describe('Post Moderation', () => {
      beforeEach(() => {
        cy.get('.moderation-page').children().first().find('[data-cy="moderate-button"]').click()
      })

      it('should contain navbar', () => {
        // Assert
        cy.get('[data-cy="ourvoice-navbar"]').should('exist')
      })

      it('should display version history', () => {
        const postVersionList = '[data-cy="post-version-list"]'
        const actionBadge = '[data-cy="action-badge"]'
        const versionLabel = '[data-cy="version-label"]'

        const getVersionChild = (n) => `${postVersionList} > * > *:nth-child(${n})`

        // Check if the version history is displayed
        cy.get(postVersionList).should('exist')
        cy.get(`${postVersionList} > * > *`).should('have.length', 3)

        // Check if the version history action is displayed in the correct order
        const actions = ['Modified', 'Modified', 'Original']
        actions.forEach((action, index) => {
          cy.get(`${getVersionChild(index + 1)} ${actionBadge}`).should('contain', action)
        })

        // Check if the version history version label is displayed in the correct order
        const versions = ['Version 3', 'Version 2', 'Version 1']
        versions.forEach((version, index) => {
          cy.get(`${getVersionChild(index + 1)} ${versionLabel}`).should('contain', version)
        })
      })

      it('should display moderation history', () => {
        const moderationHistoryButton = '[data-cy="moderation-history-button"]'
        const moderationHistory = '[data-cy="moderation-history"]'

        cy.get(moderationHistory).should('not.exist')
        cy.get(moderationHistoryButton).should('exist')
        cy.get(moderationHistoryButton).click()
        cy.get(moderationHistory).should('be.visible')
        cy.get(`${moderationHistory} li`).should('have.length', 4)
      })

      it('should display all moderation controls', () => {
        // Arrange
        const actionListBoxButton = '[data-cy="moderation-action-listbox-button"]'
        const actionListBox = '[data-cy="moderation-action-listbox"]'

        // Act & Assert
        cy.get(actionListBox).should('not.exist')
        cy.get(actionListBoxButton).click()
        cy.get(actionListBox).should('exist')
        cy.get(actionListBox).children().should('have.length', 3)
      })

      it('should accept and renew post', () => {
        // Arrange
        const selectors = {
          actionListBox: '[data-cy="moderation-action-listbox"]',
          moderationReasonTextArea: '[data-cy="moderation-reason-textarea"]',
          errorClass: 'focus-within:border-red-500 focus-within:ring-red-500',
          submitModerationButton: '[data-cy="moderate-button"]',
          moderationDecisionsCount: '[data-cy="moderation-decisions-count"]',
          selfModerationIndicator: '[data-cy="self-moderation-indicator"]',
          moderationHistoryButton: '[data-cy="moderation-history-button"]',
          moderationHistory: '[data-cy="moderation-history"]',
          sidePaneCloseButton: '[data-cy="side-pane-close-button"]',
          renewModerationButton: '[data-cy="renew-button"]'
        }

        const validateModerationHistory = (expectedLength) => {
          cy.get(selectors.moderationHistoryButton).click()
          cy.get(`${selectors.moderationHistory} li`).should('have.length', expectedLength)
          cy.get(selectors.sidePaneCloseButton).click()
        }

        const validateDecisionsCount = (acceptedCount, rejectedCount) => {
          cy.get(selectors.moderationDecisionsCount)
            .children()
            .first()
            .should('contain', `ACCEPTED: ${acceptedCount}`)
          cy.get(selectors.moderationDecisionsCount)
            .children()
            .last()
            .should('contain', `REJECTED: ${rejectedCount}`)
        }

        // Act & Assert
        cy.get(selectors.actionListBox).should('not.exist')
        cy.get(selectors.selfModerationIndicator).should('not.exist')
        cy.get(selectors.renewModerationButton).should('not.exist')
        cy.get(selectors.moderationReasonTextArea)
          .parent()
          .should('not.have.class', selectors.errorClass)

        // Accept the post
        cy.get(selectors.submitModerationButton).click()
        cy.get(selectors.renewModerationButton).should('exist')
        cy.get(selectors.selfModerationIndicator).should('exist')
        validateDecisionsCount(1, 3)
        cy.get(selectors.moderationReasonTextArea).should('not.exist')
        validateModerationHistory(5)

        // Renew the moderation
        cy.get(selectors.renewModerationButton).click()
        cy.get(selectors.moderationReasonTextArea).should('exist')
        validateDecisionsCount(0, 3)
        validateModerationHistory(4)
      })

      it('should reject and renew post', () => {
        // Arrange
        const selectors = {
          actionListBox: '[data-cy="moderation-action-listbox"]',
          actionListBoxButton: '[data-cy="moderation-action-listbox-button"]',
          moderationReasonTextArea: '[data-cy="moderation-reason-textarea"]',
          errorClass: 'focus-within:border-red-500 focus-within:ring-red-500',
          submitModerationButton: '[data-cy="moderate-button"]',
          moderationDecisionsCount: '[data-cy="moderation-decisions-count"]',
          selfModerationIndicator: '[data-cy="self-moderation-indicator"]',
          moderationHistoryButton: '[data-cy="moderation-history-button"]',
          moderationHistory: '[data-cy="moderation-history"]',
          sidePaneCloseButton: '[data-cy="side-pane-close-button"]',
          renewModerationButton: '[data-cy="renew-button"]'
        }

        const validateModerationHistory = (expectedLength) => {
          cy.get(selectors.moderationHistoryButton).click()
          cy.get(`${selectors.moderationHistory} li`).should('have.length', expectedLength)
          cy.get(selectors.sidePaneCloseButton).click()
        }

        const validateDecisionsCount = (acceptedCount, rejectedCount) => {
          cy.get(selectors.moderationDecisionsCount)
            .children()
            .first()
            .should('contain', `ACCEPTED: ${acceptedCount}`)
          cy.get(selectors.moderationDecisionsCount)
            .children()
            .last()
            .should('contain', `REJECTED: ${rejectedCount}`)
        }

        // Act & Assert
        cy.get(selectors.actionListBoxButton).click()
        cy.get(selectors.actionListBox).should('exist')
        cy.get(selectors.actionListBox).children().last().click()
        cy.get(selectors.selfModerationIndicator).should('not.exist')
        cy.get(selectors.renewModerationButton).should('not.exist')
        cy.get(selectors.moderationReasonTextArea).should('not.have.class', selectors.errorClass)
        cy.get(selectors.submitModerationButton).should('be.disabled')
        cy.get(selectors.moderationReasonTextArea).type('test')
        cy.get(selectors.moderationReasonTextArea).clear()
        cy.get(selectors.moderationReasonTextArea)
          .parent()
          .should('have.class', selectors.errorClass)
        cy.get(selectors.moderationReasonTextArea).type('test')
        cy.get(selectors.submitModerationButton).should('not.be.disabled')

        // Reject the post
        cy.get(selectors.submitModerationButton).click()
        cy.get(selectors.renewModerationButton).should('exist')
        cy.get(selectors.selfModerationIndicator).should('exist')
        validateDecisionsCount(0, 4)
        cy.get(selectors.moderationReasonTextArea).should('not.exist')
        validateModerationHistory(5)

        // Renew the moderation
        cy.get(selectors.renewModerationButton).click()
        cy.get(selectors.moderationReasonTextArea).should('exist')
        validateDecisionsCount(0, 3)
        validateModerationHistory(4)
      })

      it('should modify post and create a new version', () => {
        // Arrange
        const selectors = {
          actionListBox: '[data-cy="moderation-action-listbox"]',
          actionListBoxButton: '[data-cy="moderation-action-listbox-button"]',
          moderationReasonTextArea: '[data-cy="moderation-reason-textarea"]',
          errorClass: 'focus-within:border-red-500 focus-within:ring-red-500',
          submitModerationButton: '[data-cy="moderate-button"]',
          moderationDecisionsCount: '[data-cy="moderation-decisions-count"]',
          selfModerationIndicator: '[data-cy="self-moderation-indicator"]',
          moderationHistoryButton: '[data-cy="moderation-history-button"]',
          moderationHistory: '[data-cy="moderation-history"]',
          sidePaneCloseButton: '[data-cy="side-pane-close-button"]',
          renewModerationButton: '[data-cy="renew-button"]',
          titleInput: '[data-cy="modify-title-input"]',
          contentInput: '[data-cy="modify-content-input"]',
          categoriesMultiselect: '[data-cy="modify-categories-multiselect"]',
          titleInputError: '[data-cy="title-input-error"]',
          contentInputError: '[data-cy="content-input-error"]',
          categoriesInputError: '[data-cy="categories-error-message"]',
          postVersionList: '[data-cy="post-version-list"]',
          actionBadge: '[data-cy="action-badge"]',
          versionLabel: '[data-cy="version-label"]'
        }

        const getVersionChild = (n) => `${selectors.postVersionList} > * > *:nth-child(${n})`

        const validateModerationHistory = (expectedLength) => {
          cy.get(selectors.moderationHistoryButton).click()
          cy.get(`${selectors.moderationHistory} li`).should('have.length', expectedLength)
          cy.get(selectors.sidePaneCloseButton).click()
        }

        const validateDecisionsCount = (acceptedCount, rejectedCount) => {
          cy.get(selectors.moderationDecisionsCount)
            .children()
            .first()
            .should('contain', `ACCEPTED: ${acceptedCount}`)
          cy.get(selectors.moderationDecisionsCount)
            .children()
            .last()
            .should('contain', `REJECTED: ${rejectedCount}`)
        }

        // Act & Assert
        cy.get(selectors.actionListBoxButton).click()
        cy.get(selectors.actionListBox).should('exist')
        cy.get(`${selectors.actionListBox}`).children().eq(1).click()
        cy.get(selectors.selfModerationIndicator).should('not.exist')
        cy.get(selectors.renewModerationButton).should('not.exist')
        cy.get(selectors.moderationReasonTextArea).should('not.have.class', selectors.errorClass)
        cy.get(selectors.submitModerationButton).should('be.disabled')
        cy.get(selectors.moderationReasonTextArea).type('test')
        cy.get(selectors.moderationReasonTextArea).clear()
        cy.get(selectors.moderationReasonTextArea)
          .parent()
          .should('have.class', selectors.errorClass)
        cy.get(selectors.moderationReasonTextArea).type('test')
        cy.get(selectors.submitModerationButton).should('be.disabled')

        // Modify each field in the post
        cy.get(selectors.titleInput).clear()
        cy.get(selectors.titleInputError).should('exist')
        cy.get(selectors.submitModerationButton).should('be.disabled')
        cy.get(selectors.titleInput).type('Post Title Modified')

        cy.get(selectors.contentInput).clear()
        cy.get(selectors.contentInputError).should('exist')
        cy.get(selectors.submitModerationButton).should('be.disabled')
        cy.get(selectors.contentInput).type('Post Content Modified')

        cy.get(selectors.categoriesMultiselect).click()
        cy.get('#categories-multiselect-option-3').click()
        cy.get(selectors.categoriesInputError).should('exist')
        cy.get(selectors.submitModerationButton).should('be.disabled')
        cy.get(
          '[aria-label="Work Environment ❎"] > .multiselect-tag-remove > .multiselect-tag-remove-icon'
        ).click()
        cy.get(selectors.categoriesInputError).should('not.exist')

        cy.intercept('http://api.ourvoice.test/graphql').as('modifyPost')
        cy.get(selectors.submitModerationButton).should('not.be.disabled')
        cy.get(selectors.submitModerationButton).click()
        cy.wait('@modifyPost')
        cy.reload()

        validateModerationHistory(1)
        cy.get(`${getVersionChild(1)} ${selectors.actionBadge}`).should('contain', 'Modified')
        cy.get(`${getVersionChild(1)} ${selectors.versionLabel}`).should('contain', 'Version 4')

        // Rollback the db changes
        const rollbackMutation = `
          mutation Mutation($postId: Int!) {
            rollbackModifiedModerationPost(postId: $postId) {
              id
              authorNickname
              authorHash
              versions {
                id
                content
                title
              }
            }
          }
        `
        cy.request({
          url: 'http://api.ourvoice.test/graphql',
          method: 'POST',
          body: { query: rollbackMutation, variables: { postId: 2 } }
        })

        // // Modify the post
        // cy.get(selectors.submitModerationButton).click()
        // cy.get(selectors.renewModerationButton).should('exist')
        // cy.get(selectors.selfModerationIndicator).should('exist')
        // validateDecisionsCount(0, 4)
        // cy.get(selectors.moderationReasonTextArea).should('not.exist')
        // validateModerationHistory(5)

        // // Renew the moderation
        // cy.get(selectors.renewModerationButton).click()
        // cy.get(selectors.moderationReasonTextArea).should('exist')
        // validateDecisionsCount(0, 3)
        // validateModerationHistory(4)
      })
    })
  })
})
