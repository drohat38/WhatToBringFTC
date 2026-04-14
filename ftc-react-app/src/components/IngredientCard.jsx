import { useRef } from 'react'
import './IngredientCard.css'

// Presentational row — receives computed qty + unit from parent.
// Handles its own image fade-in to avoid opacity:0 flash on slow connections.
function IngredientCard({ item, qty, unit }) {
  const imgRef = useRef(null)

  function handleImageLoad() {
    if (imgRef.current) imgRef.current.classList.add('loaded')
  }

  return (
    <div className="ic" role="listitem">
      <div className="ic-img">
        <img
          ref={imgRef}
          src={item.img}
          alt={item.name}
          loading="lazy"
          width="40"
          height="40"
          onLoad={handleImageLoad}
        />
      </div>

      <div className="ic-body">
        <p className="ic-name">{item.name}</p>
        <p className="ic-hint">{item.hint}</p>
      </div>

      <div className="ic-qty">
        <span className="ic-num">{qty}</span>
        <span className="ic-unit">{unit}</span>
      </div>
    </div>
  )
}

export default IngredientCard
