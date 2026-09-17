import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: "Say hello to BIZPILOT AI.",
    });

    console.log("SUCCESS! OpenAI is connected.");
    console.log(response.output_text);
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

main();
