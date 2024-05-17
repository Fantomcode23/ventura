import { env } from "@/lib/langchain/config";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { createClient } from "@/utils/supabase/server";
import { nanoid } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("pdfs") as File[];
    const chatId = formData.get("chatId") as string;

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
      const pineconeIndex = pinecone.Index(chatId);

      await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
        pineconeIndex,
        textKey: "text",
      });

      console.log(`Data from ${file.name} embedded and stored in Pinecone.`);

      const supabase = createClient();

      const id = nanoid();

      const { data: pdfData, error: pdfError } = await supabase.storage
        .from("pdfbucket")
        .upload(`${file.name}+${id}`, file);

      const { data } = supabase.storage
        .from("pdfbucket")
        .getPublicUrl(`${file.name}+${id}`);

      await supabase.from("chat_pdfs").insert([
        {
          chat_id: chatId,
          pdf_url: data.publicUrl,
          pdf_name: file.name,
        },
      ]);
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
