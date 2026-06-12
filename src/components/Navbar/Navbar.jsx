import { Link } from 'react-router-dom';
import { useCart } from '../../stores/CartContext';
import styles from './Navbar.module.scss';

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

export default function Navbar() {
  const { itemCount, toggleDrawer } = useCart();

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.navbar__inner}>
        {/* Brand */}
        <Link to="/" className={styles.navbar__brand} aria-label="Nua — go to homepage">
          <span className={styles['navbar__brand-name']}>nua</span>
          <span className={styles['navbar__brand-dot']} aria-hidden="true" />
        </Link>

        {/* Right side */}
        <div className={styles.navbar__right}>
          <button
            className={styles['navbar__cart-btn']}
            onClick={toggleDrawer}
            aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className={styles.navbar__badge} aria-hidden="true">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
