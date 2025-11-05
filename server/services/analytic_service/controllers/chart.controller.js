import { GoogleGenerativeAI } from "@google/generative-ai";

export const graphFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided." });
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY || "AIzaSyCsVsT3m29LvmGwGuJrdBZTiEs1Kngf6zs"
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 🧠 Prompt: ask clearly for base64 only
    const prompt = `
      You are a data visualization AI.
      Create a clean bar chart or line chart from the following dataset:
      ${JSON.stringify(data, null, 2)}

      Important:
      - Generate the chart as a PNG image.
      - Return ONLY the image encoded in base64.
      - Do NOT include any text, explanation, or Markdown.
    `;

    // Generate chart
    const result = await model.generateContent(prompt);
    
    // Extract text output (Gemini puts image/base64 in response.text())
    const base64Output = result.response.text()?.trim();

    // Remove any accidental "data:image/png;base64," prefix
    const cleanBase64 = base64Output?.replace(/^data:image\/png;base64,/, "");

    if (!cleanBase64) {
      console.error("⚠️ Gemini did not return a base64 image.");
      return res
        .status(500)
        .json({ success: false, message: "No image generated." });
    }

    // Convert base64 → binary buffer
    const imageBuffer = Buffer.from(cleanBase64, "base64");

    // ✅ Send image as binary response
    res.setHeader("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (error) {
    console.error("Graph generation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
