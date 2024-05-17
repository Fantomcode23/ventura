import { useState } from "react";
import { PlusIcon, Send, Upload, UploadCloud } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export function EmptyScreen({ chatId }: { chatId: string }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

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
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast("Upload Successful", {
          description: "Your files have been uploaded and processed.",
        });
        setSelectedFiles([]); // Clear the selected files
      } else {
        const data = await response.json();
        toast("Upload Failed", {
          description: data.error || "An error occurred during upload.",
        });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast("Upload Failed", {
        description: "An error occurred while communicating with the server.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg  bg-background ">
        {/* <label htmlFor="pdf-upload" className="cursor-pointer">
          <Button variant={"outline"} className="w-14 h-14">
            <Upload className="w-12" />
          </Button>
        </label> */}
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
          <UploadCloud className="size-4 mr-1 " /> Upload files
        </Button>
        <ul>
          {selectedFiles.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
        <Separator className="my-2" />
      </div>
    </div>
  );
}
