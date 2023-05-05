/* eslint-disable no-console */
import { execSync } from 'node:child_process'

import colors from 'picocolors'

function determineCurrentBranch(): string {
  return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' })
}
const protectedBranch = ['main', 'master']
const developmentBranch = ['dev', 'development']
const branch = determineCurrentBranch().trim()
console.log(`Current branch is ${branch}`)

if (protectedBranch.includes(branch)) {
  console.error(
    `  ${colors.bgRed(colors.white(' ERROR '))} ${colors.red(
      `Direct push to main/master is not allowed`
    )}
    ${colors.red(
      `Please create a pull request and merge to development branch after review.`
    )}
  `
  )

  process.exit(1)
}

if (developmentBranch.includes(branch)) {
  console.log(
    `  ${colors.bgGreen(colors.white(' SUCCESS '))} ${colors.green(
      `Pushed to development branch`
    )}
    `
  )
}
