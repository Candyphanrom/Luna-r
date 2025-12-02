'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { useLoader } from '@react-three/fiber'

function Model({ url }: { url: string }) {
  const isStl = url.toLowerCase().endsWith('.stl')
  
  if (isStl) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const geom = useLoader(STLLoader, url)
    return (
      <mesh geometry={geom}>
        <meshStandardMaterial color="gray" />
      </mesh>
    )
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { scene } = useGLTF(url)
    return <primitive object={scene} />
  }
}

export default function ModelViewer({ url }: { url: string }) {
  return (
    <div className="h-[500px] w-full rounded-lg bg-gray-100">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model url={url} />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate />
      </Canvas>
    </div>
  )
}
