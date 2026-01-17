import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import "./mentorat.css";
import Footer from "../components/Footer";

const MOCK_MENTORS = [
    {
        id: 1,
        verified: true,
        name: "Salma EL AMRANI",
        title: "Développeuse Full Stack • Casablanca",
        tags: ["React", "Node.js", "SQL", "Git", "Mentorat carrière"],
        bio:
            "J’accompagne les étudiantes à structurer leurs projets, préparer leurs entretiens et gagner en confiance.",
    },
    {
        id: 2,
        verified: true,
        name: "Nadia BENALI",
        title: "Data Analyst • Rabat",
        tags: ["Python", "Data", "Power BI", "SQL", "CV & LinkedIn"],
        bio:
            "On travaille ensemble tes bases data, ton portfolio et une stratégie simple pour décrocher un stage/emploi.",
    },
    {
        id: 3,
        verified: false,
        name: "Imane AIT SAID",
        title: "Ingénieure Réseaux • Tanger",
        tags: ["Réseaux", "CCNA", "Cyber (bases)", "FTTH", "Projets"],
        bio:
            "Je t’aide à comprendre les fondamentaux réseaux, réviser CCNA et construire un mini-lab pour apprendre vite.",
    },
    {
        id: 4,
        verified: true,
        name: "Hajar ZOUINE",
        title: "DevOps • Marrakech",
        tags: ["Linux", "Docker", "CI/CD", "Cloud", "Bonnes pratiques"],
        bio:
            "Objectif : te rendre autonome. On fait des exercices concrets et une feuille de route adaptée à ton niveau.",
    },
];

const PROGRAMS = [
    {
        title: "CV & Candidature",
        desc:
            "Optimise ton CV, LinkedIn et tes candidatures. On cible les offres et on améliore ton pitch.",
    },
    {
        title: "Méthodes d’apprentissage",
        desc:
            "Organisation, planning, ressources et routines : avance plus vite sans te perdre.",
    },
    {
        title: "Orientation",
        desc:
            "Clarifie ton objectif (dev, data, cyber, cloud…). On construit un parcours réaliste étape par étape.",
    },
    {
        title: "Portfolio & Projets",
        desc:
            "Construis 1 à 3 projets crédibles (GitHub, démo, README) pour te démarquer.",
    },
    {
        title: "Préparation entretiens",
        desc:
            "Questions fréquentes, tests techniques, simulation d’entretien et feedback concret.",
    },
    {
        title: "Conseils, opportunités d’emploi et de stages",
        desc:
            "Stratégie de recherche, networking utile, messages pro et suivi des candidatures.",
    },
];


const TESTIMONIALS = [
    {
        id: 1,
        name: "Sara",
        text:
            "J’ai enfin compris quoi apprendre et dans quel ordre. Le mentorat m’a aidée à reprendre confiance.",
        stars: 5,
    },
    {
        id: 2,
        name: "Khadija",
        text:
            "On a refait mon CV + LinkedIn et préparé un entretien. Résultat : stage trouvé en 2 semaines.",
        stars: 5,
    },
    {
        id: 3,
        name: "Meryem",
        text:
            "Très concret. On a travaillé un mini-projet React et maintenant je sais expliquer mon code.",
        stars: 5,
    },
];

function Stars({ n = 5 }) {
    return <div className="mStars">{"★".repeat(n)}</div>;
}

function MentorCard({ m, compact = false, onReserve }) {
    return (
        <div className={`mMentorCard ${compact ? "mMentorCard--compact" : ""}`}>
            <div className="mMentorTop">
                <div className="mAvatar" aria-hidden="true">
                    <span>👤</span>
                </div>

                <div className="mMentorHead">
                    <div className="mMentorLine1">
                        {m.verified ? <span className="mVerified">✓ Mentor vérifié</span> : null}
                    </div>
                    <div className="mMentorName">{m.name}</div>
                    <div className="mMentorTitle">{m.title}</div>
                </div>
            </div>

            <div className="mTagRow">
                {m.tags.map((t) => (
                    <span key={t} className="mTag">
            {t}
          </span>
                ))}
            </div>

            <div className="mMentorBio">“{m.bio}”</div>

            {!compact ? (
                <button className="mBtnPrimary" type="button" onClick={onReserve}>
                    Réserver une session
                </button>
            ) : null}
        </div>
    );
}

