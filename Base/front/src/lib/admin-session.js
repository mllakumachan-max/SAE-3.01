let administrateurConnecte = false;

export function definirAdminConnecte(connecte) {
  administrateurConnecte = connecte;
  document.dispatchEvent(new CustomEvent("admin:session-change", { detail: connecte }));
}

export function estAdminConnecte() {
  return administrateurConnecte;
}