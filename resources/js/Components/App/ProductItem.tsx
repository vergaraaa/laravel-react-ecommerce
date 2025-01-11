import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import { CurrencyFormatter } from '../Core/CurrencyFormatter';

interface Props {
  product: Product;
}

export const ProductItem = ({ product }: Props) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <Link href={route('product.show', product.slug)}>
        <figure>
          <img
            src={product.image}
            alt={product.title}
            className="aspect-square object-cover"
          />
        </figure>
      </Link>

      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>

        <p>
          by{' '}
          <Link href="/" classID="hover:underline">
            {product.user.name}
          </Link>{' '}
          in
          <Link href="/" classID="hover:underline">
            {product.department.name}
          </Link>
        </p>

        <div className="card-actions mt-3 items-center justify-between">
          <button className="btn btn-primary">Add to Cart</button>

          <span className="text-2xl">
            <CurrencyFormatter amount={product.price} />
          </span>
        </div>
      </div>
    </div>
  );
};
