import { FileInput, FileInputProps, rem } from '@mantine/core';
import { ReactNode, useState } from 'react';

export interface FileUploadProps
  extends Omit<FileInputProps, 'value' | 'onChange'> {
  variant?: 'default' | 'filled' | 'unstyled';
  onFileChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  showPreview?: boolean;
}

export function FileUpload({
  variant = 'default',
  onFileChange,
  accept = 'image/*',
  maxSize,
  showPreview = false,
  ...props
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);

    if (selectedFile && showPreview && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    onFileChange?.(selectedFile);
  };

  return (
    <div>
      <FileInput
        variant={variant}
        value={file}
        onChange={handleFileChange}
        accept={accept}
        {...props}
      />
      {preview && (
        <div style={{ marginTop: '1rem' }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
    </div>
  );
}
