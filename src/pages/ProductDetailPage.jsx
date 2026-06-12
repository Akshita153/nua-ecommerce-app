import ProductDetail from '../components/ProductDetail/ProductDetail';

// This page wraps the ProductDetail component.
// Routing (useParams) is handled inside ProductDetail directly.
export default function ProductDetailPage() {
  return (
    <main>
      <div className="container">
        <ProductDetail />
      </div>
    </main>
  );
}
