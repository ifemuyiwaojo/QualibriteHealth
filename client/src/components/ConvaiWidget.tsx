import { useEffect } from "react";

export function ConvaiWidget() {
  useEffect(() => {
    // Create and append the ElevenLabs script
    const elevenLabsScript = document.createElement("script");
    elevenLabsScript.src = "https://elevenlabs.io/convai-widget/index.js";
    elevenLabsScript.async = true;
    elevenLabsScript.type = "text/javascript";
    document.body.appendChild(elevenLabsScript);

    // Add Charla widget
    window.addEventListener('load', () => {
      const widgetElement = document.createElement('charla-widget');
      widgetElement.setAttribute("p", "d0638494-03d5-4284-94a4-9b11afb19fde");
      document.body.appendChild(widgetElement);
      const widgetCode = document.createElement('script');
      widgetCode.src = 'https://app.getcharla.com/widget/widget.js';
      document.body.appendChild(widgetCode);
    });

    return () => {
      // Cleanup on unmount
      document.body.removeChild(elevenLabsScript);
      const charlaWidget = document.querySelector("charla-widget");
      if (charlaWidget?.parentNode) {
        charlaWidget.parentNode.removeChild(charlaWidget);
      }
      const charlaScript = document.querySelector("script[src='https://app.getcharla.com/widget/widget.js']");
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