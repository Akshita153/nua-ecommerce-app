import { useState, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard/ProductCard';
import styles from './ProductListingPage.module.scss';

const API_URL = 'https://fakestoreapi.com/products';

const CATEGORY_LABELS = {
  "electronics":        "Electronics",
  "jewelery":           "Jewellery",
  "men's clothing":     "Men",
  "women's clothing":   "Women",
};

export default function ProductListingPage() {
  const { data: products, loading, error } = useFetch(API_URL);
  const [activeCategory, setActiveCategory] = useState('all');

  // Derive unique categories from products
  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Page header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Shop All</h1>
            {!loading && products && (
              <p className={styles.count}>
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </header>

        {/* Category filters */}
        {!loading && !error && categories.length > 0 && (
          <div className={styles.filters} role="group" aria-label="Filter by category">
            <button
              className={`${styles['filter-btn']} ${activeCategory === 'all' ? styles['filter-btn--active'] : ''}`}
              onClick={() => setActiveCategory('all')}
              aria-pressed={activeCategory === 'all'}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles['filter-btn']} ${activeCategory === cat ? styles['filter-btn--active'] : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className={styles.error}>
            <span className={styles.error__icon} aria-hidden="true">⚠️</span>
            <p className={styles.error__title}>Couldn't load products</p>
            <p className={styles.error__sub}>
              There was a problem connecting to the store. Please check your connection and try again.
            </p>
            <button
              className={styles.error__retry}
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {/* Product grid */}
        {!error && (
          <div className={styles.grid}>
            {loading
              ? Array.from({ length: 8 }, (_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
            }
          </div>
        )}
      </div>
    </main>
  );
}
