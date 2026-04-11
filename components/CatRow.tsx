"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface Cat {
  id: string;
  name: string;
  slug: string;
  gender: "male" | "female";
  tags?: string[];
  good_with_children?: boolean;
  good_with_cats?: boolean;
  image_url?: string | null;
}

interface CatRowProps {
  title: string;
  cats: Cat[];
  rowId: number;
}

export function CatRow({ title, cats, rowId }: CatRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    if (!track || !row) return;

    // Layout
    layoutRow(track);

    // Update fades initially
    updateFades(track);

    // Scroll handler
    const handleScroll = () => updateFades(track);
    track.addEventListener("scroll", handleScroll);

    // Attach snap
    attachSnap(track);

    // Hover handlers
    const handleMouseEnter = () => row.classList.add("row-hovered");
    const handleMouseLeave = () => row.classList.remove("row-hovered");
    row.addEventListener("mouseenter", handleMouseEnter);
    row.addEventListener("mouseleave", handleMouseLeave);

    // Resize handler
    const handleResize = () => {
      layoutRow(track);
      updateFades(track);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      row.removeEventListener("mouseenter", handleMouseEnter);
      row.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [cats]);

  const getCardsCount = () => {
    const w = window.innerWidth;
    if (w < 600) return 3;
    if (w < 1000) return 4;
    return 6;
  };

  const layoutRow = (track: HTMLDivElement) => {
    const count = getCardsCount();
    const gap = 16;

    // Pobierz page-container
    const row = track.closest(".row");
    if (!row) return;

    const pageContainer = row.closest(".page-container");
    if (!pageContainer) return;

    // Oblicz padding page-container (responsive)
    const styles = window.getComputedStyle(pageContainer);
    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingRight = parseFloat(styles.paddingRight);

    // Szerokość contentu = clientWidth MINUS paddingi
    const contentWidth = pageContainer.clientWidth - paddingLeft - paddingRight;
    const cardWidth = (contentWidth - (count - 1) * gap) / count;
    const cardHeight = cardWidth * (4 / 3); // Aspect ratio 3:4

   track.querySelectorAll<HTMLElement>(".card").forEach((card) => {
  card.style.width = `${cardWidth}px`;
  card.style.height = `${cardHeight}px`;
});
  };

  const getStep = (track: HTMLDivElement) => {
    const card = track.querySelector<HTMLElement>(".card");
    if (!card) return 0;
    return card.offsetWidth + 16;
  };

  const attachSnap = (track: HTMLDivElement) => {
    let timeout: NodeJS.Timeout;

    const handleSnapScroll = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const step = getStep(track);
        if (!step) return;

        const index = Math.round(track.scrollLeft / step);
        const target = index * step;

        if (Math.abs(track.scrollLeft - target) > 1) {
          track.scrollTo({ left: target, behavior: "smooth" });
        }
      }, 80);
    };

    track.addEventListener("scroll", handleSnapScroll);
  };

  const updateFades = (track: HTMLDivElement) => {
    const wrapper = track.closest(".row-wrapper");
    if (!wrapper) return;

    const leftFade = wrapper.querySelector<HTMLElement>(".fade.left");
    const rightFade = wrapper.querySelector<HTMLElement>(".fade.right");
    const leftBtn = wrapper.querySelector<HTMLElement>(".row-btn.left");
    const rightBtn = wrapper.querySelector<HTMLElement>(".row-btn.right");

    const maxScroll = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft >= maxScroll - 1;

    if (leftFade) leftFade.style.opacity = atStart ? "0" : "1";
    if (rightFade) rightFade.style.opacity = atEnd ? "0" : "1";

    if (leftBtn) leftBtn.dataset.visible = atStart ? "false" : "true";
    if (rightBtn) rightBtn.dataset.visible = atEnd ? "false" : "true";
  };

  const handleScroll = (direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const step = getStep(track);
    const count = getCardsCount();
    const currentIndex = Math.round(track.scrollLeft / step);

    let nextIndex =
      direction === "right" ? currentIndex + count : currentIndex - count;

    nextIndex = Math.max(0, nextIndex);

    track.scrollTo({
      left: nextIndex * step,
      behavior: "smooth",
    });
  };

  if (!cats || cats.length === 0) return null;

  return (
    <div ref={rowRef} className="row">
      <h2>{title}</h2>

      <div className="row-wrapper">
        <button
          className="row-btn left"
          data-row={rowId}
          data-visible="false"
          onClick={() => handleScroll("left")}
        >
          ‹
        </button>

        <div ref={trackRef} className="row-track" id={`row-${rowId}`}>
          {cats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>

        <button
          className="row-btn right"
          data-row={rowId}
          data-visible="true"
          onClick={() => handleScroll("right")}
        >
          ›
        </button>

        <div className="fade left"></div>
        <div className="fade right"></div>
      </div>
    </div>
  );
}

function CatCard({ cat }: { cat: Cat }) {
  return (
    <Link href={`/${cat.slug}`} className="card" data-id={cat.id}>
      <div className="card-inner">
        {cat.image_url ? (
          <img src={cat.image_url} alt={cat.name} />
        ) : (
          <div className="card-placeholder">
            <span className="material-icons">pets</span>
          </div>
        )}

        {/* Info overlay */}
        <div className="card-info">
          <h3>{cat.name}</h3>
          <div className="card-meta">
            <span className="material-icons">
              {cat.gender === "female" ? "female" : "male"}
            </span>
            {cat.good_with_children && (
              <span className="material-icons" title="Dla dzieci">
                child_care
              </span>
            )}
            {cat.good_with_cats && (
              <span className="material-icons" title="Z innymi kotami">
                pets
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}