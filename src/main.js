const path = require('path')
const core = require('@actions/core')
const exec = require('@actions/exec')
const io = require('@actions/io')

async function run () {
  const image = core.getInput('image')
  const platform = core.getInput('platform')
  const sources = core.getMultilineInput('sources')
  const destination = core.getInput('destination')
  const cleanup = core.getBooleanInput('cleanup')

  core.info(`Check parameter: platform = ${platform}`)

  // Generate options for `docker cp`
  const optionsForCP = []
  if (core.getBooleanInput('follow-link')) options.push('--follow-link')

  // Pull image
  const pullArgs = ['pull']
  if (platform) {
    pullArgs.push('--platform', platform)
  }
  pullArgs.push(image)
  await exec.exec('docker', pullArgs)

  // Create container
  const createArgs = ['create']
  if (platform) {
    createArgs.push('--platform', platform)
  }
  createArgs.push(image)
  const { stdout: containerId } = await exec.getExecOutput(
    'docker', createArgs,
  )
  const { stdout: containerMetadata } = await exec.getExecOutput(
    'docker', ['inspect', containerId.trim()],
  )
  let [ container ] = JSON.parse(containerMetadata)

  // Create `destination` directory
  await io.mkdirP(destination)

  // Copy files from container to `destination`
  await Promise.all(sources.map(
    source => exec.exec('docker', ['cp', ...optionsForCP, `${container.Id}:${path.resolve(container.Config.WorkingDir, source)}`, destination])
  ))

  core.setOutput('destination', destination)

  if (cleanup) {
    // Remove container
    await exec.exec('docker', ['rm', container.Id])
  } else {
    core.setOutput('container', container)
  }
}

module.exports = {
  run
}