/* eslint-disable no-console */
import { constants, copyFileSync, existsSync, readdirSync } from 'fs'

const appDir = './apps/'
const envTemplateName = '.env.template'

function copyEnvFile(directory: string) {
  if (
    existsSync(`${directory}/${envTemplateName}`) &&
    !existsSync(`${directory}/.env`)
  ) {
    copyFileSync(
      `${directory}/${envTemplateName}`,
      `${directory}/.env`,
      constants.COPYFILE_EXCL
    )
    console.log(`Copy ${directory}/${envTemplateName}`, `to ${directory}/.env`)
  }
}

readdirSync(appDir, { withFileTypes: true }).forEach((dirent) => {
  if (dirent.isDirectory()) copyEnvFile(`${appDir}${dirent.name}`)
})

// deployment env file
copyEnvFile('./deployment')
