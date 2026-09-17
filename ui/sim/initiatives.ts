// C6 : une initiative au plus par semaine, indépendante du joueur.
// Hypothèse de gameplay (2026-09-17), pas une causalité empirique calibrée :
// proximité professionnelle et organisationnelle favorise le contact ; ambition et
// susceptibilité favorisent la rivalité, empathie et loyauté la coopération.
import { enregistrerEvenement, idOrganisation, type MondeSocial } from "./monde-social.js";
import { nomComplet, type Personnage } from "./personnages.js";
import type { Rng } from "./rng.js";

export function avancerInitiatives(ms: MondeSocial, personnages: Personnage[], tick: number, rng: Rng): MondeSocial {
  const presents = personnages.filter((p) => ms.noeuds.some((n) => n.id === p.id));
  if (presents.length < 2) return ms;
  const a = presents[Math.floor(rng.next() * presents.length)];
  const candidats = presents.filter((p) => p.id !== a.id);
  const poids = candidats.map((b) => 1 + Number(a.organisation === b.organisation) * 3
    + Number(a.metier === b.metier) * 2
    + Number(ms.liens.some((l) => (l.de === a.id && l.vers === b.id) || (l.vers === a.id && l.de === b.id))) * 2);
  let tirage = rng.next() * poids.reduce((s, p) => s + p, 0);
  const b = candidats[poids.findIndex((p) => (tirage -= p) < 0)] ?? candidats[candidats.length - 1];
  const proximite = a.organisation === b.organisation || a.metier === b.metier;
  const probabilite = 0.2 + (proximite ? 0.15 : 0) + (a.traits.includes("ambitieux") ? 0.15 : 0)
    - (a.traits.includes("discret") ? 0.1 : 0);
  if (rng.next() >= probabilite) return ms;
  const rivaliteOrg = ms.liens.some((l) => l.type === "rivalite" &&
    ((l.de === idOrganisation(a.organisation) && l.vers === idOrganisation(b.organisation)) ||
     (l.vers === idOrganisation(a.organisation) && l.de === idOrganisation(b.organisation))));
  const tension = 0.2 + Number(rivaliteOrg) * 0.35 + Number(a.traits.includes("susceptible")) * 0.2
    + Number(a.traits.includes("ambitieux") && b.traits.includes("ambitieux")) * 0.2
    - Number(a.traits.includes("empathique") || b.traits.includes("loyal")) * 0.15;
  const type = rng.next() < tension ? "rivalite" : "alliance";
  const memePaire = (l: MondeSocial["liens"][number]) =>
    (l.de === a.id && l.vers === b.id) || (l.de === b.id && l.vers === a.id);
  const ancien = ms.liens.find((l) => memePaire(l) && l.type === type);
  const force = Math.min(1, (ancien?.force ?? 0) + 0.08 + a.expertise * 0.04);
  let suivant: MondeSocial = { ...ms, liens: [
    ...ms.liens.filter((l) => !(memePaire(l) && l.type === type)).map((l) =>
      memePaire(l) && (l.type === "alliance" || l.type === "rivalite") ? { ...l, force: Math.max(0, l.force - 0.08) } : l),
    { de: a.id, vers: b.id, type, force },
  ] };
  const texte = `${nomComplet(a)} ${type === "alliance" ? "noue une coopération avec" : "entre en concurrence avec"} ${nomComplet(b)}. Contexte : ${rivaliteOrg ? "organisations rivales" : proximite ? "proximité professionnelle" : "prise de contact"} ; lien ${type} renforcé de ${(force - (ancien?.force ?? 0)).toFixed(2)}.`;
  for (const p of [a, b]) suivant = enregistrerEvenement(suivant, { tick, noeudId: p.id, type: "initiative-autonome", texte });
  return suivant;
}
