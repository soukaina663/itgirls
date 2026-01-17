import React, { useMemo, useState } from "react";
import "./register.css";
import { registerWithEmail } from "../lib/authService";

const ROLES = [
    { key: "student", label: "Etudiante" },
    { key: "expert", label: "Expert en IT" },
];

const EDUCATION_LEVELS = [
    { value: "lyceenne", label: "Lycéenne" },
    { value: "bac2", label: "Bac+2" },
    { value: "bac3", label: "Bac+3" },
    { value: "master", label: "Master" },
    { value: "autre", label: "Autre" },
];

function mapEducationToLevel(educationLevel) {
    switch (educationLevel) {
        case "lyceenne":
            return "Débutant";
        case "bac2":
        case "bac3":
            return "Intermédiaire";
        case "master":
            return "Avancé";
        default:
            return "Débutant";
    }
}

export default function RegisterPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profession: "",
        password: "",
        confirmPassword: "",
        linkedinUrl: "",
        educationLevel: "",
        specialty: "",
        role: "student",
        parcours: "",
        cvFile: null,

        // ✅ NEW
        isMentor: false,

        acceptTerms: false,
    });

    const [errors, setErrors] = useState({});
    const [authError, setAuthError] = useState("");

    const passwordMismatch = useMemo(() => {
        return form.confirmPassword && form.password !== form.confirmPassword;
    }, [form.password, form.confirmPassword]);

    function onChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        setErrors((p) => ({ ...p, [name]: undefined }));
        setAuthError("");
    }

    function onFileChange(e) {
        const file = e.target.files?.[0] || null;
        setForm((p) => ({ ...p, cvFile: file }));
        setErrors((p) => ({ ...p, cvFile: undefined }));
        setAuthError("");
    }

    function setRole(roleKey) {
        setForm((p) => ({
            ...p,
            role: roleKey,
            ...(roleKey === "expert" ? { educationLevel: "", specialty: "" } : {}),
            ...(roleKey !== "expert" ? { parcours: "", cvFile: null, isMentor: false } : {}),
        }));
    }

    function isPdf(file) {
        if (!file) return false;
        const nameOk = /\.pdf$/i.test(file.name || "");
        const typeOk = (file.type || "").toLowerCase() === "application/pdf";
        return typeOk || nameOk;
    }

    function validate() {
        const next = {};

        if (!form.firstName.trim()) next.firstName = "Prénom requis.";
        if (!form.lastName.trim()) next.lastName = "Nom requis.";

        if (!form.email.trim()) next.email = "Email requis.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Email invalide.";

        // profession tu peux le garder required (comme tu as déjà)
        if (!form.profession.trim()) next.profession = "Email/activité pro requis.";

        if (!form.password) next.password = "Mot de passe requis.";
        else if (form.password.length < 8) next.password = "8 caractères minimum.";

        if (!form.confirmPassword) next.confirmPassword = "Confirmation requise.";
        else if (form.password !== form.confirmPassword) next.confirmPassword = "Les mots de passe ne correspondent pas.";

        if (form.linkedinUrl.trim() && !/^https?:\/\/.+/i.test(form.linkedinUrl.trim())) {
            next.linkedinUrl = "Lien LinkedIn invalide (doit commencer par http/https).";
        }

        if (form.role === "student") {
            if (!form.educationLevel) next.educationLevel = "Niveau scolaire requis.";
            if (form.educationLevel === "autre" && !form.specialty.trim()) {
                next.specialty = "Précise ton profil (ex: UX designer, Dev web...).";
            }
        }

        if (form.role === "expert") {
            if (!form.parcours.trim()) next.parcours = "Parcours professionnel requis.";
            if (!form.cvFile) next.cvFile = "CV requis (PDF).";
            else if (!isPdf(form.cvFile)) next.cvFile = "Le CV doit être en format PDF.";
            // mentor: pas obligatoire (optionnel)
        }

        if (!form.acceptTerms) next.acceptTerms = "Vous devez accepter les conditions.";

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setAuthError("");
        try {
            await registerWithEmail({
                email: form.email,
                password: form.password,
                firstName: form.firstName,
                lastName: form.lastName,
                role: form.role,

                // ✅ GIRL: on envoie le niveau scolaire dans "level"
                educationLevel: form.role === "student" ? form.educationLevel : "",

                // ✅ EXPERT: parcours -> profession (dans authService)
                parcours: form.role === "expert" ? form.parcours : "",

                // ✅ EXPERT: mentor
                isMentor: form.role === "expert" ? form.isMentor : false,

                // ✅ EXPERT: cv
                cvFileName: form.role === "expert" && form.cvFile ? form.cvFile.name : "",
            });

            window.location.href = "/";
        } catch (err) {
            setAuthError(err?.message || "Inscription impossible. Vérifie tes informations.");
            console.error(err);
        }
    }


    return (
        <div className="reg-page">
            <div className="reg-shell">
                <aside className="reg-illustration" aria-label="Illustration">
                    <div className="reg-illustration__pane">
                        <img
                            className="reg-illustration__img"
                            src={`${process.env.PUBLIC_URL}/images/logo-igirls.png`}
                            alt="Logo IT Girls Network"
                        />
                    </div>
                </aside>

                <main className="reg-right">
                    <section className="reg-card" aria-label="Inscription">
                        <header className="reg-card__header">
                            <h1 className="reg-card__title">Créer votre compte professionnel</h1>
                        </header>

                        <form className="reg-form" onSubmit={onSubmit} noValidate>
                            <div className="grid-2">
                                <Field label="Prénom" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} />
                                <Field label="Nom" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} />
                            </div>

                            <div className="grid-2">
                                <Field label="Adresse e-mail" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
                                <Field label="Email professionnel" name="profession" value={form.profession} onChange={onChange} error={errors.profession} />
                            </div>

                            <div className="grid-2">
                                <Field
                                    label="Mot de passe"
                                    name="password"
                                    type="password"
                                    placeholder="Au moins 8 caractères"
                                    value={form.password}
                                    onChange={onChange}
                                    error={errors.password}
                                />
                                <Field
                                    label="Confirmer le mot de passe"
                                    name="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={onChange}
                                    error={errors.confirmPassword}
                                    hint={passwordMismatch ? "Vérifiez votre mot de passe." : ""}
                                />
                            </div>

                            <Field
                                label="LinkedIn profile url (optionnel)"
                                name="linkedinUrl"
                                type="url"
                                placeholder="https://www.linkedin.com/in/..."
                                value={form.linkedinUrl}
                                onChange={onChange}
                                error={errors.linkedinUrl}
                            />

                            {form.role === "student" && (
                                <>
                                    <SelectField
                                        label="Niveau scolaire"
                                        name="educationLevel"
                                        value={form.educationLevel}
                                        onChange={onChange}
                                        error={errors.educationLevel}
                                        options={EDUCATION_LEVELS}
                                        placeholder="Choisir un niveau"
                                    />

                                    {form.educationLevel === "autre" && (
                                        <Field
                                            label="Ton profil (ex: UX designer, Développeuse...)"
                                            name="specialty"
                                            placeholder="Ex: UX Designer, Développeuse Web..."
                                            value={form.specialty}
                                            onChange={onChange}
                                            error={errors.specialty}
                                        />
                                    )}
                                </>
                            )}

                            <div className="reg-roleRow">
                                <div className="reg-roleRow__left">
                                    <div className="reg-roleRow__label">Je m’inscris en tant que</div>
                                    <div className="role-chips">
                                        <span className="role-chips__prefix">Role Principal :</span>
                                        {ROLES.map((r) => (
                                            <button
                                                key={r.key}
                                                type="button"
                                                className={`chip ${form.role === r.key ? "is-active" : ""}`}
                                                onClick={() => setRole(r.key)}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {form.role === "expert" && (
                                <>
                                    <Field
                                        label="Parcours professionnel"
                                        name="parcours"
                                        placeholder="Ex: Ingénieur logiciel"
                                        value={form.parcours}
                                        onChange={onChange}
                                        error={errors.parcours}
                                    />

                                    {/* ✅ NEW: Mentor checkbox */}
                                    <label className="terms" style={{ marginTop: 6 }}>
                                        <input type="checkbox" name="isMentor" checked={form.isMentor} onChange={onChange} />
                                        <span>Je souhaite être mentor</span>
                                    </label>

                                    <FileField
                                        label="Uploader votre CV (PDF)"
                                        name="cvFile"
                                        onChange={onFileChange}
                                        error={errors.cvFile}
                                        fileName={form.cvFile ? form.cvFile.name : ""}
                                    />
                                </>
                            )}

                            <label className="terms">
                                <input type="checkbox" name="acceptTerms" checked={form.acceptTerms} onChange={onChange} />
                                <span>J’accepte les conditions d’utilisation et la politique de confidentialité.</span>
                            </label>

                            {errors.acceptTerms && (
                                <div className="field__error" style={{ marginTop: "-6px" }}>
                                    {errors.acceptTerms}
                                </div>
                            )}

                            {authError ? <div className="field__error">{authError}</div> : null}

                            <button className="btn btn-primary" type="submit">
                                Créer mon compte
                            </button>

                            <p className="reg-footer">
                                Déjà inscrite ? <a href="/login">Se connecter</a>
                            </p>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}

function Field({ label, hint, error, ...props }) {
    return (
        <div className="field">
            <label className="field__label" htmlFor={props.name}>
                {label}
            </label>
            <input id={props.name} className={`field__input ${error ? "is-error" : ""}`} {...props} />
            {hint && !error && <div className="field__hint">{hint}</div>}
            {error && <div className="field__error">{error}</div>}
        </div>
    );
}

function SelectField({ label, name, value, onChange, error, options, placeholder }) {
    return (
        <div className="field">
            <label className="field__label" htmlFor={name}>
                {label}
            </label>
            <select id={name} name={name} value={value} onChange={onChange} className={`field__input ${error ? "is-error" : ""}`}>
                <option value="">{placeholder}</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
            {error && <div className="field__error">{error}</div>}
        </div>
    );
}

function FileField({ label, name, onChange, error, fileName }) {
    return (
        <div className="field">
            <label className="field__label" htmlFor={name}>
                {label}
            </label>
            <input id={name} name={name} type="file" accept="application/pdf,.pdf" onChange={onChange} className={`field__input ${error ? "is-error" : ""}`} />
            {fileName ? <div className="field__hint">Fichier: {fileName}</div> : null}
            {error && <div className="field__error">{error}</div>}
        </div>
    );
}
