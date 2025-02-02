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
    const charlaScript = document.createElement("script");
    charlaScript.src = "https://app.getcharla.com/widget/widget.js";
    charlaScript.type = "text/javascript";
    charlaScript.charset = "utf-8";
    document.body.appendChild(charlaScript);


    // Add Charla widget element after script is loaded
      setTimeout(() => {
        const charlaWidgetElement = document.createElement("charla-widget");
        charlaWidgetElement.setAttribute("p", "d0638494-03d5-4284-94a4-9b11afb19fde");
        charlaWidgetElement.style.position = "fixed";
        charlaWidgetElement.style.left = "20px";
        charlaWidgetElement.style.bottom = "20px";
        charlaWidgetElement.style.zIndex = "50";
        document.body.appendChild(charlaWidgetElement);
      }, 1000);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(elevenLabsScript);
      document.body.removeChild(charlaScript);
       const charlaWidget = document.querySelector("charla-widget");
      if (charlaWidget?.parentNode) {
        document.body.removeChild(charlaWidget);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50" style={{ minWidth: "350px" }}>
      <elevenlabs-convai agent-id="6UB9cwbWARvQibbuT9bk"></elevenlabs-convai>
    </div>
  );
}