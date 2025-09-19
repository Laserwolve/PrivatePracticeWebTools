import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import JSZip from 'jszip'

type InputMode = 'urls' | 'files'

interface ImageWithFilename {
  blob: Blob
  filename: string
}

export function ImageOptimizerPage() {
  const [inputMode, setInputMode] = useState<InputMode>('urls')
  const [urls, setUrls] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Currently not running')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [downloadedImages, setDownloadedImages] = useState<ImageWithFilename[]>([])
  const [webpImages, setWebpImages] = useState<ImageWithFilename[]>([])
  const [optimizedImages, setOptimizedImages] = useState<ImageWithFilename[]>([])
  const [zipFile, setZipFile] = useState<Blob | null>(null)
  const [totalImages, setTotalImages] = useState(0)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files)
  }

  const removeFile = (indexToRemove: number) => {
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles)
      filesArray.splice(indexToRemove, 1)
      
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer()
      filesArray.forEach(file => dataTransfer.items.add(file))
      setSelectedFiles(dataTransfer.files)
      
      // Update the input element
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) {
        fileInput.files = dataTransfer.files
      }
    }
  }

  const clearAllFiles = () => {
    setSelectedFiles(null)
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleInputModeChange = (newMode: InputMode) => {
    // Clear previous input when switching modes
    if (newMode === 'files' && inputMode === 'urls') {
      setUrls('') // Clear URLs when switching to file mode
    } else if (newMode === 'urls' && inputMode === 'files') {
      clearAllFiles() // Clear files when switching to URL mode
    }
    setInputMode(newMode)
  }

  const parseUrls = (urlText: string): string[] => {
    return urlText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0 && (url.startsWith('http://') || url.startsWith('https://')))
  }

  const downloadImageFromUrl = async (url: string): Promise<Blob> => {
    const response = await fetch(url, { 
      mode: 'cors',
      cache: 'force-cache' // Use browser cache
    })
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }
    return await response.blob()
  }

  const downloadImagesInBatches = async (urls: string[], batchSize: number = 10): Promise<ImageWithFilename[]> => {
    const downloadedImages: (ImageWithFilename | null)[] = []
    let completedCount = 0
    
    // Process URLs in batches to avoid overwhelming the browser
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize)
      
      setStatusText(`Downloading batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(urls.length / batchSize)} (${batch.length} images)`)
      
      // Download all images in this batch simultaneously
      const batchPromises = batch.map(async (url, batchIndex) => {
        try {
          const blob = await downloadImageFromUrl(url)
          // Extract filename from URL or generate one
          const urlPath = new URL(url).pathname
          const originalFilename = urlPath.split('/').pop() || `image_${i + batchIndex + 1}`
          const filename = originalFilename.includes('.') ? 
            originalFilename.replace(/\.[^.]*$/, '.webp') : 
            `${originalFilename}.webp`
          
          return { blob, filename }
        } catch (error) {
          console.error(`Failed to download image from ${url}:`, error)
          return null // Return null for failed downloads
        }
      })
      
      const batchResults = await Promise.all(batchPromises)
      downloadedImages.push(...batchResults)
      
      completedCount += batch.length
      const downloadProgress = (completedCount / urls.length) * 25
      setProgress(downloadProgress)
    }
    
    // Filter out failed downloads (null values)
    const successfulDownloads = downloadedImages.filter(img => img !== null) as ImageWithFilename[]
    
    setDownloadedImages(successfulDownloads)
    setStatusText(`Downloaded ${successfulDownloads.length} of ${urls.length} images`)
    
    return successfulDownloads
  }

  const convertImageToWebP = async (imageBlob: Blob, quality: number = 0.75): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to convert image to WebP'))
              }
            },
            'image/webp',
            quality
          )
        } else {
          reject(new Error('Failed to get canvas context'))
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(imageBlob)
    })
  }

  const convertAllToWebP = async (images: ImageWithFilename[], batchSize: number = 8): Promise<ImageWithFilename[]> => {
    const convertedImages: ImageWithFilename[] = []
    let completedCount = 0
    
    // Process images in batches to avoid overwhelming the browser
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize)
      
      setStatusText(`Converting to WebP batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(images.length / batchSize)} (${batch.length} images)`)
      
      // Convert all images in this batch simultaneously
      const batchPromises = batch.map(async (imageWithFilename, batchIndex) => {
        try {
          const convertedBlob = await convertImageToWebP(imageWithFilename.blob, 0.75)
          // Ensure filename has .webp extension
          const filename = imageWithFilename.filename.endsWith('.webp') ? 
            imageWithFilename.filename : 
            imageWithFilename.filename.replace(/\.[^.]*$/, '.webp')
          return { blob: convertedBlob, filename }
        } catch (error) {
          console.error(`Failed to convert image ${i + batchIndex + 1} to WebP:`, error)
          return imageWithFilename // Return original image if conversion fails
        }
      })
      
      const batchResults = await Promise.all(batchPromises)
      convertedImages.push(...batchResults)
      
      completedCount += batch.length
      const conversionProgress = 25 + (completedCount / images.length) * 25
      setProgress(conversionProgress)
    }
    
    setWebpImages(convertedImages)
    setStatusText(`Converted ${convertedImages.length} images to WebP`)
    
    return convertedImages
  }

  const cropImageBy5Pixels = async (imageBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Crop 5 pixels from width and height (2.5px from each side)
        const newWidth = Math.max(10, img.width - 5) // Minimum size of 10px
        const newHeight = Math.max(10, img.height - 5) // Minimum size of 10px
        
        canvas.width = newWidth
        canvas.height = newHeight
        
        if (ctx) {
          // Draw cropped image (crop 2.5px from each side)
          ctx.drawImage(
            img, 
            2.5, 2.5, // Source x, y (start cropping from 2.5px in)
            newWidth, newHeight, // Source width, height
            0, 0, // Destination x, y
            newWidth, newHeight // Destination width, height
          )
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to crop image'))
              }
            },
            'image/webp',
            0.75 // Maintain same quality
          )
        } else {
          reject(new Error('Failed to get canvas context'))
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image for cropping'))
      img.src = URL.createObjectURL(imageBlob)
    })
  }

  const optimizeImageSize = async (imageBlob: Blob, maxIterations: number = 100): Promise<Blob> => {
    const targetSize = 100 * 1024 // 100KB in bytes
    let currentBlob = imageBlob
    let iterations = 0
    
    // If already under 100KB, return as-is
    if (currentBlob.size <= targetSize) {
      return currentBlob
    }
    
    while (currentBlob.size > targetSize && iterations < maxIterations) {
      try {
        currentBlob = await cropImageBy5Pixels(currentBlob)
        iterations++
      } catch (error) {
        console.error(`Error cropping image on iteration ${iterations}:`, error)
        break
      }
    }
    
    return currentBlob
  }

  const optimizeAllImageSizes = async (images: ImageWithFilename[], batchSize: number = 6): Promise<ImageWithFilename[]> => {
    const sizeOptimizedImages: ImageWithFilename[] = []
    let completedCount = 0
    
    // Process images in smaller batches since size optimization is CPU intensive
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize)
      
      setStatusText(`Optimizing size batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(images.length / batchSize)} (${batch.length} images)`)
      
      // Optimize all images in this batch simultaneously
      const batchPromises = batch.map(async (imageWithFilename, batchIndex) => {
        const imageIndex = i + batchIndex
        const originalSize = (imageWithFilename.blob.size / 1024).toFixed(1)
        
        try {
          const optimizedBlob = await optimizeImageSize(imageWithFilename.blob)
          return { blob: optimizedBlob, filename: imageWithFilename.filename }
        } catch (error) {
          console.error(`Failed to optimize size for image ${imageIndex + 1}:`, error)
          return imageWithFilename // Return original image if optimization fails
        }
      })
      
      const batchResults = await Promise.all(batchPromises)
      sizeOptimizedImages.push(...batchResults)
      
      completedCount += batch.length
      const sizeProgress = 50 + (completedCount / images.length) * 25
      setProgress(sizeProgress)
    }
    
    setOptimizedImages(sizeOptimizedImages)
    
    // Calculate total size reduction
    const originalTotalSize = images.reduce((sum, img) => sum + img.blob.size, 0) / 1024
    const optimizedTotalSize = sizeOptimizedImages.reduce((sum, img) => sum + img.blob.size, 0) / 1024
    setStatusText(`Size optimization complete: ${originalTotalSize.toFixed(1)}KB → ${optimizedTotalSize.toFixed(1)}KB`)
    
    return sizeOptimizedImages
  }

  const createZipFile = async (images: ImageWithFilename[], batchSize: number = 20) => {
    const zip = new JSZip()
    let completedCount = 0
    
    // Add files to ZIP in batches for better progress tracking
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize)
      
      setStatusText(`Adding batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(images.length / batchSize)} to ZIP (${batch.length} images)`)
      
      // Add all files in this batch to ZIP simultaneously
      const addPromises = batch.map((imageWithFilename, batchIndex) => {
        return new Promise<void>((resolve) => {
          // Use the original filename
          const filename = imageWithFilename.filename
          
          // Add image to ZIP with maximum compression
          zip.file(filename, imageWithFilename.blob, {
            compression: "DEFLATE",
            compressionOptions: {
              level: 9 // Maximum compression level (0-9)
            }
          })
          
          resolve()
        })
      })
      
      await Promise.all(addPromises)
      
      completedCount += batch.length
      const zipProgress = 75 + (completedCount / images.length) * 20 // Reserve 5% for final generation
      setProgress(zipProgress)
    }
    
    setStatusText('Finalizing ZIP file...')
    setProgress(95)
    
    try {
      // Generate the ZIP file as blob
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9 // Maximum compression
        }
      })
      
      setZipFile(zipBlob)
      setProgress(100)
      
      const totalSizeMB = (zipBlob.size / 1024 / 1024).toFixed(2)
      setStatusText(`ZIP file ready! ${images.length} images compressed (${totalSizeMB}MB)`)
      
      return zipBlob
    } catch (error) {
      console.error('Error creating ZIP file:', error)
      setStatusText('Error creating ZIP file')
      throw error
    }
  }

  const downloadZipFile = () => {
    if (!zipFile) return
    
    const url = URL.createObjectURL(zipFile)
    const link = document.createElement('a')
    link.href = url
    link.download = `optimized_images_${new Date().toISOString().slice(0, 10)}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const optimizeImages = async () => {
    if (isOptimizing) return
    
    setIsOptimizing(true)
    setProgress(0)
    setDownloadedImages([])
    setWebpImages([])
    setOptimizedImages([])
    setZipFile(null)
    
    try {
      let imagesToConvert: ImageWithFilename[] = []
      
      if (inputMode === 'urls') {
        const urlList = parseUrls(urls)
        setTotalImages(urlList.length)
        
        if (urlList.length === 0) {
          setStatusText('No valid URLs found')
          return
        }
        
        setStatusText(`Found ${urlList.length} URLs to download`)
        imagesToConvert = await downloadImagesInBatches(urlList)
        setStatusText('All images downloaded successfully!')
        
      } else if (inputMode === 'files' && selectedFiles) {
        setTotalImages(selectedFiles.length)
        setStatusText(`Processing ${selectedFiles.length} uploaded files`)
        
        // For uploaded files, immediately advance to 25% since no download needed
        setProgress(25)
        
        // Convert FileList to ImageWithFilename array, preserving original filenames
        imagesToConvert = Array.from(selectedFiles).map(file => ({
          blob: file,
          filename: file.name.replace(/\.[^.]*$/, '.webp') // Change extension to .webp
        }))
        setDownloadedImages(imagesToConvert)
        setStatusText('Files ready for optimization!')
      }
      
      // Phase 2: Convert all images to WebP (25% to 50%)
      let webpConvertedImages: ImageWithFilename[] = []
      if (imagesToConvert.length > 0) {
        setStatusText('Starting WebP conversion...')
        webpConvertedImages = await convertAllToWebP(imagesToConvert)
        setStatusText('WebP conversion completed!')
      }
      
      // Phase 3: Size optimization (50% to 75%)
      let finalOptimizedImages: ImageWithFilename[] = []
      if (webpConvertedImages.length > 0) {
        setStatusText('Starting size optimization...')
        finalOptimizedImages = await optimizeAllImageSizes(webpConvertedImages)
        setStatusText('Size optimization completed!')
      }
      
      // Phase 4: Create ZIP file (75% to 100%)
      if (finalOptimizedImages.length > 0) {
        setStatusText('Creating ZIP file...')
        await createZipFile(finalOptimizedImages)
        setStatusText('All optimization completed!')
      }
      
    } catch (error) {
      console.error('Error during image optimization:', error)
      setStatusText('Error occurred during optimization')
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Input Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle between URLs and File Upload */}
          <div className="space-y-3">
            <RadioGroup
              value={inputMode}
              onValueChange={handleInputModeChange}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urls" id="urls" />
                <Label htmlFor="urls">Paste URLs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="files" id="files" />
                <Label htmlFor="files">Upload Images</Label>
              </div>
            </RadioGroup>
          </div>

          {/* URL Input */}
          {inputMode === 'urls' && (
            <div className="space-y-2">
              <Label htmlFor="url-input">Image URLs (one per line)</Label>
              <Textarea
                id="url-input"
                placeholder={`https://example.com/image1.jpg
https://example.com/image2.png
https://example.com/image3.gif`}
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                className="h-48 font-mono text-sm resize-none overflow-y-auto"
                rows={10}
              />
            </div>
          )}

          {/* File Upload */}
          {inputMode === 'files' && (
            <div className="space-y-2">
              <Label htmlFor="file-input">Select Images</Label>
              <div className="flex items-center gap-1.5">
                <div className="relative w-48">
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-center w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    {selectedFiles && selectedFiles.length > 0 ? (
                      <span>{selectedFiles.length} file(s) selected</span>
                    ) : (
                      <span className="text-muted-foreground">Choose files...</span>
                    )}
                  </div>
                </div>
              </div>
              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">
                      {selectedFiles.length} file(s) selected:
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFiles}
                      className="h-7 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="max-h-32 overflow-y-auto border rounded-md p-2 bg-muted/30">
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {Array.from(selectedFiles).map((file, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span className="truncate flex-1 mr-2">
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-1 ml-1 flex-shrink-0"
                            aria-label={`Remove ${file.name}`}
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress Section */}
          <div className="space-y-3 pt-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{statusText}</p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={optimizeImages} 
              className="flex-1"
              disabled={isOptimizing || (!urls.trim() && inputMode === 'urls') || (!selectedFiles?.length && inputMode === 'files')}
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Images'}
            </Button>
            <Button 
              variant="outline"
              onClick={downloadZipFile} 
              className="flex-1"
              disabled={!zipFile}
            >
              Download Optimized Images
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
