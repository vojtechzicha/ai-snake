import React, { useRef, useEffect } from 'react'
import './App.css'

// import { update, draw } from './engine/manual'
import { update, draw } from './engine/ai-ui'

const App = () => {
  const canvasRef = useRef(null)
  const [context, setContext] = React.useState(null)

  useEffect(() => {
    let clean = null,
      interval = null

    if (canvasRef.current) {
      if (context === null) {
        canvasRef.current.width = window.innerWidth - 5
        canvasRef.current.height = window.innerHeight - 5
      }
      const renderCtx = canvasRef.current.getContext('2d')

      if (renderCtx) {
        interval = setInterval(() => {
          clean = update(canvasRef.current, renderCtx)

          if (context) {
            draw(canvasRef.current, renderCtx)
          }
        }, 60)

        setContext(renderCtx)
      }
    }

    return () => {
      if (clean !== null && clean !== undefined) {
        clean()
      }
      if (interval !== null) {
        clearInterval(interval)
      }
    }
  }, [context])

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas id="canvas" ref={canvasRef} width={500} height={500} tabIndex={1}></canvas>
    </div>
  )
}

export default App
