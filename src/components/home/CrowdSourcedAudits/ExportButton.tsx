"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ExportButtonProps {
  imgRef: React.RefObject<HTMLDivElement>;
  watermarkRef: React.RefObject<HTMLDivElement>;
  chartHeight: number;
}

const ExportButton = ({
  imgRef,
  watermarkRef,
  chartHeight,
}: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { exportComponentAsJPEG } = await import(
        "react-component-export-image"
      );
      if (chartHeight < 151) {
        await exportComponentAsJPEG(watermarkRef);
      } else {
        await exportComponentAsJPEG(imgRef);
      }
    } catch (error) {
      console.error("Failed to export image:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} variant="secondary" disabled={isExporting}>
      {isExporting ? "Exporting..." : "Export As PNG"}
    </Button>
  );
};

export default ExportButton;
