import { useEffect, useRef } from 'react';

interface VSeeVideoProps {
  sessionId: string;
  isProvider: boolean;
}

export function VSeeVideo({ sessionId, isProvider }: VSeeVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeVSee = async () => {
      try {
        // Get the session token and room URL
        const response = await fetch(`/api/telehealth/visit/${sessionId}/join`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to join session');
        }

        const { token, roomUrl } = await response.json();

        // Load VSee SDK
        const script = document.createElement('script');
        script.src = 'https://static.vsee.com/sdk/v2/vsee.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          const vsee = (window as any).VSee;

          if (vsee && containerRef.current) {
            // Initialize VSee with API key and token
            vsee.init({
              apiKey: import.meta.env.VITE_VSEE_API_KEY,
              container: containerRef.current,
              token: token,
              roomUrl: roomUrl,
              participant: {
                role: isProvider ? 'PROVIDER' : 'PATIENT',
              },
              ui: {
                showControls: true,
                showParticipantList: true,
              }
            });
          }
        };

        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          const vsee = (window as any).VSee;
          if (vsee) {
            vsee.disconnect();
          }
        };
      } catch (error) {
        console.error('Failed to initialize VSee:', error);
      }
    };

    initializeVSee();
  }, [sessionId, isProvider]);

  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg" ref={containerRef}>
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading video session...</p>
      </div>
    </div>
  );
}