import { useQuery } from '@apollo/client'

import { GET_ALL_TURTLES } from '../graphql/queries'

function HomePage() {
  const { data: turtleData } = useQuery(GET_ALL_TURTLES)

  return (
    <>
      <section className="hero column align-center"></section>

      <section className="turtle-container">
        <h1>See the turtles our users are adding:</h1>

        {!turtleData?.getAllTurtles.length && <h2>No turtles have beed added.</h2>}

        <div className="turtle-output">
          {turtleData?.getAllTurtles.map(turtleObj => (
            <article key={turtleObj._id}>
              <h3>{turtleObj.name}</h3>
              <p>Weapon: {turtleObj.weapon}</p>
              <p>Headband: {turtleObj.headbandColor}</p>
              <p>Added By: {turtleObj.user.username}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default HomePage