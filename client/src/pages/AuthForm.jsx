import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import { LOGIN_USER, REGISTER_USER } from '../graphql/mutations'

import { useStore } from '../store'

const initialFormData = {
  username: '',
  email: '',
  password: '',
  errorMessage: '',
  isLogin: true
}

function AuthForm() {
  const { setState } = useStore()
  const [formData, setFormData] = useState(initialFormData)
  const [loginUser] = useMutation(LOGIN_USER, {
    variables: formData
  })
  const [registerUser] = useMutation(REGISTER_USER, {
    variables: formData
  })
  const navigate = useNavigate()

  const toggleAuthState = (newValue) => {
    setFormData({
      ...formData,
      errorMessage: '',
      isLogin: newValue
    })
  }

  const handleInputChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      let res;

      if (formData.isLogin) {
        res = await loginUser()
        setState((oldState) => {
          return {
            ...oldState,
            user: res.data.loginUser.user
          }
        })
      } else {
        res = await registerUser()
        setState((oldState) => {
          return {
            ...oldState,
            user: res.data.loginUser.user
          }
        })
      }

      navigate('/dashboard')
    } catch (error) {
      setFormData({
        ...formData,
        errorMessage: error.message
      })
    }

  }

  return (
    <>
      <form onSubmit={handleSubmit} className="column">
        <h2 className="text-center">{formData.isLogin ? 'Log In' : 'Register'}</h2>

        {formData.errorMessage && <p className="error-message text-center">{formData.errorMessage}</p>}

        {!formData.isLogin && <input onChange={handleInputChange} name="username" type="text" placeholder="Enter your username" />}
        <input onChange={handleInputChange} name="email" type="email" placeholder="Enter your email address" autoComplete="email" />
        <input onChange={handleInputChange} name="password" type="password" placeholder="Enter your password" autoComplete="current-password" />

        <button>Submit</button>

        {formData.isLogin ? (
          <p className="text-center">Need an Account? <span onClick={() => toggleAuthState(false)}>Click Here</span></p>
        ) : (
          <p className="text-center">Already Registered? <span onClick={() => toggleAuthState(true)}>Click Here</span></p>
        )}
      </form>
    </>
  )
}

export default AuthForm