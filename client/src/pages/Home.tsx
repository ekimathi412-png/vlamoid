import { ArrowDown, ArrowUpRight, MapPin, Shell } from "lucide-react";
import Header, { Wordmark } from "../components/vlamoid/Header";
import SeasonalMenu from "../components/vlamoid/SeasonalMenu";
import ReservationForm from "../components/vlamoid/ReservationForm";
import { draftHours, images } from "../data/restaurant";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <section id="home" className="hero" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src={images.hero}
            alt="Restaurant table set for dinner with wine, a plated dish, and candlelight"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="fine-line" /> SEAFOOD & PÂTISSERIE · NAIROBI
            </div>
            <h1 id="hero-title">
              From the sea.
              <br />
              <em>For the soul.</em>
            </h1>
            <p>
              Fresh from the coast. Finished with something sweet.
              <br className="desktop-break" /> An intimate table in the heart of
              Nairobi.
            </p>
            <div className="hero-actions">
              <a href="#reservations" className="button button-brass">
                Reserve a table <ArrowUpRight size={18} />
              </a>
              <a href="#menu" className="hero-menu-link">
                Explore the menu <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#menu" className="scroll-prompt">
              <span className="scroll-circle">
                <ArrowDown size={17} strokeWidth={1.4} />
              </span>
              <span>THE EVENING BEGINS HERE</span>
            </a>
            <div className="hero-location">
              <span className="small-dot" /> NAIROBI, KENYA
              <span className="hero-coordinate">
                GOOD FOOD. UNHURRIED EVENINGS.
              </span>
            </div>
          </div>
          <div className="hero-side-note">TAKE YOUR TIME. STAY A LITTLE.</div>
        </section>

        <section className="intro-strip" aria-label="The Vlamoid experience">
          <span>Ocean-fresh seafood</span>
          <Shell size={23} strokeWidth={1} />
          <span>Handcrafted pastries</span>
          <Shell size={23} strokeWidth={1} />
          <span>Evenings well spent</span>
        </section>
        <SeasonalMenu />

        <section
          id="story"
          className="story-section section-pad"
          aria-labelledby="story-title"
        >
          <div className="story-image-wrap">
            <img
              src={images.patisserie}
              alt="Chocolate layer cake finished with chocolate frosting"
              width="800"
              height="600"
              loading="lazy"
            />
            <div className="photo-annotation">
              <span>THE LAST COURSE</span>
              <span>IS NEVER AN AFTERTHOUGHT.</span>
            </div>
          </div>
          <div className="story-copy">
            <span className="eyebrow">02 / BEHIND THE PASS</span>
            <h2 id="story-title">
              A coastal heart.
              <br />
              <em>A pastry soul.</em>
            </h2>
            <p className="story-lead">Two worlds. One very good evening.</p>
            <p>
              Our chef’s story begins with a simple idea: seafood and pastry
              both reward patience. Let the freshest ingredients lead, know when
              to add a little fire, and know when to leave well enough alone.
            </p>
            <p>
              At Vlamoid, that spirit takes you from the first briny bite to the
              last buttery layer. A little coastal inspiration. A little Nairobi
              character. And a reason to linger over dessert.
            </p>
            <div className="chef-signature">
              <Shell size={32} strokeWidth={1} />
              <div>
                <span>The Vlamoid kitchen</span>
                <small>SEAFOOD & PÂTISSERIE</small>
              </div>
            </div>
            <p className="quiet-note">
              Draft chef-story copy · A personal biography will follow when
              supplied.
            </p>
          </div>
        </section>

        <section
          id="reservations"
          className="reservation-section section-pad"
          aria-labelledby="reservation-title"
        >
          <div className="reservation-copy">
            <span className="eyebrow">03 / MAKE AN EVENING OF IT</span>
            <h2 id="reservation-title">
              Your table.
              <br />
              <em>Your evening.</em>
            </h2>
            <p>
              A dinner for two, a long-overdue catch-up,
              <br className="desktop-break" /> or just an excellent excuse to go
              out.
            </p>
            <p className="booking-aside">
              Choose a date, pull up a chair.
              <br />
              We’ll make the rest feel effortless.
            </p>
            <span className="draft-tag">RESERVATION PREVIEW</span>
            <p className="quiet-note booking-disclaimer">
              This preview does not send bookings to the restaurant. Your
              details stay on this page. Live reservations will open once the
              restaurant’s booking destination is connected.
            </p>
          </div>
          <ReservationForm />
        </section>

        <section
          id="visit"
          className="visit-section section-pad"
          aria-labelledby="visit-title"
        >
          <div className="section-topline">
            <span className="eyebrow">04 / COME FIND US</span>
            <span className="tiny-meta">
              THE CITY OUTSIDE. THE EVENING INSIDE.
            </span>
          </div>
          <div className="visit-layout">
            <div className="visit-copy">
              <h2 id="visit-title">
                A little escape.
                <br />
                <em>Right here in Nairobi.</em>
              </h2>
              <div className="location-details">
                <MapPin size={24} strokeWidth={1.2} />
                <div>
                  <h3>Vlamoid</h3>
                  <p>Nairobi, Kenya</p>
                  <p className="quiet-note">
                    Exact street address to be confirmed.
                  </p>
                </div>
              </div>
              <a
                className="text-link"
                href="https://www.google.com/maps/search/?api=1&query=Nairobi%2C%20Kenya"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore Nairobi on the map <ArrowUpRight size={16} />
              </a>
              <p className="quiet-note map-note">
                City-level map only. Restaurant directions will appear when the
                address is supplied.
              </p>
            </div>
            <div className="hours">
              <div className="hours-title">
                <h3>Opening hours</h3>
                <span className="draft-tag">DRAFT HOURS</span>
              </div>
              <dl>
                {draftHours.map(row => (
                  <div key={row.days}>
                    <dt>{row.days}</dt>
                    <dd>{row.hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="hours-note">
                Nairobi time · East Africa Time (UTC+3)
              </p>
              <p className="quiet-note">
                Proposed hours for this preview; please confirm before planning
                your visit.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-main">
          <Wordmark footer />
          <p>
            Seafood, pastries
            <br />
            <em>& a little after-dark magic.</em>
          </p>
          <a href="#reservations" className="footer-cta">
            An evening at Vlamoid <ArrowUpRight size={20} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Vlamoid. Nairobi, Kenya.</span>
          <span>LAUNCH PREVIEW · BUSINESS DETAILS TO BE CONFIRMED</span>
          <a href="#home">
            Back to top <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
    </>
  );
}
