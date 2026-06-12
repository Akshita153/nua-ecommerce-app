import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './stores/CartContext';
import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/CartDrawer/CartDrawer';
import AppRouter from './router/index';
import './styles/global.scss';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <div className="page-content">
          <AppRouter />
        </div>
        <CartDrawer />
      </CartProvider>
    </BrowserRouter>
  );
}
