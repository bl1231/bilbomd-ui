import { useEffect, useRef, createRef } from 'react'
import { Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import { axiosInstance } from 'app/api/axios'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import { BilboMDJob } from 'types/interfaces'
import { createPluginUI } from 'molstar/lib/mol-plugin-ui'
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec'
import { PluginLayoutControlsDisplay } from 'molstar/lib/mol-plugin/layout'
import { ObjectKeys } from 'molstar/lib/mol-util/type-helpers'
import { PluginConfig } from 'molstar/lib/mol-plugin/config'
import { PluginSpec } from 'molstar/lib/mol-plugin/spec'
import { PluginBehaviors } from 'molstar/lib/mol-plugin/behavior'
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18'
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context'
import { ShowButtons, ViewportComponent } from './Viewport'
import { BuiltInTrajectoryFormat } from 'molstar/lib/mol-plugin-state/formats/trajectory'
import 'molstar/lib/mol-plugin-ui/skin/light.scss'

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}))

declare global {
  interface Window {
    molstar?: PluginUIContext
  }
}

type LoadParams = {
  url: string
  format: BuiltInTrajectoryFormat
  fileName: string
  isBinary?: boolean
  assemblyId?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PDBsToLoad = LoadParams[]

const DefaultViewerOptions = {
  extensions: ObjectKeys({}),
  layoutIsExpanded: true,
  layoutShowControls: false,
  layoutShowRemoteState: false,
  layoutControlsDisplay: 'reactive' as PluginLayoutControlsDisplay,
  layoutShowSequence: false,
  layoutShowLog: false,
  layoutShowLeftPanel: false,

  viewportShowExpand: PluginConfig.Viewport.ShowExpand.defaultValue,
  viewportShowControls: PluginConfig.Viewport.ShowControls.defaultValue,
  viewportShowSettings: PluginConfig.Viewport.ShowSettings.defaultValue,
  viewportShowSelectionMode: PluginConfig.Viewport.ShowSelectionMode.defaultValue,
  viewportShowAnimation: PluginConfig.Viewport.ShowAnimation.defaultValue,
  pluginStateServer: PluginConfig.State.DefaultServer.defaultValue,
  volumeStreamingServer: PluginConfig.VolumeStreaming.DefaultServer.defaultValue,
  pdbProvider: PluginConfig.Download.DefaultPdbProvider.defaultValue,
  emdbProvider: PluginConfig.Download.DefaultEmdbProvider.defaultValue
}

interface MolstarViewerProps {
  job: BilboMDJob
}

const MolstarViewer = ({ job }: MolstarViewerProps) => {
  const token = useSelector(selectCurrentToken)

  const createLoadParamsArray = async (job: BilboMDJob): Promise<PDBsToLoad> => {
    const loadParamsArray: LoadParams[] = []

    // Helper function to generate file names and load parameters
    const addFilesToLoadParams = (numEnsembles: number) => {
      for (let i = 1; i <= numEnsembles; i++) {
        const fileName = `ensemble_size_${i}_model.pdb`
        loadParamsArray.push({
          url: `/jobs/${job.mongo.id}/results/${fileName}`,
          format: 'pdb',
          fileName: fileName
        })
      }
    }

    if (job.mongo.__t === 'BilboMd' && job.classic?.numEnsembles) {
      addFilesToLoadParams(job.classic.numEnsembles)
    } else if (job.mongo.__t === 'BilboMdAuto' && job.auto?.numEnsembles) {
      addFilesToLoadParams(job.auto.numEnsembles)
    } else if (job.mongo.__t === 'BilboMdScoper' && job.scoper?.foxsTopFile) {
      const pdbFilename = `scoper_combined_${job.scoper.foxsTopFile}`
      loadParamsArray.push({
        url: `/jobs/${job.mongo.id}/results/${pdbFilename}`,
        format: 'pdb',
        fileName: pdbFilename
      })
    }

    return loadParamsArray
  }

  const fetchPdbData = async (url: string) => {
    try {
      const response = await axiosInstance.get(url, {
        responseType: 'text',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching PDB data:', error)
      // Optionally, return something to indicate an error to the caller
      return null
    }
  }

  const parent = createRef<HTMLDivElement>()

  // Attempt to prevent React Strictmode from loading molstar twice in dev mode.
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) {
      return
    }
    hasRun.current = true
    const showButtons = true
    async function init() {
      const o = {
        ...DefaultViewerOptions,
        ...{
          layoutIsExpanded: false,
          layoutShowControls: false,
          layoutShowRemoteState: false,
          layoutShowSequence: false,
          layoutShowLog: false,
          layoutShowLeftPanel: false,

          viewportShowExpand: false,
          viewportShowControls: true,
          viewportShowSettings: false,
          viewportShowSelectionMode: false,
          viewportShowAnimation: false
        }
      }
      const defaultSpec = DefaultPluginUISpec()
      const spec: PluginUISpec = {
        actions: defaultSpec.actions,
        behaviors: [
          PluginSpec.Behavior(PluginBehaviors.Representation.HighlightLoci, {
            mark: false
          }),
          PluginSpec.Behavior(PluginBehaviors.Representation.DefaultLociLabelProvider),
          PluginSpec.Behavior(PluginBehaviors.Camera.FocusLoci),

          PluginSpec.Behavior(PluginBehaviors.CustomProps.StructureInfo),
          PluginSpec.Behavior(PluginBehaviors.CustomProps.Interactions),
          PluginSpec.Behavior(PluginBehaviors.CustomProps.SecondaryStructure)
        ],
        animations: defaultSpec.animations,
        customParamEditors: defaultSpec.customParamEditors,
        layout: {
          initial: {
            isExpanded: o.layoutIsExpanded,
            showControls: o.layoutShowControls,
            controlsDisplay: o.layoutControlsDisplay
          }
        },
        components: {
          ...defaultSpec.components,
          controls: {
            ...defaultSpec.components?.controls,
            top: o.layoutShowSequence ? undefined : 'none',
            bottom: o.layoutShowLog ? undefined : 'none',
            left: o.layoutShowLeftPanel ? undefined : 'none'
          },
          remoteState: o.layoutShowRemoteState ? 'default' : 'none',
          viewport: {
            view: ViewportComponent
          }
        },
        config: [
          [PluginConfig.Viewport.ShowExpand, o.viewportShowExpand],
          [PluginConfig.Viewport.ShowControls, o.viewportShowControls],
          [PluginConfig.Viewport.ShowSettings, o.viewportShowSettings],
          [PluginConfig.Viewport.ShowSelectionMode, o.viewportShowSelectionMode],
          [PluginConfig.Viewport.ShowAnimation, o.viewportShowAnimation],
          [PluginConfig.State.DefaultServer, o.pluginStateServer],
          [PluginConfig.State.CurrentServer, o.pluginStateServer],
          [PluginConfig.VolumeStreaming.DefaultServer, o.volumeStreamingServer],
          [PluginConfig.Download.DefaultPdbProvider, o.pdbProvider],
          [PluginConfig.Download.DefaultEmdbProvider, o.emdbProvider],
          // [PluginConfig.item('showButtons', true), true]
          [ShowButtons, showButtons]
        ]
      }

      window.molstar = await createPluginUI({
        target: parent.current as HTMLDivElement,
        spec,
        render: renderReact18
      })
      const loadParamsArray = await createLoadParamsArray(job)

      for (const { url, format, fileName } of loadParamsArray) {
        const pdbData = await fetchPdbData(url)
        const data = await window.molstar.builders.data.rawData({
          data: pdbData,
          label: fileName
        })

        const trajectory = await window.molstar.builders.structure.parseTrajectory(
          data,
          format
        )

        const model = await window.molstar.builders.structure.createModel(trajectory)

        const struct = await window.molstar.builders.structure.createStructure(model)

        await window.molstar.builders.structure.representation.addRepresentation(struct, {
          type: 'ball-and-stick',
          color: 'secondary-structure',
          size: 'uniform',
          sizeParams: { value: 3.33 },
          typeParams: { aromaticBonds: true }
        })
      }
    }

    init()

    return () => {
      window.molstar?.dispose()
      window.molstar = undefined
      hasRun.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Item>
      <Grid container>
        <div
          ref={parent}
          style={{
            width: '100%',
            height: '600px',
            position: 'relative'
          }}
        />
      </Grid>
    </Item>
  )
}

export default MolstarViewer
