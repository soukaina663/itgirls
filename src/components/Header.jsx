import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

export default function Header() {
    return (
        <header className="home-header">
            <div className="home-header__inner">
                <NavLink className="home-header__brand" to="/">
                    <img
                        src="/images/logo-igirls.png"
                        alt="IT Girls Network"
                        className="home-header__logo"
                    />
                </NavLink>

                <nav className="home-header__nav" aria-label="Navigation principale">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `home-header__link ${isActive ? "is-active" : ""}`
                        }
                    >
                        Accueil
                    </NavLink>

                    <NavLink
                        to="/formations"
                        className={({ isActive }) =>
                            `home-header__link ${isActive ? "is-active" : ""}`
                        }
                    >
                        Formations
                    </NavLink>

                    <NavLink
                        to="/evenements"
                        className={({ isActive }) =>
                            `home-header__link ${isActive ? "is-active" : ""}`
                        }
                    >
                        Événements
                    </NavLink>

                    <NavLink
                        to="/mentorat"
                        className={({ isActive }) =>
                            `home-header__link ${isActive ? "is-active" : ""}`
                        }
                    >
                        Mentorat
                    </NavLink>

                    <NavLink
                        to="/blog"
                        className={({ isActive }) =>
                            `home-header__link ${isActive ? "is-active" : ""}`
                        }
                    >
                        Blog
                    </NavLink>
                </nav>

                <div className="home-header__actions">
                    <NavLink className="home-header__signin" to="/login">
                        Se connecter
                    </NavLink>
                    <NavLink className="home-header__cta" to="/register">
                        Créer un compte
                    </NavLink>
                </div>
            </div>
        </header>
    );
}
