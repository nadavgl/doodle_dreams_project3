import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PROMPT, DELETE_PROMPT, GENERATE_IMAGE } from '../graphql/mutations';
import { GET_USER_PROMPTS, GET_ALL_PROMPTS } from '../graphql/queries';
import ImageModal from '../components/ImageModal';

const initialFormData = {
  animal_1: '',
  animal_2: '',
  activity: '',
  location: '',
  weather: ''
};

const choices = {
  animal_1: ['Turtle', 'Monkey', 'Dog', 'Cat', 'Frog', 'Bear', 'Tiger', 'Salmon'],
  animal_2: ['Lion', 'Tiger', 'Bear', 'Eagle'],
  activity: ['Painting', 'Sculpting', 'Writing', 'Dancing'],
  location: ['Studio', 'Forest', 'Beach', 'Mountain'],
  weather: ['Sunny', 'Rainy', 'Snowy', 'Cloudy']
};

function Dashboard() {
  const [formData, setFormData] = useState(initialFormData);
  const [addPrompt] = useMutation(ADD_PROMPT, {
    refetchQueries: [GET_USER_PROMPTS, GET_ALL_PROMPTS]
  });
  const [deletePrompt] = useMutation(DELETE_PROMPT, {
    refetchQueries: [GET_USER_PROMPTS, GET_ALL_PROMPTS]
  });
  const [generateImage] = useMutation(GENERATE_IMAGE, {
    onCompleted: (data) => {
      setImageUrl(data.generateImage.imageUrl);
    }
  });
  const { data: promptData } = useQuery(GET_USER_PROMPTS);

  const [imageUrl, setImageUrl] = useState('');

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Add prompt

      // Generate the image
      const promptText = createPrompt();
      const imageResponse = await generateImage({ variables: { prompt: promptText } });
      console.log(imageResponse)
      await addPrompt({
        variables: {
          ...formData,
          imageUrl: imageResponse.data.generateImage.imageUrl
        }

      });

      // Clear form after submission
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error adding prompt or generating image:', error);
    }
  };

  const handleDeletePrompt = async (id) => {
    try {
      await deletePrompt({
        variables: {
          prompt_id: id,
        },
      });
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const createPrompt = () => {
    return `A scene with a ${formData.animal_1} and a ${formData.animal_2} doing ${formData.activity} in a ${formData.location} with ${formData.weather} weather. Make the image kid friendly`;
  };

  return (
    <>
      <ImageModal />
      <form onSubmit={handleSubmit} className="column">
        <h2 className="text-center">Create Image</h2>

        <label htmlFor="animal_1">Select Animal 1:</label>
        <select name="animal_1" value={formData.animal_1} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.animal_1.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>

        <label htmlFor="animal_2">Select Animal 2:</label>
        <select name="animal_2" value={formData.animal_2} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.animal_2.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>

        <label htmlFor="activity">Select Activity:</label>
        <select name="activity" value={formData.activity} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.activity.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>

        <label htmlFor="location">Select Location:</label>
        <select name="location" value={formData.location} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.location.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>

        <label htmlFor="weather">Select Weather:</label>
        <select name="weather" value={formData.weather} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {choices.weather.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>

        <button type="submit">Add</button>
      </form>

      <section className="prompt-container">
        <h1>Your Prompts:</h1>

        {!promptData?.getUserPrompts.length && <h2>No prompts have been added.</h2>}

        <div className="prompt-output">
          {promptData?.getUserPrompts.map((promptObj) => (
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

      {imageUrl && (
        <section>
          <h2>Generated Image:</h2>
          <img src={imageUrl} alt="Generated" />
        </section>
      )}
    </>
  );
}

export default Dashboard;
