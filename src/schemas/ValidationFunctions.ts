const fromCharmmGui = (file: File): Promise<boolean> => {
  const charmmGui = /CHARMM-GUI/
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      const lines = (reader.result as string).split(/[\r\n]+/g)
      for (let line = 0; line < 5; line++) {
        // console.log(charmmGui.test(lines[line]), 'line', line, lines[line])
        if (charmmGui.test(lines[line])) {
          // console.log(lines[line])
          resolve(true)
        }
      }
      resolve(false)
    }
  })
}

const isCRD = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      const lines = (reader.result as string).split(/[\r\n]+/)
      let starLinesCount = 0
      let foundEndPattern = false

      // Check for lines starting with *
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('*')) {
          starLinesCount++
          if (starLinesCount > 6) {
            // More than 6 lines starting with *, not matching the pattern
            break
          }
        } else {
          // Check if the line immediately after the last *-line matches the specified pattern
          if (starLinesCount >= 2 && starLinesCount <= 6) {
            const endPattern = /^\s+\d+\s+EXT$/
            foundEndPattern = endPattern.test(lines[i])
          }
          break // No more lines starting with * consecutively, exit the loop
        }
      }

      resolve(foundEndPattern)
    }
  })
}

const noSpaces = (file: File): Promise<boolean> => {
  const spaces = /\s/
  return new Promise((resolve) => {
    if (spaces.test(file.name)) {
      // console.log('false', file.name)
      resolve(false)
    }
    resolve(true)
  })
}

const isSaxsData = (file: File): Promise<boolean> => {
  const sciNotation = /-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      const lines = (reader.result as string).split(/[\r\n]+/g)
      for (let line = 0; line < 5; line++) {
        // console.log(charmmGui.test(lines[line]), 'line', line, lines[line])
        if (sciNotation.test(lines[line])) {
          // console.log('LINE: ', lines[line])
          const arr = lines[line].match(sciNotation)
          // console.log(arr)
          // console.log(arr.length)
          if (arr && arr.length === 3) {
            resolve(true)
          }
        }
      }
      resolve(false)
    }
  })
}

export { fromCharmmGui, isCRD, noSpaces, isSaxsData }
