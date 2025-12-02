'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Plus, Save, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [videoUrl, setVideoUrl] = useState('')
  const [modelUrl, setModelUrl] = useState('')
  const [variants, setVariants] = useState([{ name: '', dimensions: '', price: '' }])
  
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    const response = await fetch(`/api/upload?filename=${file.name}`, {
      method: 'POST',
      body: file,
    });
    const newBlob = await response.json();
    return newBlob.url;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setLoading(true)
    try {
      const url = await handleUpload(e.target.files[0])
      setImages([...images, url])
    } catch (err) {
      console.error(err)
      alert('Error uploading image')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setLoading(true)
    try {
      const url = await handleUpload(e.target.files[0])
      setVideoUrl(url)
    } catch (err) {
      console.error(err)
      alert('Error uploading video')
    } finally {
      setLoading(false)
    }
  }

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setLoading(true)
    try {
      const url = await handleUpload(e.target.files[0])
      setModelUrl(url)
    } catch (err) {
      console.error(err)
      alert('Error uploading model')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      images,
      videoUrl,
      modelUrl,
      variants: variants.map(v => ({
        name: v.name,
        dimensions: v.dimensions,
        price: parseFloat(v.price)
      }))
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        alert('Error creating product')
      }
    } catch (err) {
      console.error(err)
      alert('Error creating product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl"
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Create New Product
        </h1>
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-xl shadow-2xl">
        {/* Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400">Product Name</label>
            <input
              name="name"
              type="text"
              required
              className="mt-2 block w-full rounded-lg border-0 bg-gray-800 p-4 text-white placeholder-gray-500 shadow-inner ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. Cyberpunk Helmet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Description</label>
            <textarea
              name="description"
              rows={4}
              required
              className="mt-2 block w-full rounded-lg border-0 bg-gray-800 p-4 text-white placeholder-gray-500 shadow-inner ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Product details..."
            />
          </div>
        </div>

        {/* Media */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-4">Media Gallery</label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <AnimatePresence>
              {images.map((url, i) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square overflow-hidden rounded-xl border border-gray-700 group"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/30 hover:border-indigo-500 hover:bg-gray-800/50 transition-all">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">Upload Image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* Additional Files */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Video Demo</label>
            {videoUrl ? (
              <div className="relative">
                <video src={videoUrl} className="h-32 w-full rounded-lg object-cover" controls />
                <button
                  type="button"
                  onClick={() => setVideoUrl('')}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-500"
              />
            )}
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">3D Model (.glb, .stl)</label>
            {modelUrl ? (
              <div className="flex items-center justify-between rounded-lg bg-indigo-900/30 p-3 border border-indigo-500/30">
                <span className="text-indigo-300 text-sm">Model Uploaded</span>
                <button
                  type="button"
                  onClick={() => setModelUrl('')}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept=".glb,.gltf,.stl"
                onChange={handleModelUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-500"
              />
            )}
          </div>
        </div>

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-400">Variants</label>
            <button
              type="button"
              onClick={() => setVariants([...variants, { name: '', dimensions: '', price: '' }])}
              className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Variant
            </button>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {variants.map((variant, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-32">
                    <input
                      type="text"
                      placeholder="Size (XL)"
                      value={variant.name}
                      onChange={(e) => {
                        const newVariants = [...variants]
                        newVariants[index].name = e.target.value
                        setVariants(newVariants)
                      }}
                      className="block w-full rounded-lg border-0 bg-gray-800 p-3 text-white placeholder-gray-500 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Dimensions (20x20x20 cm)"
                      value={variant.dimensions}
                      onChange={(e) => {
                        const newVariants = [...variants]
                        newVariants[index].dimensions = e.target.value
                        setVariants(newVariants)
                      }}
                      className="block w-full rounded-lg border-0 bg-gray-800 p-3 text-white placeholder-gray-500 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) => {
                        const newVariants = [...variants]
                        newVariants[index].price = e.target.value
                        setVariants(newVariants)
                      }}
                      className="block w-full rounded-lg border-0 bg-gray-800 p-3 text-white placeholder-gray-500 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-indigo-500"
                      required
                      step="0.01"
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                      className="mt-3 text-red-500 hover:text-red-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-6 border-t border-gray-800">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-3 text-base font-bold text-white shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? (
              'Creating...'
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
