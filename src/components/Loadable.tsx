import { Suspense } from 'react'
import Loader from './Loader'

const Loadable = (Component) => {
  const LoadableComponent = (props) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  )

  // Generate a displayName based on the component's name
  const componentName = Component.displayName || Component.name || 'Component'
  LoadableComponent.displayName = `Loadable(${componentName})`

  return LoadableComponent
}

export default Loadable
