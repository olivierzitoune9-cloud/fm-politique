"use client";

// Création de personnage : nom, origine, deux traits, idéologie sommaire, ambition, seed.
// L'avertissement validé en SPEC section 6 s'affiche avant toute chose.
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AMBITIONS,
  AVERTISSEMENT_OUVERTURE,
  LIBELLES_ORIGINE,
  ORIGINES,
  TRAITS_JOUEUR,
  type Ambition,
  type Origine,
} from "../../sim/carriere";
import { nomJoueurAleatoire } from "../../sim/personnages";
import { creerRng } from "../../sim/rng";

export interface ConfigIdee {
  graine: number;
  config: {
    nom: string;
    origine: Origine;
    traits: string[];
    ideologie: { gaucheDroite: number; ouvertFerme: number };
    ambition: Ambition;
    propositionTexte: string;
  };
}

export default function NouvellePartiePage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [origine, setOrigine] = useState<Origine>("bureau");
  const [traits, setTraits] = useState<string[]>(["travailleur"]);
  const [gd, setGd] = useState(0);
  const [of, setOf] = useState(0);
  const [ambition, setAmbition] = useState<Ambition>("elu");
  const [proposition, setProposition] = useState("");
  const [graine, setGraine] = useState(() => Math.floor(Math.random() * 100000));

  const nomDe = useMemo(() => nomJoueurAleatoire(creerRng(graine)), [graine]);

  function changerTrait(t: string) {
    setTraits((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      return [...prev, t].slice(-2);
    });
  }

  function creer() {
    const idee: ConfigIdee = {
      graine,
      config: {
        nom: nom.trim().length > 0 ? nom.trim() : nomDe,
        origine,
        traits,
        ideologie: { gaucheDroite: gd / 100, ouvertFerme: of / 100 },
        ambition,
        propositionTexte: proposition.trim(),
      },
    };
    sessionStorage.setItem("fm-politique:config", JSON.stringify(idee));
    router.push("/partie");
  }

  return (
    <div className="grille">
      <section className="carte">
        <h2>Avertissement</h2>
        <p>{AVERTISSEMENT_OUVERTURE}</p>
      </section>

      <div className="grille grille-2">
        <section className="carte">
          <h2>Ton personnage</h2>
          <label className="champ">
            <label>Nom (laisser vide pour un nom aléatoire : {nomDe})</label>
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} maxLength={60} />
          </label>
          <label className="champ">
            <label>Origine</label>
            <select value={origine} onChange={(e) => setOrigine(e.target.value as Origine)}>
              {ORIGINES.map((o) => (
                <option key={o} value={o}>
                  {LIBELLES_ORIGINE[o]}
                </option>
              ))}
            </select>
          </label>
          <div className="champ">
            <label>Deux traits (max)</label>
            <div className="rang-radio">
              {TRAITS_JOUEUR.map((t) => (
                <label key={t} className={traits.includes(t) ? "choisi" : ""}>
                  <input
                    type="checkbox"
                    checked={traits.includes(t)}
                    onChange={() => changerTrait(t)}
                    style={{ marginRight: 6 }}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div className="champ">
            <label>Idéologie, gauche droite ({gd > 20 ? "droite" : gd < -20 ? "gauche" : "centre"})</label>
            <input type="range" min={-100} max={100} value={gd} onChange={(e) => setGd(Number(e.target.value))} />
          </div>
          <div className="champ">
            <label>Idéologie, ouvert ferme ({of > 20 ? "ouvert" : of < -20 ? "fermé" : "mitoyen"})</label>
            <input type="range" min={-100} max={100} value={of} onChange={(e) => setOf(Number(e.target.value))} />
          </div>
        </section>

        <section className="carte">
          <h2>Ton ambition</h2>
          <div className="rang-radio" style={{ flexDirection: "column", alignItems: "stretch" }}>
            {AMBITIONS.map((a) => (
              <label key={a.id} className={ambition === a.id ? "choisi" : ""}>
                <input
                  type="radio"
                  name="ambition"
                  checked={ambition === a.id}
                  onChange={() => setAmbition(a.id)}
                  style={{ marginRight: 6 }}
                />
                <strong>{a.libelle}</strong>
                <div className="desc" style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                  {a.description}
                </div>
              </label>
            ))}
          </div>
          <label className="champ" style={{ marginTop: 12 }}>
            <label>Ta proposition centrale (tu la pousseras case par case)</label>
            <input
              type="text"
              value={proposition}
              onChange={(e) => setProposition(e.target.value)}
              placeholder="ex. tirage au sort d'un conseil citoyen"
              maxLength={120}
            />
          </label>
          <label className="champ">
            <label>Graine (même graine, même monde)</label>
            <input type="number" value={graine} onChange={(e) => setGraine(Number(e.target.value) || 0)} />
          </label>
          <div className="boutons">
            <button onClick={creer} type="button">
              Commencer le lundi 7 septembre 2026
            </button>
            <a className="lien-jouer secondaire-lien" href="/">
              Retour
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}