import xlsx from "xlsx";
import { Readable } from "stream";
import csvParser from "csv-parser";

export const fileService = {
  parseFile: async (file) => {
    return new Promise((resolve, reject) => {
      try {
        const { mimetype, buffer } = file;

        // Parse JSON
        if (mimetype === "application/json") {
          return resolve(JSON.parse(buffer.toString("utf-8")));
        }

        // Parse Excel
        if (mimetype.includes("excel") || mimetype.includes("spreadsheetml")) {
          const workbook = xlsx.read(buffer, { type: "buffer" });
          const sheetName = workbook.SheetNames[0];
          const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
          return resolve(data);
        }

        // Parse CSV
        if (mimetype === "text/csv") {
          const results = [];
          const stream = Readable.from(buffer.toString("utf-8"));
          stream
            .pipe(csvParser())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err));
        }
      } catch (error) {
        reject(new Error("Error parsing file: " + error.message));
      }
    });
  },
};
