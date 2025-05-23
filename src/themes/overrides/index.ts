// third-party
import { merge } from 'lodash'

// project import
import Alert from './Alert'
import AppBar from './AppBar'
import Accordion from './Accordion'
import Badge from './Badge'
import BackGround from './BackGround'
import BilboMdPipeline from './BilboMdPipeline'
import Button from './Button'
import CardContent from './CardContent'
import Checkbox from './Checkbox'
import Chip from './Chip'
import DataGrid from './DataGrid'
import Dialog from './Dialog'
import Footer from './Footer'
import IconButton from './IconButton'
import InputLabel from './InputLabel'
import LinearProgress from './LinearProgress'
import Link from './Link'
import ListItemIcon from './ListItemIcon'
import OutlinedInput from './OutlinedInput'
import Paper from './Paper'
import Tab from './Tab'
import TableCell from './TableCell'
import Tabs from './Tabs'
import Typography from './Typography'

import { Theme } from '@mui/material/styles'

export default function ComponentsOverrides(theme: Theme) {
  return merge(
    Alert(),
    AppBar(theme),
    Accordion(theme),
    Button(theme),
    Badge(theme),
    BackGround(theme),
    BilboMdPipeline(theme),
    CardContent(),
    Checkbox(theme),
    Chip(theme),
    DataGrid(theme),
    Dialog(theme),
    Footer(theme),
    IconButton(theme),
    InputLabel(theme),
    Paper(theme),
    LinearProgress(),
    Link(),
    ListItemIcon(theme),
    OutlinedInput(theme),
    Tab(theme),
    TableCell(theme),
    Tabs(),
    Typography()
  )
}
