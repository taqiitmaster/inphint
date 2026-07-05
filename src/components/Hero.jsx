import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { REDUCED } from '../hooks'

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    cam.position.z = 4.4
    const rend = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true })
    rend.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const geo = new THREE.IcosahedronGeometry(1.5, 1)
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x16161a, metalness: 0.25, roughness: 0.55, flatShading: true }))
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xb07ce8, transparent: true, opacity: 0.55 }))
    const grp = new THREE.Group(); grp.add(mesh); grp.add(edges); scene.add(grp)
    scene.add(new THREE.AmbientLight(0x8a78b0, 0.55))
    const key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(3, 4, 5); scene.add(key)
    const fill = new THREE.PointLight(0xb07ce8, 0.7, 24); fill.position.set(-4, -3, 2); scene.add(fill)

    const resize = () => {
      const w = c.clientWidth, h = c.clientHeight
      if (!w || !h) return
      rend.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let tx = 0, ty = 0
    const onMove = (e) => {
      const r = c.getBoundingClientRect()
      tx = (e.clientX - r.left) / r.width - 0.5
      ty = (e.clientY - r.top) / r.height - 0.5
    }
    window.addEventListener('mousemove', onMove)

    let visible = true
    const vio = new IntersectionObserver((es) => { visible = es[0].isIntersecting }, { threshold: 0.02 })
    vio.observe(c)

    let raf
    if (REDUCED) {
      resize(); rend.render(scene, cam)
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop)
        if (!visible) return
        grp.rotation.y += 0.0034
        grp.rotation.x += 0.0011
        grp.position.x += (tx * 0.5 - grp.position.x) * 0.05
        grp.position.y += (-ty * 0.4 - grp.position.y) * 0.05
        rend.render(scene, cam)
      }
      loop()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      vio.disconnect()
      geo.dispose(); mesh.material.dispose(); edges.geometry.dispose(); edges.material.dispose()
      rend.dispose()
    }
  }, [])

  return (
    <header className="hero section">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <span className="eyebrow seq d1">Inphint — digital agency</span>
            <h1 className="seq d2">Automate the boring. Nail the beautiful. <span className="accent">Grow the rest.</span></h1>
            <p className="hero-sub seq d3">AI systems, standout websites and brands people remember — built by one small studio that treats your growth like its own.</p>
            <div className="hero-cta seq d4">
              <a href="#contact" className="btn btn-primary">Book a discovery call <span className="arr">→</span></a>
              <a href="#services" className="btn btn-ghost">Explore services</a>
            </div>
            <div className="hero-trust seq d5">
              <span><b>100+</b> projects</span><span className="sep">/</span>
              <span><b>10+</b> yrs experience</span><span className="sep">/</span>
              <span><b>4</b> continents</span>
            </div>
          </div>
          <div className="seq d3">
            <div className="hero-visual">
              <div className="hv-tag"><span className="dot-live" /> Inphint engine</div>
              <canvas id="three" ref={canvasRef} />
              <div className="hv-caption">
                <div className="hv-title">Design. Build. <b>Automate.</b></div>
                <div className="hv-sub">One team taking you from idea to launch to growth.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
