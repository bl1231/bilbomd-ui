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

// Let's break down the regex `/-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g`:

// 1. `/`: Delimiter for the start of the regular expression.
// 2. `-?`: Matches an optional hyphen `-`, which indicates a negative number.
// 3. `\d+`: Matches one or more digits (`\d` is a shorthand for digit characters `[0-9]`).
// 4. `(?:\.\d*)?`: This is a non-capturing group `(?: ... )?` that matches an optional decimal part of the number. It consists of:
//    - `\.`: Matches a dot character `.`.
//    - `\d*`: Matches zero or more digits after the decimal point.
// 5. `(?:[eE][+-]?\d+)?`: Another non-capturing group that matches an optional exponent part of the number. It consists of:
//    - `[eE]`: Matches either `e` or `E`, indicating the start of the exponent.
//    - `[+-]?`: Matches an optional sign (`+` or `-`) for the exponent.
//    - `\d+`: Matches one or more digits for the exponent.
// 6. `/`: Delimiter for the end of the regular expression.
// 7. `g`: Flags at the end of the regex indicating the global search, meaning it finds all matches rather than stopping after the first match.

// In summary, this regex pattern matches numbers in scientific notation format,
//  including optional negative sign, decimal part, and exponent part.
//  Examples of matches include `123`, `-123.45`, `1.23e4`, `-1.23e-4`, etc.

const isSaxsData = (file: File): Promise<boolean> => {
  const sciNotation = /-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      const lines = (reader.result as string).split(/[\r\n]+/g)
      for (let line = 0; line < 7; line++) {
        if (sciNotation.test(lines[line])) {
          const arr = lines[line].match(sciNotation)
          if (arr && arr.length === 3) {
            resolve(true)
          }
        }
      }
      resolve(false)
    }
  })
}

const containsChainId = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        const text = e.target.result as string
        const lines = text.split('\n')
        const isValid = lines.some((line) => {
          return (
            (line.startsWith('ATOM') || line.startsWith('HETATM')) &&
            /^[A-Za-z]$/.test(line[21])
          )
        })
        resolve(isValid)
      } else {
        reject(new Error('File load error: Event target or result is null'))
      }
    }
    reader.onerror = (e) => reject(new Error('Error reading file: ' + e))
    reader.readAsText(file)
  })
}

const isValidConstInpFile = (file: File): Promise<string | true> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (!e.target || !e.target.result) {
        reject(new Error('File load error: Event target or result is null'))
        return
      }

      const text = e.target.result as string
      const lines = text.split('\n').filter((line) => line.trim() !== '') // Filter out empty lines

      // Check if the last non-empty line is exactly 'return'
      if (lines.length === 0 || lines[lines.length - 1].trim() !== 'return') {
        resolve('The last non-empty line must be exactly "return".')
        return
      }

      // Check for at least one 'define' and one 'cons fix sele' line
      const hasDefine = lines.some((line) => line.startsWith('define'))
      if (!hasDefine) {
        resolve('At least one line must start with "define".')
        return
      }

      const hasConsFixSele = lines.some((line) =>
        line.startsWith('cons fix sele')
      )
      if (!hasConsFixSele) {
        resolve('At least one line must start with "cons fix sele".')
        return
      }

      // Check 'define' lines for 'segid' followed by the correct format
      const segidRegex = /segid\s+((PRO|DNA|RNA|CAR|CAL)[A-Z])\b/
      const validSegid = lines
        .filter((line) => line.startsWith('define'))
        .every((line) => segidRegex.test(line))
      if (!validSegid) {
        resolve('segid must be: PRO[A-Z], DNA[A-Z], RNA[A-Z], etc.')
        return
      }

      resolve(true) // All checks passed
    }

    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}

export {
  fromCharmmGui,
  isCRD,
  noSpaces,
  isSaxsData,
  containsChainId,
  isValidConstInpFile
}
