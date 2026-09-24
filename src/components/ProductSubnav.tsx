/* Created by Claude · INTERNAL */
import Link from "next/link";
import { PRODUCT_SUBNAV } from "@/data/content";

/* Product index row under the site header (card pages v2, Figma
   "Breadcrumb" 22630:15278). In flow, not fixed — see `.dpc-subnav` in
   product-page.css. `current` marks the section this page belongs to; the
   comp draws no active state, so it is announced (aria-current) but not
   styled. */

export default function ProductSubnav({ current }: { current?: string }) {
  return (
    <nav className="dpc-subnav" aria-label="ürünler">
      <div className="container dpc-subnav__inner">
        <span className="dpc-subnav__label" aria-hidden="true">
          {PRODUCT_SUBNAV.label}
        </span>
        <ul className="dpc-subnav__list">
          {PRODUCT_SUBNAV.items.map((item) => {
            const isCurrent = item.id === current;
            const props = {
              className: "dpc-subnav__link",
              "aria-current": isCurrent ? ("true" as const) : undefined,
            };
            return (
              <li key={item.id}>
                {item.href.startsWith("/") ? (
                  <Link href={item.href} {...props}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} {...props}>
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
