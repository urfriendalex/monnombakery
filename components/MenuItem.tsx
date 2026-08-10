import { imageUrlFor } from "@/lib/sanity/image";
import type { MenuItem as MenuItemType } from "@/types/menu";
import { ui, type Locale } from "@/lib/i18n";

export function MenuItem({ item, locale }: { item: MenuItemType; locale: Locale }) {
  const copy = ui[locale];
  const imageUrl = imageUrlFor(item.image, 1200);

  return (
    <article
      className="menu-item"
      data-menu-item-id={item._id}
      {...(imageUrl ? { "data-photo-preview-id": item._id } : {})}
    >
      <div className="item-copy">
        <h4 className="item-name">{item.name}</h4>
        {item.description ? (
          <p className="item-description">{item.description}</p>
        ) : null}
        {(imageUrl || item.tags?.length) ? (
          <div className="item-meta">
            {imageUrl ? (
              <button
                className="photo-trigger"
                type="button"
                data-photo-preview-id={item._id}
                aria-label={`${copy.viewPhoto}: ${item.name}`}
              >
                {copy.photo}
              </button>
            ) : null}
            {item.tags?.map((tag) => (
              <span className="item-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="price-block" aria-label={`${copy.price} ${item.price}`}>
        <span className="price">{item.price}</span>
        {item.secondaryPrice ? (
          <span className="secondary-price">{item.secondaryPrice}</span>
        ) : null}
      </div>
    </article>
  );
}
