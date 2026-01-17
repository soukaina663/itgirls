import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./expertDashboard.css";

/* ---------------- Profil (fallback) ---------------- */
const DEFAULT_PROFILE = {
    name: "Expert IT",
    profession: "Expert IT",
    isMentor: false,
    roleLabel: "EXPERT",
    avatarUrl: "",
    badge: "Expert IT • Non-mentor",
};

/* ✅ Sidebar simplifiée */
const NAV = [
    { id: "overview", label: "Vue d’ensemble", icon: "📌", path: "/expert-dashboard" },
    { id: "requests", label: "Réservations & demandes", icon: "🗂️", path: "/expert/requests" },
    { id: "content", label: "Contenu", icon: "🧩", path: "/expert/content" },
    { id: "messages", label: "Messages", icon: "💬", path: "/expert/messages" },
    { id: "feedback", label: "Feedback", icon: "⭐", path: "/expert/feedback" },
    { id: "settings", label: "Paramètres", icon: "⚙️", path: "/expert/settings" },
];

/* ---------------- MOCK DATA (API plus tard) ---------------- */
const TRAININGS = [
    { id: "t1", title: "React pour débutantes", status: "Publié" },
    { id: "t2", title: "Cybersécurité — bases", status: "Brouillon" },
    { id: "t3", title: "Git & GitHub (workflow pro)", status: "Publié" },
];

const EVENTS = [
    { id: "e1", type: "Atelier", title: "Workshop CV Tech", date: "Sam 12 Jan • 16:00" },
    { id: "e2", type: "Conférence", title: "Parcours DevOps", date: "Jeu 23 Jan • 18:30" },
];

const MENTORING_RESERVATIONS = [
    { id: "m1", girl: "Sara B.", topic: "Préparer entretien", when: "Mar 07 Jan • 19:00", status: "Confirmé" },
    { id: "m2", girl: "Ines K.", topic: "Roadmap Data", when: "Jeu 09 Jan • 20:00", status: "En attente" },
];

const NOTIFICATIONS = [
    {
        id: "n1",
        type: "reservation",
        title: "Nouvelle réservation mentorat",
        text: "Ines K. a demandé une session (Roadmap Data).",
        targetPath: "/expert/requests?tab=mentorat",
        time: "Il y a 5 min",
    },
    {
        id: "n2",
        type: "inscription",
        title: "Nouvelle inscription événement",
        text: "Amira H. s’est inscrite à “Workshop CV Tech”.",
        targetPath: "/expert/content?tab=events",
        time: "Il y a 45 min",
    },
    {
        id: "n3",
        type: "message",
        title: "Nouveau message",
        text: "Sara B. : “Peux-tu valider mon CV ?”",
        targetPath: "/expert/messages",
        time: "Il y a 1h",
    },
];

/* ---------------- Helpers ---------------- */
function getInitials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || "IT";
}

function Avatar({ src, name }) {
    if (src) return <img className="xd-avatar" src={src} alt={name} />;
    return <div className="xd-avatar xd-avatar--fallback">{getInitials(name)}</div>;
}

function StatusPill({ value }) {
    const cls =
        value === "Confirmé" || value === "Confirmée" || value === "Publié"
            ? "pill pill--ok"
            : value === "En attente"
                ? "pill pill--wait"
                : "pill pill--muted";
    return <span className={cls}>{value}</span>;
}

function go(path) {
    window.location.href = path;
}

/* ✅ Récup user connecté (localStorage OU sessionStorage) */
function getLoggedUser() {
    try {
        const rawLocal = window.localStorage.getItem("user");
        if (rawLocal) return JSON.parse(rawLocal);

        const rawSession = window.sessionStorage.getItem("user");
        if (rawSession) return JSON.parse(rawSession);

        return null;
    } catch {
        return null;
    }
}

/* ✅ User -> profile UI */
function mapUserToProfile(u) {
    const name = (u?.name || u?.email || DEFAULT_PROFILE.name).trim();
    const roleRaw = (u?.role || "EXPERT").toString().toUpperCase();

    // profession et mentor viennent du backend
    const profession = (u?.profession || "").trim() || "Expert IT";
    const isMentor = !!u?.isMentor;

    const badge =
        roleRaw === "EXPERT"
            ? isMentor
                ? "Expert IT • Mentor"
                : "Expert IT • Non-mentor"
            : roleRaw;

    return {
        name,
        profession,
        isMentor,
        roleLabel: roleRaw,
        avatarUrl: u?.avatarUrl || "",
        badge,
    };
}

