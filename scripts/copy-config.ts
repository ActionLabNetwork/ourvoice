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
}

if (process.env.DOCKER_BUILD === 'true') {
  //copy files for docker APPS build
  copyFileSync('./Dockerfile-for-apps.template', './apps/auth-api/Dockerfile')
  copyFileSync(
    './Dockerfile-for-apps.template',
    './apps/ourvoice-api/Dockerfile'
  )
  copyFileSync(
    './Dockerfile-for-apps.template',
    './apps/ourvoice-admin/Dockerfile'
  )
  copyFileSync(
    './Dockerfile-for-apps.template',
    './apps/ourvoice-app/Dockerfile'
  )
}
