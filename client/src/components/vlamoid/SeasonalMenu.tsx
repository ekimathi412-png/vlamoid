import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import {
  formatPrice,
  images,
  menu,
  type MenuCategory,
} from "../../data/restaurant";

export default function SeasonalMenu() {
  const [active, setActive] = useState<MenuCategory>("raw-bar");
  const [showAll, setShowAll] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectTab(index: number) {
    setActive(menu[index].id);
    setShowAll(false);
    tabs.current[index]?.focus();
  }

  return (
    <section
      id="menu"
      className="menu-section section-pad"
      aria-labelledby="menu-title"
    >
      <div className="section-topline">
        <span className="eyebrow">01 / AT THE TABLE</span>
        <span className="tiny-meta">SEAFOOD & PÂTISSERIE</span>
      </div>
      <div className="menu-heading">
        <h2 id="menu-title">
          A taste of <em>the season.</em>
        </h2>
        <p>
          Good ingredients. A light touch.
          <br />
          Something worth staying out for.
        </p>
      </div>
      <div
        className="menu-tabs"
        role={showAll ? "group" : "tablist"}
        aria-label="Seasonal menu categories"
      >
        {menu.map((section, index) => (
          <button
            key={section.id}
            ref={node => {
              tabs.current[index] = node;
            }}
            id={`tab-${section.id}`}
            role={showAll ? undefined : "tab"}
            type="button"
            aria-selected={showAll ? undefined : active === section.id}
            aria-controls={`panel-${section.id}`}
            tabIndex={showAll || active === section.id ? 0 : -1}
            className={!showAll && active === section.id ? "is-active" : ""}
            onClick={() => {
              setActive(section.id);
              setShowAll(false);
            }}
            onKeyDown={event => {
              if (
                ["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
              ) {
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? menu.length - 1
                      : (index +
                          (event.key === "ArrowRight" ? 1 : -1) +
                          menu.length) %
                        menu.length;
                selectTab(next);
              }
            }}
          >
            {section.label}
            <span className="tab-number">0{index + 1}</span>
          </button>
        ))}
      </div>
      <div className={`menu-body ${showAll ? "show-all" : ""}`}>
        <div id="menu-panel-group" className="menu-panels">
          {menu.map(section => (
            <div
              key={section.id}
              id={`panel-${section.id}`}
              role={showAll ? "region" : "tabpanel"}
              aria-labelledby={
                showAll ? `heading-${section.id}` : `tab-${section.id}`
              }
              hidden={!showAll && active !== section.id}
              tabIndex={0}
              className="menu-panel"
            >
              {showAll && <h3 id={`heading-${section.id}`}>{section.label}</h3>}
              <p className="menu-subtitle">{section.subtitle}</p>
              {section.items.map(item => (
                <div className="menu-item" key={item.name}>
                  <div>
                    <div className="dish-heading">
                      <h4>{item.name}</h4>
                      {item.note && (
                        <span className="dish-note">{item.note}</span>
                      )}
                    </div>
                    <p>{item.description}</p>
                  </div>
                  <span className="dish-price">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="menu-footnote">
            <span>Draft seasonal selections · Prices in Kenyan shillings.</span>
            <button
              className="text-link"
              type="button"
              aria-expanded={showAll}
              aria-controls="menu-panel-group"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Back to categories" : "See the full menu"}
              {showAll ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
            </button>
          </div>
          <p className="quiet-note">
            Sample dishes and prices for this website preview. Please confirm
            the menu and tell the restaurant about any allergies before dining.
          </p>
        </div>
        <figure className="menu-photo">
          <img
            src={images.rawBar}
            alt="Close-up of fresh prawns in a ceramic dish"
            loading="lazy"
            width="800"
            height="600"
          />
          <figcaption>
            <span>
              A LITTLE SALT.
              <br />
              <em>A lot of soul.</em>
            </span>
            <ArrowUpRight size={24} strokeWidth={1} />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
