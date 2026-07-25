import * as React from 'react'

/**
 * WebGL hero background — lime particle field, gyroscope rings, HUD grid floor.
 * Reacts to mouse (parallax) and scroll (ring rotation). Client-only: three.js is
 * dynamically imported after mount so SSR and the initial paint stay untouched.
 * Skipped entirely for prefers-reduced-motion; all GPU resources disposed on unmount.
 */
export function HeroScene() {
  const hostRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let disposed = false
    let cleanup: (() => void) | undefined

    ;(async () => {
      const THREE = await import('three')
      if (disposed || !host.isConnected) return

      let renderer: import('three').WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        return // no WebGL — silently keep the CSS background
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(host.clientWidth, host.clientHeight)
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.inset = '0'
      host.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x04080a, 0.028)
      const camera = new THREE.PerspectiveCamera(
        55,
        host.clientWidth / host.clientHeight,
        0.1,
        120,
      )
      camera.position.set(0, 0.6, 13)

      /* particle field */
      const isMobile = host.clientWidth < 768
      const count = isMobile ? 380 : 950
      const positions = new Float32Array(count * 3)
      const speeds = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 46
        positions[i * 3 + 1] = (Math.random() - 0.5) * 26
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20
        speeds[i] = 0.2 + Math.random() * 0.8
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const pMat = new THREE.PointsMaterial({
        color: 0xd9d523,
        size: 0.07,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const points = new THREE.Points(pGeo, pMat)
      scene.add(points)

      /* gyroscope rings */
      const limeMat = new THREE.MeshBasicMaterial({
        color: 0xd9d523,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      })
      const tealMat = new THREE.MeshBasicMaterial({
        color: 0x5a868b,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      })
      const ringGeos = [
        new THREE.TorusGeometry(6.4, 0.015, 6, 160),
        new THREE.TorusGeometry(5.0, 0.015, 6, 140),
        new THREE.TorusGeometry(8.0, 0.01, 6, 180),
      ]
      const rings = [
        new THREE.Mesh(ringGeos[0], limeMat),
        new THREE.Mesh(ringGeos[1], tealMat),
        new THREE.Mesh(ringGeos[2], tealMat),
      ]
      rings[0].rotation.x = Math.PI / 2.4
      rings[1].rotation.x = Math.PI / 1.8
      rings[2].rotation.x = Math.PI / 2.1
      const gyro = new THREE.Group()
      rings.forEach((r) => gyro.add(r))
      gyro.position.set(isMobile ? 0 : 3.4, 0.4, -2)
      scene.add(gyro)

      /* HUD grid floor */
      const grid = new THREE.GridHelper(100, 64, 0xd9d523, 0x5a868b)
      grid.position.y = -7
      const gridMat = grid.material as import('three').Material
      gridMat.transparent = true
      gridMat.opacity = 0.14
      scene.add(grid)

      /* pointer parallax + scroll */
      const target = { x: 0, y: 0 }
      const onPointer = (e: PointerEvent) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2
        target.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      const finePointer = window.matchMedia('(pointer: fine)').matches
      if (finePointer) window.addEventListener('pointermove', onPointer)

      const clock = new THREE.Clock()
      let raf = 0
      const tick = () => {
        const t = clock.getElapsedTime()
        const scroll = window.scrollY * 0.0012

        points.rotation.y = t * 0.02
        const pos = pGeo.attributes.position as import('three').BufferAttribute
        for (let i = 0; i < count; i++) {
          const y = pos.getY(i) + speeds[i] * 0.008
          pos.setY(i, y > 13 ? -13 : y)
        }
        pos.needsUpdate = true

        rings[0].rotation.z = t * 0.25 + scroll
        rings[1].rotation.z = -t * 0.18 - scroll
        rings[2].rotation.z = t * 0.1 + scroll * 0.5
        gyro.rotation.y = t * 0.05

        grid.position.z = (t * 0.6) % 1.5625 // one cell = 100/64
        grid.rotation.y = 0

        camera.position.x += (target.x * 1.1 - camera.position.x) * 0.04
        camera.position.y += (-target.y * 0.7 + 0.6 - camera.position.y) * 0.04
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)
        raf = requestAnimationFrame(tick)
      }
      tick()

      const ro = new ResizeObserver(() => {
        const w = host.clientWidth
        const h = host.clientHeight
        if (!w || !h) return
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      })
      ro.observe(host)

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        if (finePointer) window.removeEventListener('pointermove', onPointer)
        pGeo.dispose()
        pMat.dispose()
        ringGeos.forEach((g) => g.dispose())
        limeMat.dispose()
        tealMat.dispose()
        grid.geometry.dispose()
        gridMat.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
      if (disposed) cleanup()
    })()

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [])

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    />
  )
}
