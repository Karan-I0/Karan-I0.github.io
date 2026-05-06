import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Renders `text` as a 3D cloud of color-graded particles that converge from
// a "universe" sphere into the letter shapes. Drag to rotate, hover to push
// particles away (creates a "hole"), idle slow auto-rotation otherwise.

const MAX_PARTICLES = 5000
const ARRIVAL_MS = 2400
const SAMPLE_STEP = 3
const REPULSION_RADIUS = 90
const REPULSION_STRENGTH = 75

// Color gradient stops along X axis (left → right)
const COLOR_STOPS = [
  [0.0, [1.0, 0.86, 0.25]], // warm yellow
  [0.27, [0.55, 0.95, 0.45]], // green
  [0.55, [0.3, 0.8, 1.0]], // cyan
  [0.78, [0.55, 0.5, 1.0]], // blue
  [1.0, [0.95, 0.45, 0.95]], // magenta
]

function gradientColor(t) {
  const k = Math.max(0, Math.min(1, t))
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (k <= COLOR_STOPS[i + 1][0]) {
      const [a, ca] = COLOR_STOPS[i]
      const [b, cb] = COLOR_STOPS[i + 1]
      const local = (k - a) / (b - a)
      return [
        ca[0] + (cb[0] - ca[0]) * local,
        ca[1] + (cb[1] - ca[1]) * local,
        ca[2] + (cb[2] - ca[2]) * local,
      ]
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1][1]
}

function buildSparkTexture() {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0.0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.55)')
  grad.addColorStop(1.0, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function sampleTextTargets(text, W, H) {
  const SCALE = 2
  const c = document.createElement('canvas')
  c.width = W * SCALE
  c.height = H * SCALE
  const ctx = c.getContext('2d')

  let fontSize = H * SCALE * 0.7
  ctx.font = `700 ${fontSize}px Inter, "SF Pro Display", -apple-system, sans-serif`
  const maxW = c.width * 0.93
  const measured = ctx.measureText(text).width
  if (measured > maxW) {
    fontSize *= maxW / measured
    ctx.font = `700 ${fontSize}px Inter, "SF Pro Display", -apple-system, sans-serif`
  }
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, c.width / 2, c.height / 2)

  const data = ctx.getImageData(0, 0, c.width, c.height).data
  const collected = []
  let minX = Infinity
  let maxX = -Infinity

  for (let y = 0; y < c.height; y += SAMPLE_STEP) {
    for (let x = 0; x < c.width; x += SAMPLE_STEP) {
      const idx = (y * c.width + x) * 4
      if (data[idx + 3] > 140) {
        const wx = (x - c.width / 2) / SCALE
        const wy = -(y - c.height / 2) / SCALE
        if (wx < minX) minX = wx
        if (wx > maxX) maxX = wx
        collected.push([wx, wy])
      }
    }
  }

  const range = maxX - minX || 1
  const target = Math.min(collected.length, MAX_PARTICLES)
  const stride = collected.length / target
  const depthAmplitude = (fontSize / SCALE) * 0.18

  const result = []
  for (let i = 0; i < target; i++) {
    const [wx, wy] = collected[Math.floor(i * stride)]
    const tNorm = (wx - minX) / range
    const wz = (Math.random() - 0.5) * depthAmplitude * 2
    const [r, g, b] = gradientColor(tNorm)
    result.push({ x: wx, y: wy, z: wz, r, g, b })
  }
  return result
}

