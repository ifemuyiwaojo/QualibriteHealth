import { useEffect } from "react";

export function ConvaiWidget() {
  useEffect(() => {
    // Create and append the ElevenLabs script
    const elevenLabsScript = document.createElement("script");
    elevenLabsScript.src = "https://elevenlabs.io/convai-widget/index.js";
    elevenLabsScript.async = true;
    elevenLabsScript.type = "text/javascript";
    document.body.appendChild(elevenLabsScript);

    // Add Charla widget with independent initialization
    const charlaWidget = document.createElement('charla-widget');
    charlaWidget.setAttribute("p", "d0638494-03d5-4284-94a4-9b11afb19fde");
    charlaWidget.style.position = "fixed";
    charlaWidget.style.left = "20px";
    charlaWidget.style.bottom = "20px";
    charlaWidget.style.zIndex = "50";
    document.body.appendChild(charlaWidget);

    const charlaScript = document.createElement('script');
    charlaScript.src = 'https://app.getcharla.com/widget/widget.js';
    charlaScript.type = "text/javascript";
    document.body.appendChild(charlaScript);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(elevenLabsScript);
      if (charlaWidget?.parentNode) {
        charlaWidget.parentNode.removeChild(charlaWidget);
      }
      if (charlaScript?.parentNode) {
        charlaScript.parentNode.removeChild(charlaScript);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50" style={{ minWidth: "350px" }}>
      <elevenlabs-convai agent-id="6UB9cwbWARvQibbuT9bk"></elevenlabs-convai>
    </div>
  );
}