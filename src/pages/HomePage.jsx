import React, { useState } from "react";
import Header from "../components/Header";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import "./home.css";
import DonationsDock from "../components/DonationsDock";
import Footer from "../components/Footer";

export default function HomePage() {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="home-page">
            <Header />

            <main className="home-main">
                {/* HERO */}
                <section className="hero" id="accueil">
                    <div className="hero__inner">
                        <div className="hero__left">
                            <h1 className="hero__title">
                                <span className="hero__titleLine">Rejoins notre communauté!</span>
                                <span className="hero__titleAccent">Moroccan IT Girls</span>
                            </h1>
                        </div>

                        <div className="hero__right" aria-label="Image">
                            <div className="hero__imageWrap">
                                <img
                                    className="hero__image"
                                    src="/images/homepage-img.png"
                                    alt="Communauté IT Girls"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-miniBlock" aria-label="Académie professionnelle">
                    <div className="home-miniBlock__inner">
                        <div className="home-miniBlock__kicker">RÉSEAU PROFESSIONNEL</div>

                        <h2 className="home-miniBlock__title">
                            Préparez vos étudiantes à des emplois recherchés
                        </h2>

                        <p className="home-miniBlock__desc">
                            Renforcez l’employabilité des étudiantes grâce à des formations guidées,
                            du mentorat et une communauté active.
                        </p>

                        <p className="home-miniBlock__desc">
                            Avec IT Girls Network, vous permettez à vos étudiantes de :
                        </p>

                        <ul className="home-miniBlock__list">
                            <li>Obtenir des certificats et progresser étape par étape</li>
                            <li>Acquérir les compétences attendues par les employeurs</li>
                            <li>Mettre en valeur leurs compétences via un portfolio de projets</li>
                            <li>Découvrir des opportunités (événements, compétitions, mentorat)</li>
                        </ul>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="features" id="formations">
                    <h2 className="features__title">
                        Élargis tes compétences tech avec IT Girls Network
                    </h2>

                    <div className="features__grid">
                        <a className="f-card" href="/formations">
                            <div className="f-icon">🎓</div>
                            <h3 className="f-title">Apprends & Forme-toi</h3>
                            <p className="f-text">
                                Accède à des cours en ligne gratuits pour débutantes et avancées.
                            </p>
                            <span className="f-link">Voir les formations →</span>
                        </a>

                        <a className="f-card" href="/mentorat" id="mentorat">
                            <div className="f-icon">💬</div>
                            <h3 className="f-title">Échange & Reseaute</h3>
                            <p className="f-text">
                                Rejoins nos discussions, forums et séances de coaching en groupe.
                            </p>
                            <span className="f-link">Explorer le mentorat →</span>
                        </a>

                        <a className="f-card" href="/evenements" id="evenements">
                            <div className="f-icon">🏆</div>
                            <h3 className="f-title">Participe & Gagne</h3>
                            <p className="f-text">
                                Engage-toi dans nos hackathons, challenges et événements exclusifs.
                            </p>
                            <span className="f-link">Découvrir les événements →</span>
                        </a>
                    </div>
                </section>

                {/* THEMES */}
                <section className="home-themes" aria-label="Les thématiques">
                    <div className="home-themes__inner">
                        <header className="home-themes__header">
                            <h2 className="home-themes__title">LES THÉMATIQUES</h2>
                            <p className="home-themes__subtitle">
                                Sélectionnez la catégorie qui vous intéresse et découvrez les formations disponibles.
                            </p>
                        </header>

                        <div className="home-themes__grid">
                            <a className="theme" href="/formations" aria-label="Développement & Programmation">
                <span className="theme__icon" aria-hidden="true">
                  <img
                      className="theme__img"
                      src="/images/themes/dev.png"
                      alt=""
                      loading="lazy"
                      decoding="async"
                  />
                </span>
                                <span className="theme__label">Développement &amp; Programmation</span>
                            </a>

                            <a className="theme" href="/formations" aria-label="Cybersécurité">
                <span className="theme__icon" aria-hidden="true">
                  <img
                      className="theme__img"
                      src="/images/themes/cyber.png"
                      alt=""
                      loading="lazy"
                      decoding="async"
                  />
                </span>
                                <span className="theme__label">Cybersécurité</span>
                            </a>

                            <a className="theme" href="/formations" aria-label="Réseaux & Télécoms">
                <span className="theme__icon" aria-hidden="true">
                  <img
                      className="theme__img"
                      src="/images/themes/reseaux.png"
                      alt=""
                      loading="lazy"
                      decoding="async"
                  />
                </span>
                                <span className="theme__label">Réseaux &amp; Télécoms</span>
                            </a>

                            <a className="theme" href="/formations" aria-label="Big Data">
                <span className="theme__icon" aria-hidden="true">
                  <img
                      className="theme__img"
                      src="/images/themes/Data.png"
                      alt=""
                      loading="lazy"
                      decoding="async"
                  />
                </span>
                                <span className="theme__label">Big Data</span>
                            </a>

                            <a className="theme" href="/formations" aria-label="Intelligence Artificielle">
                <span className="theme__icon" aria-hidden="true">
                  <img
                      className="theme__img"
                      src="/images/themes/AI.png"
                      alt=""
                      loading="lazy"
                      decoding="async"
                  />
                </span>
                                <span className="theme__label">Intelligence Artificielle</span>
                            </a>

                            <a className="theme" href="/formations" aria-label="Cloud & DevOps">
                <span className="theme__icon" aria-hidden="true">
                  <img
                      className="theme__img"
                      src="/images/themes/cloud.png"
                      alt=""
                      loading="lazy"
                      decoding="async"
                  />
                </span>
                                <span className="theme__label">Cloud &amp; DevOps</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS (inchangé) */}
                <section className="testimonials">
                    <TestimonialsCarousel />
                </section>

                {/* CTA FOOTER */}
                <section className="cta">
                    <div className="cta__box cta__box--anim">
                        <h2 className="cta__title">Prête à lancer ta carrière en tech?</h2>
                    </div>
                </section>
            </main>

            {/* ✅ Dock réseau à droite (peek + open) */}
            <DonationsDock onSelectUser={setSelectedUser} />

            <Footer />
        </div>
    );
}
