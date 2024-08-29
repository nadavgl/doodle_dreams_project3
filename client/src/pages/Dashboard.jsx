import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { ADD_TURTLE, DELETE_TURTLE } from '../graphql/mutations'
import { GET_USER_TURTLES, GET_ALL_TURTLES } from '../graphql/queries'

const initialFormData = {
  name: '',
  weapon: '',
  headbandColor: ''
}

function Dashboard() {
  const [formData, setFormData] = useState(initialFormData)
  const [addTurtle] = useMutation(ADD_TURTLE, {
    variables: formData,
    refetchQueries: [GET_USER_TURTLES, GET_ALL_TURTLES]
  })
  const [deleteTurtle] = useMutation(DELETE_TURTLE, {
    refetchQueries: [GET_USER_TURTLES, GET_ALL_TURTLES]
  })
  const { data: turtleData } = useQuery(GET_USER_TURTLES)

  const handleInputChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const res = await addTurtle()

    console.log(res)

    setFormData({
      ...initialFormData
    })
  }

  const handleDeleteTurtle = async (id) => {
    try {
      await deleteTurtle({
        variables: {
          turtle_id: id
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="column">
        <h2 className="text-center">Add a Ninja Turtle</h2>

        <input type="text" onChange={handleInputChange} value={formData.name} name="name" placeholder="Enter the Turtle's name (Must be a renaissance artist)" />
        <input type="text" onChange={handleInputChange} value={formData.weapon} name="weapon" placeholder="Enter the Turtle's weapon" />
        <input type="text" onChange={handleInputChange} value={formData.headbandColor} name="headbandColor" placeholder="Enter the Turtle's headband color" />

        <button>Add</button>
      </form>

      <section className="turtle-container">
        <h1>Your Turtles:</h1>

        {!turtleData?.getUserTurtles.length && <h2>No turtles have beed added.</h2>}

        <div className="turtle-output">
          {turtleData?.getUserTurtles.map(turtleObj => (
            <article key={turtleObj._id}>
              <h3>{turtleObj.name}</h3>
              <p>Weapon: {turtleObj.weapon}</p>
              <p>Headband: {turtleObj.headbandColor}</p>
              <button onClick={() => handleDeleteTurtle(turtleObj._id)}>Delete</button>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Dashboard