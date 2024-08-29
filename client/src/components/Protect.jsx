import { Navigate } from 'react-router-dom'

import { useStore } from '../store'

function Protect(props) {
  const { state } = useStore()

  if (!state.loading) {
    if (props.requireAuth && !state.user) {
      return <Navigate to="/auth" />
    }

    if (props.requireAuth && state.user) {
      return props.children
    }

    if (!props.requireAuth && state.user) {
      return <Navigate to="/dashboard" />
    }

    if (!props.requireAuth && !state.user) {
      return props.children
    }
  }


}

export default Protect