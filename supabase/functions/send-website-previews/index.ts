
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WebsitePreview {
  name: string;
  url: string;
  template: string;
}

interface RequestData {
  emails: string[];
  websites: WebsitePreview[];
}

function getSitePreviewHtml(websites: WebsitePreview[]): string {
  return `
    <h2>Website Previews</h2>
    <ul style="padding-left:18px;">
      ${websites
        .map(
          (w) =>
            `<li>
              <strong>${w.name}</strong> — <span style="color:#888;">${w.template}</span><br/>
              <a href="${w.url}" target="_blank">${w.url}</a>
            </li>`
        )
        .join("")}
    </ul>
    <p style="font-size:13px;color:#888;">— Sent by your Website Platform</p>
  `;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { emails, websites }: RequestData = await req.json();
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(JSON.stringify({ error: "No email recipients." }), { status: 400, headers: corsHeaders });
    }
    if (!websites || !Array.isArray(websites) || websites.length === 0) {
      return new Response(JSON.stringify({ error: "No websites to preview." }), { status: 400, headers: corsHeaders });
    }
    const html = getSitePreviewHtml(websites);
    const sendPromises = emails.map(email => 
      resend.emails.send({
        from: "Lovable Platform <onboarding@resend.dev>",
        to: [email],
        subject: "Preview your new websites!",
        html
      })
      .then(() => ({ email, success: true }))
      .catch((err: any) => ({ email, success: false, error: err.message }))
    );
    const results = await Promise.all(sendPromises);
    return new Response(JSON.stringify({ results }), { status: 200, headers: corsHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
