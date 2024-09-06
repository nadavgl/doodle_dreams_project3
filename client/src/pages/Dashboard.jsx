import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Slider from "react-slick"; // Import the Slick carousel

import { DELETE_PROMPT, GENERATE_IMAGE } from '../graphql/mutations';
import { GET_USER_PROMPTS, GET_ALL_PROMPTS } from '../graphql/queries';
import ImageModal from '../components/ImageModal';

const initialFormData = {
  animal_1: '',
  animal_2: '',
  activity: '',
  location: '',
  weather: '',
  imageUrl: ''
};

const choices = {
  animal_1: ['🐢 Turtle', '🐒 Monkey', '🐶 Dog', '🐱 Cat', '🐸 Frog', '🐻 Bear', '🐅 Tiger', '🐧 Penguin', '🦉Owl', '🦊Fox'],
  animal_2: ['🦁 Lion', '🐅 Tiger', '🐻 Bear', '🦅 Eagle', '🦔 Porcupine', '🦝 Raccoon', '🐊 Alligator', '🦩 Ostrich', '🐇 Rabbit'],
  activity: ['🎨 Painting', '🗿 Sculpting', '✍ Writing', '💃 Dancing', '📚 Reading', '🐾 Frolicking', '🏀 Playing basketball', '🥾 Hiking'],
  location: ['🏢 Studio', '🌳 Forest', '🏖 Beach', '🏔 Mountain', '🌵 Desert', '🌿 Grass', '🛖 Swamp'],
  weather: ['☀️ Sunny', '🌧 Rainy', '❄️ Snowy', '☁️ Cloudy']
};

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isNewImage, setIsNewImage] = useState(false); // New state to track if the image is newly generated
  const [formData, setFormData] = useState(initialFormData);
  const [imageUrl, setImageUrl] = useState('');
  const [spellingMode, setSpellingMode] = useState(false); // New state for Spelling mode

  const [deletePrompt] = useMutation(DELETE_PROMPT, {
    refetchQueries: [GET_USER_PROMPTS, GET_ALL_PROMPTS]
  });
  const [generateImage] = useMutation(GENERATE_IMAGE, {
    onCompleted: (data) => {
      setImageUrl(data.generateImage.imageUrl);
      setIsNewImage(true);  // Set to true when image is generated
    }
  });
  const { data: promptData } = useQuery(GET_USER_PROMPTS);

  const generateRandomFormData = () => {
    const randomValue = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setFormData({
      animal_1: randomValue(choices.animal_1),
      animal_2: randomValue(choices.animal_2),
      activity: randomValue(choices.activity),
      location: randomValue(choices.location),
      weather: randomValue(choices.weather),
      imageUrl: ''
    });
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const toggleSpellingMode = () => {
    setSpellingMode(!spellingMode);
    setFormData(initialFormData); // Reset form when toggling mode
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Set the placeholder image first
      setImageUrl('./images/painting.gif');
      setIsNewImage(true); // Ensure buttons appear for the new image
      setModalOpen(true); // Open the modal immediately

      const promptText = createPrompt();
      const imageResponse = await generateImage({ variables: { prompt: promptText } });

      // Replace the placeholder with the generated image URL
      setImageUrl(imageResponse.data.generateImage.imageUrl);
    } catch (error) {
      console.error('Error adding prompt or generating image:', error);
    }
  };

  const handleViewImage = (promptObj) => {
    setImageUrl(promptObj.imageUrl);
    setIsNewImage(false);  // Set to false when viewing an existing image
    setModalOpen(true);
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
    return `A scene with a ${formData.animal_1} and a ${formData.animal_2} doing ${formData.activity} in a ${formData.location} with ${formData.weather} weather. Make the image kid friendly.`;
  };

  // Slider settings for Slick carousel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      <div className="dash">
        <ImageModal
          initialFormData={initialFormData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          formData={formData}
          imageUrl={imageUrl}
          isNewImage={isNewImage}
        />

        <button onClick={toggleSpellingMode} className="button is-info">
          {spellingMode ? 'Disable Spelling Mode' : 'Enable Spelling Mode'}
        </button>

        <form className="form-pic column" onSubmit={handleSubmit}>
          <h2 className="text-center">Create Image</h2>
          {/* Form fields go here */}
          <button type="submit">Add 🎨</button>
        </form>

        <section className="prompt-container">
          <h1 className="doodstyle">Your Doodles:</h1>

          {!promptData?.getUserPrompts.length && <h2>No doodles have been added.</h2>}

          <Slider {...sliderSettings}>
            {promptData?.getUserPrompts.map((promptObj) => (
              <div key={promptObj._id} className="carousel-item">
                <article className="prompt-bg has-text-centered">
                  <p>Animal: {promptObj.animal_1}</p>
                  <p>Friend: {promptObj.animal_2}</p>
                  <p>Activity: {promptObj.activity}</p>
                  <p>Location: {promptObj.location}</p>
                  <p>Weather: {promptObj.weather}</p>
                  <button onClick={() => handleDeletePrompt(promptObj._id)}>Delete 🗑</button>
                  <button className="viewImg" onClick={() => handleViewImage(promptObj)}>View Image 👁️</button>
                </article>
              </div>
            ))}
          </Slider>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
