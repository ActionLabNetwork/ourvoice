/* eslint-disable no-console */
import { constants, copyFileSync, cpSync, existsSync, readdirSync } from 'fs'

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

if (process.env.RUN_POST !== 'false') {
  readdirSync(appDir, { withFileTypes: true }).forEach((dirent) => {
    if (dirent.isDirectory()) copyEnvFile(`${appDir}${dirent.name}`)
  })

  // deployment env file
  copyEnvFile('./deployment')

  // copy configuration files
  copyFileSync('./config/config.yml', './apps/ourvoice-api/config/config.yml')
  copyFileSync(
    './config/config.yml',
    './apps/ourvoice-auth-api/config/config.yml'
  )

  // copy logo and favicon to ourvoice-app assets folder
  cpSync('./config/brand/default/assets', './apps/ourvoice-app/src/assets', {
    recursive: true,
  })
}
