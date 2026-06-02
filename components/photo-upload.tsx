'use client'

import { useCallback, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fileToOptimizedDataUrl, validateImageFile } from '@/lib/image-utils'

interface PhotoUploadProps {
  value: string | null
  onChange: (value: string | null) => void
  onError?: (message: string) => void
  disabled?: boolean
  className?: string
}

export function PhotoUpload({
  value,
  onChange,
  onError,
  disabled = false,
  className,
}: PhotoUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file)
      if (validationError) {
        onError?.(validationError)
        return
      }

      setIsProcessing(true)
      try {
        const dataUrl = await fileToOptimizedDataUrl(file)
        onChange(dataUrl)
        onError?.('')
      } catch {
        onError?.('No se pudo cargar la imagen. Intenta con otro archivo.')
      } finally {
        setIsProcessing(false)
      }
    },
    [onChange, onError],
  )

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length || disabled || isProcessing) return
      void processFile(files[0])
    },
    [disabled, isProcessing, processFile],
  )

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled || isProcessing) return
    dragCounter.current += 1
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled || isProcessing) return
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)
    if (disabled || isProcessing) return
    handleFiles(event.dataTransfer.files)
  }

  const clearPhoto = (event: React.MouseEvent) => {
    event.stopPropagation()
    onChange(null)
    onError?.('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        disabled={disabled || isProcessing}
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div className="relative mx-auto w-full max-w-xs">
        {value && (
          <button
            type="button"
            onClick={clearPhoto}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Quitar foto"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <label
          htmlFor={inputId}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 transition-colors touch-manipulation',
            'border-foreground/30 bg-secondary/40 hover:border-foreground/50 hover:bg-secondary/60',
            isDragging && 'border-primary bg-primary/10',
            (disabled || isProcessing) && 'pointer-events-none opacity-60',
          )}
        >
          {value ? (
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-foreground/20 shadow-md">
              <Image
                src={value}
                alt="Vista previa de tu foto"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-foreground/25 bg-background/40">
              <Camera className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          <p className="mt-4 text-center text-sm font-medium text-foreground">
            {isProcessing
              ? 'Procesando imagen...'
              : isDragging
                ? 'Suelta la imagen aqui'
                : value
                  ? 'Toca para cambiar la foto'
                  : 'Foto de perfil'}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Upload className="h-3.5 w-3.5 shrink-0" />
            Arrastra una imagen o toca para elegir
          </p>
          <p className="mt-1 text-center text-[10px] text-muted-foreground/80">
            JPG, PNG, WEBP o GIF · max. 5 MB
          </p>
        </label>
      </div>
    </div>
  )
}
