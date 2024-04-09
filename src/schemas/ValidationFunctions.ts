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

export { fromCharmmGui, isCRD, noSpaces, isSaxsData }
