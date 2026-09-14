import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your API Key
const genAI = new GoogleGenerativeAI(process.env.LLM_API);

export const aiService = {
  analyzeData: async (parsedData) => {
    // Data slice limit taaki API crash na ho
    const dataString = JSON.stringify(parsedData).substring(0, 150000);

    const prompt = `
      Here is some parsed data in JSON format: ${dataString}.
      
      Act as an Expert Data Analyst. Analyze this data deeply to find the most important metrics, trends, and distributions. 
      Generate 2 to 4 different charts that best represent this data (e.g., Bar chart for comparisons, Line chart for trends, Pie chart for distributions).
      
      Return the response STRICTLY in the following JSON format without any markdown blocks.
      {
        "analytics": "A detailed paragraph explaining the key trends, insights, and overall summary of the data.",
        "charts": [
          {
            "labels": ["label1", "label2"],
            "values": [10, 20],
            "chartType": "bar", 
            "title": "Title of the first chart"
          },
          {
            "labels": ["labelA", "labelB"],
            "values": [30, 40],
            "chartType": "pie",
            "title": "Title of the second chart"
          }
        ]
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    const result = await model.generateContent(prompt);

    const responseText = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "");

    return JSON.parse(responseText);
  },

  chatWithData: async (question, dataContext) => {
    try {
      // Agar data bohot bada hai, toh limit cross hone se bachane ke liye slice karein
      const contextString = JSON.stringify(dataContext).substring(0, 50000);

      const prompt = `
        Here is the raw data in JSON format: ${contextString}
        
        The user is asking: "${question}"
        
        Act as a Data Analyst. Give a concise, professional answer based ONLY on the provided data. Do not use complex formatting.
      `;

      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
      });
      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      throw new Error("AI Chat Processing Failed: " + error.message);
    }
  },
};
