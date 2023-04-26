import colors from 'picocolors'

const currentBranch = `git rev-parse --abbrev-ref HEAD`
const protectedBranch = ['main', 'master']
const developmentBranch = ['dev', 'development']

console.log(`Current branch is ${currentBranch}`)

if (protectedBranch.includes(currentBranch)) {
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

if (developmentBranch.includes(currentBranch)) {
  console.log(
    `  ${colors.bgGreen(colors.white(' SUCCESS '))} ${colors.green(
      `Pushed to development branch`
    )}
    `
  )
}
