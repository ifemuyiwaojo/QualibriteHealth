#!/usr/bin/env tsx
import { generateTelehealthImage, TELEHEALTH_PROMPTS } from "../server/lib/image-generator";

async function main() {
  console.log("🎨 Generating photorealistic telehealth images with Imagen 4...");
  
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is required but not found in environment variables");
      console.log("Please set your GEMINI_API_KEY to continue with image generation");
      process.exit(1);
    }

    console.log("✅ GEMINI_API_KEY found, proceeding with image generation");

    // Generate hero image
    console.log("\n📸 Generating hero image...");
    const heroImagePath = await generateTelehealthImage({
      prompt: TELEHEALTH_PROMPTS.heroImage,
      filename: "telehealth_hero_photorealistic.png",
      directory: "attached_assets/generated_images/telehealth"
    });
    console.log(`✅ Hero image saved: ${heroImagePath}`);

    // Generate platform features image
    console.log("\n📸 Generating platform features image...");
    const featuresImagePath = await generateTelehealthImage({
      prompt: TELEHEALTH_PROMPTS.platformFeatures,
      filename: "telehealth_platform_features_photorealistic.png", 
      directory: "attached_assets/generated_images/telehealth"
    });
    console.log(`✅ Platform features image saved: ${featuresImagePath}`);

    // Generate device compatibility image
    console.log("\n📸 Generating device compatibility image...");
    const deviceImagePath = await generateTelehealthImage({
      prompt: TELEHEALTH_PROMPTS.deviceCompatibility,
      filename: "telehealth_device_compatibility_photorealistic.png",
      directory: "attached_assets/generated_images/telehealth"
    });
    console.log(`✅ Device compatibility image saved: ${deviceImagePath}`);

    console.log("\n🎉 All telehealth images generated successfully!");
    console.log("Images saved in: attached_assets/generated_images/telehealth/");
    
  } catch (error) {
    console.error("❌ Failed to generate images:", error);
    process.exit(1);
  }
}

main().catch(console.error);