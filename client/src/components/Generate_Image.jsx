import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GENERATE_IMAGE } from '../graphql/mutations';

function GenerateImage() {
  const [prompt, setPrompt] = useState('');
  const [generateImage, { data, loading, error }] = useMutation(GENERATE_IMAGE);

  const handleGenerate = async () => {
    try {
      await generateImage({ variables: { prompt } });
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <button onClick={handleGenerate} disabled={loading}>
        Generate Image
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <img src={data.generateImage.imageUrl} alt="Generated" />}
    </div>
  );
}

export default GenerateImage;
