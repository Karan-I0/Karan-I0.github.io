import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Rounded-rect smartphone built from primitives, with a CanvasTexture screen
// that cycles through three project mockups (drawn live with 2D canvas APIs).
// Lives in the hero. Idle rotation + scroll-tied transform.

const SCREEN_W = 540
const SCREEN_H = 1170
const FRAME_INTERVAL_MS = 3200
const FADE_MS = 320

// Optional screenshot frames — loaded from public/. If a file isn't present,
// we fall back to the corresponding stylized 2D-canvas painter below.
// To replace a stylized frame with a real screenshot, drop a PNG in
// `public/screens/` and reference the path here.
const SCREENSHOT_FRAMES = [
  '/screens/runkeeper.png', // Frame 0 — Runkeeper (replaces stylized fitness)
  null, // Frame 1 — keep stylized auth (or set '/screens/onespan.png')
  null, // Frame 2 — keep stylized insurance (or set '/screens/insurance.png')
]

// ───── 2D canvas frame painters (monochrome, Apple-style) ─────

function paintStatusBar(ctx) {
  ctx.fillStyle = '#ffffff'
  ctx.font = '600 28px -apple-system, Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('9:41', 36, 50)

  // Battery icon (right side)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.strokeRect(SCREEN_W - 80, 30, 50, 24)
  ctx.fillRect(SCREEN_W - 28, 38, 3, 8)
  ctx.fillRect(SCREEN_W - 78, 32, 38, 20)

  // Notch (centered)
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  const notchY = 0
  const notchW = 180
  const notchH = 32
  const cx = SCREEN_W / 2
  ctx.moveTo(cx - notchW / 2, notchY)
  ctx.lineTo(cx + notchW / 2, notchY)
  ctx.quadraticCurveTo(cx + notchW / 2 + 12, notchY, cx + notchW / 2 + 12, notchY + 12)
  ctx.lineTo(cx + notchW / 2 + 12, notchY + notchH - 12)
  ctx.quadraticCurveTo(cx + notchW / 2 + 12, notchY + notchH, cx + notchW / 2, notchY + notchH)
  ctx.lineTo(cx - notchW / 2, notchY + notchH)
  ctx.quadraticCurveTo(cx - notchW / 2 - 12, notchY + notchH, cx - notchW / 2 - 12, notchY + notchH - 12)
  ctx.lineTo(cx - notchW / 2 - 12, notchY + 12)
  ctx.quadraticCurveTo(cx - notchW / 2 - 12, notchY, cx - notchW / 2, notchY)
  ctx.fill()
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Frame 0 — Runkeeper-style fitness
function paintFitness(ctx) {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
  paintStatusBar(ctx)

  // App label
  ctx.fillStyle = '#86868b'
  ctx.font = '500 22px -apple-system, Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('TODAY · MORNING RUN', SCREEN_W / 2, 160)

  // Big kilometres number
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 200px -apple-system, Inter, sans-serif'
  ctx.fillText('5.27', SCREEN_W / 2, 380)

  ctx.font = '500 22px -apple-system, Inter, sans-serif'
  ctx.fillStyle = '#86868b'
  ctx.fillText('KILOMETRES', SCREEN_W / 2, 425)

  // 3 stat tiles
  const tileY = 530
  const tileH = 130
  const gap = 18
  const tileW = (SCREEN_W - 72 - gap * 2) / 3
  const stats = [
    ['28:14', 'TIME'],
    ['5:21', 'AVG / KM'],
    ['412', 'CAL'],
  ]
  stats.forEach((s, i) => {
    const x = 36 + i * (tileW + gap)
    ctx.fillStyle = '#1d1d1f'
    roundRect(ctx, x, tileY, tileW, tileH, 14)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = '600 36px -apple-system, Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(s[0], x + tileW / 2, tileY + 56)
    ctx.fillStyle = '#86868b'
    ctx.font = '500 16px -apple-system, Inter, sans-serif'
    ctx.fillText(s[1], x + tileW / 2, tileY + 96)
  })

  // Faux map area
  ctx.fillStyle = '#0e0e0f'
  roundRect(ctx, 36, 700, SCREEN_W - 72, 320, 18)
  ctx.fill()

  // Route polyline (stylized)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(80, 950)
  ctx.bezierCurveTo(140, 820, 240, 880, 280, 780)
  ctx.bezierCurveTo(320, 720, 400, 760, 460, 730)
  ctx.stroke()

  // Start dot
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(80, 950, 9, 0, Math.PI * 2)
  ctx.fill()
  // End dot
  ctx.beginPath()
  ctx.arc(460, 730, 9, 0, Math.PI * 2)
  ctx.fill()

  // Bottom action bar
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 80, 1060, SCREEN_W - 160, 70, 35)
  ctx.fill()
  ctx.fillStyle = '#000000'
  ctx.font = '600 24px -apple-system, Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('End Run', SCREEN_W / 2, 1106)
}

