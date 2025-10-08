"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface ColorCardProps {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export function ColorCard({ name, hex, rgb, usage }: ColorCardProps) {
  const [copied, setCopied] = useState(false);
  const isLight = hex === "#ffffff" || hex === "#f3f4f6";

  const handleCopy = async (value: string, type: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
        } catch (fallbackErr) {
          console.error("Fallback copy failed: ", fallbackErr);
          return;
        } finally {
          document.body.removeChild(textArea);
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Show a brief error state
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className="h-32 w-full relative group cursor-pointer"
        style={{ backgroundColor: hex }}
        onClick={() => handleCopy(hex, "hex")}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span
            className={`text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 ${
              isLight ? "text-[#374151]" : "text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Click to copy
              </>
            )}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-[#374151] mb-2">{name}</h3>
        <div className="space-y-1 mb-3">
          <div
            className="font-mono text-sm text-[#6b7280] cursor-pointer hover:text-[#005a5e] transition-colors flex items-center gap-2"
            onClick={() => handleCopy(hex, "hex")}
            title="Click to copy hex value"
          >
            <span>{hex}</span>
            <Copy className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity" />
          </div>
          <div
            className="font-mono text-xs text-[#6b7280] cursor-pointer hover:text-[#005a5e] transition-colors flex items-center gap-2"
            onClick={() => handleCopy(rgb, "rgb")}
            title="Click to copy RGB value"
          >
            <span>{rgb}</span>
            <Copy className="w-3 h-3 opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <p className="text-sm text-[#6b7280] leading-relaxed">{usage}</p>
      </div>
    </Card>
  );
}
