import * as pdfjsLib from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

// Vite resolves `new URL(..., import.meta.url)` at build time — no extra plugin needed.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * Extracts all text content from a PDF File object.
 * Iterates every page in order and joins text items with whitespace.
 * Throws if the file is not a valid PDF or yields no text.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .filter((item): item is TextItem => "str" in item)
      .map((item) => item.str.trim())
      .filter(Boolean)
      .join(" ");
    pageTexts.push(pageText);
    page.cleanup();
  }

  await pdf.destroy();

  const result = pageTexts.join("\n\n").trim();
  if (!result) throw new Error("No text could be extracted from this PDF.");
  return result;
}
