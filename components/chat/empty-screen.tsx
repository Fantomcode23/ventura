import { useEffect, useState } from "react";
import { PlusIcon, Send, Upload, UploadCloud } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { spinner } from "./spinner";
import { createClient } from "@/utils/supabase/client";
import PdfCardList from "./pdf-cards";

interface PdfData {
  pdf_url: string;
  pdf_name: string;
}

export function EmptyScreen({ chatId }: { chatId: string }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const [pdfs, setpdfs] = useState<PdfData[]>([]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const supabase = createClient(); // Initialize with your credentials
        const { data, error } = await supabase
          .from("chat_pdfs")
          .select("pdf_url, pdf_name") // Select both columns
          .eq("chat_id", chatId);

        if (data) {
          setpdfs(data as PdfData[]); // Correctly type the data
        } else if (error) {
          console.error("Error fetching PDFs:", error);
          toast("Failed to fetch PDFs", {
            description:
              "An error occurred while communicating with the server.",
          });
        }
      } catch (error) {
        console.error("Unexpected error fetching PDFs:", error);
        toast("Failed to fetch PDFs", {
          description: "An unexpected error occurred.",
        });
      }
    };

    fetchPdfs();
  }, [chatId, isUploading]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast("Select file", {
        description: "Please select one or more PDF files to upload.",
      });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("pdfs", file));
    formData.append("chatId", chatId);

    try {
      setIsUploading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast("Upload Successful", {
          description: "Your files have been uploaded and processed.",
        });
        setIsUploading(false);
        setSelectedFiles([]); // Clear the selected files
      } else {
        const data = await response.json();
        toast("Upload Failed", {
          description: data.error || "An error occurred during upload.",
        });
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast("Upload Failed", {
        description: "An error occurred while communicating with the server.",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg  bg-background ">
        <Input
          type="file"
          id="pdf-upload"
          className="h-16 flex flex-col items-center justify-center"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
        />

        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0}
          className="flex flex-row items-center mt-2 text-sm justify-center"
        >
          {!isUploading ? <UploadCloud className="w-6 h-6 mr-2" /> : spinner}
          Upload files
        </Button>
        <ul>
          {selectedFiles.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
        <Separator className="my-2" />
        {pdfs.length > 0 &&
          pdfs.map((pdfUrl, index) => (
            <PdfCardList
              key={index}
              pdfUrls={[{ url: pdfUrl.pdf_url, name: pdfUrl.pdf_name }]}
            />
          ))}
      </div>
    </div>
  );
}
