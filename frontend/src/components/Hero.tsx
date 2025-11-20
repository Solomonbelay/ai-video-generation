'use client';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

const API_URL = process.env.NEXT_PUBLIC_AKOOL_API_URL; // Global API URL

export default function Hero() {
  const router = useRouter();

  const [mode, setMode] = useState<'text' | 'image' | null>(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);




const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  // 🔥 Drag & Drop Handlers
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setImageFile(file);
  };















  const generateVideo = async () => {

    alert('Please pay first to generate video.');
    router.push('/payment');
    return;

    setLoading(true);
    setVideoUrl(null);

    try {
      let response;

      if (mode === 'text') {
        response = await fetch(`${API_URL}/video/text-to-video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-akool-token': process.env.NEXT_PUBLIC_AKOOL_KEY!,
          },
          body: JSON.stringify({
            prompt: textPrompt,
            duration: 10,
            resolution: '720p',
          }),
        });
      } else if (mode === 'image' && imageFile) {
        const formData = new FormData();
       formData.append('image', imageFile!);  // <-- fix TypeScript error
        formData.append('description', imageDescription);
        formData.append('duration', '10');
        formData.append('resolution', '720p');

        response = await fetch(`${API_URL}/video/image-to-video`, {
          method: 'POST',
          headers: {
            'x-akool-token': process.env.NEXT_PUBLIC_AKOOL_KEY!,
          },
          body: formData,
        });
      }

      const data = await response?.json();
      if (data?.video_url) setVideoUrl(data.video_url);
      else alert('Video generation failed.');
    } catch (error) {
      console.error(error);
      alert('An error occurred during video generation.');
    } finally {
      setLoading(false);
    }
  };





  return (
    <>
      <Head>
        <title>AI Video Generator | Create Videos from Text or Image</title>
        <meta
          name="description"
          content="Generate AI-powered videos from text prompts or images instantly. Turn your ideas into realistic videos with our AI VideoGen platform."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <section className="text-center py-16 px-4 bg-gradient-to-r from-blue-50 to-white min-h-screen">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Create AI Videos from Text or Image
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Turn your ideas into short videos instantly using the power of AI.
        </p>

        {/* Mode Selection */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <button
            onClick={() => setMode('text')}
            className={`px-6 py-2 rounded-md border ${
              mode === 'text'
                ? 'bg-blue-600 text-white'
                : 'border-gray-400 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Use Text Prompt
          </button>
          <button
            onClick={() => setMode('image')}
            className={`px-6 py-2 rounded-md border ${
              mode === 'image'
                ? 'bg-blue-600 text-white'
                : 'border-gray-400 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Use Image Prompt
          </button>
        </div>

        {/* Text Input */}
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

        {/* Image Input + Description */}
 {/* IMAGE UPLOAD - Drag & Drop */}
        {mode === 'image' && (
          <div className="max-w-xl mx-auto mb-6 flex flex-col gap-4">
            <label
              htmlFor="imageUpload"
              className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition 
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imageFile ? (
                <p className="text-gray-700">{imageFile.name}</p>
              ) : (
                <p className="text-gray-500">
                  Click or drag an image here to upload
                </p>
              )}

              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <textarea
              className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              placeholder="Describe what the video should depict..."
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
            />
          </div>
        )}
        {/* Generate Button */}
        {mode && (
          <button
            className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              if (mode === 'text' && !textPrompt) alert('Please enter a text prompt.');
              else if (mode === 'image' && (!imageFile || !imageDescription))
                alert('Please upload an image and provide description.');
              else generateVideo();
            }}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Video'}
          </button>
        )}

        {/* Generated Video Preview */}
        {videoUrl && (
          <div className="mt-10 text-center">
            <h3 className="text-xl font-semibold mb-4">Your Generated Video:</h3>
            <video
              src={videoUrl}
              controls
              className="mx-auto rounded-lg shadow-lg max-w-full"
            />
            <div className="mt-4">
              <a
                href={videoUrl}
                download="AI_Video.mp4"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Download Video
              </a>
            </div>
          </div>
        )}

        {/* Example Videos Section */}
       <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {[
    "https://www.youtube.com/embed/GYZJsM7sOKU",
    "https://www.youtube.com/embed/nolS8hDocp4",
    "https://www.youtube.com/embed/sPppjTWLsCY"
  ].map((video, index) => (
    <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
        className="w-full h-48"
        src={video}
        title={`Video ${index + 1}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div className="p-4">
        <h4 className="font-semibold text-gray-800">Video {index + 1}</h4>
        <p className="text-gray-600 text-sm mt-1">
          See how AI can turn your ideas into videos instantly.
        </p>
      </div>
    </div>
  ))}
</div>
      </section>
    </>
  );
}
