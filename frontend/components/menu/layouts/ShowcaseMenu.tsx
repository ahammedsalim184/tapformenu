import type { MenuCategory } from "@/types/menu";
import { getMediaUrl } from "@/lib/api";

interface ShowcaseMenuProps {
  categories: MenuCategory[];
}

function formatPrice(
  price: string | null,
  priceRange: boolean,
  priceMin: string | null,
  priceMax: string | null
) {
  if (priceRange && priceMin && priceMax) {
    return `₹${parseFloat(priceMin)} - ₹${parseFloat(priceMax)}`;
  }

  if (price) {
    return `₹${parseFloat(price)}`;
  }

  return null;
}

export default function ShowcaseMenu({
  categories,
}: ShowcaseMenuProps) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        {categories.map((category) => (
          <section
            key={category.id}
            id={`category-${category.id}`}
            className="scroll-mt-20"
          >
            {/* Category heading */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {category.name}
              </h2>

              {category.description && (
                <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                  {category.description}
                </p>
              )}
            </div>

            {/* Showcase items */}
            <div className="space-y-10">
              {category.items.map((item) => {
                const itemPrice = formatPrice(
                  item.price,
                  item.price_range,
                  item.price_min,
                  item.price_max
                );

                const imageUrl = getMediaUrl(item.image);

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl bg-gray-50"
                  >
                    <div className="grid md:grid-cols-2">
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[360px]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            draggable={false}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full min-h-[280px] items-center justify-center bg-gray-100 text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-center p-6 sm:p-10">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {item.name}
                              </h3>

                              {item.vegetarian && (
                                <span
                                  className="h-4 w-4 rounded-sm border-2 border-green-600"
                                  title="Vegetarian"
                                >
                                  <span className="mx-auto mt-[3px] block h-1.5 w-1.5 rounded-full bg-green-600" />
                                </span>
                              )}
                            </div>
                          </div>

                          {itemPrice && (
                            <span className="shrink-0 text-lg font-bold text-gray-900">
                              {itemPrice}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="mt-4 leading-7 text-gray-600">
                            {item.description}
                          </p>
                        )}

                        {/* Variants */}
                        {item.variants.length > 0 && (
                          <div className="mt-6 border-t border-gray-200 pt-5">
                            <div className="space-y-3">
                              {item.variants.map((variant) => {
                                const variantPrice = formatPrice(
                                  variant.price,
                                  variant.price_range,
                                  variant.price_min,
                                  variant.price_max
                                );

                                return (
                                  <div
                                    key={variant.id}
                                    className="flex items-center justify-between gap-4"
                                  >
                                    <span className="text-gray-700">
                                      {variant.name}
                                    </span>

                                    {variantPrice && (
                                      <span className="font-semibold text-gray-900">
                                        {variantPrice}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}