// Frame 1 — OneSpan-style secure auth
function paintAuth(ctx) {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
  paintStatusBar(ctx)

  // Lock icon (drawn)
  const cx = SCREEN_W / 2
  const lockY = 280
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  // Lock body
  ctx.fillStyle = '#1d1d1f'
  roundRect(ctx, cx - 70, lockY, 140, 110, 14)
  ctx.fill()
  // Shackle
  ctx.beginPath()
  ctx.arc(cx, lockY, 50, Math.PI, Math.PI * 2)
  ctx.stroke()
  // Keyhole
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(cx, lockY + 50, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(cx - 3, lockY + 55, 6, 22)

  // Heading
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 56px -apple-system, Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Secure Sign-In', cx, 510)

  ctx.fillStyle = '#86868b'
  ctx.font = '400 24px -apple-system, Inter, sans-serif'
  ctx.fillText('Enter the 6-digit authentication code', cx, 560)
  ctx.fillText('sent to your device.', cx, 594)

  // 6 OTP boxes
  const boxW = 60
  const boxH = 80
  const boxGap = 14
  const totalW = boxW * 6 + boxGap * 5
  const startX = (SCREEN_W - totalW) / 2
  const boxY = 690
  const filled = ['7', '3', '8', '·', '·', '·']
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = i < 3 ? '#ffffff' : '#3a3a3c'
    ctx.lineWidth = 2
    roundRect(ctx, startX + i * (boxW + boxGap), boxY, boxW, boxH, 10)
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.font = '500 36px -apple-system, Inter, sans-serif'
    ctx.fillText(filled[i], startX + i * (boxW + boxGap) + boxW / 2, boxY + 54)
  }

  // Footer line
  ctx.fillStyle = '#86868b'
  ctx.font = '400 20px -apple-system, Inter, sans-serif'
  ctx.fillText('Didn’t receive a code?', cx, 870)
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Resend', cx, 904)

  // Primary button
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 80, 1010, SCREEN_W - 160, 70, 35)
  ctx.fill()
  ctx.fillStyle = '#000000'
  ctx.font = '600 24px -apple-system, Inter, sans-serif'
  ctx.fillText('Verify', cx, 1056)
}

// Frame 2 — RN insurance dashboard
function paintInsurance(ctx) {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
  paintStatusBar(ctx)

  // Header
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 56px -apple-system, Inter, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Claims', 40, 180)

  ctx.fillStyle = '#86868b'
  ctx.font = '400 22px -apple-system, Inter, sans-serif'
  ctx.fillText('3 active · 12 closed this year', 40, 218)

  // Filter chips
  const chips = ['All', 'Active', 'Closed']
  let chipX = 40
  const chipY = 270
  chips.forEach((c, i) => {
    const w = ctx.measureText(c).width + 36
    if (i === 0) {
      ctx.fillStyle = '#ffffff'
    } else {
      ctx.fillStyle = '#1d1d1f'
    }
    roundRect(ctx, chipX, chipY, w, 44, 22)
    ctx.fill()
    ctx.fillStyle = i === 0 ? '#000000' : '#ffffff'
    ctx.font = '500 18px -apple-system, Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(c, chipX + w / 2, chipY + 28)
    chipX += w + 12
  })

  // Claim cards
  const claims = [
    ['#A-2839', 'Auto · Collision', 'In review', '$ 4,210'],
    ['#H-1024', 'Home · Water damage', 'Approved', '$ 8,940'],
    ['#A-2814', 'Auto · Glass repair', 'Closed', '$ 320'],
  ]
  let cardY = 350
  claims.forEach((c) => {
    ctx.fillStyle = '#0e0e0f'
    roundRect(ctx, 40, cardY, SCREEN_W - 80, 150, 16)
    ctx.fill()

    ctx.fillStyle = '#86868b'
    ctx.font = '500 16px -apple-system, Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(c[0], 64, cardY + 36)

    ctx.fillStyle = '#ffffff'
    ctx.font = '600 26px -apple-system, Inter, sans-serif'
    ctx.fillText(c[1], 64, cardY + 80)

    ctx.fillStyle = '#86868b'
    ctx.font = '400 18px -apple-system, Inter, sans-serif'
    ctx.fillText(c[2], 64, cardY + 116)

    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'right'
    ctx.font = '600 26px -apple-system, Inter, sans-serif'
    ctx.fillText(c[3], SCREEN_W - 64, cardY + 92)

    cardY += 168
  })

  // Bottom action
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 80, 1010, SCREEN_W - 160, 70, 35)
  ctx.fill()
  ctx.fillStyle = '#000000'
  ctx.font = '600 24px -apple-system, Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('File New Claim', SCREEN_W / 2, 1056)
}

