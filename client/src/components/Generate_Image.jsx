import React from 'react';
import { useMutation } from '@apollo/client';
import { GENERATE_IMAGE } from '../graphql/mutations';

function Generate_Image({ prompt }) {
  const [generateImage, { data, loading, error }] = useMutation(GENERATE_IMAGE);

  const handleGenerate = async () => {
    try {
      const response = await generateImage({ variables: { prompt } });

      // Handle the response if needed
      console.log(response);
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <img src={data.generateImage.imageUrl} alt="Generated" />}
    </div>
  );
}

export default Generate_Image;
