import { Carousel } from '@/Components/Core/Carousel';
import { CurrencyFormatter } from '@/Components/Core/CurrencyFormatter';
import { arraysAreEqual } from '@/helpers';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product, VariationTypeOption } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  product: Product;
  variationOptions: number[];
}

export default function Show({ product, variationOptions }: Props) {
  const form = useForm<{
    options_ids: Record<string, number>;
    quanitty: number;
    price: number | null;
  }>({
    options_ids: {},
    quanitty: 1,
    price: null,
  });

  const { url } = usePage();

  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, VariationTypeOption>
  >([]);

  const images = useMemo(() => {
    for (const typeId in selectedOptions) {
      const option = selectedOptions[typeId];

      if (option.images.length > 0) return option.images;

      return product.images;
    }
  }, [product, selectedOptions]);

  const computedProduct = useMemo(() => {
    const selectedOptionIds = Object.values(selectedOptions)
      .map((op) => op.id)
      .sort();

    for (const variation of product.variations) {
      const optionIds = variation.variation_type_option_ids.sort();

      if (arraysAreEqual(selectedOptionIds, optionIds)) {
        return {
          price: variation.price,
          quantity:
            variation.quantity === null ? Number.MAX_VALUE : variation.quantity,
        };
      }
    }

    return {
      price: product.price,
      quantity: product.quantity,
    };
  }, [product, selectedOptions]);

  const getOptionIdsMap = (newOptions: object) => {
    return Object.fromEntries(
      Object.entries(newOptions).map(([a, b]) => [a, b.id]),
    );
  };

  const chooseOption = (
    typeId: number,
    option: VariationTypeOption,
    updateRouter: boolean = true,
  ) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newOptions = {
        ...prevSelectedOptions,
        [typeId]: option,
      };

      if (updateRouter) {
        router.get(
          url,
          {
            options: getOptionIdsMap(newOptions),
          },
          {
            preserveScroll: true,
            preserveState: true,
          },
        );
      }

      return newOptions;
    });
  };

  const onQuantityChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    form.setData('quanitty', parseInt(ev.target.value));
  };

  const addToCart = () => {
    form.post(route('cart.store', product.id), {
      preserveScroll: true,
      preserveState: true,
      onError: (err) => console.log(err),
    });
  };

  const renderProductVariationTypes = () => {
    return product.variationTypes.map((type) => (
      <div key={type.id}>
        <b>{type.name}</b>

        {type.type === 'Image' && (
          <div className="mb-4 flex gap-2">
            {type.options.map((option) => (
              <div
                key={option.id}
                onClick={() => chooseOption(type.id, option)}
              >
                {JSON.stringify(option)}
                {option.images && (
                  <img
                    src={option.images[0].thumb}
                    alt=""
                    className={
                      'w-[50px] ' +
                      (selectedOptions[type.id]?.id === option.id
                        ? 'outline outline-4 outline-primary'
                        : '')
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {type.type === 'Radio' && (
          <div className="join mb-4 flex">
            {type.options.map((option) => (
              <input
                key={option.id}
                onChange={() => chooseOption(type.id, option)}
                className="btn join-item"
                type="radio"
                value={option.id}
                checked={selectedOptions[type.id]?.id === option.id}
                name={`variation_type_${type.id}`}
                aria-label={option.name}
              />
            ))}
          </div>
        )}
      </div>
    ));
  };

  const renderAddToCartButton = () => {
    return (
      <div className="mb-8 flex gap-4">
        <select
          value={form.data.quanitty}
          onChange={onQuantityChange}
          className="select select-bordered w-full"
        >
          {Array.from({ length: Math.min(10, computedProduct.quantity) }).map(
            (_, i) => (
              <option key={i + 1} value={i + 1}>
                Quantity {i + 1}
              </option>
            ),
          )}
        </select>

        <button onClick={addToCart} className="btn btn-primary">
          Add to Cart
        </button>
      </div>
    );
  };

  useEffect(() => {
    const idsMap = Object.fromEntries(
      Object.entries(selectedOptions).map(
        ([typeId, option]: [string, VariationTypeOption]) => [
          typeId,
          option.id,
        ],
      ),
    );

    console.log(idsMap);
    form.setData('options_ids', idsMap);
  }, [selectedOptions]);

  useEffect(() => {
    for (const type of product.variationTypes) {
      const selectedOptionId: number = variationOptions[type.id];

      chooseOption(
        type.id,
        type.options.find((op) => op.id === selectedOptionId) ||
          type.options[0],
        false,
      );
    }
  }, [product.variationTypes, variationOptions]);

  return (
    <AuthenticatedLayout>
      <Head title={product.title} />

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="col-span-7">
            <Carousel images={images ?? []} />
          </div>

          <div className="col-span-5">
            <h1 className="mb-8 text-2xl">{product.title}</h1>

            <div>
              <div className="text-3xl font-semibold">
                <CurrencyFormatter amount={computedProduct.price} />
              </div>
            </div>

            {renderProductVariationTypes()}

            {computedProduct.quantity !== undefined &&
              computedProduct.quantity < 10 && (
                <div className="my-4 text-error">
                  <span>Only {computedProduct.quantity} left</span>
                </div>
              )}

            {renderAddToCartButton()}

            <b className="text-xl">About the item</b>

            <div
              className="wysiwyg-output"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
