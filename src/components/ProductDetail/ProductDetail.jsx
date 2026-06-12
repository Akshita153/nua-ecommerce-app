import { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useVariant } from '../../hooks/useVariant';
import { useCart } from '../../stores/CartContext';
import { getVariantsForProduct, getThumbnails } from '../../data/variants';
import styles from './ProductDetail.module.scss';

const API_BASE = 'https://fakestoreapi.com';

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

export default function ProductDetail() {
  const { id }                  = useParams();
  const { data: product, loading, error } = useFetch(`${API_BASE}/products/${id}`);
  const { addItem, openDrawer } = useCart();

 const variants = product ? getVariantsForProduct(product) : [];
  const thumbnails  = product ? getThumbnails(product.image) : [];

  const [activeThumb, setActiveThumb]   = useState(0);
  const [quantity, setQuantity]         = useState(1);
  const [addedFlash, setAddedFlash]     = useState(false);

  const {
    selectedColour,
    selectedSize,
    colourData,
    isSoldOut,
    isLowStock,
    selectColour,
    selectSize,
  } = useVariant(variants);

  const handleAddToCart = useCallback(() => {
    if (!product || isSoldOut) return;

    addItem(product, { colour: selectedColour, size: selectedSize }, quantity);
    openDrawer();

    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1500);
  }, [product, isSoldOut, addItem, selectedColour, selectedSize, quantity, openDrawer]);

  
  if (loading) {
    return (
      <div className={styles['state-box']}>
        <div className={styles.spinner} role="status" aria-label="Loading product" />
        <p className={styles['state-box__sub']}>Loading product…</p>
      </div>
    );
  }

  
  if (error || !product) {
    return (
      <div className={styles['state-box']}>
        <p className={styles['state-box__title']}>Product not found</p>
        <p className={styles['state-box__sub']}>
          {error || "We couldn't load this product."}
        </p>
        <Link to="/" className={styles['state-box__btn']}>
          Back to shop
        </Link>
      </div>
    );
  }

  
  const isOnSale     = product.id % 3 === 0;
  const salePrice    = isOnSale ? (product.price * 0.8).toFixed(2) : null;
  const displayPrice = isOnSale ? salePrice : product.price.toFixed(2);
  const originalPrice= isOnSale ? product.price.toFixed(2) : null;

  return (
    <section className={styles.page}>
      <div className="container">
        <Link to="/" className={styles['back-link']}>
          <BackArrow />
          Back to all products
        </Link>

        <div className={styles.layout}>
          <div className={styles.gallery}>
            {/* Main image */}
            <div className={styles['main-image']}>
              <img
                src={thumbnails[activeThumb] ?? product.image}
                alt={product.title}
              />
            </div>

            
            <div className={styles.thumbnails} role="list" aria-label="Product images">
              {thumbnails.map((src, idx) => (
                <button
                  key={idx}
                  className={`${styles.thumb} ${activeThumb === idx ? styles['thumb--active'] : ''}`}
                  onClick={() => setActiveThumb(idx)}
                  aria-label={`Image ${idx + 1}`}
                  aria-pressed={activeThumb === idx}
                  role="listitem"
                >
                  <img src={src} alt="" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>


          <div className={styles.info}>
            <div>
              <p className={styles.brand}>{product.category}</p>
              <h1 className={styles.name}>{product.title}</h1>
            </div>

            
            <div className={styles['price-row']}>
              <span className={`${styles.price} ${isOnSale ? styles['price--sale'] : ''}`}>
                ${displayPrice}
              </span>
              {isOnSale && (
                <>
                  <span className={styles['price-original']}>${originalPrice}</span>
                  <span className={styles['price-badge']}>SALE</span>
                </>
              )}
            </div>

            <div className={styles.divider} />

           
            <div>
              <p className={styles['section-label']}>
                Colour <span>{selectedColour}</span>
              </p>
              <div className={styles.colours} role="group" aria-label="Select colour">
                {variants.map((v) => (
                  <button
                    key={v.colour}
                    className={`${styles['colour-btn']} ${selectedColour === v.colour ? styles['colour-btn--active'] : ''}`}
                    style={{ backgroundColor: v.hex }}
                    onClick={() => selectColour(v.colour)}
                    aria-label={v.colour}
                    aria-pressed={selectedColour === v.colour}
                    title={v.colour}
                  />
                ))}
              </div>
            </div>

            
            <div>
              <p className={styles['section-label']}>
                Size <span>{selectedSize}</span>
              </p>
              <div className={styles.sizes} role="group" aria-label="Select size">
                {colourData?.sizes.map(({ size, status }) => {
                  const isSO   = status === 'sold-out';
                  const isLS   = status === 'low-stock';
                  const active = selectedSize === size;

                  return (
                    <button
                      key={size}
                      className={[
                        styles['size-btn'],
                        active   ? styles['size-btn--active']     : '',
                        isLS     ? styles['size-btn--low-stock']  : '',
                        isSO     ? styles['size-btn--sold-out']   : '',
                      ].join(' ')}
                      onClick={() => !isSO && selectSize(size)}
                      disabled={isSO}
                      aria-label={`Size ${size}${isSO ? ', sold out' : isLS ? ', low stock' : ''}`}
                      aria-pressed={active}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              
              <div className={styles['size-hint']}>
                <span className={`${styles['size-hint__dot']} ${styles['size-hint__dot--low']}`}>
                  Low stock
                </span>
                <span className={`${styles['size-hint__dot']} ${styles['size-hint__dot--out']}`}>
                  Sold out
                </span>
              </div>
            </div>

            
            {isSoldOut && (
              <div className={`${styles['stock-status']} ${styles['stock-status--out']}`}>
                This size is sold out. Try a different size or colour.
              </div>
            )}
            {isLowStock && !isSoldOut && (
              <div className={`${styles['stock-status']} ${styles['stock-status--low']}`}>
                ⚡ Almost gone — only a few left in this size.
              </div>
            )}

            
            {!isSoldOut && (
              <div className={styles['qty-row']}>
                <span className={styles['qty-label']}>Qty</span>
                <div className={styles.qty}>
                  <button
                    className={styles.qty__btn}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className={styles.qty__value}>{quantity}</span>
                  <button
                    className={styles.qty__btn}
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

           
            <button
              className={styles['add-btn']}
              onClick={handleAddToCart}
              disabled={isSoldOut}
              aria-disabled={isSoldOut}
            >
              {isSoldOut
                ? 'Sold Out'
                : addedFlash
                ? '✓ Added to Cart'
                : 'Add to Cart'}
            </button>

            <div className={styles.divider} />

           
            <p className={styles.description}>{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
