// Please seed the db with the following command before running the test:
// pnpm seed:api:all
describe('Moderate Comment', () => {
  beforeEach(() => {
    cy.session('login', cy.loginAsModerator)
  })

  describe('Moderation Comment List', () => {
    beforeEach(() => {
      cy.visit('/moderation/comments')
    })

    it('should contain navbar', () => {
      // Assert
      cy.get('[data-cy="ourvoice-navbar"]').should('exist')
    })

    it('should display the moderation comment list', () => {
      // Assert
      cy.get('.moderation-page').children().should('have.length', 20)

      cy.get('[data-cy="accepted-tab"]').click()
      cy.get('.moderation-page').children().should('have.length', 20)

      cy.get('[data-cy="rejected-tab"]').click()
      cy.get('.moderation-page').children().should('have.length', 20)
    })

    it('should display moderate button only on pending comments', () => {
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

    describe('Comment Moderation', () => {
      beforeEach(() => {
        cy.intercept('http://api.ourvoice.test/graphql').as('gqlQueryOrMutation')

        cy.get('.moderation-page > *:nth-child(2)').find('[data-cy="moderate-button"]').click()
      })

      it('should contain navbar', () => {
        // Assert
        cy.get('[data-cy="ourvoice-navbar"]').should('exist')
      })

      it('should display version history', () => {
        const commentVersionList = '[data-cy="comment-version-list"]'
        const actionBadge = '[data-cy="action-badge"]'
        const versionLabel = '[data-cy="version-label"]'

        const getVersionChild = (n) => `${commentVersionList} > * > *:nth-child(${n})`

        // Check if the version history is displayed
        cy.get(commentVersionList).should('exist')
        cy.get(`${commentVersionList} > * > *`).should('have.length', 1)

        // Check if the version history action is displayed in the correct order
        const actions = ['Original']
        actions.forEach((action, index) => {
          cy.get(`${getVersionChild(index + 1)} ${actionBadge}`).should('contain', action)
        })

        // Check if the version history version label is displayed in the correct order
        const versions = ['Version 1']
        versions.forEach((version, index) => {
          cy.get(`${getVersionChild(index + 1)} ${versionLabel}`).should('contain', version)
        })
      })

      it('should not display moderation history', () => {
        const moderationHistory = '[data-cy="moderation-history"]'

        cy.get(moderationHistory).should('not.exist')
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

      it('should accept and renew comment', () => {
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
        cy.get(selectors.moderationReasonTextArea).should('not.exist')

        // Renew the moderation
        cy.get(selectors.renewModerationButton).click()
        cy.get(selectors.moderationReasonTextArea).should('exist')
      })

      it('should reject and renew comment', () => {
        // Arrange
        const selectors = {
          actionListBox: '[data-cy="moderation-action-listbox"]',
          actionListBoxButton: '[data-cy="moderation-action-listbox-button"]',
          moderationReasonTextArea: '[data-cy="moderation-reason-textarea"]',
          errorClass: 'focus-within:border-red-500 focus-within:ring-red-500',
          submitModerationButton: '[data-cy="moderate-button"]',
          moderationDecisionsCount: '[data-cy="comment-moderation-decisions-count"]',
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
        validateDecisionsCount(0, 1)
        cy.get(selectors.moderationReasonTextArea).should('not.exist')
        validateModerationHistory(1)

        // Renew the moderation
        cy.get(selectors.renewModerationButton).click()
        cy.get(selectors.moderationReasonTextArea).should('exist')
      })

      it('should modify comment and create a new version', () => {
        // Arrange
        const selectors = {
          actionListBox: '[data-cy="moderation-action-listbox"]',
          actionListBoxButton: '[data-cy="moderation-action-listbox-button"]',
          moderationReasonTextArea: '[data-cy="moderation-reason-textarea"]',
          errorClass: 'focus-within:border-red-500 focus-within:ring-red-500',
          submitModerationButton: '[data-cy="moderate-button"]',
          moderationDecisionsCount: '[data-cy="comment-moderation-decisions-count"]',
          selfModerationIndicator: '[data-cy="self-moderation-indicator"]',
          moderationHistoryButton: '[data-cy="moderation-history-button"]',
          moderationHistory: '[data-cy="moderation-history"]',
          sidePaneCloseButton: '[data-cy="side-pane-close-button"]',
          renewModerationButton: '[data-cy="renew-button"]',
          contentInput: '[data-cy="modify-content-input"]',
          contentInputError: '[data-cy="content-input-error"]',
          commentVersionList: '[data-cy="comment-version-list"]',
          actionBadge: '[data-cy="action-badge"]',
          versionLabel: '[data-cy="version-label"]'
        }

        const getVersionChild = (n) => `${selectors.commentVersionList} > * > *:nth-child(${n})`

        const validateModerationHistory = (expectedLength) => {
          cy.get(selectors.moderationHistoryButton).click()
          cy.get(`${selectors.moderationHistory} li`).should('have.length', expectedLength)
          cy.get(selectors.sidePaneCloseButton).click()
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

        // Modify content field in the comment
        cy.get(selectors.contentInput).clear()
        cy.get(selectors.contentInputError).should('exist')
        cy.get(selectors.submitModerationButton).should('be.disabled')
        cy.get(selectors.contentInput).type('Comment Content Modified')

        cy.intercept('http://api.ourvoice.test/graphql').as('modifyComment')
        cy.get(selectors.submitModerationButton).should('not.be.disabled')
        cy.get(selectors.submitModerationButton).click()
        cy.wait('@modifyComment')
        cy.reload()

        validateModerationHistory(1)
        cy.get(`${getVersionChild(1)} ${selectors.actionBadge}`).should('contain', 'Modified')
        cy.get(`${getVersionChild(1)} ${selectors.versionLabel}`).should('contain', 'Version 2')

        // Rollback the db changes
        const rollbackMutation = `
              mutation Mutation($commentId: Int!) {
                rollbackModifiedModerationComment(commentId: $commentId) {
                  id
                }
              }
            `
        cy.request({
          url: 'http://api.ourvoice.test/graphql',
          method: 'POST',
          body: { query: rollbackMutation, variables: { commentId: 4 } }
        })
      })
    })
  })
})
