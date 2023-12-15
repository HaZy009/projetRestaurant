import connectionPromise from '../connexion.js'
//retourne le panier
export async function getOrder(id_utilisateur){
    let connection = await connectionPromise;

    let order = await connection.all(
        `SELECT * FROM commande_produit WHERE id_utilisateur = ?;`,
        [id_utilisateur]
    );
    return order;
};
//ajoute 1 a la quantite d'un item quand il est deja existant dans le panier
export async function incrItem(id_utilisateur,id_produit) {
    let connection = await connectionPromise;

    await connection.run(
        `UPDATE commande_produit
        SET quantite = quantite + 1
        WHERE id_utilisateur = ? AND id_produit = ?`,
        [id_utilisateur,id_produit]
    )
}


//ajoute un item au panier
export async function addItem(id_utilisateur,id_produit) {
    let connection = await connectionPromise;
    let result = await connection.run(
        `INSERT INTO commande_produit(id_commande, id_utilisateur, id_produit, quantite)
        VALUES(1,?,?,1);`,
        [id_utilisateur,id_produit]
    );
    return;
}
//vide le panier
export async function clearOrder(id_utilisateur){
    let connection = await connectionPromise;

    let result = await connection.run(
        `DELETE FROM commande_produit WHERE id_utilisateur = ?;`,
        [id_utilisateur]
    )
    return;
}
//reduit la quantite d'un item quand il est existant
export async function reduireQuantiteItem(id_utilisateur,id_produit) {
    let connection = await connectionPromise;

    await connection.run(
        `UPDATE commande_produit
        SET quantite = quantite - 1
        WHERE id_utilisateur = ? AND id_produit = ?`,
        [id_utilisateur,id_produit]
    )
}
//retire l'item
export async function retirerItem(id_utilisateur,id_produit){
    let connection = await connectionPromise;

    let result = await connection.run(
        `DELETE FROM commande_produit
        WHERE id_utilisateur = ? AND id_produit = ?`,
        [id_utilisateur,id_produit]
    )
    return;
}
//set le bon id commande
export async function bonIdCommande(id_commande) {
    let connection = await connectionPromise;

    await connection.run(
        `UPDATE commande_produit
        SET id_commande  = ?`,
        [id_commande]
    )
}
//join entre la table du panier actuel et notre menu
export async function joinPanierMenu(id_utilisateur){
    let connection = await connectionPromise;

    let order = await connection.all(
        `SELECT * FROM commande_produit
        INNER JOIN produit
        ON commande_produit.id_produit = produit.id_produit
        WHERE commande_produit.id_utilisateur=?;`,
        [id_utilisateur]
    );
    return order;
};
//join modifier pour notre affichage dans les detail de la page connexion
export async function beauJoinPanierMenu(id_utilisateur){
    let connection = await connectionPromise;

    let beauPanier = await connection.all(
        `SELECT produit.nom, commande_produit.quantite, produit.prix FROM commande_produit
        INNER JOIN produit
        ON commande_produit.id_produit = produit.id_produit
        WHERE commande_produit.id_utilisateur=?;`,
        [id_utilisateur]
    );
    return beauPanier;
};