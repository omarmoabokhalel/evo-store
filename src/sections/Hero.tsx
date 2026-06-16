import { useRef, useEffect, useMemo, Suspense } from 'react'
import { useLanguageStore } from '@/stores/languageStore'
import { translations } from '@/data/translations'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Float } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { demoProducts } from '@/data/products'

function VortexPlane({
  texture,
  index,
  total,
  scrollSpeed,
}: {
  texture: THREE.Texture
  index: number
  total: number
  scrollSpeed: React.MutableRefObject<number>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialAngle = (index / total) * Math.PI * 2
  const radius = 2.5 + (index % 3) * 1.2
  const yPos = (index - total / 2) * 0.8
  const speed = 0.15 + (index % 4) * 0.05

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const scroll = scrollSpeed.current

    // Vortex rotation
    const angle = initialAngle + t * speed + scroll * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius - 5

    meshRef.current.position.x = x
    meshRef.current.position.y = yPos + Math.sin(t * 0.5 + index) * 0.3
    meshRef.current.position.z = z

    // Face center
    meshRef.current.rotation.y = -angle + Math.PI / 2
    meshRef.current.rotation.x = Math.sin(t * 0.3 + index) * 0.1

    // Scale based on z position
    const scale = THREE.MathUtils.mapLinear(z, -8, -2, 0.5, 1.5)
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.2, 1.6]} />
      <meshBasicMaterial map={texture} transparent opacity={0.85} side={THREE.DoubleSide} />
    </mesh>
  )
}

function FloatingText({ index, total }: { index: number; total: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const angle = (index / total) * Math.PI * 2 + Math.PI / 4
  const radius = 4
  const yOffset = (index - total / 2) * 1.5

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const x = Math.cos(angle + t * 0.1) * radius
    const z = Math.sin(angle + t * 0.1) * radius - 6
    meshRef.current.position.set(x, yOffset + Math.sin(t + index) * 0.2, z)
    meshRef.current.rotation.y = -(angle + t * 0.1) + Math.PI / 2
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="#6B46C1" transparent opacity={0.15} />
      </mesh>
    </Float>
  )
}

function Scene() {
  const scrollSpeed = useRef(0)
  const { camera } = useThree()

  // Load textures from product images
  const textures = useTexture(
    demoProducts.slice(0, 8).map((p) => p.image)
  )

  // Smooth scroll handling
  useEffect(() => {
    let targetScroll = 0
    let currentScroll = 0

    const handleWheel = (e: WheelEvent) => {
      targetScroll += e.deltaY * 0.0001
      targetScroll = Math.max(-1, Math.min(1, targetScroll))
    }

    window.addEventListener('wheel', handleWheel, { passive: true })

    const interval = setInterval(() => {
      currentScroll += (targetScroll - currentScroll) * 0.05
      targetScroll *= 0.95
      scrollSpeed.current = currentScroll
    }, 16)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      clearInterval(interval)
    }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Camera movement
    camera.position.z = 3 + Math.sin(t * 0.2) * 0.5
    camera.position.y = Math.sin(t * 0.1) * 0.3
    camera.rotation.z = scrollSpeed.current * 0.1
  })

  const textWords = ['CUSTOM', 'AI', 'STREET', 'WEAR', 'DESIGN', 'CREATE', 'UNIQUE', 'STYLE']

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Vortex Planes */}
      {Array.isArray(textures)
        ? textures.map((tex, i) => (
          <VortexPlane
            key={i}
            texture={tex}
            index={i}
            total={8}
            scrollSpeed={scrollSpeed}
          />
        ))
        : null}

      {/* Floating Text Elements */}
      {textWords.map((word, i) => (
        <FloatingText key={word} index={i} total={textWords.length} />
      ))}

      {/* Particles */}
      <Particles count={100} />
    </>
  )
}

function Particles({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 5,
      ] as [number, number, number],
      speed: 0.005 + Math.random() * 0.01,
      offset: Math.random() * Math.PI * 2,
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    particles.forEach((p, i) => {
      dummy.position.set(
        p.position[0] + Math.sin(t * p.speed + p.offset) * 0.5,
        p.position[1] + Math.cos(t * p.speed + p.offset) * 0.5,
        p.position[2]
      )
      dummy.scale.setScalar(0.02 + Math.sin(t + p.offset) * 0.01)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#6B46C1" transparent opacity={0.4} />
    </instancedMesh>
  )
}

export default function Hero() {
  const { language } = useLanguageStore()
  const t = translations[language]

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center"
        >
          <h1
            className="text-[clamp(3rem,10vw,9rem)] font-extrabold tracking-[-0.05em] leading-[0.9] mb-6 text-white"
          >
            <span className="block">{t.heroTitle}</span>
            <span className="block text-gradient text-[clamp(1.5rem,5vw,4rem)] tracking-[-0.02em] font-bold mt-2 leading-[1.4] pb-2">
              {t.heroSubtitle}
            </span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            {t.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform duration-300"
            >
              {t.exploreCollection}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
            </Link>
            <Link
              to="/customizer"
              className="flex items-center gap-3 px-8 py-4 rounded-full glass text-white font-bold hover:bg-white/10 transition-all duration-300"
            >
              {t.aiStudio}
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/40 text-xs uppercase tracking-[0.2em]">{t.scroll}</span>
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
