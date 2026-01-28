import { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -10000, y: -10000 })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }
    const handleEnter = () => setVisible(true)
    const handleLeave = () => setVisible(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseenter', handleEnter)
    window.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseenter', handleEnter)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  const style: React.CSSProperties = {
    position: 'fixed',
    left: pos.x,
    top: pos.y,
    width: 40,
    height: 40,
    pointerEvents: 'none',
    transform: 'translate(0, 0)',
    backgroundImage: "url('/cursor.png')",
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    zIndex: 9999,
    cursor: 'none',
    transition: 'transform 0.05s ease-out, opacity 0.12s ease-out',
    opacity: visible ? 1 : 0,
  }

  return <div aria-hidden style={style} />
}

export default CustomCursor
