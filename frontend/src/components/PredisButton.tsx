'use client';

import { useEffect } from 'react';

export default function PredisButton() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://predis.ai/sdk/embed.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
  }, []);

  const handleClick = () => {
    // @ts-ignore - because Predis is not typed
    const predis = new window.Predis();
    predis.initialize({ appId: 'YOUR_APP_ID' });

    predis.on('ready', () => {
      predis.createPost({
        onPostPublish: function (err: any, data: any) {
          console.log('Published Post:', err, data);
        },
      });
    });

    predis.on('error', (e: any) => {
      console.error('Predis Error:', e);
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
    >
      Generate Post
    </button>
  );
}
