'use client';
import { useState, ChangeEvent ,useEffect} from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
//import useAuth from '@/hooks/useAuth';

export default function Hero() {

//useAuth();


  const [mode, setMode] = useState<'text' | 'image' | null>(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  




  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const generateVideo = async () => {


    setLoading(true);
    setVideoUrl(null);


    try {
      let response;

      if (mode === 'text') {
        response = await fetch('https://api.akool.com/openapi/video/text-to-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-akool-token': 'YOUR_AKOOL_API_KEY', // Replace with your actual API key
          },
          body: JSON.stringify({
            prompt: textPrompt,
            duration: 10,
            resolution: '720p',
          }),
        });
      } else if (mode === 'image' && imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('duration', '10');
        formData.append('resolution', '720p');

        response = await fetch('https://api.akool.com/openapi/video/image-to-video', {
          method: 'POST',
          headers: {
            'x-akool-token': 'YOUR_AKOOL_API_KEY',
          },
          body: formData,
        });
      }

      const data = await response?.json();
      if (data?.video_url) {
        setVideoUrl(data.video_url);
      } else {
        alert('Video generation failed.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during video generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-center py-20 px-4 bg-gradient-to-r from-blue-50 to-white min-h-screen">

      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
        Create AI Videos from Text or Image
      </h2>
      <p className="text-lg md:text-xl text-gray-600 mb-8">
        Turn your ideas into short videos instantly using the power of AI.
      </p>

      {/* Mode Selection Buttons */}
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setMode('text')}
          className={`px-5 py-2 rounded-md border ${
            mode === 'text'
              ? 'bg-blue-600 text-white'
              : 'border-gray-400 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Use Text Prompt
        </button>
        <button
          onClick={() => setMode('image')}
          className={`px-5 py-2 rounded-md border ${
            mode === 'image'
              ? 'bg-blue-600 text-white'
              : 'border-gray-400 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Use Image Prompt
        </button>
      </div>

      {/* Text Prompt Input */}
      {mode === 'text' && (
        <div className="max-w-2xl mx-auto mb-6">
          <textarea
            className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={5}
            placeholder="Enter your text prompt here..."
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
          />
        </div>
      )}

      {/* Image Prompt Upload */}
      {mode === 'image' && (
        <div className="max-w-xl mx-auto mb-6">
          <label
            htmlFor="imageUpload"
            className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400"
          >
            {imageFile ? (
              <p className="text-gray-700">{imageFile.name}</p>
            ) : (
              <p className="text-gray-500">Click or drag an image to upload</p>
            )}
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      )}

      {/* Generate Button */}
      {mode && (
        <button
          className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            if (mode === 'text' && !textPrompt) {
              alert('Please enter a text prompt.');
            } else if (mode === 'image' && !imageFile) {
              alert('Please upload an image.');
            } else {
              generateVideo();
            }
          }}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Video'}
        </button>
      )}

      {/* Video Preview */}
      {videoUrl && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Your Generated Video:</h3>
          <video src={videoUrl} controls className="mx-auto rounded-lg shadow-lg max-w-full" />
        </div>
      )}
    </section>
  );
}
