import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ShopContext = createContext(null);

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return ctx;
};

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [pricelistUrl, setPricelistUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Store ONLY product IDs in localStorage
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('sethupyropark_wishlist_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Store ONLY product ID -> qty mapping in localStorage
  const [cartQtys, setCartQtys] = useState(() => {
    try {
      const saved = localStorage.getItem('sethupyropark_cart_qtys');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save ONLY IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sethupyropark_wishlist_ids', JSON.stringify(wishlistIds));
    } catch (e) {}
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('sethupyropark_cart_qtys', JSON.stringify(cartQtys));
    } catch (e) {}
  }, [cartQtys]);

  // Fetch live product details from Supabase API using stored IDs
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://iplfsscpeixfxzbouhlp.supabase.co';
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?order=product_code.asc`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        }
      });
      if (res.ok) {
        const data = await res.json();
        
        // Extract site settings if present
        const settingsProd = (data || []).find(p => p.category === '__SITE_SETTINGS__');
        if (settingsProd) {
          try {
            const s = JSON.parse(settingsProd.description || '{}');
            setPricelistUrl(s.pricelist_url || '');
          } catch (e) {}
        }

        // Exclude system internal entries (__HERO_BANNER__, __SITE_ANNOUNCEMENT__) from public catalog
        const cleanProducts = (data || []).filter(p => !p.category || !p.category.startsWith('__'));
        setProducts(cleanProducts);
      }
    } catch (e) {
      console.error('ShopContext fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Map stored IDs to live product objects fetched from API
  const productsMap = new Map(products.map(p => [String(p.id), p]));

  // Wishlist actions
  const toggleWishlist = (productOrId) => {
    const id = typeof productOrId === 'object' ? String(productOrId.id) : String(productOrId);
    if (!id) return;
    setWishlistIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistIds.includes(String(productId));
  };

  const removeFromWishlist = (productId) => {
    const id = String(productId);
    setWishlistIds(prev => prev.filter(i => i !== id));
  };

  // Cart actions
  const addToCart = (productOrId, qty = 1) => {
    const id = typeof productOrId === 'object' ? String(productOrId.id) : String(productOrId);
    if (!id) return;

    // Block adding inactive / out of stock items
    const prod = productsMap.get(id);
    if (prod && prod.is_active === false) {
      return;
    }

    setCartQtys(prev => {
      const currentQty = prev[id] || 0;
      const nextQty = currentQty + qty;
      if (nextQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: nextQty
      };
    });
  };

  const updateCartQty = (productId, qty) => {
    const id = String(productId);

    // Block incrementing quantity if the item is inactive / out of stock
    const prod = productsMap.get(id);
    const currentQty = cartQtys[id] || 0;
    if (prod && prod.is_active === false && qty > currentQty) {
      return;
    }

    setCartQtys(prev => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return {
        ...prev,
        [id]: qty
      };
    });
  };

  const removeFromCart = (productId) => {
    const id = String(productId);
    setCartQtys(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const clearCart = () => setCartQtys({});

  const moveAllWishlistToCart = () => {
    setCartQtys(prev => {
      const next = { ...prev };
      wishlistIds.forEach(id => {
        const key = String(id);
        const prod = productsMap.get(key);
        // Only move to cart if product is active
        if (prod && prod.is_active !== false) {
          next[key] = (next[key] || 0) + 1;
        }
      });
      return next;
    });
    // Keep inactive items in wishlist, clear only active ones moved to cart
    setWishlistIds(prev => prev.filter(id => {
      const prod = productsMap.get(String(id));
      return !prod || prod.is_active === false;
    }));
  };

  const wishlist = wishlistIds
    .map(id => productsMap.get(id))
    .filter(Boolean);

  const cartItems = Object.entries(cartQtys)
    .map(([id, qty]) => {
      const product = productsMap.get(id);
      if (!product) return null;
      return { product, qty };
    })
    .filter(Boolean);

  // Computations
  const wishlistCount = wishlistIds.length;

  const cartCount = Object.values(cartQtys).reduce((acc, q) => acc + (q || 0), 0);

  const cartTotalMrp = cartItems.reduce((acc, item) => {
    const mrp = parseFloat(item.product.mrp || item.product.original_price || item.product.price || 0);
    return acc + (mrp * item.qty);
  }, 0);

  const cartTotalPrice = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product.price || 0);
    return acc + (price * item.qty);
  }, 0);

  const cartTotalSavings = Math.max(0, cartTotalMrp - cartTotalPrice);

  // Compatibility helper mapping cart object format
  const cart = Object.fromEntries(
    cartItems.map(item => [item.product.id, item])
  );

  const [cartModalOpen, setCartModalOpen] = useState(false);

  return (
    <ShopContext.Provider
      value={{
        wishlistIds,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveAllWishlistToCart,

        cartQtys,
        cart,
        cartItems,
        cartCount,
        cartTotalMrp,
        cartTotalPrice,
        cartTotalSavings,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,

        products,
        loading,
        fetchProducts,
        pricelistUrl,
        cartModalOpen,
        setCartModalOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
