
import { Message, WebsiteStatus } from '@/components/chatbot/types';

const API_KEY = "AIzaSyAUQZFNXyvEfsiaFTawgiyNq7aJyV8KzgE";

export const geminiSystemContext = `You are a website creation assistant for an agency, specialized in helping create websites using our template system. Your goal is to help users build websites based on our available templates:

1. Clean Slate - A minimalist black & white single-page template
2. Tradecraft - For trade businesses with blue & orange theme
3. Retail Ready - For retail stores with purple & pink theme
4. Service Pro - For service businesses with teal & green theme
5. Local Expert - For local professionals with amber & gold theme

Guide users through template selection, customization, and branding. After gathering sufficient information about their business and preferences, conclude by saying "Your website has been created! You can now view your website by clicking the View Website button below." Include key details like: company name: "Business Name", domain: "domain.com", logo: "logo-url" in your response to trigger website creation.`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: geminiSystemContext + "\n\n" + message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      throw new Error(data.error.message || "Error from Gemini API");
    }
    
    throw new Error("Unexpected response format from Gemini API");
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

export const extractWebsiteInfo = (text: string): Partial<WebsiteStatus> => {
  // Extract website information from AI response
  const companyNameMatch = text.match(/company name:?\s*["']([^"']+)["']/i);
  const domainMatch = text.match(/domain:?\s*["']([^"']+)["']/i);
  const logoMatch = text.match(/logo:?\s*["']([^"']+)["']/i);
  
  const cleanSlateMatch = text.match(/clean slate/i);
  const tradecraftMatch = text.match(/tradecraft/i);
  const retailReadyMatch = text.match(/retail ready/i);
  const serviceProMatch = text.match(/service pro/i);
  const localExpertMatch = text.match(/local expert/i);
  
  let template = null;
  if (cleanSlateMatch) template = "cleanslate";
  else if (tradecraftMatch) template = "tradecraft";
  else if (retailReadyMatch) template = "retail";
  else if (serviceProMatch) template = "service";
  else if (localExpertMatch) template = "expert";
  
  return {
    isCreated: text.toLowerCase().includes("your website has been created"),
    template,
    path: template ? `/${template}` : null,
    companyName: companyNameMatch ? companyNameMatch[1] : null,
    domainName: domainMatch ? domainMatch[1] : null,
    logo: logoMatch ? logoMatch[1] : null,
    colorScheme: null,
    secondaryColorScheme: null
  };
};
