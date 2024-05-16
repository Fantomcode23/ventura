import { env } from "@/lib/langchain/config";
import { getPineconeClient } from "@/lib/langchain/pinecone-client";
// import { PineconeClient } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("pdfs") as File[];

    for (const file of files) {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Invalid file type" },
          { status: 400 }
        );
      }

      console.log(`Processing file: ${file.name}`);

      // Load the PDF and split it into chunks
      const loader = new PDFLoader(file);
      const docs = await loader.load();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunkedDocs = await textSplitter.splitDocuments(docs);

      console.log(`Loading ${chunkedDocs.length} chunks into Pinecone...`);

      const pinecone = new Pinecone();
      const pineconeIndex = pinecone.Index(env.PINECONE_INDEX_NAME);

      await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
        pineconeIndex,
        textKey: "text",
      });

      console.log(`Data from ${file.name} embedded and stored in Pinecone.`);
    }

    return NextResponse.json({ message: "Upload successful" });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
