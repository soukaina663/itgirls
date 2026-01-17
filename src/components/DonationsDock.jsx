import React, { useEffect, useState } from "react";

const API_BASE = (process.env.REACT_APP_API_BASE || "http://localhost:8080").replace(/\/$/, "");

async function readError(res) {
    const txt = await res.text();
    try {
        const j = txt ? JSON.parse(txt) : null;
        return j?.message || j?.error || txt || `HTTP ${res.status}`;
    } catch {
        return txt || `HTTP ${res.status}`;
    }
}

export default function DonationDock() {
    const [open, setOpen] = useState(false);
    const [okMsg, setOkMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        amount: "",
        message: "",
    });

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    function onChange(e) {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        setErrMsg("");
        setOkMsg("");
    }

    function validate() {
        if (!form.firstName.trim()) return "Prénom requis.";
        if (!form.lastName.trim()) return "Nom requis.";
        if (!form.email.trim()) return "Email requis.";
        if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Email invalide.";
        const amt = String(form.amount || "").replace(",", ".").trim();
        const n = Number(amt);
        if (!amt) return "Montant requis.";
        if (!Number.isFinite(n) || n <= 0) return "Montant invalide.";
        return "";
    }

    async function submit() {
        const v = validate();
        if (v) {
            setErrMsg(v);
            return;
        }

        const payload = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim().toLowerCase(),
            amount: String(form.amount).replace(",", ".").trim(),
            message: form.message.trim(),
        };

        const res = await fetch(`${API_BASE}/api/public/donations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const msg = await readError(res);
            setErrMsg(msg);
            return;
        }

        setOkMsg("Merci 💗 Nous vous contacterons par email très bientôt.");
        setErrMsg("");
        setForm({ firstName: "", lastName: "", email: "", amount: "", message: "" });
    }

    const styles = {
        // ✅ Dock simple (pas long), semi-transparent
        launcher: {
            position: "fixed",
            right: 18,
            bottom: 18,
            left: "auto",
            transform: "none",

            zIndex: 9992,

            width: 340, // ✅ plus court
            maxWidth: "calc(100vw - 28px)",
            height: 64,

            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(255, 228, 235, 0.70)", // ✅ transparent
            boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
            backdropFilter: "blur(10px)",

            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            cursor: "pointer",
            userSelect: "none",
            gap: 14,
        },

        // ✅ petit rond icon (optionnel) — tu peux supprimer si tu veux encore + simple
        icon: {
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "rgba(216,27,96,0.12)",
            border: "1px solid rgba(216,27,96,0.18)",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            fontWeight: 900,
            color: "#d81b60",
            flex: "0 0 auto",
        },

        textWrap: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 4,
            minWidth: 0,
        },

        title: {
            margin: 0,
            fontWeight: 950,
            fontSize: 18,
            lineHeight: 1.05,
            color: "#d81b60", // ✅ rose foncé
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },

        subBottom: {
            margin: 0,
            fontWeight: 850,
            fontSize: 13,
            color: "rgba(15,23,42,0.70)",
            display: "flex",
            alignItems: "center",
            gap: 8,
        },

        heart: { color: "#d81b60" },

        overlay: {
            position: "fixed",
            inset: 0,
            zIndex: 9993,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(2px)",
            display: open ? "block" : "none",
        },

        modal: {
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9994,
            width: 520,
            maxWidth: "calc(100vw - 24px)",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
            overflow: "hidden",
            display: open ? "block" : "none",
        },

        modalHead: {
            padding: "14px 16px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, rgba(236,72,153,0.16), rgba(255,255,255,0.92))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
        },

        modalTitle: {
            margin: 0,
            fontWeight: 950,
            color: "#d81b60",
            fontSize: 18,
        },

        closeBtn: {
            border: "1px solid rgba(0,0,0,0.10)",
            background: "rgba(255,255,255,0.9)",
            borderRadius: 12,
            padding: "8px 10px",
            cursor: "pointer",
            fontWeight: 900,
        },

        body: { padding: 16 },

        grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },

        field: { display: "grid", gap: 6, marginBottom: 10 },

        label: { fontWeight: 850, fontSize: 12, color: "rgba(15,23,42,0.75)" },

        input: {
            height: 42,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            padding: "0 12px",
            outline: "none",
            fontWeight: 700,
        },

        textarea: {
            minHeight: 90,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            padding: 12,
            outline: "none",
            fontWeight: 700,
            resize: "vertical",
        },

        hint: {
            marginTop: 8,
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(15,23,42,0.65)",
        },

        error: { marginTop: 10, color: "#dc2626", fontWeight: 800, fontSize: 13 },
        ok: { marginTop: 10, color: "#0f766e", fontWeight: 900, fontSize: 13 },

        actions: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },

        btn: {
            borderRadius: 12,
            height: 42,
            padding: "0 14px",
            border: "1px solid rgba(0,0,0,0.12)",
            cursor: "pointer",
            fontWeight: 900,
            background: "rgba(248,250,252,1)",
        },

        btnPrimary: {
            background: "#d81b60",
            color: "white",
            border: "1px solid rgba(216,27,96,0.25)",
        },
    };

    return (
        <>
            {/* Dock */}
            <div style={styles.launcher} onClick={() => setOpen(true)} role="button" aria-label="Faire un don">
                <div style={styles.icon}>🎁</div>
                <div style={styles.textWrap}>
                    <p style={styles.title}>Faire un don</p>
                    <p style={styles.subBottom}>
                        Clique pour soutenir <span style={styles.heart}>❤</span>
                    </p>
                </div>
            </div>

            {/* Overlay */}
            <div
                style={styles.overlay}
                onMouseDown={(e) => {
                    if (e.target === e.currentTarget) setOpen(false);
                }}
            />

            {/* Modal */}
            <div style={styles.modal} role="dialog" aria-modal="true" aria-label="Formulaire de don">
                <div style={styles.modalHead}>
                    <h3 style={styles.modalTitle}>Faire un don</h3>
                    <button style={styles.closeBtn} onClick={() => setOpen(false)}>
                        Fermer ✕
                    </button>
                </div>

                <div style={styles.body}>
                    <div style={styles.grid2}>
                        <div style={styles.field}>
                            <label style={styles.label}>Prénom</label>
                            <input style={styles.input} name="firstName" value={form.firstName} onChange={onChange} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Nom</label>
                            <input style={styles.input} name="lastName" value={form.lastName} onChange={onChange} />
                        </div>
                    </div>

                    <div style={styles.grid2}>
                        <div style={styles.field}>
                            <label style={styles.label}>Email</label>
                            <input style={styles.input} name="email" type="email" value={form.email} onChange={onChange} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Montant (MAD)</label>
                            <input
                                style={styles.input}
                                name="amount"
                                inputMode="decimal"
                                placeholder="ex: 200"
                                value={form.amount}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Message (optionnel)</label>
                        <textarea
                            style={styles.textarea}
                            name="message"
                            value={form.message}
                            onChange={onChange}
                            placeholder="Un petit mot..."
                        />
                    </div>

                    <div style={styles.hint}>Nous vous contacterons par email pour finaliser le don.</div>

                    {errMsg ? <div style={styles.error}>{errMsg}</div> : null}
                    {okMsg ? <div style={styles.ok}>{okMsg}</div> : null}

                    <div style={styles.actions}>
                        <button style={{ ...styles.btn, ...styles.btnPrimary }} type="button" onClick={submit}>
                            Envoyer la demande
                        </button>
                        <button style={styles.btn} type="button" onClick={() => setOpen(false)}>
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
