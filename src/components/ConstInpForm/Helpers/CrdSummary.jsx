import React, { useEffect, useState, useRef } from 'react'
// import { Formik, Field, Form, useField, useFormikContext } from 'formik'
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import ChainCard from './ChainCard'
const CrdSummary = (props) => {
  const { file, src, chains } = props
  // const [lines, setLines] = useState()
  // const [chainIds, setChainIds] = useState()
  // const [numChainIds, setNumChainIds] = useState()

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // if (file && src) {
      //   // split on newline and carrage return
      //   let lines = src.result.split(/[\r\n]+/g)
      //   // grab 7th column = chain IDs
      //   const chainId = /^\s*(?:\S+\s+){7}(\S+)/
      //   const allChainIds = []
      //   for (let line = 5; line < lines.length - 1; line++) {
      //     let id = chainId.exec(lines[line])[1]
      //     //   console.log(id)
      //     allChainIds.push(id)
      //   }
      //   // console.log('lines:', lines.length)
      //   // console.log('atoms:', allChainIds.length)
      //   const unique = allChainIds.filter(
      //     (value, index, array) => array.indexOf(value) === index
      //   )
      //   setChainIds(unique)
      //   // setFieldValue(chains, chainIds)
      //   setNumChainIds(unique.length)
      //   // console.log('unique Chain IDs', unique)
      //   setLines(allChainIds.length)
      //   // console.log(lines.slice(7, 8))
      // }
      console.log(chains)
      console.log('effect ran')
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, file, chains])

  const chainIds = chains.map((chain, index) => (
    <li key={index}>
      {' '}
      CHAIN {index + 1} : {chain.id}{' '}
    </li>
  ))

  const chainIds2 = chains.map((chain, index) => (
    <React.Fragment>
      <Typography>
        <b>CHAIN {index + 1}:</b> {chain.id}
      </Typography>
      <Typography>
        <b>CHAIN {index + 1}:</b> NUMBER OF RESIDUES: {chain.num_res}
      </Typography>
      <Divider />
    </React.Fragment>
  ))

  const chainCard = (
    <Grid container spacing={3}>
      {chains.map((chain) => (
        <Grid item xs={12} md={3} lg={3} key={chain.id}>
          <ChainCard chain={chain} />
        </Grid>
      ))}
    </Grid>
  )

  return chainCard
}

export default CrdSummary
