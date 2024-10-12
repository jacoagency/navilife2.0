import { useState } from 'react';
import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_KEY,
});

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}

interface FalResult {
  images?: { url: string }[];
}

export default function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      console.log('FAL_KEY:', process.env.FAL_KEY ? 'Set' : 'Not set');
      console.log('Generating image with prompt:', prompt);

      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: prompt,
          image_size: "landscape_4_3",
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log('Queue update:', update);
          if (update.status === "IN_PROGRESS") {
            console.log("Generation in progress:", update.logs);
          }
        },
      }) as FalResult;

      console.log('Fal AI response:', result);

      if (result.images && result.images.length > 0) {
        console.log('Image generated:', result.images[0].url);
        onImageGenerated(result.images[0].url);
      } else {
        console.error('No images in result');
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to generate..."
        className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isGenerating}
      />
      <button
        onClick={generateImage}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-150 ease-in-out"
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>
    </div>
  );
}
