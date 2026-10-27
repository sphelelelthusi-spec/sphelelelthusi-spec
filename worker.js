
export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const respond = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=utf-8",
        },
      });

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === "/") {
      return respond({
        app: "VidoSave API",
        status: "online",
        message: "VidoSave backend is working.",
      });
    }

    if (url.pathname === "/api/check" && request.method === "POST") {
      let body;

      try {
        body = await request.json();
      } catch {
        return respond({ error: "Please send valid JSON." }, 400);
      }

      if (typeof body.videoUrl !== "string") {
        return respond({ error: "Please provide a videoUrl." }, 400);
      }

      let videoUrl;

      try {
        videoUrl = new URL(body.videoUrl);
      } catch {
        return respond({ error: "That URL is not valid." }, 400);
      }

      if (videoUrl.protocol !== "https:") {
        return respond({ error: "Only HTTPS links are accepted." }, 400);
      }

      const host = videoUrl.hostname.toLowerCase();
      const isFacebook =
        host === "facebook.com" ||
        host.endsWith(".facebook.com") ||
        host === "fb.watch";

      return respond({
        valid: true,
        source: isFacebook ? "Facebook" : "Other",
        retrieved: false,
        downloadable: false,
        message: isFacebook
          ? "Link format accepted. This API has not retrieved the Facebook video."
          : "Link format accepted. Actual video retrieval is not implemented yet.",
      });
    }

    return respond({ error: "Endpoint not found." }, 404);
  },
};
