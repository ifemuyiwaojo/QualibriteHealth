import { useEffect, useRef } from 'react';

interface VSeeVideoProps {
  sessionId: string;
  isProvider: boolean;
}

export function VSeeVideo({ sessionId, isProvider }: VSeeVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load VSee SDK
    const script = document.createElement('script');
    script.src = 'https://static.vsee.com/sdk/v2/vsee.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const vsee = (window as any).VSee;
      
      if (vsee && containerRef.current) {
        // Initialize VSee with API key
        vsee.init({
          apiKey: import.meta.env.VITE_VSEE_API_KEY,
          container: containerRef.current,
          sessionId: sessionId,
          participant: {
            role: isProvider ? 'provider' : 'patient',
            name: 'User', // This should be replaced with actual user name
          },
          ui: {
            showControls: true,
            showParticipantList: true,
          }
        });
      }
    };

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const vsee = (window as any).VSee;
      if (vsee) {
        vsee.disconnect();
      }
    };
  }, [sessionId, isProvider]);

  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg" ref={containerRef}>
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading video session...</p>
      </div>
    </div>
  );
}
