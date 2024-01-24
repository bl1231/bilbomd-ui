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
// import { ColorListName } from 'molstar/lib/mol-util/color/lists'
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
  assemblyId: number
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

  const createLoadParamsArray = async (job: BilboMDJob): Promise<PDBsToLoad[]> => {
    const loadParamsMap = new Map<string, LoadParams[]>()

    // Helper function to add LoadParams to the Map
    const addFilesToLoadParams = (fileName: string, numModels: number) => {
      let paramsArray = loadParamsMap.get(fileName)

      if (!paramsArray) {
        paramsArray = []
        loadParamsMap.set(fileName, paramsArray)
      }

      for (let assemblyId = 1; assemblyId <= numModels; assemblyId++) {
        paramsArray.push({
          url: `/jobs/${job.mongo.id}/results/${fileName}`,
          format: 'pdb',
          fileName: fileName,
          assemblyId: assemblyId
        })
      }
    }

    // Adding LoadParams based on job type and number of ensembles
    if (job.mongo.__t === 'BilboMd' && job.classic?.numEnsembles) {
      for (let i = 1; i <= job.classic.numEnsembles; i++) {
        const fileName = `ensemble_size_${i}_model.pdb`
        addFilesToLoadParams(fileName, i)
      }
    } else if (job.mongo.__t === 'BilboMdAuto' && job.auto?.numEnsembles) {
      for (let i = 1; i <= job.auto.numEnsembles; i++) {
        const fileName = `ensemble_size_${i}_model.pdb`
        addFilesToLoadParams(fileName, i)
      }
    } else if (job.mongo.__t === 'BilboMdScoper' && job.scoper?.foxsTopFile) {
      const pdbFilename = `scoper_combined_${job.scoper.foxsTopFile}`
      addFilesToLoadParams(pdbFilename, 1)
    }

    // Convert the Map values to an array of arrays
    return Array.from(loadParamsMap.values())
  }

  const fetchPdbData = async (url: string) => {
    try {
      const response = await axiosInstance.get(url, {
        responseType: 'text',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // console.log('fetch: ', url)
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
          layoutShowLeftPanel: true,

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
      // console.log(loadParamsArray)
      for (const loadParamsGroup of loadParamsArray) {
        const { url, format, fileName } = loadParamsGroup[0] // All items in group have same url, format, fileName
        const pdbData = await fetchPdbData(url)

        for (const { assemblyId } of loadParamsGroup) {
          const data = await window.molstar.builders.data.rawData({
            data: pdbData,
            label: fileName
          })
          const trajectory = await window.molstar.builders.structure.parseTrajectory(
            data,
            format
          )
          // console.log('traj: ', trajectory)
          // console.log('create model for assemblyId:', assemblyId)
          const model = await window.molstar.builders.structure.createModel(trajectory, {
            modelIndex: assemblyId
          })
          const struct = await window.molstar.builders.structure.createStructure(model)
          // console.log('struct: ', struct)
          await window.molstar.builders.structure.representation.addRepresentation(
            struct,
            {
              type: 'cartoon',
              color: 'structure-index',
              size: 'uniform',
              sizeParams: { value: 1.0 }
            }
          )
        }
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
