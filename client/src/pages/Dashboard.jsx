import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { ADD_PROMPT, DELETE_PROMPT } from '../graphql/mutations'
import { GET_USER_PROMPTS, GET_ALL_PROMPTS } from '../graphql/queries'

const initialFormData = {
  animal_1: '',
  animal_2: '',
  activity: '',
  location: '',
  weather: ''
}

const choices = {
  animal_1: ['Turtle', 'Monkey', 'Dog', 'Cat'],
  animal_2: ['Lion', 'Tiger', 'Bear', 'Eagle'],
  activity: ['Painting', 'Sculpting', 'Writing', 'Dancing'],
  location: ['Studio', 'Forest', 'Beach', 'Mountain'],
  weather: ['Sunny', 'Rainy', 'Snowy', 'Cloudy']
}

function Dashboard() {
  const [formData, setFormData] = useState(initialFormData)
  const [addPrompt] = useMutation(ADD_PROMPT, {
    variables: formData,
    refetchQueries: [GET_USER_PROMPTS, GET_ALL_PROMPTS]
  })
  const [deletePrompt] = useMutation(DELETE_PROMPT, {
    refetchQueries: [GET_USER_PROMPTS, GET_ALL_PROMPTS]
  })
  const { data: promptData } = useQuery(GET_USER_PROMPTS)

  const handleInputChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const res = await addPrompt()

    console.log(res)

    setFormData({
      ...initialFormData
    })
  }

  const handleDeletePrompt = async (id) => {
    try {
      await deletePrompt({
        variables: {
          prompt_id: id
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="column">
        <h2 className="text-center">Create Image</h2>

        <label htmlFor="animal_1">Select Animal 1:</label>
        <select name="animal_1" value={formData.animal_1} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.animal_1.map(choice => (
            <option key={choice} value={choice}>{choice}</option>
          ))}
        </select>

        <label htmlFor="animal_2">Select Animal 2:</label>
        <select name="animal_2" value={formData.animal_2} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.animal_2.map(choice => (
            <option key={choice} value={choice}>{choice}</option>
          ))}
        </select>

        <label htmlFor="activity">Select Activity:</label>
        <select name="activity" value={formData.activity} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.activity.map(choice => (
            <option key={choice} value={choice}>{choice}</option>
          ))}
        </select>

        <label htmlFor="location">Select Location:</label>
        <select name="location" value={formData.location} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.location.map(choice => (
            <option key={choice} value={choice}>{choice}</option>
          ))}
        </select>

        <label htmlFor="weather">Select Weather:</label>
        <select name="weather" value={formData.weather} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.weather.map(choice => (
            <option key={choice} value={choice}>{choice}</option>
          ))}
        </select>

        <button>Add</button>
      </form>

      <section className="prompt-container">
        <h1>Your Prompts:</h1>

        {!promptData?.getUserPrompts.length && <h2>No prompts have been added.</h2>}

        <div className="prompt-output">
          {promptData?.getUserPrompts.map(promptObj => (
            <article key={promptObj._id}>
              <p>Animal 1: {promptObj.animal_1}</p>
              <p>Animal 2: {promptObj.animal_2}</p>
              <p>Activity: {promptObj.activity}</p>
              <p>Location: {promptObj.location}</p>
              <p>Weather: {promptObj.weather}</p>
              <button onClick={() => handleDeletePrompt(promptObj._id)}>Delete</button>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Dashboard
