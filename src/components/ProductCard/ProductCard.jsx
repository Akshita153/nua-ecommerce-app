import { Link } from 'react-router-dom';
import { useCart } from '../../stores/CartContext';
import { getVariantsForProduct } from '../../data/variants';
import styles from './ProductCard.module.scss';

export function ProductCardSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeleton__image} />
      <div className={styles.skeleton__body}>
        <div className={`${styles.skeleton__line} ${styles['skeleton__line--short']}`} />
        <div className={`${styles.skeleton__line} ${styles['skeleton__line--long']}`} />
        <div className={`${styles.skeleton__line} ${styles['skeleton__line--price']}`} />
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addItem, openDrawer } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

   const variants = getVariantsForProduct(product);
    const defaultVariant = variants[0];
    const availableSize  = defaultVariant?.sizes.find((s) => s.status !== 'sold-out');

    addItem(product, {
      colour: defaultVariant?.colour ?? 'Default',
      size:   availableSize?.size   ?? defaultVariant?.sizes[0]?.size ?? 'One Size',
    }, 1);

    openDrawer();
  };

  return (
    <article className={styles.card}>
      {/* Product image — links to detail page */}
      <Link
        to={`/product/${product.id}`}
        className={styles['card__image-link']}
        aria-label={`View ${product.title}`}
        tabIndex={-1}
      >
        <img
          className={styles.card__image}
          src={product.image}
          alt={product.title}
          loading="lazy"
        />

        {/* Quick Add overlay */}
        <button
          className={styles['card__add-btn']}
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.title} to cart`}
        >
          Quick Add
        </button>
      </Link>

      {/* Card body */}
      <div className={styles.card__body}>
        <span className={styles.card__category}>{product.category}</span>

        <Link
          to={`/product/${product.id}`}
          className={styles['card__name-link']}
        >
          <h2 className={styles.card__name}>{product.title}</h2>
        </Link>

        <p className={styles.card__price}>${product.price.toFixed(2)}</p>
      </div>
    </article>
  );
}
