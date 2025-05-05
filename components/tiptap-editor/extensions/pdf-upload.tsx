"use client"

import type React from "react"

import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { NodeViewWrapper } from "@tiptap/react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, Trash, Upload, Loader2, ExternalLink, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface PDFNodeAttributes {
  src: string
  filename: string
  filesize: number
  description?: string
}

export interface PDFComponentProps {
  node: {
    attrs: PDFNodeAttributes
  }
  updateAttributes: (attrs: Partial<PDFNodeAttributes>) => void
  deleteNode: () => void
}

const PDFComponent = ({ node, updateAttributes, deleteNode }: PDFComponentProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [description, setDescription] = useState(node.attrs.description || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modificar la función handleFileChange para manejar mejor los archivos PDF
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    try {
      // Verificar que sea un archivo PDF
      if (file.type !== "application/pdf") {
        throw new Error("Solo se permiten archivos PDF")
      }

      // Limitar el tamaño del archivo (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("El archivo es demasiado grande. El tamaño máximo es 10MB")
      }

      // Usar FileReader para convertir a data URL
      const reader = new FileReader()

      reader.onload = () => {
        const dataUrl = reader.result as string

        // Verificar que el resultado sea válido
        if (!dataUrl || typeof dataUrl !== "string") {
          throw new Error("Error al leer el archivo")
        }

        updateAttributes({
          src: dataUrl,
          filename: file.name,
          filesize: file.size,
          description: description || `Template PDF: ${file.name}`,
        })

        setIsLoading(false)
      }

      reader.onerror = () => {
        throw new Error("Error al leer el archivo")
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading PDF:", error)
      alert(error instanceof Error ? error.message : "Error al cargar el PDF")
      setIsLoading(false)
    }
  }

  // Modificar la función handleDownload para asegurar que funcione correctamente
  const handleDownload = () => {
    try {
      // Crear un elemento <a> para la descarga
      const link = document.createElement("a")

      // Establecer el atributo href a la URL del PDF
      link.href = node.attrs.src

      // Establecer el nombre del archivo para la descarga
      link.download = node.attrs.filename || "document.pdf"

      // Ocultar el elemento
      link.style.display = "none"

      // Simular un clic en el enlace para iniciar la descarga
      document.body.appendChild(link)
      link.click()

      // Eliminar el enlace después de un breve retraso
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
    } catch (error) {
      console.error("Error downloading PDF:", error)

      // Método alternativo si el anterior falla
      window.open(node.attrs.src, "_blank")
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const openPDF = () => {
    window.open(node.attrs.src, "_blank")
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value
    setDescription(newDescription)
    updateAttributes({ description: newDescription })
  }

  return (
    <NodeViewWrapper
      className="pdf-wrapper my-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
        {node.attrs.src ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{node.attrs.filename || "Document.pdf"}</h4>
                <p className="text-xs text-gray-500">{formatFileSize(node.attrs.filesize || 0)}</p>
                {node.attrs.description && <p className="mt-1 text-sm text-gray-700">{node.attrs.description}</p>}
                {isHovered && (
                  <input
                    type="text"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Añadir descripción de la plantilla..."
                    className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                )}
              </div>
              <div className={cn("flex gap-2 transition-opacity", isHovered ? "opacity-100" : "opacity-0")}>
                <Button size="sm" variant="outline" onClick={() => setShowPreview(true)} title="Preview PDF">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={openPDF} title="Open PDF">
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownload} title="Download Template">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={deleteNode} title="Remove PDF">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <Button size="sm" variant="default" onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Descargar plantilla PDF
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="text-sm text-gray-500">Subiendo plantilla PDF...</p>
              </div>
            ) : (
              <>
                <FileText className="mb-2 h-10 w-10 text-gray-400" />
                <p className="mb-2 text-sm font-medium">Subir una plantilla PDF</p>
                <p className="mb-4 text-xs text-gray-500">Archivos PDF hasta 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar plantilla PDF
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{node.attrs.filename || "PDF Preview"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-full min-h-[60vh]">
            {node.attrs.src && (
              <iframe
                src={`${node.attrs.src}#toolbar=0`}
                className="w-full h-full rounded-md border"
                title={node.attrs.filename || "PDF Preview"}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </NodeViewWrapper>
  )
}

export const PDFUpload = Node.create({
  name: "pdfUpload",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: "",
      },
      filename: {
        default: "",
      },
      filesize: {
        default: 0,
      },
      description: {
        default: "",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="pdf-upload"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "pdf-upload" })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(PDFComponent)
  },

  addCommands() {
    return {
      insertPDF:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: "",
              filename: "",
              filesize: 0,
              description: "",
            },
          })
        },
    }
  },
})

export default PDFUpload