/* ---------------- Page ---------------- */
export default function ExpertDashboard() {
    const logged = getLoggedUser();

    const [profile] = useState(() => {
        if (!logged) return DEFAULT_PROFILE;
        return mapUserToProfile(logged);
    });

    const [active, setActive] = useState("overview");
    const [notifOpen, setNotifOpen] = useState(false);

    /* stats (mock) */
    const stats = useMemo(() => {
        const activeTrainings = TRAININGS.filter((t) => t.status === "Publié").length;
        const upcomingEvents = EVENTS.length;
        const mentoringRequests = MENTORING_RESERVATIONS.filter((r) => r.status === "En attente").length;
        const unreadNotifs = NOTIFICATIONS.length;

        return [
            { id: "s1", label: "Formations actives", value: activeTrainings, tone: "teal", path: "/expert/content?tab=trainings" },
            { id: "s2", label: "Événements à venir", value: upcomingEvents, tone: "indigo", path: "/expert/content?tab=events" },
            { id: "s3", label: "Réservations en attente", value: mentoringRequests, tone: "pink", path: "/expert/requests?tab=mentorat" },
            { id: "s4", label: "Notifications", value: unreadNotifs, tone: "orange", onClick: () => setNotifOpen((v) => !v) },
        ];
    }, []);

    return (
        <div className="xd-page">
            <Header />

            <main className="xd-main">
                <div className="xd-shell">
                    {/* SIDEBAR */}
                    <aside className="xd-side">
                        <div className="xd-profile">
                            <Avatar src={profile.avatarUrl} name={profile.name} />

                            <div className="xd-name">{profile.name}</div>

                            {/* ✅ profession + mentor */}
                            <div className="xd-role">
                                {profile.profession} • {profile.isMentor ? "Mentor ✅" : "Mentor ❌"}
                            </div>

                            <div className="xd-badge">{profile.badge}</div>
                        </div>

                        <nav className="xd-nav" aria-label="Navigation dashboard">
                            {NAV.map((item) => (
                                <button
                                    key={item.id}
                                    className={`xd-navItem ${active === item.id ? "is-active" : ""}`}
                                    type="button"
                                    onClick={() => {
                                        setActive(item.id);
                                        go(item.path);
                                    }}
                                >
                  <span className="xd-navIcon" aria-hidden="true">
                    {item.icon}
                  </span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* ✅ Déconnexion vraie */}
                        <button
                            className="xd-logout"
                            type="button"
                            onClick={() => {
                                window.localStorage.removeItem("user");
                                window.sessionStorage.removeItem("user");
                                window.location.href = "/login";
                            }}
                        >
                            ⏻ Se déconnecter
                        </button>
                    </aside>

                    {/* CONTENT */}
                    <section className="xd-content">
                        <div className="xd-topbar">
                            <div>
                                <h1 className="xd-title">Tableau de Bord Expert IT</h1>
                                <div className="xd-sub">Gestion rapide : formations, événements, mentorat.</div>
                            </div>

                            <div className="xd-actions">
                                <button className="iconBtn" type="button" aria-label="Notifications" onClick={() => setNotifOpen((v) => !v)}>
                                    🔔
                                </button>

                                {notifOpen && (
                                    <div className="notifPanel" role="menu" aria-label="Notifications">
                                        <div className="notifPanel__head">
                                            <div className="notifPanel__title">Notifications</div>
                                            <button className="iconBtn iconBtn--mini" type="button" onClick={() => setNotifOpen(false)}>
                                                ✕
                                            </button>
                                        </div>

                                        <div className="notifPanel__list">
                                            {NOTIFICATIONS.map((n) => (
                                                <div className="notifItem" key={n.id}>
                                                    <div className="notifItem__top">
                                                        <div className="notifItem__t">{n.title}</div>
                                                        <div className="notifItem__time">{n.time}</div>
                                                    </div>
                                                    <div className="notifItem__txt">{n.text}</div>
                                                    <button className="btn btn--teal btn--mini" type="button" onClick={() => go(n.targetPath)}>
                                                        Voir →
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="xd-stats">
                            {stats.map((s) => (
                                <button
                                    key={s.id}
                                    className={`stat stat--${s.tone} stat--click`}
                                    type="button"
                                    onClick={() => (s.onClick ? s.onClick() : go(s.path))}
                                >
                                    <div className="stat__value">{s.value}</div>
                                    <div className="stat__label">{s.label}</div>
                                    <div className="stat__hint">Cliquer pour ouvrir →</div>
                                </button>
                            ))}
                        </div>

                        {/* 3 blocs */}
                        <div className="xd-mid">
                            {/* Formations */}
                            <button className="card card--click" type="button" onClick={() => go("/expert/content?tab=trainings")}>
                                <div className="card__head">
                                    <div className="card__title">Formations</div>
                                    <span className="card__meta">Créer / gérer / voir inscrites</span>
                                </div>

                                <div className="miniList">
                                    {TRAININGS.slice(0, 3).map((t) => (
                                        <div className="miniRow" key={t.id}>
                                            <div className="miniRow__main">
                                                <div className="miniRow__title">{t.title}</div>
                                            </div>
                                            <StatusPill value={t.status} />
                                        </div>
                                    ))}
                                </div>

                                <div className="card__foot">
                                    <span className="linkLike">Ouvrir Formations →</span>
                                </div>
                            </button>

                            {/* Événements */}
                            <button className="card card--c--click card--click" type="button" onClick={() => go("/expert/content?tab=events")}>
                                <div className="card__head">
                                    <div className="card__title">Événements</div>
                                    <span className="card__meta">Créer / gérer / voir inscrites</span>
                                </div>

                                <div className="miniList">
                                    {EVENTS.slice(0, 3).map((e) => (
                                        <div className="miniRow" key={e.id}>
                                            <div className="miniRow__main">
                                                <div className="miniRow__title">
                                                    {e.type} • {e.title}
                                                </div>
                                                <div className="miniRow__meta">{e.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="card__foot">
                                    <span className="linkLike">Ouvrir Événements →</span>
                                </div>
                            </button>

                            {/* Mentorat */}
                            <button className="card card--click" type="button" onClick={() => go("/expert/requests?tab=mentorat")}>
                                <div className="card__head">
                                    <div className="card__title">Mentorat</div>
                                    <span className="card__meta">Réservations / demandes</span>
                                </div>

                                <div className="miniList">
                                    {MENTORING_RESERVATIONS.slice(0, 3).map((m) => (
                                        <div className="miniRow" key={m.id}>
                                            <div className="miniRow__main">
                                                <div className="miniRow__title">
                                                    {m.girl} <span className="miniRow__tag">{m.topic}</span>
                                                </div>
                                                <div className="miniRow__meta">{m.when}</div>
                                            </div>
                                            <StatusPill value={m.status} />
                                        </div>
                                    ))}
                                </div>

                                <div className="card__foot">
                                    <span className="linkLike">Ouvrir Réservations →</span>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
