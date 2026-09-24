import type {
  MenuCategory,
  MenuTheme,
} from "@/types/menu";

import { getMediaUrl } from "@/lib/api";
import { getMenuThemeStyles } from "@/components/menu/menuThemes";

interface ShowcaseMenuProps {
  categories: MenuCategory[];
  theme: MenuTheme;
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
  theme,
}: ShowcaseMenuProps) {
  const styles =
    getMenuThemeStyles(theme);

  return (
    <section
      className={`
        px-4
        py-10
        transition-colors
        duration-500
        sm:px-6
        lg:px-8
        ${styles.page}
      `}
    >
      <div className="mx-auto max-w-6xl space-y-16">
        {categories.map((category) => (
          <section
            key={category.id}
            id={`category-${category.id}`}
            className="scroll-mt-20"
          >
            <div className="mb-8 text-center">
              <h2
                className={`
                  text-3xl
                  font-bold
                  tracking-tight
                  sm:text-4xl
                  ${styles.categoryTitle}
                `}
              >
                {category.name}
              </h2>

              {category.description && (
                <p
                  className={`
                    mx-auto
                    mt-3
                    max-w-2xl
                    ${styles.categoryDescription}
                  `}
                >
                  {category.description}
                </p>
              )}
            </div>

            <div className="space-y-10">
              {category.items.map(
                (item) => {
                  const itemPrice =
                    formatPrice(
                      item.price,
                      item.price_range,
                      item.price_min,
                      item.price_max
                    );

                  const imageUrl =
                    getMediaUrl(item.image);

                  return (
                    <article
                      key={item.id}
                      className={`
                        overflow-hidden
                        rounded-3xl
                        border
                        transition-all
                        duration-300
                        ${styles.showcaseCard}
                      `}
                    >
                      <div className="grid md:grid-cols-2">
                        <div
                          className={`
                            aspect-[4/3]
                            overflow-hidden
                            ${styles.imageBackground}
                            md:aspect-auto
                            md:min-h-[360px]
                          `}
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              draggable={false}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition
                                duration-500
                                hover:scale-105
                              "
                            />
                          ) : (
                            <div
                              className={`
                                flex
                                h-full
                                min-h-[280px]
                                items-center
                                justify-center
                                text-sm
                                ${styles.imagePlaceholder}
                              `}
                            >
                              No image
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col justify-center p-6 sm:p-10">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3
                                  className={`
                                    text-2xl
                                    font-bold
                                    sm:text-3xl
                                    ${styles.itemName}
                                  `}
                                >
                                  {item.name}
                                </h3>

                                {item.vegetarian && (
                                  <span
                                    className={`
                                      h-4
                                      w-4
                                      rounded-sm
                                      border-2
                                      ${styles.vegetarianBorder}
                                    `}
                                    title="Vegetarian"
                                  >
                                    <span
                                      className={`
                                        mx-auto
                                        mt-[3px]
                                        block
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        ${styles.vegetarianDot}
                                      `}
                                    />
                                  </span>
                                )}
                              </div>
                            </div>

                            {itemPrice && (
                              <span
                                className={`
                                  shrink-0
                                  text-lg
                                  font-bold
                                  ${styles.price}
                                `}
                              >
                                {itemPrice}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p
                              className={`
                                mt-4
                                leading-7
                                ${styles.description}
                              `}
                            >
                              {
                                item.description
                              }
                            </p>
                          )}

                          {item.variants.length >
                            0 && (
                            <div
                              className={`
                                mt-6
                                border-t
                                pt-5
                                ${styles.variantBorder}
                              `}
                            >
                              <div className="space-y-3">
                                {item.variants.map(
                                  (
                                    variant
                                  ) => {
                                    const variantPrice =
                                      formatPrice(
                                        variant.price,
                                        variant.price_range,
                                        variant.price_min,
                                        variant.price_max
                                      );

                                    return (
                                      <div
                                        key={
                                          variant.id
                                        }
                                        className="flex items-center justify-between gap-4"
                                      >
                                        <span
                                          className={
                                            styles.variantName
                                          }
                                        >
                                          {
                                            variant.name
                                          }
                                        </span>

                                        {variantPrice && (
                                          <span
                                            className={`
                                              font-semibold
                                              ${styles.variantPrice}
                                            `}
                                          >
                                            {
                                              variantPrice
                                            }
                                          </span>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}