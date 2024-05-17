import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

// Returns vector-store handle to be used a retrievers on langchains
export async function getVectorStore(chatId: string) {
  try {
    const embeddings = new OpenAIEmbeddings();
    const pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = pineconeClient.Index(chatId);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}
