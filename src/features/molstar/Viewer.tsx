import { useEffect, createRef } from 'react'
import { Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import { axiosInstance } from 'app/api/axios'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../auth/authSlice'
import { createPluginUI } from 'molstar/lib/mol-plugin-ui'
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec'
import { PluginLayoutControlsDisplay } from 'molstar/lib/mol-plugin/layout'
import { ObjectKeys } from 'molstar/lib/mol-util/type-helpers'
import { PluginConfig } from 'molstar/lib/mol-plugin/config'
import { PluginSpec } from 'molstar/lib/mol-plugin/spec'
import { PluginBehaviors } from 'molstar/lib/mol-plugin/behavior'
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18'
import { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context'
// import 'molstar/lib/mol-plugin-ui/skin/dark.scss'
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

const DefaultViewerOptions = {
  extensions: ObjectKeys({}),
  layoutIsExpanded: true,
  layoutShowControls: true,
  layoutShowRemoteState: true,
  layoutControlsDisplay: 'reactive' as PluginLayoutControlsDisplay,
  layoutShowSequence: true,
  layoutShowLog: true,
  layoutShowLeftPanel: true,

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
  jobId: string
  foxsBest: string
}

const MolstarViewer = ({ jobId, foxsBest }: MolstarViewerProps) => {
  const token = useSelector(selectCurrentToken)

  const fetchPdbData = async (jobId: string, foxsBest: string) => {
    const pdbFilename = `scoper_combined_${foxsBest}`
    try {
      const response = await axiosInstance.get(`jobs/${jobId}/results/${pdbFilename}`, {
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

  useEffect(() => {
    async function init() {
      const o = {
        ...DefaultViewerOptions,
        ...{
          layoutIsExpanded: false,
          layoutShowControls: false,
          layoutShowRemoteState: false,
          layoutShowSequence: true,
          layoutShowLog: false,
          layoutShowLeftPanel: true,

          viewportShowExpand: false,
          viewportShowControls: true,
          viewportShowSettings: true,
          viewportShowSelectionMode: false,
          viewportShowAnimation: true
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
          remoteState: o.layoutShowRemoteState ? 'default' : 'none'
          // viewport: {
          //   view: ViewportComponent
          // }
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
          [PluginConfig.item('showButtons', true), true]
        ]
      }

      window.molstar = await createPluginUI({
        target: parent.current as HTMLDivElement,
        spec,
        render: renderReact18
      })

      const pdbData = await fetchPdbData(jobId, foxsBest)

      const data = await window.molstar.builders.data.rawData({ data: pdbData })

      const trajectory = await window.molstar.builders.structure.parseTrajectory(
        data,
        'pdb'
      )
      const model = await window.molstar.builders.structure.createModel(trajectory)
      const struct = await window.molstar.builders.structure.createStructure(model)
      await window.molstar.builders.structure.representation.applyPreset(
        struct,
        'illustrative'
      )
      // await window.molstar.builders.structure.hierarchy.applyPreset(trajectory, 'default')
    }
    init()
    return () => {
      window.molstar?.dispose()
      window.molstar = undefined
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, foxsBest])

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
