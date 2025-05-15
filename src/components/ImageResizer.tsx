import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { Footer } from './ModalComponents';


const ImageResizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [maxSize, setMaxSize] = useState<number>(1.9);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [imageInfo, setImageInfo] = useState<{
    originalSize?: string;
    processedSize?: string;
    dimensions?: string;
  }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // B2 dimensions in pixels
  const targetWidth = 2673;
  const targetHeight = 1890;

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImageInfo(prev => ({
        ...prev,
        originalSize: formatBytes(file.size)
      }));
      await processImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setImageInfo(prev => ({
        ...prev,
        originalSize: formatBytes(file.size)
      }));
      await processImage(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setMaxSize(newValue);
    
    // Reprocess image when slider changes
    if (selectedFile) {
      processImage(selectedFile);
    }
  };

  const processImage = async (file: File) => {
    if (!file.type.includes('image')) {
      alert('Please select an image file');
      return;
    }

    setProcessing(true);

    try {
      // Create an image element to get original dimensions
      const img = new Image();
      const imgUrl = URL.createObjectURL(file);
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          setImageInfo(prev => ({
            ...prev,
            dimensions: `${img.width}x${img.height}`
          }));
          resolve();
        };
        img.src = imgUrl;
      });

      // Resize the image to B2 dimensions
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to PNG format
      const resizedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      });

      // Create a File object from the Blob
      const resizedFile = new File([resizedBlob], `${file.name.split('.')[0]}.png`, { 
        type: 'image/png',
        lastModified: new Date().getTime()
      });

      // Compress the image
      const options = {
        maxSizeMB: maxSize,
        maxWidthOrHeight: Math.max(targetWidth, targetHeight),
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(resizedFile, options);
      const compressedUrl = URL.createObjectURL(compressedFile);
      
      setProcessedImageUrl(compressedUrl);
      setImageInfo(prev => ({
        ...prev,
        processedSize: formatBytes(compressedFile.size)
      }));
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = `processed_${selectedFile?.name?.split('.')[0] || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="tw:flex tw:flex-col tw:h-full">
      {/* Header with icon */}
      <div className="tw:bg-[#14082d] tw:px-4 tw:py-3 tw:flex tw:items-center tw:gap-3">
        <div className="tw:bg-[#2a2347] tw:rounded-full tw:w-10 tw:h-10 tw:flex tw:items-center tw:justify-center">
          <span className="tw:text-white">•••</span>
        </div>
        <h2 className="tw:text-white tw:text-xl">Image Resizer</h2>
      </div>
      
      {/* Main content */}
      <div className="tw:p-4 tw:flex tw:flex-col tw:gap-5 tw:flex-grow tw:overflow-y-auto">
        {/* Description */}
        <p className="tw:text-gray-500">
          Upload an image to resize it to B2 (707 × 500 mm)/(2673 x 1890 px), convert it to PNG, and compress it under 2MB.
        </p>
        
        {/* Upload area or preview */}
        {!processedImageUrl ? (
          <div 
            className="tw:bg-white tw:rounded-md tw:p-6 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:cursor-pointer tw:border tw:border-gray-300 tw:shadow-md"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="tw:hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            {/* Cloud upload icon */}
            <div className="tw:rounded-full tw:w-16 tw:h-16 tw:flex tw:items-center tw:justify-center tw:mb-[-5px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="tw:h-10 tw:w-14 tw:text-black" fill="none" viewBox="0 0 26 20" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <p className="tw:text-blue-500 tw:font-medium">Click to upload</p>
            <p className="tw:text-gray-500">or drag and drop</p>
            <p className="tw:text-gray-400 tw:text-sm">Supported formats: JPG and PNG</p>
          </div>
        ) : (
          <div className="tw:bg-white tw:rounded-md tw:p-4 tw:border tw:border-gray-200">
            <div className="tw:aspect-w-4 tw:aspect-h-3 tw:mb-3">
              <img 
                src={processedImageUrl} 
                alt="Processed Image" 
                className="tw:object-contain tw:w-full tw:h-full tw:rounded-md"
              />
            </div>
            {imageInfo.dimensions && (
              <div className="tw:text-sm tw:text-gray-500">
                <p>Original size: {imageInfo.originalSize}</p>
                <p>Processed size: {imageInfo.processedSize}</p>
                <p>Dimensions: Resized to {targetWidth}x{targetHeight} pixels (B2)</p>
              </div>
            )}
          </div>
        )}
        
        {/* Slider for resolution */}
        <div className="tw:mt-2">
          <div className="tw:flex tw:justify-between tw:mb-2">
            <p className="tw:text-gray-500">Maximum Resolution (MB)</p>
            <p className="tw:text-gray-600 tw:font-medium">{maxSize.toFixed(1)} MB</p>
          </div>
          <div className="tw:flex tw:items-center tw:gap-2">
            <span className="tw:text-gray-500">0</span>
            <input 
              type="range" 
              min="0.1" 
              max="1.9" 
              step="0.1" 
              value={maxSize}
              onChange={handleSliderChange}
              className="tw:flex-grow tw:h-1 tw:appearance-none tw:bg-gray-300 tw:rounded-full"
            />
            <span className="tw:bg-[#2a2347] tw:text-white tw:px-2 tw:py-1 tw:rounded-md">1.9</span>
          </div>
          <div className="tw:flex tw:justify-between tw:text-xs tw:text-gray-400 tw:mt-1">
            <span>Lower quality, smaller file</span>
            <span>Higher quality, larger file</span>
          </div>
        </div>
        
        {/* Status message */}
        {processing && (
          <div className="tw:text-blue-500 tw:text-center">
            Processing image...
          </div>
        )}
        
        {/* Download button */}
        <div className="tw:flex tw:justify-center tw:mt-2">
          <button 
            onClick={downloadImage}
            className={`tw:py-2 tw:px-4 tw:rounded-md tw:font-medium tw:border tw:bg-blue-600${
              processedImageUrl && !processing 
                ? 'tw:bg-blue-100 tw:text-black tw:hover:bg-gray-300 tw:cursor-pointer' 
                : 'tw:bg-gray-100 tw:text-gray-400 tw:cursor-not-allowed'
            }`}
            disabled={!processedImageUrl || processing}
          >
            Download Image
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ImageResizer; 