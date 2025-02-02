import { useEffect } from "react";

export function ConvaiWidget() {
  useEffect(() => {
    // Create and append the script element
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <elevenlabs-convai agent-id="6UB9cwbWARvQibbuT9bk"></elevenlabs-convai>
    </div>
  );
}
