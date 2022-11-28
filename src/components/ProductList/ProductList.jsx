import React, { useCallback } from 'react';
import ProductItem from '../ProductItem/ProductItem';
import styles from './productlist.module.css';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useTelegram } from '../../hooks/useTelegram';

const getTotalPrice = (items) => {
  return items.reduce((acc, item) => acc += item.price, 0);
}

const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [data, setData] = useState([]);
  const {tg, queryId} = useTelegram();
  useEffect(() => {
    axios.get('https://fakestoreapi.com/products').then(resp =>setData(resp.data));
  }, [])

  const onSendData = useCallback(() => {
    const data = {
      products: addedItems,
      totalPrice: getTotalPrice(addedItems),
      queryId,
    };
    fetch('http://95.213.234.253:8000/web-data', {
      method:'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  }, [addedItems])

  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData)

    return () => {
      tg.offEvent('mainButtonClicked', onSendData)
    }
  },[onSendData])

  const onAdd = (product) => {
    const alreadyAdded = addedItems.find(item => item.id === product.id);
    let newItems = [];

    if (alreadyAdded){
      newItems = addedItems.filter(item => item.id !== product.id);
    } else {
      newItems = [...addedItems, product];
    }

    setAddedItems(newItems);

    if (newItems.length === 0) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: `Купить за ${getTotalPrice(newItems)} рублей ${queryId}`
      })
    }
  }

  return (
    <div className={styles.list}>
      {data.map(item => (
        <ProductItem
          product={item}
          onAdd={onAdd}
          className={styles.item}
        />
      ))}
    </div>
  );
};

export default ProductList;
