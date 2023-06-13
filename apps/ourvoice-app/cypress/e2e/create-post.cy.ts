import { createPostContentCharacterLimit } from '../../src/constants/post'
import { aliasMutation, aliasQuery } from '../utils/graphql-test-utils'

describe('Create Post', () => {
  const fixtureRoot = 'create-post'

  const attachFile = (filename: string, mimeType: string, fileContent: Blob) => {
    cy.get('#attachments').attachFile({
      fileContent,
      fileName: filename,
      mimeType
    })
  }

  beforeEach(() => {
    // Create/Restore auth session
    cy.login()

    // Intercept and stub API calls
    cy.intercept({ method: 'POST', url: 'http://api.ourvoice.test/graphql' }, (req) => {
      // Query Aliases
      aliasQuery(req, 'GetPresignedUrls')
      aliasQuery(req, 'GetCategories')

      // Mutation Aliases
      aliasMutation(req, 'CreateModerationPost')

      if (req.body?.query?.includes('categories')) {
        req.reply({
          fixture: `${fixtureRoot}/mockedCategoriesQueryResponse.json`
        })
      } else if (req.body?.query?.includes('getPresignedUrls')) {
        req.reply({
          fixture: `${fixtureRoot}/mockedPresignedUrlsQueryResponse.json`
        })
      } else if (req.body?.query?.includes('createModerationPost')) {
        req.reply({
          fixture: `${fixtureRoot}/mockedCreatePostMutationResponse.json`
        })
      }
    })

    cy.intercept(
      {
        method: 'PUT',
        url: 'http://localhost:4566/test-bucket/user123/1683163606594_0_dummy.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=test%2F20230504%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230504T012646Z&X-Amz-Expires=300&X-Amz-Signature=063eba130bfd93d1814ab194960d178dc0fbf8754c5a7c2266c09887c9ff3034&X-Amz-SignedHeaders=host&x-id=PutObject'
      },
      []
    ).as('putPresignedUrl')

    // Should be authenticated, now visit the create post page
    cy.visit('/post')
  })

  describe('Form rendering', () => {
    it('should display the form and required fields', () => {
      // Assert
      cy.get('form').should('exist')
      cy.get('#title').should('exist')
      cy.get('#content').should('exist')
      cy.get('#categories').should('exist')
      cy.get('#attachments').should('exist')
      cy.get('button[type="submit"]').should('exist')
    })

    it('should not show any error messages when form is untouched', () => {
      // Assert
      cy.get('[data-cy="title-error-message"]').should('not.exist')
      cy.get('[data-cy="content-error-message"]').should('not.exist')
      cy.get('[data-cy="categories-error-message"]').should('not.exist')
      cy.get('[data-cy="attachments-error-message"]').should('not.exist')
    })
  })

  describe('Validation', () => {
    it('should show an error message if the title is empty', () => {
      // Act
      cy.get('#title').click()
      cy.get('#title').type('a')
      cy.get('#title').clear()

      // Assert
      cy.get('[data-cy="title-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })

    it('should show an error message if the title is more than allowed characters', () => {
      // Act
      cy.get('#title').type('a'.repeat(createPostContentCharacterLimit + 1))

      // Assert
      cy.get('[data-cy="title-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })

    it('should show an error message if the title contains non alphanumeric characters', () => {
      // Act
      cy.get('#title').type('!@#$%^&*()')
      cy.get('#content').click()

      // Assert
      cy.get('[data-cy="title-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })

    it('should show an error message if the content is more than allowed characters', () => {
      // Act
      cy.get('#content').type('a'.repeat(createPostContentCharacterLimit + 1))
      cy.get('#title').click()

      // Assert
      cy.get('[data-cy="content-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })

    it('should show an error message if the content is empty', () => {
      // Act
      cy.get('#content').click()
      cy.get('#content').type('a')
      cy.get('#content').clear()

      // Assert
      cy.get('[data-cy="content-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })

    it('should show an error message if the categories is empty', () => {
      // Act
      const selectCategory = (optionIndex: number) => {
        cy.get('#categories').click()
        cy.get(`#categories-multiselect-option-${optionIndex}`).click()
      }

      const removeCategory = () => {
        cy.get('.multiselect-tag-remove').click()
      }

      selectCategory(1)
      removeCategory()

      // Assert
      cy.get('[data-cy="categories-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })

    it('should show an error message if more than 2 categories are selected', () => {
      // Act
      const selectCategory = (optionIndex: number) => {
        cy.get('#categories').click()
        cy.get(`#categories-multiselect-option-${optionIndex}`).click()
      }

      selectCategory(1)
      selectCategory(2)
      selectCategory(3)

      // Assert
      cy.get('[data-cy="categories-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })

    it('should show an error message when uploading file types that are not allowed', () => {
      // Arrange
      const txtFile = `${fixtureRoot}/dummy.txt`

      cy.fixture(txtFile).then((fileContent) => {
        attachFile(txtFile, 'text/plain', fileContent)
      })

      // Assert
      cy.get('[data-cy="attachments-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })

    it('should show an error message when upload exceeds allowed size', () => {
      // Arrange
      const pdfFile = `${fixtureRoot}/big.pdf`

      cy.fixture(pdfFile).then((fileContent) => {
        attachFile(pdfFile, 'application/pdf', fileContent)
      })

      // Assert
      cy.get('[data-cy="attachments-error-message"]').should('be.visible')
      cy.get('[data-cy="create-post-submit-button"]').should('be.disabled')
    })
  })

  describe('Categories (API Reliant)', () => {
    it('should display categories received from the API', () => {
      // Arrange
      const expectedCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
        { id: 4, name: 'Category 4' },
        { id: 5, name: 'Category 5' }
      ]

      // Act
      cy.get('#categories').click()

      // Assert
      cy.wait('@gqlGetCategoriesQuery').then(({ request }) => {
        expect(request.body.query).to.include('categories')
      })
      cy.get('[data-cy="categories-error-message"]').should('not.exist')
      expectedCategories.forEach((category) => {
        cy.get(`#categories-multiselect-option-${category.id}`).contains(category.name)
      })
    })
  })

  describe('Attachments (API reliant)', () => {
    it('should display uploaded attachments', () => {
      // Arrange
      const pdfFile = `${fixtureRoot}/dummy.pdf`

      cy.fixture(pdfFile).then((fileContent) => {
        attachFile(pdfFile, 'application/pdf', fileContent)
      })

      // Assert
      cy.get('#uploaded-attachments-list').should('contain', pdfFile)
    })

    it('should query presigned url on attachment upload', () => {
      // Arrange
      const pdfFile = `${fixtureRoot}/dummy.pdf`

      cy.fixture(pdfFile).then((fileContent) => {
        attachFile(pdfFile, 'application/pdf', fileContent)
      })

      // Assert
      cy.get('#uploaded-attachments-list').should('contain', pdfFile)
      cy.wait('@gqlGetPresignedUrlsQuery').then(({ request, response }) => {
        // Request assertions
        expect(request.body.query).to.include('getPresignedUrls')

        // Response assertions
        expect(response?.statusCode).to.equal(200)
        expect(response?.body.data.getPresignedUrls).to.be.an('array')
        expect(response?.body.data.getPresignedUrls[0]).to.have.property('url')
      })
    })
  })

  describe('Form submission (API reliant)', () => {
    it('should do mutation calls to upload attachments to s3 bucket and create post details on form submit', () => {
      // Arrange
      const pdfFile = `${fixtureRoot}/dummy.pdf`

      cy.fixture(pdfFile).then((fileContent) => {
        attachFile(pdfFile, 'application/pdf', fileContent)
      })

      // Act
      cy.get('#title').type('Title')
      cy.get('#content').type('Content')
      cy.get('#categories').click()
      cy.get('#categories-multiselect-option-1').click()
      cy.get('[data-cy="create-post-submit-button"]').click()

      // Assert
      cy.wait('@putPresignedUrl').then(({ request, response }) => {
        // Request assertions
        expect(request.method).to.equal('PUT')

        // Response assertions
        expect(response?.statusCode).to.equal(200)
      })

      cy.wait('@gqlCreateModerationPostMutation').then(({ request, response }) => {
        // Request assertions
        expect(request.body.query).to.include('createModerationPost')

        // Response assertions
        expect(response?.statusCode).to.equal(200)
        expect(response?.body.data.createModerationPost).to.be.an('object')
        expect(response?.body.data.createModerationPost).to.have.property('id')
        expect(response?.body.data.createModerationPost).to.have.property('title')
        expect(response?.body.data.createModerationPost).to.have.property('content')

        // Assert form reset
        cy.get('#title').should('have.value', '')
        cy.get('#content').should('have.value', '')
        cy.get('#categories').should('have.value', '')
        cy.get('#uploaded-attachments-list').should('not.exist')
      })
    })
  })
})
