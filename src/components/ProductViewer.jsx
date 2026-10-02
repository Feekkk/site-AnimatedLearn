import React, { Suspense, useState } from 'react'
import useMacbookStore from '../store'
import { macbookModelAttribution } from '../constants'
import clsx from 'clsx'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import MacbookModel14 from './models/Macbook-14'
import MacbookModel16 from './models/Macbook-16'

const MODEL_14 = '/models/macbook-14-transformed.glb'
const MODEL_16 = '/models/macbook-16-transformed.glb'

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function ModelLoader() {
  const { active } = useProgress()
  if (!active) return null
  return <p className="model-status">Loading model…</p>
}

function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={4} position={[0, 3, 4]} scale={[8, 5, 1]} />
      <Lightformer form="rect" intensity={2} position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
      <Lightformer form="rect" intensity={2} position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 4, 1]} />
      <Lightformer form="rect" intensity={1.5} position={[0, 4, -4]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 4, 1]} />
    </Environment>
  )
}

const ProductViewer = () => {
  const { color, setColor, scale, setScale } = useMacbookStore()
  const [modelError, setModelError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const is14Inch = scale === 0.06
  const Model = is14Inch ? MacbookModel14 : MacbookModel16

  const retry = () => {
    useGLTF.clear(MODEL_14)
    useGLTF.clear(MODEL_16)
    setModelError(false)
    setAttempt((value) => value + 1)
  }

  const selectScale = (nextScale) => {
    setModelError(false)
    setScale(nextScale)
  }

  return (
    <section id="product-viewer">
      <h2>Take a closer look</h2>

      <div className="controls">
        <p className="info">MacbookPro {is14Inch ? '14' : '16'}" in {color}</p>

        <div className="flex-center gap-5 mt-5">
          <div className="color-control">
            <div
              onClick={() => setColor('#adb5bd')}
              className={clsx('bg-neutral-300', color === '#adb5bd' && 'active')}
            />
            <div
              onClick={() => setColor('#2e2c2e')}
              className={clsx('bg-neutral-900', color === '#2e2c2e' && 'active')}
            />
          </div>

          <div className="size-control">
            <div
              onClick={() => selectScale(0.06)}
              className={clsx(scale === 0.06 && 'active')}
            >
              <p>14"</p>
            </div>
            <div
              onClick={() => selectScale(0.08)}
              className={clsx(scale === 0.08 && 'active')}
            >
              <p>16"</p>
            </div>
          </div>
        </div>

        <p className="model-credit">
          3D model &ldquo;{macbookModelAttribution.title}&rdquo; by{' '}
          <a href={macbookModelAttribution.authorUrl} target="_blank" rel="noreferrer">
            {macbookModelAttribution.author}
          </a>{' '}
          is licensed under{' '}
          <a href={macbookModelAttribution.licenseUrl} target="_blank" rel="noreferrer">
            {macbookModelAttribution.license}
          </a>
          . Adapted from the{' '}
          <a href={macbookModelAttribution.sourceUrl} target="_blank" rel="noreferrer">
            original Sketchfab model
          </a>
          .
        </p>
      </div>

      {modelError ? (
        <div className="model-status" role="alert">
          <p>The MacBook model could not be loaded.</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </div>
      ) : (
        <ModelLoader />
      )}

      <Canvas id="canvas" camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 100 }}>
        <ambientLight intensity={1} />
        <Studio />
        <ModelErrorBoundary
          key={`${is14Inch ? '14' : '16'}-${attempt}`}
          onError={() => setModelError(true)}
        >
          <Suspense fallback={null}>
            <Model scale={scale} color={color} position={[0, 0, 0]} />
          </Suspense>
        </ModelErrorBoundary>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </section>
  )
}

export default ProductViewer
