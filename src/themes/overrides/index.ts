// third-party
import { merge } from 'lodash'

// project import
import Alert from './Alert'
import AppBar from './AppBar'
import Accordion from './Accordion'
import Badge from './Badge'
import BackGround from './BackGround'
import Button from './Button'
import CardContent from './CardContent'
import Checkbox from './Checkbox'
import Chip from './Chip'
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

// ==============================|| OVERRIDES - MAIN ||============================== //

export default function ComponentsOverrides(theme) {
  return merge(
    Alert(),
    AppBar(theme),
    Accordion(theme),
    Button(theme),
    Badge(theme),
    BackGround(theme),
    CardContent(),
    Checkbox(theme),
    Chip(theme),
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
