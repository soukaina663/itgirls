import React, { useEffect, useMemo, useRef, useState } from "react";
import "./testimonials.css";

export default function TestimonialsCarousel() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const scrollerRef = useRef(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoading(true);

                const res = await fetch("http://localhost:8080/api/public/feedbackgeneral");
                if (!res.ok) throw new Error("Failed to load feedbacks");

                const data = await res.json();
                if (!alive) return;

                // On mappe vers le même format que ton mock
                const mapped = (Array.isArray(data) ? data : []).map((f) => ({
                    name: f.authorName,
                    role: f.authorTitle,
                    text: f.text,
                }));

                setReviews(mapped);
                setIndex(0);
            } catch (e) {
                // si backend down -> on évite de casser la home
                setReviews([]);
            } finally {
                if (alive) setLoading(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    function scrollToCard(nextIndex) {
        const el = scrollerRef.current;
        if (!el) return;
        const cards = el.querySelectorAll(".t-card");
        const clamped = Math.max(0, Math.min(nextIndex, cards.length - 1));
        const target = cards[clamped];
        if (target) target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        setIndex(clamped);
    }

    const safeReviews = useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);

    return (
        <div className="t-wrap">
            <div className="t-head">
                <div>
                    <h3 className="t-title">Prouver leur succès, inspirer d’autres femmes.</h3>
                    <p className="t-sub">
                        Des témoignages réels de membres : formations, mentorat, challenges et accompagnement.
                    </p>
                </div>

                <div className="t-controls" aria-label="Contrôles avis">
                    <button
                        type="button"
                        className="t-btn"
                        onClick={() => scrollToCard(index - 1)}
                        aria-label="Avis précédent"
                        disabled={safeReviews.length === 0}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className="t-btn"
                        onClick={() => scrollToCard(index + 1)}
                        aria-label="Avis suivant"
                        disabled={safeReviews.length === 0}
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="t-scroller" ref={scrollerRef}>
                {loading ? (
                    <article className="t-card">
                        <div className="t-quote">“</div>
                        <p className="t-text">Chargement des témoignages…</p>
                        <div className="t-person">
                            <div className="t-avatar" aria-hidden="true">…</div>
                            <div>
                                <div className="t-name">IT Girls</div>
                                <div className="t-role">Feedback</div>
                            </div>
                        </div>
                    </article>
                ) : safeReviews.length === 0 ? (
                    <article className="t-card">
                        <div className="t-quote">“</div>
                        <p className="t-text">Aucun témoignage pour le moment.</p>
                        <div className="t-person">
                            <div className="t-avatar" aria-hidden="true">I</div>
                            <div>
                                <div className="t-name">IT Girls</div>
                                <div className="t-role">Communauté</div>
                            </div>
                        </div>
                    </article>
                ) : (
                    safeReviews.map((r, i) => (
                        <article key={i} className="t-card">
                            <div className="t-quote">“</div>
                            <p className="t-text">{r.text}</p>
                            <div className="t-person">
                                <div className="t-avatar" aria-hidden="true">{(r.name || "?").slice(0, 1)}</div>
                                <div>
                                    <div className="t-name">{r.name}</div>
                                    <div className="t-role">{r.role}</div>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
