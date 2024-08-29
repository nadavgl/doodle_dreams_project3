import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Protect from './components/Protect'

import HomePage from './pages/HomePage'
import AuthForm from './pages/AuthForm'
import Dashboard from './pages/Dashboard'

import { useStore } from './store'

function App() {
  const { state } = useStore()

  return (
    <>
      {state.loading && (
        <div className="overlay row justify-center align-center">
          <h1>Loading...</h1>
        </div>
      )}

      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={(
          <Protect requireAuth={false}>
            <AuthForm />
          </Protect>
        )} />
        <Route path="/dashboard" element={(
          <Protect requireAuth={true} >
            <Dashboard />
          </Protect>
        )} />
      </Routes>
    </>
  )
}

export default App
