import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";
import path from "path";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ImageGenerationOptions {
  prompt: string;
  filename: string;
  directory?: string;
}

export async function generateTelehealthImage(options: ImageGenerationOptions): Promise<string> {
  try {
    const outputDir = options.directory || "attached_assets/generated_images/telehealth";
    
    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagePath = path.join(outputDir, options.filename);

    // IMPORTANT: only this gemini model supports image generation  
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: options.prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated from the response");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("Invalid response structure");
    }

    let imageGenerated = false;
    for (const part of content.parts) {
      if (part.text) {
        console.log("Generation description:", part.text);
      } else if (part.inlineData && part.inlineData.data) {
        const imageData = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(imagePath, imageData);
        console.log(`Image saved as ${imagePath}`);
        imageGenerated = true;
      }
    }

    if (!imageGenerated) {
      throw new Error("No image data found in the response");
    }

    return imagePath;
  } catch (error) {
    throw new Error(`Failed to generate image: ${error}`);
  }
}

// Predefined prompts for the telehealth platform
export const TELEHEALTH_PROMPTS = {
  heroImage: `Create a BOLD, photorealistic, professional hero image for a mental health telehealth platform that makes a statement of QUALITY services. Show a confident, diverse healthcare provider (psychiatrist or therapist) conducting a video consultation on a modern laptop. The scene should be in a pristine, modern office environment with dramatic professional lighting. The provider should appear highly competent and trustworthy, wearing professional attire. Include high-end office furniture, modern technology, and subtle luxury elements that convey premium healthcare services. Studio-quality photography with perfect lighting, shot with a professional camera at 85mm lens, shallow depth of field, ultra-high resolution, crisp details.`,
  
  aboutPageImage: `Create a BOLD, photorealistic image for the About section of a premium mental health telehealth platform. Show a confident, professional mental health specialist (diverse, approachable but highly competent) in a modern, luxury medical office setting. The person should be looking directly at the camera with a warm but professional smile, conveying expertise and trustworthiness. Include modern medical technology, elegant office decor, diplomas/certifications on the wall, and premium furnishings that signal quality healthcare services. Use dramatic, professional lighting with soft shadows. Shot with professional camera, 85mm portrait lens, perfect shallow depth of field, ultra-high resolution, magazine-quality photography.`,
  
  platformFeatures: `Generate a photorealistic image showcasing modern telehealth technology across multiple devices. Show a smartphone, tablet, and laptop displaying the same secure video consultation interface. The devices should be arranged on a clean, modern white desk with professional lighting. The interface should look clean, accessible, and healthcare-focused with calming blue and white colors. Include subtle healthcare elements like a stethoscope or medical notes nearby. Professional product photography style with crisp details and soft shadows.`,
  
  deviceCompatibility: `Create a photorealistic image demonstrating multi-device compatibility for a telehealth platform. Show the same telehealth consultation interface running seamlessly across a mobile phone, tablet, and desktop computer. Arrange the devices in an appealing composition on a modern workspace. The interface should show consistency across all devices, with clean, professional healthcare design. Use professional lighting and high detail to show the quality and accessibility of the platform. Commercial photography quality with excellent lighting and composition.`
};