const FRAME_PAINTERS = [paintFitness, paintAuth, paintInsurance]

// Build a rounded-rect Three.js Shape (for ExtrudeGeometry)
function buildPhoneShape(w, h, r) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 + r)
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
  return s
}

export default function MockupPhone({ scrollProgress = 0 }) {
  const mountRef = useRef(null)
  const scrollProgressRef = useRef(scrollProgress)

  useEffect(() => {
    scrollProgressRef.current = scrollProgress
  }, [scrollProgress])

  useEffect(() => {
    const mount = mountRef.current
    const W = mount.clientWidth
    const H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(26, W / H, 0.1, 100)
    camera.position.set(0, 0, 10)

    // Phone shape — 9:19.5 aspect-ish, rounded with refined chamfers
    const phoneW = 1.9
    const phoneH = 4.05
    const phoneR = 0.32 // larger corner radius — more iPhone-like
    const phoneDepth = 0.13 // thinner profile
    const shape = buildPhoneShape(phoneW, phoneH, phoneR)
    const bodyGeo = new THREE.ExtrudeGeometry(shape, {
      depth: phoneDepth,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 12, // smoother chamfer
      curveSegments: 48,
    })
    bodyGeo.center()

    // Premium gunmetal — slightly bluer-black, very polished
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x171719,
      roughness: 0.22,
      metalness: 0.95,
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)

    const phoneGroup = new THREE.Group()
    phoneGroup.add(body)

    // Inner bezel — slightly brighter ring around the screen for definition
    const bezelShape = buildPhoneShape(
      phoneW - 0.06,
      phoneH - 0.06,
      phoneR - 0.04,
    )
    const bezelGeo = new THREE.ShapeGeometry(bezelShape)
    bezelGeo.center()
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.4,
      metalness: 0.4,
    })
    const bezel = new THREE.Mesh(bezelGeo, bezelMat)
    bezel.position.z = phoneDepth / 2 + 0.0285
    phoneGroup.add(bezel)

    // Screen — inset plane with CanvasTexture
    const screenCanvas = document.createElement('canvas')
    screenCanvas.width = SCREEN_W
    screenCanvas.height = SCREEN_H
    const ctx = screenCanvas.getContext('2d')

    // Pre-load any optional screenshot images (non-blocking; falls back to painter on error)
    const loadedImages = SCREENSHOT_FRAMES.map(() => null)
    SCREENSHOT_FRAMES.forEach((src, i) => {
      if (!src) return
      const img = new Image()
      img.onload = () => {
        loadedImages[i] = img
        // If the current frame is this one, repaint immediately
        if (currentFrame === i) {
          drawFrame(i)
          tex.needsUpdate = true
        }
      }
      img.onerror = () => {
        // image missing — silently fall back to painter
        loadedImages[i] = null
      }
      img.src = src
    })

    function drawFrame(i) {
      const img = loadedImages[i]
      if (img) {
        // Letterbox / cover the screen with the screenshot
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
        const ratio = img.width / img.height
        const targetRatio = SCREEN_W / SCREEN_H
        let dw, dh, dx, dy
        if (ratio > targetRatio) {
          dh = SCREEN_H
          dw = SCREEN_H * ratio
          dx = (SCREEN_W - dw) / 2
          dy = 0
        } else {
          dw = SCREEN_W
          dh = SCREEN_W / ratio
          dx = 0
          dy = (SCREEN_H - dh) / 2
        }
        ctx.drawImage(img, dx, dy, dw, dh)
      } else if (FRAME_PAINTERS[i]) {
        FRAME_PAINTERS[i](ctx)
      }
    }

    drawFrame(0) // initial

    const tex = new THREE.CanvasTexture(screenCanvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8

    const screenInset = 0.11
    const screenGeo = new THREE.PlaneGeometry(
      phoneW - screenInset * 2,
      phoneH - screenInset * 2,
    )
    const screenMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 1,
    })
    const screen = new THREE.Mesh(screenGeo, screenMat)
    screen.position.z = phoneDepth / 2 + 0.029
    phoneGroup.add(screen)

    // Camera dot (front)
    const camDot = new THREE.Mesh(
      new THREE.CircleGeometry(0.035, 32),
      new THREE.MeshBasicMaterial({ color: 0x0a0a0c }),
    )
    camDot.position.set(0, phoneH / 2 - 0.2, phoneDepth / 2 + 0.03)
    phoneGroup.add(camDot)

    // Side highlight — thin emissive strip running down the right edge
    const edgeStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(0.012, phoneH * 0.7),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
      }),
    )
    edgeStrip.position.set(phoneW / 2 + 0.001, 0, 0.02)
    edgeStrip.rotation.y = Math.PI / 2
    phoneGroup.add(edgeStrip)

    scene.add(phoneGroup)

    // Lighting — three-point setup for crisp edges
    scene.add(new THREE.AmbientLight(0xffffff, 0.45))
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(3, 4, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xddddff, 0.9)
    rim.position.set(-4, 1, -3)
    scene.add(rim)
    const fill = new THREE.PointLight(0xffffff, 0.8, 12)
    fill.position.set(-2, -1, 4)
    scene.add(fill)

    // (No halo — phone floats on the hero's gradient backdrop)

    // Initial slight tilt
    phoneGroup.rotation.set(-0.05, 0.25, 0)

    // Frame cycling logic
    let currentFrame = 0
    let frameSwitchAt = performance.now() + FRAME_INTERVAL_MS
    let fadeStart = null
    let nextFrame = 1

    let raf
    const animate = (t) => {
      raf = requestAnimationFrame(animate)
      const sp = scrollProgressRef.current

      // Idle slow rotation around Y (subtle)
      phoneGroup.rotation.y = 0.25 + Math.sin(t * 0.0004) * 0.18

      // Scroll-tied: tilt + scale + fade out as user leaves hero
      const localSp = Math.min(1, Math.max(0, sp))
      phoneGroup.rotation.x = -0.05 + localSp * 0.5
      phoneGroup.scale.setScalar(1.1 * (1 - localSp * 0.4))
      phoneGroup.position.y = -localSp * 1.5

      // Frame swap with fade
      if (fadeStart !== null) {
        const dt = t - fadeStart
        if (dt < FADE_MS) {
          // fade out
          screenMat.opacity = 1 - dt / FADE_MS
        } else if (dt < FADE_MS * 2) {
          // mid-swap: redraw if not yet
          if (currentFrame !== nextFrame) {
            currentFrame = nextFrame
            drawFrame(currentFrame)
            tex.needsUpdate = true
          }
          // fade in
          screenMat.opacity = (dt - FADE_MS) / FADE_MS
        } else {
          screenMat.opacity = 1
          fadeStart = null
          frameSwitchAt = t + FRAME_INTERVAL_MS
        }
      } else if (t >= frameSwitchAt) {
        nextFrame = (currentFrame + 1) % FRAME_PAINTERS.length
        fadeStart = t
      }

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(animate)

    const onResize = () => {
      const W2 = mount.clientWidth
      const H2 = mount.clientHeight
      camera.aspect = W2 / H2
      camera.updateProjectionMatrix()
      renderer.setSize(W2, H2)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      bodyGeo.dispose()
      screenGeo.dispose()
      bodyMat.dispose()
      screenMat.dispose()
      tex.dispose()
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 480,
      }}
    />
  )
}
