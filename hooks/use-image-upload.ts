"use client";

import type React from "react";

import { useCallback, useRef, useState } from "react";

interface UseImageUploadProps {
  onUpload?: (url: string) => void;
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convertir archivo a base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
        setUploading(true);
        setError(null);

        try {
          // Validar tipo de archivo
          if (!file.type.startsWith("image/")) {
            throw new Error("Solo se permiten archivos de imagen");
          }

          // Validar tamaño (limitar a 5MB para evitar URLs demasiado largas)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error("La imagen es demasiado grande (máximo 5MB)");
          }

          // Convertir a base64
          const base64String = await convertToBase64(file);
          setPreviewUrl(base64String);

          // Llamar al callback con la URL base64
          onUpload?.(base64String);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error al procesar la imagen"
          );
          console.error(err);
        } finally {
          setUploading(false);
        }
      }
    },
    [onUpload]
  );

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    uploading,
    error,
  };
}
