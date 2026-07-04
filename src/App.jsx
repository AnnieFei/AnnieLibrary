import { useEffect, useRef, useState } from "react";

const asset = (filename) => `${import.meta.env.BASE_URL}assets/${filename}`;

// EDIT YOUR LIBRARY HERE.
// Put images/videos in public/assets, then change the `media` path for each work.
const works = [
  {
    id: "cant-feminist",
    number: "01",
    title: '"I can\'t,"',
    year: "2026",
    type: "image",
    media: asset("cant-feminist.jpg"), // ADD/REPLACE YOUR FIRST IMAGE HERE
    shape: "portrait",
    note: "and I won't",
    paragraphs: [
      "I can't pray to something that I don't belive exists. Religion, Us, Emotion, Time, what a joke",
      "I used Acrylics here on a 88 * 54 canvas",
      "Hope you get it"
    ]
  },
  {
    id: "work-two",
    number: "02",
    title: "insipid",
    year: "2025",
    type: "image",
    media: "https://i.postimg.cc/rFPC8j5K/image.png", // ADD YOUR SECOND IMAGE HERE
    shape: "portrait",
    note: "Maybe not at all yk, could just be messy",
    paragraphs: ["this painting made me realized how lazy and not consistent I am. I wanted to say how we grow by letting go the past versions of ourselves, yk?.", 
                "Acrylics again, can't afford oil"]
  },
  {
    id: "work-three",
    number: "03",
    title: "Artwork Three",
    year: "2024",
    type: "video",
    media: asset("your-video-03.mp4"), // ADD YOUR VIDEO HERE
    poster: asset("your-video-poster-03.jpg"), // ADD THE VIDEO PREVIEW IMAGE HERE
    shape: "tall",
    note: "Add a short sentence about this video.",
    paragraphs: ["Add your writing here.", "Add another paragraph here."]
  },
  {
    id: "work-four",
    number: "04",
    title: "Artwork Four",
    year: "2023",
    type: "image",
    media: asset("your-image-04.jpg"), // ADD YOUR FOURTH IMAGE HERE
    shape: "landscape",
    note: "Add a short sentence about this work.",
    paragraphs: ["Add your writing here.", "Add another paragraph here."]
  }
];

function Media({ work, expanded = false }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span className="media-missing" aria-label={`Add media for ${work.title}`}>
        <span>Add your {work.type}</span>
        <small>{work.media}</small>
      </span>
    );
  }

  if (work.type === "video") {
    return (
      <video
        className={expanded ? "detail__media" : "work__media"}
        src={work.media}
        poster={work.poster}
        controls={expanded}
        muted={!expanded}
        playsInline
        onError={() => setMissing(true)}
      />
    );
  }

  return (
    <img
      className={expanded ? "detail__media" : "work__media"}
      src={work.media}
      alt={expanded ? work.title : ""}
      onError={() => setMissing(true)}
    />
  );
}

function Artwork({ work, onOpen }) {
  return (
    <article className={`work work--${work.shape}`}>
      <button className="work__button" onClick={() => onOpen(work)} aria-label={`Open ${work.title}`}>
        <span className="work__frame"><Media work={work} /></span>
        <span className="work__caption">
          <span>{work.number} / {work.title} / {work.year}</span>
          <span>{work.note}</span>
        </span>
      </button>
    </article>
  );
}

function Detail({ work, onClose }) {
  const closeButton = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    closeButton.current?.focus();
    document.body.classList.add("detail-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("detail-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <section className="detail" role="dialog" aria-modal="true" aria-label={`${work.title} reading`}>
      <button ref={closeButton} className="detail__close" onClick={onClose} aria-label="Close">×</button>
      <div className="detail__visual"><Media work={work} expanded /></div>
      <article className="detail__writing">
        <p className="microcopy">{work.number} / {work.year} / {work.type}</p>
        <h2>{work.title}</h2>
        <div className="detail__paragraphs">
          {work.paragraphs.map((paragraph, index) => <p key={`${work.id}-${index}`}>{paragraph}</p>)}
        </div>
        <a className="original" href={work.media} target="_blank" rel="noreferrer">View original ↗</a>
      </article>
    </section>
  );
}

export function App() {
  const [selected, setSelected] = useState(null);
  const [firstWorkReached, setFirstWorkReached] = useState(false);
  const [pointer, setPointer] = useState({ x: -500, y: -500, visible: false });

  useEffect(() => {
    const move = (event) => setPointer({ x: event.clientX, y: event.clientY, visible: true });
    const hide = () => setPointer((value) => ({ ...value, visible: false }));
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  useEffect(() => {
    const updateStickyTitle = () => {
      const firstWork = document.querySelector(".work");
      if (!firstWork) return;

      const firstWorkBox = firstWork.getBoundingClientRect();
      setFirstWorkReached(firstWorkBox.bottom <= window.innerHeight * 0.92);
    };

    updateStickyTitle();
    window.addEventListener("scroll", updateStickyTitle, { passive: true });
    window.addEventListener("resize", updateStickyTitle);
    return () => {
      window.removeEventListener("scroll", updateStickyTitle);
      window.removeEventListener("resize", updateStickyTitle);
    };
  }, []);

  return (
    <>
      <div
        className={`cursor-light ${pointer.visible ? "is-visible" : ""}`}
        style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)` }}
        aria-hidden="true"
      />

      <header className="topbar">
        <a className="index-link" href="#top">Index</a>
        <nav aria-label="Primary navigation">
          <a href="#archive">Archive</a>
          <a href="#about">About</a>
        </nav>
        <span>Archive 01—{String(works.length).padStart(2, "0")}</span>
      </header>

      <main id="top">
        <div className="library-flow">
          <section className={`hero ${firstWorkReached ? "hero--archive" : ""}`}>
            <h1>{firstWorkReached ? "Like it?" : "Welcome"}</h1>
            <p>keep going</p>
          </section>

          <section className="archive" id="archive" aria-label="Artwork archive">
            {works.map((work) => <Artwork key={work.id} work={work} onOpen={setSelected} />)}
          </section>
        </div>

        <section className="about" id="about">
          <p className="microcopy">About / Personal library</p>
          <p>a page of things im proud of</p>
        </section>
      </main>

      {selected && <Detail work={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
