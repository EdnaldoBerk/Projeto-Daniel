import React, { useEffect, useRef, useState } from 'react'
import styles from './Slider.module.css'

/*
  Componente Slider (reutilizável)

  Props:
  - items: array (opcional) - array de dados a serem renderizados (se usar renderItem)
  - renderItem: function(item, index) => ReactNode (opcional) - callback de renderização usado com items
  - children: ReactNode(s) (opcional) - se já tiver nós React (ex.: <Card />) você pode passar como children
  - slidesToShow: number (default 5) - número preferido de slides visíveis em telas grandes
  - gap: number (px) espaço entre slides (default 24)
  - infinite: boolean (default false)
  - autoplay: boolean (default false)
  - autoplayInterval: number ms (default 4000)
  - maxItemWidth: number (px) largura máxima de cada item/slide (default 288)
  - title: string (opcional) - título a ser exibido acima do slider
*/

export default function Slider({
  items,
  renderItem,
  children,
  slidesToShow = 5,
  gap = 24,
  infinite = false,
  autoplay = false,
  autoplayInterval = 4000,
  maxItemWidth = 288, // nova prop para limitar largura do slide
  title, // título opcional
}) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const allNodes = items ? items.map((it, i) => ({ _item: it, _idx: i })) : React.Children.toArray(children)
  const total = allNodes.length
  const [current, setCurrent] = useState(0)

  // heurística responsiva: reduz slides em larguras menores
  function computeVisibleCount(width) {
    if (!width) return slidesToShow
    if (width < 480) return Math.max(1, Math.min(1, slidesToShow))
    if (width < 768) return Math.max(1, Math.min(2, slidesToShow))
    if (width < 1024) return Math.max(1, Math.min(3, slidesToShow))
    return slidesToShow
  }

  const [visible, setVisible] = useState(() => computeVisibleCount(typeof window !== 'undefined' ? window.innerWidth : 1200))

  // Resize observer para recalcular tamanhos
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function update() {
      setContainerWidth(el.clientWidth)
      setVisible(computeVisibleCount(el.clientWidth))
    }

    update()
    let ro
    if (window.ResizeObserver) {
      ro = new ResizeObserver(update)
      ro.observe(el)
    } else {
      window.addEventListener('resize', update)
    }

    return () => {
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', update)
    }
  }, [slidesToShow])

  // mantém 'current' em um intervalo válido se 'visible' mudar
  useEffect(() => {
    const maxIndex = Math.max(0, total - visible)
    if (!infinite && current > maxIndex) setCurrent(maxIndex)
  }, [visible, total, infinite, current])

  // autoplay
  useEffect(() => {
    if (!autoplay || total <= visible) return
    const id = setInterval(() => {
      setCurrent((c) => {
        const maxIndex = Math.max(0, total - visible)
        if (c >= maxIndex) return infinite ? 0 : maxIndex
        return c + 1
      })
    }, autoplayInterval)
    return () => clearInterval(id)
  }, [autoplay, autoplayInterval, total, visible, infinite])

  function prev() {
    if (total <= visible) return
    setCurrent((c) => {
      if (c <= 0) return infinite ? Math.max(0, total - visible) : 0
      return c - 1
    })
  }

  function next() {
    if (total <= visible) return
    setCurrent((c) => {
      const maxIndex = Math.max(0, total - visible)
      if (c >= maxIndex) return infinite ? 0 : maxIndex
      return c + 1
    })
  }

  // arrastar / swipe
  const pos = useRef({ startX: 0, deltaX: 0, isDown: false })

  function onPointerDown(e) {
    pos.current.isDown = true
    pos.current.startX = (e.touches ? e.touches[0].clientX : e.clientX)
  }
  function onPointerMove(e) {
    if (!pos.current.isDown) return
    const x = (e.touches ? e.touches[0].clientX : e.clientX)
    pos.current.deltaX = x - pos.current.startX
  }
  function onPointerUp() {
    if (!pos.current.isDown) return
    const threshold = (containerWidth / Math.max(visible, 1)) * 0.15 // 15% da largura do slide
    if (pos.current.deltaX > threshold) prev()
    else if (pos.current.deltaX < -threshold) next()
    pos.current.isDown = false
    pos.current.deltaX = 0
  }

  // tamanhos calculados
  const computedSlideWidth = visible > 0 ? (containerWidth - gap * (visible - 1)) / visible : 0
  const slideWidth = Math.min(computedSlideWidth, maxItemWidth) // aplica limite
  // largura total do track (soma dos slides + gaps)
  const totalTrackWidth = total > 0 ? total * (slideWidth + gap) - gap : 0
  // se o track for menor que o container, centraliza-o
  const centerOffset = totalTrackWidth < containerWidth ? (containerWidth - totalTrackWidth) / 2 : 0
  const translateX = Math.round(centerOffset - current * (slideWidth + gap))

  // pontos/páginas
  const pageCount = Math.max(1, Math.ceil(total / visible))

  return (
    <div className={styles.slider}>
      {title && <h2 className={styles.sliderTitle}>{title}</h2>}
      <div className={styles.viewport} ref={containerRef}>
        <div
          className={styles.track}
          ref={trackRef}
          style={{
            transform: `translateX(${translateX}px)`,
            gap: `${gap}px`,
            transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseLeave={onPointerUp}
          onMouseUp={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        >
          {allNodes.map((node, idx) => {
            const content = items ? renderItem?.(node._item, node._idx) : node
            return (
              <div
                key={idx}
                className={styles.slide}
                style={{ width: `${Math.round(slideWidth)}px` }}
                aria-hidden={idx < current || idx >= current + visible}
              >
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {/* Setas */}
      <button
        className={`${styles.arrow} ${styles.prev}`}
        onClick={prev}
        aria-label="Anterior"
        disabled={!infinite && current === 0}
      >
        ‹
      </button>
      <button
        className={`${styles.arrow} ${styles.next}`}
        onClick={next}
        aria-label="Próximo"
        disabled={!infinite && current >= Math.max(0, total - visible)}
      >
        ›
      </button>
    </div>
  )
}