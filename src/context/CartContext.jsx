import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      // Si el producto tiene variante, la clave es _id + color + talla
      if (product.variante) {
        const exists = prev.some(
          (p) =>
            p._id === product._id &&
            p.variante &&
            p.variante.color === product.variante.color &&
            p.variante.talla === product.variante.talla
        );
        return exists ? prev : [...prev, product];
      } else {
        // Si no tiene variante, solo por _id
        const exists = prev.some((p) => p._id === product._id && !p.variante);
        return exists ? prev : [...prev, product];
      }
    });
  };

  // Recibe _id y opcional variante
  const removeFromCart = (id, variante) => {
    setCart((prev) =>
      prev.filter((p) => {
        if (variante && p.variante) {
          return !(
            p._id === id &&
            p.variante.color === variante.color &&
            p.variante.talla === variante.talla
          );
        } else {
          return p._id !== id;
        }
      })
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}