const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI;
if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

const chatWithAI = async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ success: false, message: "Google API Server Key is not configured correctly." });
    }

    const { prompt, context } = req.body;
    
    // Using flash for faster conversational voice responses
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Strict system context to train the bot as a Bihar Tourism guide speaking out loud
    const systemInstruction = `You are a professional, highly intelligent, and friendly Voice Assistant embedded directly inside the official Bihar Tourism web application.
The user is speaking to you directly.
CRITICAL RULES:
1. ALWAYS keep your response concise (usually 1-3 sentences). The user will listen to it being spoken out loud, so do not write long paragraphs or use heavy bullet points.
2. If they ask "what is this all about?", tell them about Bihar Tourism and its rich heritage (Nalanda, Bodh Gaya, wildlife, vibrant culture) in an exciting and succinct way.
3. If they ask about a specific place, tell them an interesting short fact.
4. If applicable, use the current page context provided: [${context || "General Website Navigation"}] to tailor your response.`;

    const finalPrompt = `${systemInstruction}\n\nUser Question: ${prompt}`;

    const result = await model.generateContent(finalPrompt);
    const responseText = result.response.text();

    res.json({
      success: true,
      text: responseText
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ success: false, message: "My AI servers are currently resting. Please try your question again in a moment!" });
  }
};

module.exports = { chatWithAI };
