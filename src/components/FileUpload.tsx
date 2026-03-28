import { useState, useCallback, useRef } from "react";
import type { Player } from "../types";
import { parseRosterHtml } from "../parser";

interface FileUploadProps {
  onParsed: (players: Player[]) => void;
}

export function FileUpload({ onParsed }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.name.endsWith(".xls")) {
        setError("Expected a .xls file from Hockey Nation.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const players = parseRosterHtml(reader.result as string);
          if (players.length === 0) {
            setError("No players found in file.");
            return;
          }
          onParsed(players);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to parse file.");
        }
      };
      reader.onerror = () => setError("Failed to read file.");
      reader.readAsText(file);
    },
    [onParsed],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      className={`file-upload${dragOver ? " file-upload--drag-over" : ""}`}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xls"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        style={{ display: "none" }}
      />
      <p className="file-upload__label">
        Drop your Hockey Nation <code>.xls</code> skill export here
      </p>
      <p className="file-upload__hint">or click to browse</p>
      {error && <p className="file-upload__error">{error}</p>}
    </div>
  );
}