export default function ParticleName({ text = 'Karan Sharma' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let W = mount.clientWidth
    let H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.cursor = 'grab'
    renderer.domElement.style.touchAction = 'none'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, W / H, 1, 5000)
    camera.position.set(0, 0, Math.max(W, H) * 0.95)

    let targets = sampleTextTargets(text, W, H)
    const N = targets.length

    const positions = new Float32Array(N * 3)
    const startPositions = new Float32Array(N * 3)
    const targetPositions = new Float32Array(N * 3)
    const colors = new Float32Array(N * 3)
    const driftSeeds = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const t = targets[i]
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.max(W, H) * (1.2 + Math.random() * 0.6)
      const sx = r * Math.sin(phi) * Math.cos(theta)
      const sy = r * Math.sin(phi) * Math.sin(theta)
      const sz = r * Math.cos(phi)

      startPositions[i * 3] = sx
      startPositions[i * 3 + 1] = sy
      startPositions[i * 3 + 2] = sz
      positions[i * 3] = sx
      positions[i * 3 + 1] = sy
      positions[i * 3 + 2] = sz

      targetPositions[i * 3] = t.x
      targetPositions[i * 3 + 1] = t.y
      targetPositions[i * 3 + 2] = t.z

      colors[i * 3] = t.r
      colors[i * 3 + 1] = t.g
      colors[i * 3 + 2] = t.b

      driftSeeds[i] = Math.random() * Math.PI * 2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const sparkTex = buildSparkTexture()
    const mat = new THREE.PointsMaterial({
      map: sparkTex,
      size: 7,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Mouse / touch state
    const mouseNDC = new THREE.Vector2(0, 0)
    let mouseActive = false
    let isDragging = false
    let lastDrag = { x: 0, y: 0 }
    const targetRotation = { x: 0, y: 0 }

    const setMouseFromEvent = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1
      mouseNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1
      mouseActive = true
    }

    const onPointerMove = (e) => {
      setMouseFromEvent(e.clientX, e.clientY)
      if (isDragging) {
        const dx = e.clientX - lastDrag.x
        const dy = e.clientY - lastDrag.y
        targetRotation.y += dx * 0.005
        targetRotation.x += dy * 0.005
        targetRotation.x = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, targetRotation.x))
        lastDrag.x = e.clientX
        lastDrag.y = e.clientY
      }
    }
    const onPointerDown = (e) => {
      isDragging = true
      lastDrag.x = e.clientX
      lastDrag.y = e.clientY
      renderer.domElement.style.cursor = 'grabbing'
    }
    const onPointerUp = () => {
      isDragging = false
      renderer.domElement.style.cursor = 'grab'
    }
    const onPointerLeave = () => {
      mouseActive = false
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('pointerup', onPointerUp)

    const raycaster = new THREE.Raycaster()
    const localOrigin = new THREE.Vector3()
    const localDir = new THREE.Vector3()
    const localPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const inv = new THREE.Matrix4()

    const start = performance.now()
    let raf

    const animate = (t) => {
      raf = requestAnimationFrame(animate)
      const elapsed = t - start
      const p = Math.min(1, elapsed / ARRIVAL_MS)
      const eased = 1 - Math.pow(1 - p, 3)
      const arrived = p >= 1
      const driftT = elapsed * 0.0008

      // Idle slow rotation when not dragging
      if (!isDragging && arrived) {
        targetRotation.y += 0.0014
      }

      // Smooth rotation
      points.rotation.x += (targetRotation.x - points.rotation.x) * 0.08
      points.rotation.y += (targetRotation.y - points.rotation.y) * 0.08
      points.updateMatrixWorld()

      // Compute mouse intersection in points-local space (z=0 plane)
      let localMouseX = null
      let localMouseY = null
      if (mouseActive && arrived) {
        raycaster.setFromCamera(mouseNDC, camera)
        inv.copy(points.matrixWorld).invert()
        localOrigin.copy(raycaster.ray.origin).applyMatrix4(inv)
        localDir.copy(raycaster.ray.direction).transformDirection(inv).normalize()
        if (Math.abs(localDir.z) > 0.001) {
          const tHit = -localOrigin.z / localDir.z
          if (tHit > 0) {
            localMouseX = localOrigin.x + localDir.x * tHit
            localMouseY = localOrigin.y + localDir.y * tHit
          }
        }
      }

      const arr = geo.attributes.position.array
      for (let i = 0; i < N; i++) {
        const sx = startPositions[i * 3]
        const sy = startPositions[i * 3 + 1]
        const sz = startPositions[i * 3 + 2]
        const tx = targetPositions[i * 3]
        const ty = targetPositions[i * 3 + 1]
        const tz = targetPositions[i * 3 + 2]

        let px = sx + (tx - sx) * eased
        let py = sy + (ty - sy) * eased
        let pz = sz + (tz - sz) * eased

        if (arrived) {
          const seed = driftSeeds[i]
          px += Math.sin(driftT + seed) * 0.6
          py += Math.cos(driftT * 1.13 + seed) * 0.6

          if (localMouseX !== null) {
            const dx = px - localMouseX
            const dy = py - localMouseY
            const d2 = dx * dx + dy * dy
            const r2 = REPULSION_RADIUS * REPULSION_RADIUS
            if (d2 > 0 && d2 < r2) {
              const d = Math.sqrt(d2)
              const k = 1 - d / REPULSION_RADIUS
              const force = k * k * REPULSION_STRENGTH
              px += (dx / d) * force
              py += (dy / d) * force
            }
          }
        }

        arr[i * 3] = px
        arr[i * 3 + 1] = py
        arr[i * 3 + 2] = pz
      }
      geo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(animate)

    const onResize = () => {
      const newW = mount.clientWidth
      const newH = mount.clientHeight
      if (newW === W && newH === H) return
      W = newW
      H = newH
      renderer.setSize(W, H)
      camera.aspect = W / H
      camera.position.z = Math.max(W, H) * 0.95
      camera.updateProjectionMatrix()

      const newTargets = sampleTextTargets(text, W, H)
      const minN = Math.min(N, newTargets.length)
      for (let i = 0; i < minN; i++) {
        targetPositions[i * 3] = newTargets[i].x
        targetPositions[i * 3 + 1] = newTargets[i].y
        targetPositions[i * 3 + 2] = newTargets[i].z
        colors[i * 3] = newTargets[i].r
        colors[i * 3 + 1] = newTargets[i].g
        colors[i * 3 + 2] = newTargets[i].b
      }
      geo.attributes.color.needsUpdate = true
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('pointerup', onPointerUp)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      sparkTex.dispose()
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement)
    }
  }, [text])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: 'clamp(180px, 26vw, 320px)',
      }}
    />
  )
}
