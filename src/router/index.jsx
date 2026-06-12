import { Routes, Route } from 'react-router-dom';
import ProductListingPage from '../pages/ProductListingPage';
import ProductDetailPage  from '../pages/ProductDetailPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/"            element={<ProductListingPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
    </Routes>
  );
}
