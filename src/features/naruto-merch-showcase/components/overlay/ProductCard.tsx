import React from 'react';
import { ProductItem } from '../../types';
import styles from '../../styles/NarutoShowcase.module.scss';

interface ProductCardProps {
  product: ProductItem;
  onClaim: (product: ProductItem) => void;
  onInspect: (product: ProductItem) => void;
  onHover?: () => void;
}

export function ProductCard({ product, onClaim, onInspect, onHover }: ProductCardProps) {
  return (
    <div
      id={`naruto-product-card-${product.id}`}
      className={styles['naruto-showcase__spec-card']}
      onMouseEnter={onHover}
    >
      {/* Card Header: Limited Edition Tag & Rarity */}
      <div className={styles['naruto-showcase__card-header']}>
        <div className={styles['naruto-showcase__edition-badge']}>
          <span aria-hidden="true">巻</span>
          <span>{product.specs.editionLimit}</span>
        </div>
        <div className={styles['naruto-showcase__rarity-seal']}>
          {product.rarityBadge}
        </div>
      </div>

      {/* Product Title & Japanese Subtitle */}
      <h3 className={styles['naruto-showcase__card-title']}>{product.title}</h3>
      <p className={styles['naruto-showcase__card-desc']}>{product.description}</p>

      {/* Technical Specifications Grid */}
      <div className={styles['naruto-showcase__specs-grid']}>
        <div className={styles['naruto-showcase__spec-item']}>
          <small>Scale / Format</small>
          <strong>{product.specs.scaleOrFormat}</strong>
        </div>
        <div className={styles['naruto-showcase__spec-item']}>
          <small>Chakra Affinity</small>
          <strong style={{ color: 'var(--chakra-cyan)' }}>{product.specs.chakraAffinity}</strong>
        </div>
        <div className={styles['naruto-showcase__spec-item']}>
          <small>Materials</small>
          <strong>{product.specs.material}</strong>
        </div>
      </div>

      {/* Interactive CTAs */}
      <div className={styles['naruto-showcase__card-actions']}>
        <button
          type="button"
          id={`btn-claim-${product.id}`}
          className={styles['naruto-showcase__btn-primary']}
          onClick={() => onClaim(product)}
          onMouseEnter={onHover}
        >
          <span>{product.primaryActionLabel}</span>
          <span style={{ fontSize: '0.85em', opacity: 0.85 }}>({product.specs.price})</span>
        </button>
        <button
          type="button"
          id={`btn-inspect-${product.id}`}
          className={styles['naruto-showcase__btn-secondary']}
          onClick={() => onInspect(product)}
          onMouseEnter={onHover}
        >
          <span>{product.secondaryActionLabel}</span>
        </button>
      </div>
    </div>
  );
}
