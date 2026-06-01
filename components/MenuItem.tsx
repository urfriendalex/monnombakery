import { imageUrlFor } from "@/lib/sanity/image";
import type { MenuItem as MenuItemType } from "@/types/menu";

export function MenuItem({ item }: { item: MenuItemType }) {
  const imageUrl = imageUrlFor(item.image, 1200);

  return (
    <article className="menu-item" data-menu-item-id={item._id}>
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
                aria-label={`Zobacz zdjęcie: ${item.name}`}
              >
                zdjęcie
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
      <div className="price-block" aria-label={`Cena ${item.price}`}>
        <span className="price">{item.price}</span>
        {item.secondaryPrice ? (
          <span className="secondary-price">{item.secondaryPrice}</span>
        ) : null}
      </div>
    </article>
  );
}
