
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    const { messages } = await req.json()

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant specialized in web development and helping users create websites from templates. You can help with template selection, customization, and code development. Keep your responses concise and focused.'
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      const data = await response.json()
      
      // Check for OpenAI API errors
      if (data.error) {
        console.error("OpenAI API Error:", data.error);
        throw new Error(data.error.message || "Error from OpenAI API");
      }
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (openAiError) {
      console.error("OpenAI request error:", openAiError);
      throw new Error(`OpenAI API error: ${openAiError.message}`);
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      choices: [{ 
        message: { 
          content: "I'm having trouble connecting to my AI services right now. This might be due to API limits or connection issues. Please try again later or contact support if the issue persists." 
        } 
      }]
    }), {
      status: 200, // Sending 200 with error details in body for better client handling
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
