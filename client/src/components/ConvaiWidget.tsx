import { useEffect } from "react";

export function ConvaiWidget() {
  useEffect(() => {
    // Create and append the ElevenLabs script
    const elevenLabsScript = document.createElement("script");
    elevenLabsScript.src = "https://elevenlabs.io/convai-widget/index.js";
    elevenLabsScript.async = true;
    elevenLabsScript.type = "text/javascript";
    document.body.appendChild(elevenLabsScript);

    // Create and append the Charla widget script
    const charlaWidgetElement = document.createElement("charla-widget");
    charlaWidgetElement.setAttribute("p", "d0638494-03d5-4284-94a4-9b11afb19fde");
    document.body.appendChild(charlaWidgetElement);

    const charlaScript = document.createElement("script");
    charlaScript.src = "https://app.getcharla.com/widget/widget.js";
    charlaScript.type = "text/javascript";
    charlaScript.charset = "utf-8";
    document.body.appendChild(charlaScript);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(elevenLabsScript);
      if (charlaWidgetElement.parentNode) {
        document.body.removeChild(charlaWidgetElement);
      }
      if (charlaScript.parentNode) {
        document.body.removeChild(charlaScript);
      }
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <elevenlabs-convai agent-id="6UB9cwbWARvQibbuT9bk"></elevenlabs-convai>
      </div>
      <div className="fixed bottom-4 left-4 z-50">
        <charla-widget p="d0638494-03d5-4284-94a4-9b11afb19fde"></charla-widget>
      </div>
    </>
  );
}