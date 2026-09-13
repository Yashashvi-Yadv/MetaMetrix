import { fileService } from "./file.service.js";
import { aiService } from "./ai.service.js";

export const uploadController = {
  handleUpload: async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      // Step 1: Parse the file
      const parsedData = await fileService.parseFile(req.file);

      // Step 2: Send to AI for analytics & chart config
      const aiInsights = await aiService.analyzeData(parsedData);

      // Step 3: Return to Frontend

      res.status(200).json({
        success: true,
        message: "Data analyzed successfully",
        data: aiInsights,
        rawParsedData: parsedData, // Optional: Send back if frontend needs it for the chatbot
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
  handleChat: async (req, res) => {
    try {
      const { question, dataContext } = req.body;

      // Validation
      if (!question) {
        return res.status(400).json({
          success: false,
          message: "Question is required",
        });
      }

      if (!dataContext) {
        return res.status(400).json({
          success: false,
          message: "Data context is required for analysis",
        });
      }

      // Call Service
      const answer = await aiService.chatWithData(question, dataContext);

      // Send Response
      res.status(200).json({
        success: true,
        answer: answer,
      });
    } catch (error) {
      console.error("Chat Error:", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong while processing the chat",
        error: error.message,
      });
    }
  },
};
