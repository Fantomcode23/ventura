"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Link1Icon } from "@radix-ui/react-icons";

interface PdfCardProps {
  url: string;
  name: string; // Add a name prop for each PDF
}

const PdfCard: React.FC<PdfCardProps> = ({ url, name }) => {
  const handleOpenPdf = () => {
    window.open(url, "_blank");
  };

  return (
    <Card
      onClick={handleOpenPdf}
      className="p-4 overflow-hidden flex flex-col gap-2 cursor-pointer"
    >
      <CardTitle className="flex flex-row gap-1 items-center">
        {" "}
        <Link1Icon />
        {name}
      </CardTitle>{" "}
      {/* Display the name */}
      <CardDescription>{url}</CardDescription>
    </Card>
  );
};

const PdfCardList: React.FC<{ pdfUrls: { url: string; name: string }[] }> = ({
  pdfUrls,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2">
      {pdfUrls.map((pdf, index) => (
        <PdfCard key={index} url={pdf.url} name={pdf.name} />
      ))}
    </div>
  );
};

export default PdfCardList;
