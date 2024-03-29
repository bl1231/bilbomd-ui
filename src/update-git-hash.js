import { writeFileSync } from 'fs'
import { execSync } from 'child_process'

// Function to execute shell command and retrieve git hash
function getGitHash() {
  try {
    // Execute shell command to retrieve git hash
    const gitHash = execSync('git rev-parse --short HEAD').toString().trim()
    return gitHash
  } catch (error) {
    console.error('Error retrieving git hash:', error)
    return ''
  }
}

// Get the git hash
const gitHash = getGitHash()

// Write the git hash to a file
writeFileSync('public/git-hash.txt', gitHash)

console.log('Git hash updated successfully:', gitHash)
