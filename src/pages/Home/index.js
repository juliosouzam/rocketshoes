import React, { useState, useEffect, useCallback } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../services/api';

import { formatPrice } from '../../util/format';

import { ProductList } from './styles';

import { addToCart } from '../../store/modules/cart/actions';

export default function Home() {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const amount = useSelector((state) =>
    state.cart.reduce((a, product) => {
      a[product.id] = product.amount;

      return a;
    }, {})
  );

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/products');

      setProducts(
        response.data.map((p) => ({
          ...p,
          priceFormatted: formatPrice(p.price),
        }))
      );
    }

    loadProducts();
  }, []);

  const handleAddProduct = useCallback(
    (product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />

          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button type="button" onClick={() => handleAddProduct(product)}>
            <div>
              <MdAddShoppingCart size={16} color="#fff" />{' '}
              {amount[product.id] || 0}
            </div>

            <span>Adicionar ao carrinho</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}
