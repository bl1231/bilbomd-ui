import React, { useEffect, useState, useRef } from 'react'
// import { Formik, Field, Form, useField, useFormikContext } from 'formik'
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import ChainCard from './ChainCard'

const CrdSummary = (props) => {
  const { file, src, chains } = props

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      console.log(chains)
      console.log('effect ran')
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, file, chains])

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
