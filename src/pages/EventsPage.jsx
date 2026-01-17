// src/pages/EventsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./events.css";
import Header from "../components/Header";

const EVENT_CHIPS = [
    { key: "all", label: "Tout" },
    { key: "atelier", label: "Ateliers" },
    { key: "conference", label: "Conférences" },
    { key: "competition", label: "Compétitions" },
];

// ✅ Mock data (tu brancheras la DB après)
const MOCK_EVENTS = [
    {
        id: 1,
        typeKey: "atelier",
        typeLabel: "Atelier",
        title: "Maîtriser les Hooks avec React",
        startsAt: "2025-02-15T15:00:00",
        durationMins: 120,
        participantsCount: 410,
        badge: "Populaire",
        cover: "/images/events/react.jpg",
    },
    {
        id: 2,
        typeKey: "conference",
        typeLabel: "Conférence",
        title: "IA Générative : comprendre & pratiquer",
        startsAt: "2025-03-30T16:00:00",
        durationMins: 90,
        participantsCount: 680,
        badge: "Populaire",
        cover: "/images/events/ai.jpg",
    },
    {
        id: 3,
        typeKey: "competition",
        typeLabel: "Compétition",
        title: "Challenge Data : Dashboard SQL",
        startsAt: "2025-01-21T19:00:00",
        durationMins: 180,
        participantsCount: 370,
        badge: "",
        cover: "/images/events/data.jpg",
    },
    {
        id: 4,
        typeKey: "atelier",
        typeLabel: "Atelier",
        title: "Sécurité : bases + bonnes pratiques",
        startsAt: "2024-06-08T18:30:00", // passé => Non disponible
        durationMins: 120,
        participantsCount: 520,
        badge: "",
        cover: "/images/events/cyber.jpg",
    },
    {
        id: 5,
        typeKey: "conference",
        typeLabel: "Conférence",
        title: "Cloud & DevOps : roadmap carrière",
        startsAt: "2025-04-10T18:00:00",
        durationMins: 75,
        participantsCount: 260,
        badge: "Nouveau",
        cover: "/images/events/cloud.jpg",
    },
    {
        id: 6,
        typeKey: "competition",
        typeLabel: "Compétition",
        title: "Hackathon : mini-app React + API",
        startsAt: "2024-10-02T10:00:00", // passé => Non disponible
        durationMins: 360,
        participantsCount: 980,
        badge: "Populaire",
        cover: "/images/events/hackathon.jpg",
    },
    {
        id: 7,
        typeKey: "atelier",
        typeLabel: "Atelier",
        title: "Nmap : scan & méthodologie",
        startsAt: "2025-05-12T17:00:00",
        durationMins: 95,
        participantsCount: 210,
        badge: "",
        cover: "/images/events/nmap.jpg",
    },
];

function formatNumber(n) {
    if (n == null) return "";
    return new Intl.NumberFormat("fr-FR").format(n);
}

function formatDateTimeFR(iso) {
    const d = new Date(iso);
    const date = d.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
}

function isPast(iso) {
    return new Date(iso).getTime() < Date.now();
}

function EventCard({ e, onView }) {
    const past = isPast(e.startsAt);
    const { date, time } = formatDateTimeFR(e.startsAt);

    return (
        <div className="evCard">
            <div className="evThumb">
                {e.cover ? <img src={e.cover} alt="" loading="lazy" decoding="async" /> : null}

                <div className="evBadges">
                    {e.badge ? <span className="evBadge evBadge--green">{e.badge}</span> : null}
                    {past ? <span className="evBadge evBadge--red">Non disponible</span> : null}
                </div>
            </div>

            <div className="evBody">
                <div className="evMeta">
                    <span className="evPill">{e.typeLabel}</span>
                    <span className="evDot">•</span>
                    <span className="evWhen">
            {date} <span className="evDot">•</span> {time}
          </span>
                </div>

                <div className="evTitle" title={e.title}>
                    {e.title}
                </div>

                <div className="evInfoRow">
                    <span>👥 {formatNumber(e.participantsCount)} participantes</span>
                    <span className="evDot">•</span>
                    <span>⏱ {e.durationMins} min</span>
                </div>

                <div className="evActions">
                    <button className="btnGhost" onClick={() => onView?.(e)} type="button">
                        Voir le détail
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [q, setQ] = useState("");
    const [chip, setChip] = useState("all");
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        setEvents(MOCK_EVENTS);
    }, []);

    // ✅ Filtre: chips + recherche, et on garde anciens + futurs
    const filtered = useMemo(() => {
        let list = [...events];

        if (chip !== "all") list = list.filter((e) => e.typeKey === chip);

        const qq = q.trim().toLowerCase();
        if (qq) list = list.filter((e) => (e.title || "").toLowerCase().includes(qq));

        // tri: futurs d'abord, puis passés à la fin
        list.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

        return list;
    }, [events, chip, q]);

    // ✅ Pour le rendu: on affiche progressivement
    const visibleEvents = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

    const canLoadMore = visibleCount < filtered.length;

    return (
        <div className="eventsPage">
            <Header />

            {/* TOP (comme l'image, propre) */}
            <section className="eventsHero">
                <div className="eventsHero__inner">
                    <h1 className="eventsHero__title">Nos évènements</h1>

                    <div className="eventsHero__controls">
                        <div className="searchRow">
                            <input
                                className="searchInput"
                                value={q}
                                onChange={(e) => {
                                    setQ(e.target.value);
                                    setVisibleCount(6);
                                }}
                                placeholder="Rechercher un évènement..."
                            />
                            <button className="searchBtn" title="Rechercher" type="button">
                                ⌕
                            </button>
                        </div>

                        <div className="chipsRow">
                            {EVENT_CHIPS.map((t) => (
                                <button
                                    key={t.key}
                                    className={`chip ${chip === t.key ? "chip--active" : ""}`}
                                    onClick={() => {
                                        setChip(t.key);
                                        setVisibleCount(6);
                                    }}
                                    type="button"
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* LISTE */}
            <section className="section">
                <div className="grid">
                    {visibleEvents.map((e) => (
                        <EventCard
                            key={e.id}
                            e={e}
                            onView={() => alert("Détail (modal/page) à brancher ✅")}
                        />
                    ))}
                </div>

                {/* AFFICHER PLUS */}
                {canLoadMore && (
                    <div className="loadMoreWrap">
                        <button className="btnLoadMore" onClick={() => setVisibleCount((v) => v + 6)} type="button">
                            Afficher plus d’évènements
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
