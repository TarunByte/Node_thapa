import { createReadStream, createWriteStream } from "fs";
import path from "path";

const inputFilePath = path.join(import.meta.dirname, "input.txt");
const outputFilePath = path.join(import.meta.dirname, "output.txt");

const readableStream = createReadStream(inputFilePath, {
  encoding: "utf-8",
  highWaterMark: 16,
});

const writeableStream = createWriteStream(outputFilePath);

//Listen for data chunks
readableStream.on("data", (chunk) => {
  console.log("Buffer (chunk):", Buffer.from(chunk)); // Convert the chunk to a buffer
  console.log("Received chunk:", chunk); // Logs each 16-byte chunk
  writeableStream.write(chunk); // Write each chunk to output file
});

// Handle stream end
readableStream.on("end", () => {
  console.log("File read completed.");
  writeableStream.end();
});

// readableStream.pipe(writeableStream);

// Handle errors
readableStream.on("error", (err) => console.log("Error:", err));
writeableStream.on("error", (err) => console.log("Error:", err));
