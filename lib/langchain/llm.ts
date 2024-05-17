import { ChatOpenAI } from "langchain/chat_models/openai";

export const streamingModel = new ChatOpenAI({
  modelName: process.env.NEXT_PUBLIC_OPENAI_MODEL_NAME,
  streaming: true,
  verbose: true,
  temperature: 0,
});

export const nonStreamingModel = new ChatOpenAI({
  modelName: process.env.NEXT_PUBLIC_OPENAI_MODEL_NAME,
  verbose: true,
  temperature: 0,
});
