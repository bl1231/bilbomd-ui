interface FoxsDataPoint {
  q: number
  exp_intensity: number
  model_intensity: number
  error: number
}

// interface ResidualDataPoints {
//   q: number
//   [key: `res_${number}`]: number
// }

interface FoxsData {
  filename: string
  chisq: number
  c1: number
  c2: number
  data: FoxsDataPoint[]
}

interface CombinedFoxsData {
  q: number
  exp_intensity: number
  error: number
  [key: `model_intensity_${number}`]: number
  [key: `residual_${number}`]: number
}

interface ScoperFoXSAnalysisProps {
  id: string
}
