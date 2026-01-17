import React from "react";
import "./footer.css";

export default function Footer() {
    return (
        <footer className="site-footer" aria-label="Footer">
            <section className="site-footer__contact" aria-label="Contact">
                <div className="site-footer__inner">
                    <h2 className="site-footer__title">Contact</h2>
                    <p className="site-footer__desc">
                        Besoin d’infos, partenariat ou adhésion ? Contacte l’association :
                    </p>

                    <div className="site-footer__grid">
                        <div className="site-footer__card">
                            <div className="site-footer__label">Téléphone</div>
                            <a className="site-footer__value" href="tel:+212600000000">
                                +212 6 00 00 00 00
                            </a>
                        </div>

                        <div className="site-footer__card">
                            <div className="site-footer__label">E-mail</div>
                            <a className="site-footer__value" href="mailto:contact@itgirls.ma">
                                contact@itgirls.ma
                            </a>
                        </div>

                        <div className="site-footer__card">
                            <div className="site-footer__label">Adresse</div>
                            <div className="site-footer__value">
                                Casablanca, Maroc (adresse complète à préciser)
                            </div>
                        </div>
                    </div>

                    <div className="site-footer__bottom">
                        <div className="site-footer__copy">
                            © {new Date().getFullYear()} IT Girls Network
                        </div>


                    </div>
                </div>
            </section>
        </footer>
    );
}
