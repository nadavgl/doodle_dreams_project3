import { useState, useEffect, useContext, createContext } from 'react'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../graphql/queries'

const StoreContext = createContext()

const initialState = {
  loading: true,
  user: null
}

export function StoreProvider(props) {
  const [state, setState] = useState(initialState)
  const { loading, data } = useQuery(GET_USER)

  useEffect(() => {
    if (!loading && data) {
      setState({
        ...state,
        user: data.getUser.user,
        loading: false
      })
    }
  }, [data])

  return (
    <StoreContext.Provider value={{
      state,
      setState
    }}>
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)