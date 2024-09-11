import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Slider from "react-slick"; // Import the Slick carousel
import Select from 'react-select';


import { DELETE_PROMPT, GENERATE_IMAGE } from '../graphql/mutations';
import { GET_USER_PROMPTS, GET_ALL_PROMPTS } from '../graphql/queries';
import ImageModal from '../components/ImageModal';

const initialFormData = {
  animal_1: '',
  animal_2: '',
  activity: '',
  location: '',
  weather: '',
  imageUrl: '',
  animal_1_spelling: { value: '', label: '' }, // Change to object
  animal_2_spelling: { value: '', label: '' }, // Change to object
};

const choices = {
  animal_1: ['🐢 Turtle', '🐒 Monkey', '🐶 Dog', '🐱 Cat', '🐸 Frog', '🐻 Bear', '🐅 Tiger', '🐧 Penguin', '🦉Owl', '🦊Fox'],
  animal_2: ['🦁 Lion', '🐅 Tiger', '🐻 Bear', '🦅 Eagle', '🦔 Porcupine', '🦝 Raccoon', '🐊 Alligator', '🦩 Ostrich', '🐇 Rabbit'],
  activity: ['🎨 Painting', '🗿 Sculpting', '✍ Writing', '💃 Dancing', '📚 Reading', '🐾 Frolicking', '🏀 Playing basketball', '🥾 Hiking', '🎸 Playing guitar'],
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

    const newFormData = {
      animal_1: randomValue(choices.animal_1),
      animal_2: randomValue(choices.animal_2),
      activity: randomValue(choices.activity),
      location: randomValue(choices.location),
      weather: randomValue(choices.weather),
      imageUrl: '',
      // Set spelling fields to empty objects in spelling mode
      animal_1_spelling: spellingMode ? { value: '', label: '' } : initialFormData.animal_1_spelling,
      animal_2_spelling: spellingMode ? { value: '', label: '' } : initialFormData.animal_2_spelling
    };

    setFormData(newFormData);
  };

  // const handleInputChange = (event) => {
  //   setFormData({
  //     ...formData,
  //     [event.target.name]: event.target.value,
  //   });
  // };

  const toggleSpellingMode = () => {
    setSpellingMode(!spellingMode);
    setFormData(initialFormData); // Reset form when toggling mode
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (spellingMode) {
      // Extract animal names without emojis
      const animal1Name = formData.animal_1.replace(/[^a-zA-Z]/g, '').toLowerCase().trim();
      const animal2Name = formData.animal_2.replace(/[^a-zA-Z]/g, '').toLowerCase().trim();

      // Compare with user spelling input, accessing the 'value' property
      if (formData.animal_1_spelling.value.toLowerCase().trim() !== animal1Name ||
          formData.animal_2_spelling.value.toLowerCase().trim() !== animal2Name) {
        alert("Spelling is incorrect. Please spell the animals correctly.");
        return;
      }
    }

    try {
      // Set the placeholder image first (painting.gif)
      setImageUrl('./images/painting.gif');  // Make sure to set the correct path to painting.gif
      setIsNewImage(true); // Ensure buttons appear for the new image
      setModalOpen(true); // Open the modal immediately

      const promptText = createPrompt();

      // Generate the actual image after setting the placeholder
      const imageResponse = await generateImage({ variables: { prompt: promptText } });

      // Replace the placeholder with the newly generated image URL
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

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
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

  const handleSelectChange = (selectedOption, fieldName) => {
    // Make sure you're updating the correct field in formData
    setFormData({
      ...formData,
      [fieldName]: selectedOption.value,
    });

    // Add this line for debugging
    console.log(formData);
  };
  const customStyles = {
    menuPortal: provided => ({ ...provided, zIndex: 9999 }),
    menu: provided => ({ ...provided, zIndex: 9999 }),
    menuList: (provided, state) => ({
      ...provided,
      display: state.options.length ? 'block' : 'none',
    }),
  };

  const spellingInputStyles = {
    ...customStyles, // Inherit other styles
    dropdownIndicator: (provided, state) => ({
      ...provided,
      display: 'none',
    }),
  };

  const formatChoicesForSelect = (choicesArray, spellingMode) => {
    return choicesArray.map(choice => {
      const emojiRegex = /[\p{Emoji}\u200d]/gu; // Regex to match emojis
      const emojiMatch = choice.match(emojiRegex);
      const emoji = emojiMatch ? emojiMatch[0] : ''; // Extract the emoji or set to empty string if no match

      return {
        value: choice,
        label: spellingMode ? emoji : choice
      };
    });
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

          {spellingMode ? (
            <>
              <label htmlFor="animal_1">Select Animal and Spell it:</label>
              <Select
                options={formatChoicesForSelect(choices.animal_1, spellingMode)}
                value={formatChoicesForSelect(choices.animal_1, spellingMode).find(option => option.value === formData.animal_1)}
                onChange={(selectedOption) => handleSelectChange(selectedOption, 'animal_1')}
                isSearchable={false}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                styles={customStyles}
              />
              <Select // Modified animal_2_spelling Select component
                value={formData.animal_1_spelling}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    animal_1_spelling: selectedOption || { value: '', label: '' }
                  })
                }
                styles={spellingInputStyles}
                isClearable
                // Key changes below:
                inputValue={formData.animal_1_spelling.value || ''} // Ensure inputValue is always a string
                onInputChange={(inputValue, { action }) => {
                  if (action === 'input-change') { // Only update on actual input changes
                    setFormData({
                      ...formData,
                      animal_1_spelling: { value: inputValue, label: inputValue }
                    });
                  }
                }}
              />

              <label htmlFor="animal_2">Select Friend and Spell it:</label>
              <Select
                options={formatChoicesForSelect(choices.animal_2, spellingMode)}
                value={formatChoicesForSelect(choices.animal_2, spellingMode).find(option => option.value === formData.animal_2)}
                onChange={(selectedOption) => handleSelectChange(selectedOption, 'animal_2')}
                isSearchable={false}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                styles={customStyles}
              />
              <Select // Modified animal_2_spelling Select component
                value={formData.animal_2_spelling}
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    animal_2_spelling: selectedOption || { value: '', label: '' }
                  })
                }
                styles={spellingInputStyles}
                isClearable
                // Key changes below:
                inputValue={formData.animal_2_spelling.value || ''} // Ensure inputValue is always a string
                onInputChange={(inputValue, { action }) => {
                  if (action === 'input-change') { // Only update on actual input changes
                    setFormData({
                      ...formData,
                      animal_2_spelling: { value: inputValue, label: inputValue }
                    });
                  }
                }}
              />

            </>
          ) : (
            <>
              <label htmlFor="animal_1">Select Animal:</label>
              <Select
                options={formatChoicesForSelect(choices.animal_1)}
                value={formatChoicesForSelect(choices.animal_1).find(option => option.value === formData.animal_1)}
                onChange={(selectedOption) => handleSelectChange(selectedOption, 'animal_1')}
                isSearchable={false}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                styles={customStyles}
              />

              <label htmlFor="animal_2">Select Friend:</label>
              <Select
                options={formatChoicesForSelect(choices.animal_2)}
                value={formatChoicesForSelect(choices.animal_2).find(option => option.value === formData.animal_2)}
                onChange={(selectedOption) => handleSelectChange(selectedOption, 'animal_2')}
                isSearchable={false}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                styles={customStyles}
              />
            </>
          )}
          <label htmlFor="activity">Select Activity:</label>
          <div className="react-select-container">
            <Select
              options={formatChoicesForSelect(choices.activity)}
              value={formatChoicesForSelect(choices.activity).find(option => option.value === formData.activity)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, 'activity')}
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
              styles={customStyles}
            />
          </div>

          <label htmlFor="location">Select Location:</label>
          <div className="react-select-container">
            <Select
              options={formatChoicesForSelect(choices.location)}
              value={formatChoicesForSelect(choices.location).find(option => option.value === formData.location)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, 'location')}
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
              styles={customStyles}
            />
          </div>

          <label htmlFor="weather">Select Weather:</label>
          <div className="react-select-container">
            <Select
              options={formatChoicesForSelect(choices.weather)}
              value={formatChoicesForSelect(choices.weather).find(option => option.value === formData.weather)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, 'weather')}
              isSearchable={false}
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
              styles={customStyles}
            />
          </div>

          <button type="button" className='purple-button' onClick={generateRandomFormData}>
            Randomize 🌀
          </button>

          <button type="submit" className='green-button'>Add 🎨</button>
        </form>


        <section className="prompt-container">
          <h1 className="doodstyle">Your Doodles:</h1>

          {!promptData?.getUserPrompts.length && <h2>No doodles have been added.</h2>}

          <Slider {...sliderSettings}>
            {promptData?.getUserPrompts.map((promptObj) => (
              <div key={promptObj._id} className="prompt-output">
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
        {/* 
      {imageUrl && (
        <section>
          <h2>Latest Masterpiece:</h2>
          <img src={imageUrl} alt="Generated" />
        </section>
      )} */}
      </div>
    </>
  );
}

export default Dashboard