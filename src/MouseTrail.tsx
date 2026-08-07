import { useEffect, useRef } from 'react'

interface Dot {
  x: number
  y: number
  alpha: number
  color: string
  r: number
  glow: boolean
}

// Tông "biển đêm": tím -> chàm -> xanh dương -> xanh trời -> xanh ngọc -> xanh lục biển
const DOT_COLORS = [
  '#a78bfa', // tím lavender
  '#818cf8', // tím xanh (indigo)
  '#6366f1', // chàm (indigo đậm)
  '#60a5fa', // xanh dương
  '#3b82f6', // xanh dương đậm
  '#38bdf8', // xanh trời (sky)
  '#7dd3fc', // xanh biển nhạt (sky nhạt)
  '#22d3ee', // xanh cyan
  '#2dd4bf', // xanh ngọc đậm (teal)
  '#5eead4', // xanh ngọc (teal nhạt)
  '#34d399', // xanh lục biển (emerald nhạt)
  '#a5f3fc', // xanh cyan rất nhạt (bọt sóng)
  '#c4b5fd', // tím nhạt
]

// Chuyển hex -> [r,g,b] để nội suy màu mượt
const hexToRgb = (hex: string): [number, number, number] => {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}
const DOT_COLORS_RGB = DOT_COLORS.map(hexToRgb)

// Lấy màu theo pha liên tục (số thực) -> nội suy tuyến tính giữa 2 màu liền kề
// Cho phép "cuộn" liên tục qua bảng màu như một dòng sóng, thay vì random giật cục
const getWaveColor = (phase: number): string => {
  const n = DOT_COLORS_RGB.length
  const p = ((phase % n) + n) % n // đảm bảo luôn dương
  const i0 = Math.floor(p)
  const i1 = (i0 + 1) % n
  const t = p - i0
  const [r0, g0, b0] = DOT_COLORS_RGB[i0]
  const [r1, g1, b1] = DOT_COLORS_RGB[i1]
  const r = Math.round(r0 + (r1 - r0) * t)
  const g = Math.round(g0 + (g1 - g0) * t)
  const b = Math.round(b0 + (b1 - b0) * t)
  return `rgb(${r}, ${g}, ${b})`
}

// Tốc độ "trôi" của sóng màu theo mỗi chấm mới được tạo ra
const WAVE_SPEED = 0.045

const RING_RADIUS_NORMAL = 22
const RING_RADIUS_HOVER = 34

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastRef = useRef({ x: 0, y: 0 })
  const ringPosRef = useRef({ x: 0, y: 0 })
  const ringRadiusRef = useRef(RING_RADIUS_NORMAL)
  const isHoveringRef = useRef(false)
  const frameCountRef = useRef(0)
  const wavePhaseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX
      const mouseY = e.clientY
      mouseRef.current = { x: mouseX, y: mouseY }

      // Kiểm tra xem chuột có đang ở trên phần tử tương tác không (button, checkbox, link...)
      const target = document.elementFromPoint(mouseX, mouseY)
      const isInteractive = !!target?.closest(
        'button, input[type="checkbox"], a, [role="button"]',
      )
      isHoveringRef.current = isInteractive

      const dx = mouseX - lastRef.current.x
      const dy = mouseY - lastRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Chỉ tạo chấm mới khi chuột di đủ xa -> vệt thưa, nhẹ nhàng
      if (dist > 12) {
        const perpX = -dy / (dist || 1)
        const perpY = dx / (dist || 1)
        const jitter = (Math.random() - 0.5) * 8
        const isGlow = frameCountRef.current % 7 === 0

        // Màu trôi dần theo "sóng" thay vì random giật cục
        wavePhaseRef.current += WAVE_SPEED
        // Thêm dao động nhẹ quanh pha chính để trông tự nhiên, không đơn điệu
        const jitterPhase = Math.sin(frameCountRef.current * 0.3) * 0.6
        const color = getWaveColor(wavePhaseRef.current + jitterPhase)

        dotsRef.current.push({
          x: mouseX + perpX * jitter,
          y: mouseY + perpY * jitter,
          alpha: 0.6,
          color,
          r: isGlow ? 4 + Math.random() * 2 : 1.5 + Math.random() * 1.5,
          glow: isGlow,
        })

        lastRef.current = { x: mouseX, y: mouseY }
        frameCountRef.current++
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Mờ dần khá nhanh -> vệt ngắn, tinh tế
      dotsRef.current = dotsRef.current
        .map((p) => ({ ...p, alpha: p.alpha - 0.035 }))
        .filter((p) => p.alpha > 0)

      dotsRef.current.forEach((p) => {
        ctx.save()
        ctx.globalAlpha = p.alpha
        if (p.glow) {
          ctx.shadowColor = p.color
          ctx.shadowBlur = 8
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.restore()
      })

      // Vòng tròn đuổi theo có độ trễ (lerp)
      ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * 0.06
      ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * 0.06

      // Bán kính cũng lerp mượt tới kích thước mục tiêu (to hơn khi hover)
      const targetRadius = isHoveringRef.current ? RING_RADIUS_HOVER : RING_RADIUS_NORMAL
      ringRadiusRef.current += (targetRadius - ringRadiusRef.current) * 0.15

      ctx.beginPath()
      ctx.arc(ringPosRef.current.x, ringPosRef.current.y, ringRadiusRef.current, 0, Math.PI * 2)
      ctx.strokeStyle = isHoveringRef.current
        ? 'rgba(196, 181, 253, 0.4)'
        : 'rgba(94, 234, 212, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
    />
  )
}

export default CursorTrail