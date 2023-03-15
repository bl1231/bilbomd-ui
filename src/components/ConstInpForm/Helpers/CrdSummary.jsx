import React, { useEffect, useState, useRef } from 'react'
import { Typography } from '@mui/material'

const CrdSummary = (props) => {
  const { file, src, variant = 'normal' } = props
  const [lines, setLines] = useState()
  const [chainIds, setChainIds] = useState()
  const [numChainIds, setNumChainIds] = useState()

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      if (file && src) {
        // split on newline and carrage return
        let lines = src.result.split(/[\r\n]+/g)
        // grab 7th column = chain IDs
        const chainId = /^\s*(?:\S+\s+){7}(\S+)/
        const allChainIds = []
        for (let line = 5; line < lines.length - 1; line++) {
          let id = chainId.exec(lines[line])[1]
          //   console.log(id)
          allChainIds.push(id)
        }
        console.log('lines:', lines.length)
        console.log('atoms:', allChainIds.length)
        const unique = allChainIds.filter(
          (value, index, array) => array.indexOf(value) === index
        )
        setChainIds(unique)
        setNumChainIds(unique.length)
        console.log('unique Chain IDs', unique)
        setLines(allChainIds.length)
        // console.log(lines.slice(7, 8))
      }
    }
    return () => (effectRan.current = true)
  }, [src, file])

  return (
    <React.Fragment>
      <Typography>FILE NAME: {file.name}</Typography>
      <Typography>ATOMS: {lines}</Typography>
      <Typography>NUMBER OF CHAINS: {numChainIds}</Typography>
      <Typography>CHAINS: {chainIds}</Typography>
    </React.Fragment>
  )
}

export default CrdSummary
