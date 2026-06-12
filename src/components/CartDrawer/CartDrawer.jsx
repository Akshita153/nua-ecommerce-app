import { useEffect, useRef } from 'react';
import { useCart } from '../../stores/CartContext';
import styles from './CartDrawer.module.scss';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function EmptyBagIcon() {
  return (
    <svg className={styles.empty__icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
      />
    </svg>
  );
}

function QuantityStepper({ value, onDecrement, onIncrement }) {
  return (
    <div className={styles.qty}>
      <button
        className={styles.qty__btn}
        onClick={onDecrement}
        aria-label="Decrease quantity"
        disabled={value <= 1}
      >
        −
      </button>
      <span className={styles.qty__value} aria-label={`Quantity: ${value}`}>{value}</span>
      <button
        className={styles.qty__btn}
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className={styles.item}>
      <img
        className={styles.item__image}
        src={item.image}
        alt={item.title}
        loading="lazy"
      />
      <div className={styles.item__info}>
        <p className={styles.item__name}>{item.title}</p>
        <p className={styles.item__variant}>
          {item.variant.colour} · {item.variant.size}
        </p>
        <p className={styles.item__price}>
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <div className={styles.item__actions}>
          <QuantityStepper
            value={item.quantity}
            onDecrement={() => updateQuantity(item.key, item.quantity - 1)}
            onIncrement={() => updateQuantity(item.key, item.quantity + 1)}
          />
          <button
            className={styles.item__remove}
            onClick={() => removeItem(item.key)}
            aria-label={`Remove ${item.title} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, itemCount, subtotal } = useCart();
  const closeRef = useRef(null);


  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [isOpen]);


  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) closeDrawer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeDrawer]);


  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 9.99) : 0;
  const total    = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.overlay} ${isOpen ? styles['overlay--visible'] : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${isOpen ? styles['drawer--open'] : ''}`}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className={styles.header__title}>Your Cart</span>
            {itemCount > 0 && (
              <span className={styles.header__count}>({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
            )}
          </div>
          <button
            ref={closeRef}
            className={styles.header__close}
            onClick={closeDrawer}
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <EmptyBagIcon />
            <p className={styles.empty__text}>Your cart is empty</p>
            <p className={styles.empty__sub}>Add something you love.</p>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <CartItem key={item.key} item={item} />
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.summary__row}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summary__row}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className={`${styles.summary__row} ${styles['summary__row--total']}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className={styles.summary__checkout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
