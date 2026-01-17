import React, { useEffect, useMemo, useState } from "react";
import "./girlDashboard.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
    fetchGirlDashboard,
    postGeneralFeedback,
    postMentoratFeedback,
    fetchConversationMessages,
    sendConversationMessage,
} from "../lib/dashboardApi";

// ✅ helper dates
function daysUntil(iso) {
    if (!iso) return null;
    const now = new Date();
    const d = new Date(iso);
    const diffMs = d.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function formatDateTime(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(d);
}

function Stars({ value = 0 }) {
    const v = Math.max(0, Math.min(5, Number(value || 0)));
    const full = Math.floor(v);
    const empty = 5 - full;
    return (
        <span className="gd-stars" aria-label={`${v} étoiles`}>
      {"★".repeat(full)}
            {"☆".repeat(empty)}
    </span>
    );
}

function Pill({ children, tone = "neutral" }) {
    return <span className={`gd-pill gd-pill--${tone}`}>{children}</span>;
}

function Card({ title, subtitle, right, children }) {
    return (
        <div className="gd-card">
            <div className="gd-card__head">
                <div>
                    <div className="gd-card__title">{title}</div>
                    {subtitle ? <div className="gd-card__sub">{subtitle}</div> : null}
                </div>
                {right ? <div className="gd-card__right">{right}</div> : null}
            </div>
            <div className="gd-card__body">{children}</div>
        </div>
    );
}

function EmptyState({ title, hint }) {
    return (
        <div className="gd-empty">
            <div className="gd-empty__title">{title}</div>
            {hint ? <div className="gd-empty__hint">{hint}</div> : null}
        </div>
    );
}

function getLoggedUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function GirlDashboard() {
    // --- data
    const [loading, setLoading] = useState(true);
    const [dash, setDash] = useState({
        profile: { name: "Hello 👋", level: "Débutant", badge: "Girl Mode" },
        stats: { formations: 0, events: 0, messages: 0 },
        enrollments: [],
        events: [],
        conversations: [],
    });

    // --- feedback forms
    const [generalFb, setGeneralFb] = useState({ rating: 5, message: "" });
    const [mentoratFb, setMentoratFb] = useState({ rating: 5, message: "" });

    // --- messaging
    const [activeConvId, setActiveConvId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgDraft, setMsgDraft] = useState("");

    // ✅ userMeta depuis login/register
    const userMeta = useMemo(() => {
        const u = getLoggedUser();
        return {
            userId: u?.id || 1,
            authorName: u?.name || "Jeune fille",
            authorTitle: u?.level || "Débutant",
        };
    }, []);

    async function reload() {
        setLoading(true);
        try {
            const data = await fetchGirlDashboard(userMeta.userId);
            setDash(data);

            // ✅ fallback UI si API ne renvoie pas profile.level
            setDash((prev) => ({
                ...prev,
                profile: {
                    ...(prev.profile || {}),
                    name: data?.profile?.name || userMeta.authorName,
                    level: data?.profile?.level || userMeta.authorTitle,
                    badge: data?.profile?.badge || "Girl Mode",
                },
            }));

            if (!activeConvId && data.conversations?.length) {
                setActiveConvId(data.conversations[0].id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        reload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            if (!activeConvId) {
                setMessages([]);
                return;
            }
            try {
                const list = await fetchConversationMessages(activeConvId, userMeta.userId);
                setMessages(list);
            } catch (e) {
                console.error(e);
                setMessages([]);
            }
        })();
    }, [activeConvId, userMeta.userId]);

    const upcomingReminders = useMemo(() => {
        return (dash.events || [])
            .map((ev) => ({ ...ev, d: daysUntil(ev.startsAt) }))
            .filter((ev) => ev.d != null && ev.d >= 0 && ev.d <= 2)
            .sort((a, b) => a.d - b.d);
    }, [dash.events]);

    async function handleSendMessage() {
        const content = msgDraft.trim();
        if (!content || !activeConvId) return;

        const temp = {
            id: "temp-" + Date.now(),
            conversationId: activeConvId,
            senderId: userMeta.userId,
            content,
            createdAt: new Date().toISOString(),
            optimistic: true,
        };
        setMessages((prev) => [...prev, temp]);
        setMsgDraft("");

        try {
            const saved = await sendConversationMessage(activeConvId, content, userMeta.userId, userMeta.authorName)

            setMessages((prev) => prev.map((m) => (m.id === temp.id ? saved : m)));
            reload();
        } catch (e) {
            console.error(e);
            setMessages((prev) => prev.filter((m) => m.id !== temp.id));
            alert("Erreur envoi message ❌");
        }
    }

    async function handleGeneralFeedback() {
        if (!generalFb.message.trim()) return;
        try {
            await postGeneralFeedback({
                ...userMeta,
                rating: generalFb.rating,
                message: generalFb.message,
            });
            setGeneralFb({ rating: 5, message: "" });
            alert("Merci pour ton feedback 💜");
            reload();
        } catch (e) {
            console.error(e);
            alert("Erreur feedback ❌");
        }
    }

    async function handleMentoratFeedback() {
        if (!mentoratFb.message.trim()) return;
        try {
            await postMentoratFeedback({
                ...userMeta,
                rating: mentoratFb.rating,
                message: mentoratFb.message,
                mentorId: null,
            });
            setMentoratFb({ rating: 5, message: "" });
            alert("Feedback mentorat envoyé ✨");
            reload();
        } catch (e) {
            console.error(e);
            alert("Erreur feedback mentorat ❌");
        }
    }

    return (
        <div className="gd-page">
            <Header />

            <section className="gd-hero">
                <div className="gd-hero__left">
                    <div className="gd-badge">{dash.profile?.badge || "Girl Dashboard"}</div>

                    <h1 className="gd-title">
                        {loading ? "Chargement..." : `Bienvenue, ${dash.profile?.name || userMeta.authorName}`}
                    </h1>

                    <p className="gd-sub">
                        Niveau : <strong>{dash.profile?.level || userMeta.authorTitle}</strong> • Ta zone perso : événements,
                        formations, messages, feedbacks.
                    </p>

                    {upcomingReminders.length ? (
                        <div className="gd-reminder">
                            <div className="gd-reminder__title">⏰ Reminder</div>
                            <div className="gd-reminder__list">
                                {upcomingReminders.slice(0, 3).map((ev) => (
                                    <div key={ev.id} className="gd-reminder__item">
                                        <div className="gd-reminder__name">{ev.title}</div>
                                        <div className="gd-reminder__meta">
                                            <Pill tone="pink">{ev.d === 0 ? "Aujourd’hui" : `Dans ${ev.d} jour(s)`}</Pill>
                                            <span className="gd-dot">•</span>
                                            <span>{formatDateTime(ev.startsAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="gd-reminder gd-reminder--soft">
                            <div className="gd-reminder__title">✨ Aucun événement imminent</div>
                            <div className="gd-reminder__hint">
                                Quand tu t’inscris à un event, tu verras un rappel ici à J-2.
                            </div>
                        </div>
                    )}
                </div>

                <div className="gd-hero__right">
                    <div className="gd-stats">
                        <div className="gd-stat">
                            <div className="gd-stat__label">Formations</div>
                            <div className="gd-stat__value">{dash.stats?.formations ?? dash.enrollments?.length ?? 0}</div>
                        </div>
                        <div className="gd-stat">
                            <div className="gd-stat__label">Événements</div>
                            <div className="gd-stat__value">{dash.stats?.events ?? dash.events?.length ?? 0}</div>
                        </div>
                        <div className="gd-stat">
                            <div className="gd-stat__label">Messages</div>
                            <div className="gd-stat__value">{dash.stats?.messages ?? dash.conversations?.length ?? 0}</div>
                        </div>
                    </div>

                    <div className="gd-actions">
                        <button className="gd-btn gd-btn--primary" onClick={() => window.location.assign("/formations")}>
                            Explorer les formations
                        </button>
                        <button className="gd-btn gd-btn--ghost" onClick={() => window.location.assign("/mentorat")}>
                            Aller au mentorat
                        </button>
                    </div>
                </div>
            </section>

            <section className="gd-grid">
                {/* FORMATIONS */}
                <Card
                    title="Mes formations"
                    subtitle="Les formations où tu es inscrite"
                    right={<Pill tone="violet">{(dash.enrollments || []).length} inscrite(s)</Pill>}
                >
                    {(dash.enrollments || []).length ? (
                        <div className="gd-list">
                            {dash.enrollments.slice(0, 6).map((f) => (
                                <div key={f.id || f.formationId} className="gd-row">
                                    <div className="gd-row__main">
                                        <div className="gd-row__title">{f.formationTitle}</div>
                                        <div className="gd-row__meta">
                                            <Pill tone="neutral">{f.level}</Pill>
                                            <span className="gd-dot">•</span>
                                            <span className="gd-muted">{f.themeKey}</span>
                                        </div>
                                    </div>
                                    <div className="gd-row__right">
                                        <div className="gd-progress">
                                            <div
                                                className="gd-progress__bar"
                                                style={{ width: `${Math.max(0, Math.min(100, f.progressPercent ?? 0))}%` }}
                                            />
                                        </div>
                                        <div className="gd-muted">{f.progressPercent ?? 0}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState title="Aucune formation encore" hint="Inscris-toi à une formation pour la voir apparaître ici." />
                    )}
                </Card>

                {/* EVENTS */}
                <Card
                    title="Mes événements"
                    subtitle="Tes événements inscrits"
                    right={<Pill tone="pink">{(dash.events || []).length} event(s)</Pill>}
                >
                    {(dash.events || []).length ? (
                        <div className="gd-list">
                            {dash.events.slice(0, 6).map((ev) => {
                                const d = daysUntil(ev.startsAt);
                                const soon = d != null && d >= 0 && d <= 2;
                                return (
                                    <div key={ev.id} className="gd-row">
                                        <div className="gd-row__main">
                                            <div className="gd-row__title">{ev.title}</div>
                                            <div className="gd-row__meta">
                                                <span className="gd-muted">{ev.location || "En ligne"}</span>
                                                <span className="gd-dot">•</span>
                                                <span>{formatDateTime(ev.startsAt)}</span>
                                            </div>
                                        </div>
                                        <div className="gd-row__right">
                                            {soon ? <Pill tone="pink">J-{d}</Pill> : <Pill tone="neutral">À venir</Pill>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState title="Pas encore d’événement" hint="Inscris-toi à un event (workshop, talk…) pour le voir ici." />
                    )}
                </Card>

                {/* FEEDBACK GENERAL */}
                <Card title="Feedback général" subtitle="Ton avis s’affichera sur la Home (public)">
                    <div className="gd-form">
                        <div className="gd-formRow">
                            <label className="gd-label">Note</label>
                            <select
                                className="gd-select"
                                value={generalFb.rating}
                                onChange={(e) => setGeneralFb((p) => ({ ...p, rating: Number(e.target.value) }))}
                            >
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>
                                        {n} / 5
                                    </option>
                                ))}
                            </select>
                            <div className="gd-previewStars">
                                <Stars value={generalFb.rating} />
                            </div>
                        </div>

                        <textarea
                            className="gd-textarea"
                            placeholder="Ton feedback (ex: j’adore l’ambiance, les formations sont top...)"
                            value={generalFb.message}
                            onChange={(e) => setGeneralFb((p) => ({ ...p, message: e.target.value }))}
                        />

                        <div className="gd-formActions">
                            <button className="gd-btn gd-btn--primary" onClick={handleGeneralFeedback}>
                                Envoyer
                            </button>
                            <button className="gd-btn gd-btn--ghost" onClick={() => setGeneralFb({ rating: 5, message: "" })}>
                                Reset
                            </button>
                        </div>
                    </div>
                </Card>

                {/* FEEDBACK MENTORAT */}
                <Card title="Feedback mentorat" subtitle="Ton avis s’affichera dans la page mentorat">
                    <div className="gd-form">
                        <div className="gd-formRow">
                            <label className="gd-label">Note</label>
                            <select
                                className="gd-select"
                                value={mentoratFb.rating}
                                onChange={(e) => setMentoratFb((p) => ({ ...p, rating: Number(e.target.value) }))}
                            >
                                {[5, 4, 3, 2, 1].map((n) => (
                                    <option key={n} value={n}>
                                        {n} / 5
                                    </option>
                                ))}
                            </select>
                            <div className="gd-previewStars">
                                <Stars value={mentoratFb.rating} />
                            </div>
                        </div>

                        <textarea
                            className="gd-textarea"
                            placeholder="Feedback mentorat (ex: mentor super claire, très motivante...)"
                            value={mentoratFb.message}
                            onChange={(e) => setMentoratFb((p) => ({ ...p, message: e.target.value }))}
                        />

                        <div className="gd-formActions">
                            <button className="gd-btn gd-btn--primary" onClick={handleMentoratFeedback}>
                                Envoyer
                            </button>
                            <button className="gd-btn gd-btn--ghost" onClick={() => setMentoratFb({ rating: 5, message: "" })}>
                                Reset
                            </button>
                        </div>
                    </div>
                </Card>

                {/* MESSAGING */}
                <Card title="Messagerie" subtitle="Discussions mentorat, support, groupe">
                    <div className="gd-chat">
                        <div className="gd-chat__sidebar">
                            <div className="gd-chat__sidebarTitle">Conversations</div>

                            {(dash.conversations || []).length ? (
                                <div className="gd-chat__convs">
                                    {dash.conversations.map((c) => (
                                        <button
                                            key={c.id}
                                            className={`gd-chat__conv ${activeConvId === c.id ? "is-active" : ""}`}
                                            onClick={() => setActiveConvId(c.id)}
                                            type="button"
                                        >
                                            <div className="gd-chat__convTitle">{c.title}</div>
                                            <div className="gd-chat__convMeta">
                                                <Pill tone={c.type === "mentor" ? "violet" : c.type === "group" ? "pink" : "neutral"}>
                                                    {c.type}
                                                </Pill>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="Aucune conversation" hint="Tu verras ici tes conversations mentorat/support." />
                            )}
                        </div>

                        <div className="gd-chat__main">
                            <div className="gd-chat__head">
                                <div className="gd-chat__headTitle">
                                    {activeConvId
                                        ? dash.conversations?.find((c) => c.id === activeConvId)?.title || "Conversation"
                                        : "Choisis une conversation"}
                                </div>
                                <button className="gd-btn gd-btn--ghost" onClick={reload}>
                                    Rafraîchir
                                </button>
                            </div>

                            <div className="gd-chat__messages">
                                {activeConvId ? (
                                    messages.length ? (
                                        messages.map((m) => {
                                            const mine = m.senderId === userMeta.userId;
                                            return (
                                                <div key={m.id} className={`gd-msg ${mine ? "gd-msg--mine" : ""}`}>
                                                    <div className="gd-msg__bubble">
                                                        <div className="gd-msg__text">{m.content}</div>
                                                        <div className="gd-msg__time">{formatDateTime(m.createdAt)}</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <EmptyState title="Pas de messages" hint="Écris un premier message 💬" />
                                    )
                                ) : (
                                    <EmptyState title="Sélectionne une conversation" />
                                )}
                            </div>

                            <div className="gd-chat__composer">
                                <input
                                    className="gd-input"
                                    placeholder="Écrire un message..."
                                    value={msgDraft}
                                    onChange={(e) => setMsgDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSendMessage();
                                    }}
                                    disabled={!activeConvId}
                                />
                                <button className="gd-btn gd-btn--primary" onClick={handleSendMessage} disabled={!activeConvId}>
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            <Footer />
        </div>
    );
}
