// src/pages/LoginPage.jsx
import React, { useState } from "react";
import "./login.css";
import { loginWithEmail } from "../lib/authService";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState("");

    function onChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        setErrors((p) => ({ ...p, [name]: undefined }));
        setAuthError("");
    }

    function validate() {
        const next = {};
        if (!form.email.trim()) next.email = "Email requis.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Email invalide.";
        if (!form.password) next.password = "Mot de passe requis.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function redirectByRole(user) {
        const role = (user?.role || user?.user?.role || "").toString().toUpperCase();
        if (role === "EXPERT") {
            window.location.href = "/expert-dashboard";
            return;
        }
        window.location.href = "/girl-dashboard";
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setAuthError("");
        try {
            const user = await loginWithEmail(form.email, form.password, form.remember);
            redirectByRole(user);
        } catch (err) {
            console.error("LOGIN ERROR", err);
            setAuthError(err?.message || "Connexion impossible. Vérifie ton email et ton mot de passe.");
        }
    }

    return (
        <div className="login-page">
            <div className="login-shell">
                <aside className="login-left" aria-label="Présentation">
                    <div className="login-left__content">
                        <h1 className="login-left__title">Rejoins la communauté IT Girls.</h1>
                        <p className="login-left__subtitle">
                            Participe à des formations, des évènements et des compétitions <br />
                            pensées pour toi.
                        </p>

                        <ul className="login-left__bullets">
                            <li>Formations 100% gratuites</li>
                            <li>Mentorat par des experts IT</li>
                            <li>Communauté bienveillante</li>
                        </ul>

                        <div className="login-left__imageWrap">
                            <img
                                className="login-left__image"
                                src="/images/login-hero.jpg"
                                alt="Jeunes filles en train de travailler sur un ordinateur"
                            />
                        </div>
                    </div>
                </aside>

                <main className="login-right">
                    <div className="login-brand"></div>

                    <section className="login-card" aria-label="Connexion">
                        <header className="login-card__header">
                            <h2 className="login-card__title">Se connecter</h2>
                            <p className="login-card__desc">Connecte-toi pour continuer ta progression.</p>
                        </header>

                        <form className="login-form" onSubmit={onSubmit} noValidate>
                            <div className="field">
                                <label className="field__label" htmlFor="email">
                                    Adresse e-mail
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="ex: prenom.nom@email.com"
                                    value={form.email}
                                    onChange={onChange}
                                    className={`field__input ${errors.email ? "is-error" : ""}`}
                                />
                                {errors.email && <div className="field__error">{errors.email}</div>}
                            </div>

                            <div className="field">
                                <div className="field__row">
                                    <label className="field__label" htmlFor="password">
                                        Mot de passe
                                    </label>
                                    <a className="field__link" href="/forgot-password">
                                        Mot de passe oublié ?
                                    </a>
                                </div>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={onChange}
                                    className={`field__input ${errors.password ? "is-error" : ""}`}
                                />
                                {errors.password && <div className="field__error">{errors.password}</div>}
                            </div>

                            <div className="login-options">
                                <label className="checkbox">
                                    <input type="checkbox" name="remember" checked={form.remember} onChange={onChange} />
                                    <span>Se souvenir de moi</span>
                                </label>
                            </div>

                            <button className="btn btn-primary" type="submit">
                                Se connecter
                            </button>

                            {authError ? <div className="field__error">{authError}</div> : null}

                            <p className="login-footer">
                                Pas encore de compte ? <a href="/register">Créer un compte</a>
                            </p>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}
