import React from 'react';
import Button from '../Button/Button';
import styles from './productitem.module.css';

const ProductItem = ({product, onAdd, className}) => {

  const onAddHandler = () => {
    onAdd(product);
  }

  return (
    <div className={styles.product}>
      <img src={product.image} alt={product.title} className={styles.img} />
      <div className={styles.title}>{product.title}</div>
      <div className={styles.description}>{product.description}</div>
      <div className={styles.price}>
        <span>Стоимость: <b>{product.price}</b></span>
      </div>
      <Button className={styles.addBtn} onClick={onAddHandler}>
        Добавить в корзину
      </Button>
    </div>
  );
};

export default ProductItem;
