import { createContext, useContext, useReducer, useEffect } from 'react';


const STORAGE_KEY = 'nua_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [], isOpen: false };
  } catch {
    return { items: [], isOpen: false };
  }
}

const initialState = {
  ...loadCart(),
  isOpen: false, 
};


function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity = 1 } = action.payload;
      const key = `${product.id}-${variant.colour}-${variant.size}`;
      const exists = state.items.find((i) => i.key === key);

      const items = exists
        ? state.items.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [
            ...state.items,
            {
              key,
              id: product.id,
              title: product.title,
              image: product.image,
              price: product.price,
              variant,
              quantity,
            },
          ];

      return { ...state, items };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((i) => i.key !== action.payload.key),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { key, quantity } = action.payload;
      if (quantity < 1) {
        return { ...state, items: state.items.filter((i) => i.key !== key) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === key ? { ...i, quantity } : i
        ),
      };
    }

    case 'OPEN_DRAWER':
      return { ...state, isOpen: true };

    case 'CLOSE_DRAWER':
      return { ...state, isOpen: false };

    case 'TOGGLE_DRAWER':
      return { ...state, isOpen: !state.isOpen };

    default:
      return state;
  }
}


const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

 
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items })
      );
    } catch {
     
    }
  }, [state.items]);

 
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const addItem = (product, variant, quantity) =>
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });

  const removeItem = (key) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { key } });

  const updateQuantity = (key, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } });

  const openDrawer = () => dispatch({ type: 'OPEN_DRAWER' });
  const closeDrawer = () => dispatch({ type: 'CLOSE_DRAWER' });
  const toggleDrawer = () => dispatch({ type: 'TOGGLE_DRAWER' });

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