export default function MentoratPage() {
    const [idx, setIdx] = useState(0);
    const featured = useMemo(() => MOCK_MENTORS[idx], [idx]);

    const next = () => setIdx((v) => (v + 1) % MOCK_MENTORS.length);
    const prev = () => setIdx((v) => (v - 1 + MOCK_MENTORS.length) % MOCK_MENTORS.length);

    return (
        <div className="mPage">
            <Header />

            {/* HERO plein écran */}
            <section className="mHero" aria-label="Mentorat hero">
                <div className="mHero__inner">
                    <div className="mHero__left">
                        <h1 className="mHero__title">
                            Trouvez le <span className="mAccent">mentor parfait</span>
                            <br />
                            pour votre succès
                        </h1>

                        <p className="mHero__subtitle">
                            Un coup de pouce pour tes études et ta carrière : échange avec des mentors
                            bénévoles et des pros qui partagent leur expérience.
                        </p>
                    </div>

                    <div className="mHero__right">
                        <MentorCard
                            m={featured}
                            onReserve={() => alert("Réservation (à brancher au back) ✅")}
                        />

                        <div className="mHeroNav">
                            <button className="mBtnSquare" type="button" onClick={prev} aria-label="Mentor précédent">
                                ‹
                            </button>
                            <button className="mBtnSquare" type="button" onClick={next} aria-label="Mentor suivant">
                                ›
                            </button>
                        </div>
                    </div>
                </div>

                {/* fond turquoise (sans image) */}
                <div className="mHeroBg" aria-hidden="true" />
            </section>




            {/* Comment ça marche ? (plein écran au scroll) */}
            <section className="mHow" aria-label="Comment ça marche">
                <div className="mHow__inner">
                    <div className="mPillTop">Simple et efficace</div>
                    <h2 className="mHow__title">Comment ça marche ?</h2>
                    <p className="mHow__subtitle">
                        En trois étapes simples, connectez-vous avec le mentor idéal pour atteindre vos objectifs.
                    </p>

                    <div className="mSteps">
                        <div className="mStep">
                            <div className="mStepNum">1</div>
                            <h3 className="mStepTitle">Créez votre profil</h3>
                            <p className="mStepText">
                                Inscrivez-vous et partagez vos objectifs, compétences à développer et disponibilités.
                            </p>
                        </div>

                        <div className="mStep">
                            <div className="mStepNum">2</div>
                            <h3 className="mStepTitle">Trouvez votre mentor</h3>
                            <p className="mStepText">
                                Parcourez les profils de nos mentors et choisissez celui qui correspond à vos besoins.
                            </p>
                        </div>

                        <div className="mStep">
                            <div className="mStepNum">3</div>
                            <h3 className="mStepTitle">Commencez votre parcours</h3>
                            <p className="mStepText">
                                Planifiez votre première session et lancez-vous dans un apprentissage personnalisé.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programmes */}
            <section className="mSection mSection--soft">
                <div className="mSection__inner">
                    <header className="mSection__header">
                        <h2 className="mSection__title">Nos programmes</h2>
                        <p className="mSection__sub">
                            Un accompagnement personnalisé pour booster ton parcours académique et pro.
                        </p>
                    </header>

                    <div className="mProgramsGrid">
                        {PROGRAMS.map((p) => (
                            <div key={p.title} className="mProgramCard">
                                <div className="mProgramTitle">{p.title}</div>
                                <div className="mProgramDesc">{p.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Témoignages */}
            <section className="mTestimonials">
                <div className="mTestimonials__inner">
                    <div className="mPillTop">Témoignages</div>
                    <h2 className="mTestimonials__title">Ce que disent nos mentorées</h2>
                    <p className="mTestimonials__sub">
                        Des retours réels (à connecter à ta base plus tard).
                    </p>

                    <div className="mTestGrid">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.id} className="mTestCard">
                                <Stars n={t.stars} />
                                <div className="mTestText">“{t.text}”</div>
                                <div className="mTestUser">
                                    <div className="mTestAvatar">👤</div>
                                    <div>
                                        <div className="mTestName">{t.name}</div>
                                        <div className="mTestMeta">Mentorée IT Girls</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />

        </div>
    );
}
