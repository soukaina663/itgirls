// src/pages/FormationsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./formations.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiFetch, getStoredUser } from "../lib/apiClient";


const API_BASE = "http://localhost:8080";

const THEME_CHIPS = [
    { key: "all", label: "Tout" },
    { key: "dev", label: "Dev" },
    { key: "cyber", label: "Cyber" },
    { key: "cloud", label: "Cloud" },
    { key: "ai", label: "IA" },
    { key: "bigdata", label: "Big Data" },
    { key: "net", label: "Réseaux" },
];

function formatNumber(n) {
    if (n == null) return "";
    return new Intl.NumberFormat("fr-FR").format(n);
}

function Stars({ rating }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    const arr = [...Array(full).fill("★"), ...(half ? ["★"] : []), ...Array(empty).fill("☆")];
    return <span className="stars">{arr.join("")}</span>;
}

function CourseCard({ course, onView }) {
    return (
        <div className="courseCard">
            <div className="courseThumb">
                <img src={course.thumbnail} alt="" />
                {course.badge ? <span className="badge">{course.badge}</span> : null}
            </div>

            <div className="courseBody">
                <div className="courseTitle" title={course.title}>
                    {course.title}
                </div>

                <div className="courseMeta">
                    <span className="pill">{course.themeLabel}</span>
                    <span className="dot">•</span>
                    <span className="pill">{course.level}</span>
                </div>

                <div className="courseRatingRow">
                    <span className="ratingValue">{Number(course.rating || 0).toFixed(1)}</span>
                    <Stars rating={Number(course.rating || 0)} />
                    <span className="reviews">({formatNumber(course.reviewsCount)} avis)</span>
                </div>

                <div className="courseFooter">
                    <div className="enrolled">
                        {formatNumber(course.enrolledCount)} déjà inscrites • {course.lessonsCount} modules
                    </div>
                    <div className="courseActions">
                        <button className="btnGhost" onClick={() => onView(course)}>
                            Voir le détail
                        </button>
                        <button
                            className="btnPrimary"
                            onClick={() => alert("Inscription gratuite (à brancher au login) ✅")}
                        >
                            S’inscrire gratuitement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * ✅ Mapping minimal: on garde exactement les champs attendus par ton UI
 * (si ton backend renvoie déjà ces noms, ça passe direct)
 */
function normalizeFormation(f) {
    return {
        id: f.id,
        themeKey: f.themeKey,
        themeLabel: f.themeLabel,
        title: f.title,
        level: f.level,

        rating: f.rating ?? 4.7,
        reviewsCount: f.reviewsCount ?? 0,
        enrolledCount: f.enrolledCount ?? 0,

        prerequisites: f.prerequisites ?? "—",
        durationWeeks: f.durationWeeks ?? 0,
        hoursPerWeek: f.hoursPerWeek ?? 0,
        selfPaced: f.selfPaced ?? true,
        lessonsCount: f.lessonsCount ?? 0,

        badge: f.badge ?? "",
        thumbnail: f.thumbnail ?? "/images/themes/dev.png",
        isPopular: Boolean(f.isPopular),
    };
}

export default function FormationsPage() {
    const [courses, setCourses] = useState([]);
    const [q, setQ] = useState("");
    const [chip, setChip] = useState("all");
    const [level, setLevel] = useState("all");
    const [selected, setSelected] = useState(null);

    // ✅ Fetch au backend (avec filtres)
    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                const params = new URLSearchParams();
                if (chip !== "all") params.set("themeKey", chip);
                if (level !== "all") params.set("level", level);
                if (q.trim()) params.set("q", q.trim());

                const url = `${API_BASE}/api/public/formations${params.toString() ? `?${params}` : ""}`;

                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                setCourses(Array.isArray(data) ? data.map(normalizeFormation) : []);
            } catch (e) {
                if (e.name !== "AbortError") {
                    console.error("Erreur fetch formations:", e);
                    setCourses([]); // on ne casse pas la page
                }
            }
        }

        load();
        return () => controller.abort();
    }, [chip, level, q]);

    const popular = useMemo(() => courses.filter((c) => c.isPopular).slice(0, 6), [courses]);

    // ⚠️ on garde ton filtered tel quel (même si back filtre déjà)
    const filtered = useMemo(() => {
        let list = [...courses];
        if (chip !== "all") list = list.filter((c) => c.themeKey === chip);
        if (level !== "all") list = list.filter((c) => c.level === level);

        const qq = q.trim().toLowerCase();
        if (qq) {
            list = list.filter(
                (c) =>
                    (c.title || "").toLowerCase().includes(qq) ||
                    (c.themeLabel || "").toLowerCase().includes(qq)
            );
        }
        return list;
    }, [courses, chip, level, q]);

    const showPopularSection = chip === "all" && q.trim() === "" && level === "all";

    return (
        <div className="formationsPage">
            <Header />

            <section className="formationsHero">
                <div className="formationsHero__left">
                    <h1 className="formationsHero__title">Explorer les formations</h1>
                    <p className="formationsHero__subtitle">
                        Découvre nos parcours et apprends à ton rythme.
                    </p>

                    <div className="searchRow">
                        <input
                            className="searchInput"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Rechercher une formation..."
                        />
                        <button className="searchBtn" title="Rechercher">⌕</button>
                    </div>

                    <div className="chipsRow">
                        {THEME_CHIPS.map((t) => (
                            <button
                                key={t.key}
                                className={`chip ${chip === t.key ? "chip--active" : ""}`}
                                onClick={() => setChip(t.key)}
                                type="button"
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="filtersRow">
                        <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="all">Tous niveaux</option>
                            <option value="Débutant">Débutant</option>
                            <option value="Intermédiaire">Intermédiaire</option>
                            <option value="Avancé">Avancé</option>
                        </select>
                    </div>
                </div>
            </section>

            {showPopularSection && (
                <section className="section">
                    <h2 className="sectionTitle">Populaires en ce moment</h2>

                    <div className="popularRow">
                        {popular.map((c) => (
                            <div key={c.id} className="popularCard">
                                <div className="popularThumb">
                                    <img src={c.thumbnail} alt="" />
                                    <span className="badge">Populaire</span>
                                </div>

                                <div className="popularBody">
                                    <div className="popularTitle">{c.title}</div>
                                    <div className="popularSub">
                                        <span className="pill">{c.level}</span>
                                        <span className="dot">•</span>
                                        <span>{formatNumber(c.enrolledCount)} inscrites</span>
                                    </div>

                                    <div className="courseRatingRow">
                                        <span className="ratingValue">{Number(c.rating || 0).toFixed(1)}</span>
                                        <Stars rating={Number(c.rating || 0)} />
                                        <span className="reviews">({formatNumber(c.reviewsCount)})</span>
                                    </div>

                                    <div className="popularActions">
                                        <button className="btnGhost" onClick={() => setSelected(c)}>
                                            Voir le détail
                                        </button>
                                        <button className="btnPrimary" onClick={() => alert("Inscription ✅")}>
                                            S’inscrire gratuitement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="section">
                <h2 className="sectionTitle">Toutes les formations</h2>

                <div className="grid">
                    {filtered.map((c) => (
                        <CourseCard key={c.id} course={c} onView={(course) => setSelected(course)} />
                    ))}
                </div>
            </section>

            {selected && (
                <div className="modalOverlay" onMouseDown={() => setSelected(null)}>
                    <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <div>
                                <div className="modalTitle">{selected.title}</div>
                                <div className="modalSub">
                                    <span className="pill">{selected.themeLabel}</span>
                                    <span className="dot">•</span>
                                    <span className="pill">{selected.level}</span>
                                    <span className="dot">•</span>
                                    <span>{formatNumber(selected.enrolledCount)} inscrites</span>
                                </div>
                            </div>
                            <button className="btnClose" onClick={() => setSelected(null)}>✕</button>
                        </div>

                        <div className="modalContent">
                            <div className="modalLeft">
                                <img className="modalImg" src={selected.thumbnail} alt="" />
                                <div className="courseRatingRow" style={{ marginTop: 10 }}>
                                    <span className="ratingValue">{Number(selected.rating || 0).toFixed(1)}</span>
                                    <Stars rating={Number(selected.rating || 0)} />
                                    <span className="reviews">({formatNumber(selected.reviewsCount)} avis)</span>
                                </div>
                            </div>

                            <div className="modalRight">
                                <div className="detailGrid">
                                    <div className="detailBox">
                                        <div className="detailLabel">Prérequis</div>
                                        <div className="detailValue">{selected.prerequisites}</div>
                                    </div>
                                    <div className="detailBox">
                                        <div className="detailLabel">Niveau</div>
                                        <div className="detailValue">{selected.level}</div>
                                    </div>
                                    <div className="detailBox">
                                        <div className="detailLabel">Planning flexible</div>
                                        <div className="detailValue">
                                            {selected.durationWeeks} semaines à {selected.hoursPerWeek} heures/sem
                                            {selected.selfPaced ? " • À votre rythme" : ""}
                                        </div>
                                    </div>
                                    <div className="detailBox">
                                        <div className="detailLabel">Contenu</div>
                                        <div className="detailValue">{selected.lessonsCount} modules</div>
                                    </div>
                                </div>

                                <div className="modalActions">
                                    <button className="btnPrimary" onClick={() => alert("Inscription ✅")}>
                                        S’inscrire gratuitement
                                    </button>
                                    <button className="btnGhost" onClick={() => alert("Route: /formations/" + selected.id)}>
                                        Voir la page complète
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
