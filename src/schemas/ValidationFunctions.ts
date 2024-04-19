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

const isPsfData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`validate if ${file.name} isPsfData`)
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      const lines = (reader.result as string).split(/[\r\n]+/g)
      const atomRegex =
        /^\s*\d+\s+[A-Z]{4}\s+\d+\s+[A-Z]{3}\s+[a-zA-Z0-9_']+\s+[a-zA-Z0-9_']+\s+-?\d+\.\d+(?:[eE][+-]?\d+)?\s+\d+\.\d{4,}(?:[eE][+-]?\d+)?\s+\d+.*$/

      if (!lines[0].includes('PSF')) {
        console.log('first line does not contain PSF')
        resolve(false)
        return
      }

      if (!lines.some((line) => line.trim().endsWith('!NTITLE'))) {
        console.log('NTITLE missing')
        resolve(false)
        return
      }

      // Find the line containing !NATOM and capture the preceding number
      const natomMatch = lines.find((line) => /\d+\s+!NATOM/.test(line))
      if (!natomMatch) {
        resolve(false)
        return
      }

      const natomResult = natomMatch.match(/(\d+)\s+!NATOM/)
      // console.log('natomResult = ', natomResult)
      if (!natomResult) {
        resolve(false)
        return
      }

      const natom = parseInt(natomResult[1], 10)
      console.log('natom expected = ', natom)
      if (isNaN(natom)) {
        resolve(false)
        return
      }

      const natomLineIndex = lines.findIndex((line) =>
        /\d+\s+!NATOM/.test(line)
      )
      // console.log('natomLineIndex =', natomLineIndex)
      if (natomLineIndex === -1) {
        resolve(false)
        return
      }

      // Check for atom lines directly following the !NATOM line
      const atomLines = lines.slice(
        natomLineIndex + 1,
        natomLineIndex + 1 + natom
      )
      console.log('num atom lines = ', atomLines.length)
      if (atomLines.length !== natom) {
        resolve(false)
        return
      }

      // Verify each atom line against the regex
      for (const line of atomLines) {
        if (!atomRegex.test(line)) {
          console.log('Failed atom regex:', line)
          resolve(false)
          return
        }
      }

      resolve(true)
    }

    reader.onerror = () => {
      resolve(false)
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
  const sciNotation = /-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g // Regular expression to match scientific notation

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = () => {
      const lines = (reader.result as string).split(/[\r\n]+/g) // Split the text into lines
      let dataLineCount = 0 // Counter for the number of data lines checked

      for (const line of lines) {
        if (line.startsWith('#')) {
          continue // Skip lines starting with '#'
        }

        if (sciNotation.test(line)) {
          const arr = line.match(sciNotation)
          if (arr && arr.length === 3) {
            resolve(true) // Resolve true if a line with exactly three scientific notations is found
            return // Exit the function once a match is found
          }
        }

        dataLineCount++ // Increment the data line counter
        if (dataLineCount >= 7) {
          break // Stop checking after 7 data lines
        }
      }

      resolve(false) // Resolve false if no valid line is found within the first 7 data lines
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

const isValidConstInpFile = (
  file: File,
  mode: string
): Promise<string | true> => {
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
        resolve('The last line must be "return".')
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
      // console.log('isValidConstInpFile mode: ', mode)
      if (mode === 'pdb') {
        const segidRegex = /segid\s+((PRO|DNA|RNA|CAR|CAL)[A-Z])\b/
        const validSegid = lines
          .filter((line) => line.startsWith('define'))
          .every((line) => segidRegex.test(line))
        console.log(file.name, ' valid segid is ', validSegid)
        if (!validSegid) {
          resolve('segid must be: PRO[A-Z], DNA[A-Z], RNA[A-Z], etc.')
          return
        }
      } else if (mode === 'crd_psf') {
        const segidRegex = /segid\s+([A-Z]{4})\b/
        const validSegid = lines
          .filter((line) => line.startsWith('define'))
          .every((line) => segidRegex.test(line))
        console.log(file.name, ' valid segid is ', validSegid)
        if (!validSegid) {
          resolve('segid must contain 4 uppercase letters [A-Z]')
          return
        }
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
  isPsfData,
  noSpaces,
  isSaxsData,
  containsChainId,
  isValidConstInpFile
}
