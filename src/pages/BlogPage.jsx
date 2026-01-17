import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./blog.css";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:8080").replace(/\/$/, "");

function formatFrDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return String(isoDate);
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
}

function resolveImageUrl(url) {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    // si tu stockes "/images/..." dans la DB et tes images sont dans public/
    return `${process.env.PUBLIC_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function CatIcon({ label }) {
    const map = {
        Programmation: "💻",
        Cybersécurité: "🛡️",
        "Carrière Tech": "🚀",
        Data: "📊",
        "Data Science": "📈",
        "Cloud & DevOps": "☁️",
    };
    return <span aria-hidden="true">{map[label] || "✨"}</span>;
}

/* --- Logos SVG --- */
function InstagramIcon(props) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9z" />
            <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            <path d="M17.6 6.4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
    );
}

function LinkedInIcon(props) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M4.98 3.5a2.5 2.5 0 1 1-.01 5.01A2.5 2.5 0 0 1 4.98 3.5zM3 9h4v12H3V9zM9 9h3.8v1.64h.06c.53-.95 1.84-1.95 3.78-1.95C20.4 8.69 21 11 21 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.28V21H9V9z" />
        </svg>
    );
}

function FacebookIcon(props) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
            <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.87.24-1.46 1.5-1.46H16.7V5c-.3-.04-1.35-.13-2.57-.13-2.54 0-4.28 1.55-4.28 4.4V11H7v3h2.85v8H13.5z" />
        </svg>
    );
}

/* Carousel community */
function CommunityPostsCarousel({ posts, intervalMs = 3800 }) {
    const items = Array.isArray(posts) ? posts.filter(Boolean) : [];

    const [index, setIndex] = useState(0);
    const [enableTransition, setEnableTransition] = useState(true);
    const timerRef = useRef(null);

    const hasItems = items.length > 0;
    const slides = items.length > 1 ? [...items, items[0]] : items;

    useEffect(() => {
        setIndex(0);
        setEnableTransition(true);
        if (timerRef.current) clearInterval(timerRef.current);

        if (items.length <= 1) return;

        timerRef.current = setInterval(() => {
            setEnableTransition(true);
            setIndex((prev) => prev + 1);
        }, intervalMs);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [intervalMs, items.length]);

    const handleTransitionEnd = () => {
        if (items.length > 1 && index === slides.length - 1) {
            setEnableTransition(false);
            setIndex(0);
            requestAnimationFrame(() => requestAnimationFrame(() => setEnableTransition(true)));
        }
    };

    if (!hasItems) {
        return (
            <div className="community-posts">
                <div className="community-posts__empty">
                    Aucun post pour l’instant (les photos de la communauté s’afficheront ici).
                </div>
            </div>
        );
    }

    return (
        <div className="community-posts">
            <div className="community-posts__viewport">
                <div
                    className={`community-posts__track ${enableTransition ? "is-anim" : "no-anim"}`}
                    style={{ transform: `translateX(-${index * 100}%)` }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slides.map((p, i) => (
                        <div className="community-posts__slide" key={`${p.id || p.title}-${i}`}>
                            <div className="community-postCard">
                                <img
                                    className="community-postCard__img"
                                    src={resolveImageUrl(p.imageUrl)}
                                    alt={p.title}
                                />
                                <div className="community-postCard__overlay">
                                    <div className="community-postCard__title">{p.title}</div>

                                    {/* ✅ CHANGEMENT ICI : authorName */}
                                    {p.authorName ? (
                                        <div className="community-postCard__meta">par {p.authorName}</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {items.length > 1 && (
                <div className="community-posts__dots" aria-hidden="true">
                    {items.map((_, i) => (
                        <span key={i} className={`community-posts__dot ${i === (index % items.length) ? "is-on" : ""}`} />
                    ))}
                </div>
            )}
        </div>
    );
}

const CATEGORIES = ["Programmation", "Cybersécurité", "Carrière Tech", "Data Science", "Cloud & DevOps"];
const TAGS = ["#JavaScript", "#Python", "#ConseilsCarrière", "#Hackathon", "#CV", "#React"];

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [featured, setFeatured] = useState(null);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        async function load() {
            setLoading(true);
            try {
                const [postsRes, featuredRes, communityRes] = await Promise.all([
                    fetch(`${API_BASE}/api/public/blog/posts`).then((r) => r.json()),
                    fetch(`${API_BASE}/api/public/blog/featured`).then((r) => r.json()),
                    fetch(`${API_BASE}/api/public/community-posts?limit=20`).then((r) => r.json()),
                ]);

                if (!alive) return;

                setPosts(Array.isArray(postsRes) ? postsRes : []);
                setFeatured(featuredRes || null);
                setCommunityPosts(Array.isArray(communityRes) ? communityRes : []);
            } catch (e) {
                console.error(e);
                if (!alive) return;
                setPosts([]);
                setFeatured(null);
                setCommunityPosts([]);
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    const featuredUi = featured
        ? {
            badge: "À la une",
            title: featured.title,

            // ✅ CHANGEMENT ICI : authorName
            meta: `Posté le ${formatFrDate(featured.publishDate)}${
                featured.authorName ? ` • par ${featured.authorName}` : ""
            }`,

            excerpt: featured.excerpt,
        }
        : null;

    return (
        <div className="blog-page">
            <Header />

            <main className="blog-main">
                <section className="blog-heroMiniOnly" aria-label="Bannière blog">
                    <div className="blog-heroMiniOnly__inner">
                        <h1 className="blog-heroMiniOnly__title">GIRLS COMMUNITY BLOG</h1>
                    </div>
                </section>

                <section className="blog-layout" aria-label="Contenu blog">
                    <div className="blog-layout__inner">
                        {/* LEFT */}
                        <div className="blog-left" id="derniers">
                            <div className="blog-sectionHead">
                                <h2 className="blog-sectionTitle">Derniers articles</h2>
                                <p className="blog-sectionSub">
                                    {loading ? "Chargement..." : "Contenus chargés depuis la base de données ✅"}
                                </p>
                            </div>

                            <div className="blog-grid">
                                {(posts || []).map((p) => (
                                    <article key={p.id} className="blog-postCard">
                                        <div className="blog-postTop">
                                            <div className="blog-postTop__left">
                                                <span className="blog-postIcon">
                                                    <CatIcon label={p.category} />
                                                </span>
                                                <span className="blog-badge">{p.category}</span>
                                            </div>

                                            <div className="blog-postMeta">
                                                <span>{formatFrDate(p.publishDate)}</span>
                                                <span className="blog-dot">•</span>
                                                <span>{p.readTimeMins ? `${p.readTimeMins} min` : ""}</span>
                                            </div>
                                        </div>

                                        <div className="blog-postBody">
                                            <h3 className="blog-postTitle">{p.title}</h3>
                                            <p className="blog-postExcerpt">{p.excerpt}</p>

                                            <button
                                                className="blog-btn blog-btn--ghost"
                                                type="button"
                                                onClick={() => alert("Détails article (à brancher) ✅")}
                                            >
                                                Lire l’article →
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="blog-moreRow">
                                <button
                                    className="blog-btn blog-btn--soft"
                                    type="button"
                                    onClick={() => alert("Pagination (à faire) ✅")}
                                >
                                    Voir tous les articles →
                                </button>
                            </div>

                            {/* ✅ Community posts depuis DB */}
                            <CommunityPostsCarousel posts={communityPosts} intervalMs={3800} />
                        </div>

                        {/* RIGHT */}
                        <aside className="blog-right" aria-label="Sidebar blog">
                            <div className="blog-sideCard">
                                <div className="blog-sideTitle">À la une</div>

                                {featuredUi ? (
                                    <div className="blog-featured">
                                        <div className="blog-featuredTop">
                                            <span className="blog-badge blog-badge--pink">{featuredUi.badge}</span>
                                            <span className="blog-featuredSpark" aria-hidden="true">
                                                ✨
                                            </span>
                                        </div>

                                        <div className="blog-featuredBody">
                                            <div className="blog-featuredTitle">{featuredUi.title}</div>
                                            <div className="blog-featuredMeta">{featuredUi.meta}</div>
                                            <div className="blog-featuredExcerpt">{featuredUi.excerpt}</div>

                                            <button className="blog-btn" type="button" onClick={() => alert("Article à la une ✅")}>
                                                Voir l’article →
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="blog-sideNote">Aucun article “featured” en base pour le moment.</div>
                                )}
                            </div>

                            <div className="blog-sideCard">
                                <div className="blog-sideTitle">Catégories</div>
                                <div className="blog-cats">
                                    {CATEGORIES.map((c) => (
                                        <button key={c} className="blog-pill" type="button" onClick={() => alert(`Filtrer catégorie: ${c} ✅`)}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="blog-sideCard">
                                <div className="blog-sideTitle">Tags</div>
                                <div className="blog-tags">
                                    {TAGS.map((t) => (
                                        <button key={t} className="blog-tag" type="button" onClick={() => alert(`Filtrer tag: ${t} ✅`)}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="blog-sideCard">
                                <div className="blog-sideTitle">Suivez-nous</div>

                                <div className="blog-socialsMini">
                                    <a className="blog-socialMini" href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram">
                                        <InstagramIcon className="blog-socialMini__svg" />
                                    </a>
                                    <a className="blog-socialMini" href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">
                                        <LinkedInIcon className="blog-socialMini__svg" />
                                    </a>
                                    <a className="blog-socialMini" href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook">
                                        <FacebookIcon className="blog-socialMini__svg" />
                                    </a>
                                </div>

                                <div className="blog-sideNote">(Les liens seront ajoutés plus tard.)</div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
