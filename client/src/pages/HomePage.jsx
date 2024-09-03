import { useQuery } from '@apollo/client'

import { GET_ALL_PROMPTS } from '../graphql/queries'

function HomePage() {
  const { data: turtleData } = useQuery(GET_ALL_PROMPTS)

  return (
    <>
      <section className="hero column align-center"></section>


    </>
  )
}

export default HomePage