import { useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { GET_ALL_PROMPTS } from '../graphql/queries'
import { useStore } from '../store'

function HomePage() {
  const { data: turtleData } = useQuery(GET_ALL_PROMPTS)
  const { state } = useStore() // Access user state
  const navigate = useNavigate()

  const handleDoodleClick = () => {
    if (state.user) {
      // If user is logged in, navigate to the dashboard
      navigate('/dashboard')
    } else {
      // If not logged in, navigate to the login page
      navigate('/auth')
    }
  }

  return (
    <section className="hero column align-center">
      <button className="button is-purple" onClick={handleDoodleClick}>
        Let's Doodle
      </button>
    </section>
  )
}

export default HomePage
