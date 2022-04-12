import vtMap from './vtMap'

const mapInfo = {};

/** Get info
 * @param {number} around pixel around
 * @param {ol/Coordinate} coord
 * @return {object}
 */
mapInfo.getAround = function(around=20, coord) {
  if (!coord) coord = vtMap.getView().getCenter();
  const pixel = vtMap.getPixelFromCoordinate(coord);
  const features = vtMap.getFeaturesAtPixel(pixel, { hitTolerance: around });
  if (vtMap.get('targetDiv')) {
    vtMap.get('targetDiv').style.width = vtMap.get('targetDiv').style.height = (2*around)+'px';
  } 
  return getFeaturesProp(features);
}

//
function getFeaturesProp(features) {
  const info = [];
  features.forEach(f => {
    const p = f.getProperties()
    // 
    delete p.date_creation,
    delete p.date_d_apparition,
    delete p.date_modification,
    delete p.date_de_confirmation,
    delete p.date_du_toponyme,
    delete p.date_d_apparition,
    delete p.cleabs,
    delete p.cleabs_de_l_objet,
    delete p.classe_de_l_objet,
    delete p.precision_planimetrique,
    delete p.identifiants_sources,
    delete p.statut_du_toponyme,
    delete p.identifiants_sources,
    delete p.etat_de_l_objet,
    delete p.source_du_toponyme,
    delete p.sources,
    delete p.appariement_fichiers_fonciers,
    delete p.altitude_maximale_sol,
    delete p.altitude_maximale_toit,
    delete p.altitude_minimale_sol,
    delete p.altitude_minimale_toit,
    delete p.materiaux_de_la_toiture,
    delete p.materiaux_des_murs,
    delete p.origine_du_batiment,
    delete p.precision_altimetrique,

    delete p.alias_droit,
    delete p.alias_gauche,
    delete p.identifiant_voie_1_droite;
    delete p.identifiant_voie_1_gauche;
    delete p.cpx_classement_administratif;
    delete p.cpx_gestionnaire;
    delete p.gestionnaire;
    delete p.borne_debut_droite;
    delete p.borne_debut_gauche;
    delete p.borne_fin_droite;
    delete p.borne_fin_gauche;
    delete p.code_postal_droit,
    delete p.code_postal_gauche,
    delete p.insee_commune_droite,
    delete p.insee_commune_gauche,
    delete p.itineraire_vert,
    delete p.liens_vers_route_nommee,
    delete p.matieres_dangereuses_interdites,
    delete p.nom_1_droite,
    delete p.nom_1_gauche,
    delete p.nom_2_droite,
    delete p.nom_2_gauche,
    delete p.position_par_rapport_au_sol,
    delete p.prive,
    delete p.sens_de_circulation,
    delete p.type_d_adressage_du_troncon,
    delete p.urbain,

    delete p.code_du_cours_d_eau_bdcarthage,
    delete p.code_du_pays,
    delete p.code_hydrographique,
    delete p.delimitation,
    delete p.fosse,
    delete p.liens_vers_cours_d_eau,
    delete p.mode_d_obtention_de_l_altitude,
    delete p.mode_d_obtention_des_coordonnees,
    delete p.navigabilite,
    delete p.numero_d_ordre,
    delete p.origine,
    delete p.perimetre_d_utilisation_ou_origine,
    delete p.reseau_principal_coulant,
    delete p.salinite,
    delete p.sens_de_l_ecoulement,
    delete p.statut,
    delete p.type_de_bras,

    delete p.adresse_designation_de_l_entree,
    delete p.adresse_indice_de_repetition,
    // delete p.adresse_nom_1: ""
    // delete p.adresse_nom_2: "LE BOURG"
    delete p.adresse_numero,
    delete p.code_postal,
    delete p.id_reference,
    delete p.insee_commune,
    delete p.liens_vers_adresse,
    delete p.liens_vers_batiment,
    delete p.liens_vers_enceinte,
    delete p.numero_siret,
    delete p.origine_de_la_geometrie,
    delete p.type_principal,
    delete p.types_secondaires,

    // CARTE
    delete p.niveau;
    delete p.territoire;
    delete p.txt_typo;
    delete p.terminaison;
    delete p.alti_sol;
    delete p.rotation;
    delete p.fictif;
    delete p.rond_point;
    delete p.isole;
    delete p.sens_circu;
    info.push(p)
  })
  return info;
}

/** Get features at pixel
 * @param {ol/Pixel} [pixel] pixel coords, default the map view center
 * @returns {object}
 */
mapInfo.getFeaturesAtPixel = function(pixel) {
  if (pixel) {
    pixel = vtMap.getPixelFromCoordinate(vtMap.getView().getCenter());
  }
  const features = vtMap.getFeaturesAtPixel(pixel);
  return getFeaturesProp(features);
}

/** Show info on click
 */
vtMap.on('click', e => {
  const info = getFeaturesProp(vtMap.getFeaturesAtPixel(e.pixel));
  if (info.length) {
    console.clear();
    console.table(info);
  }
})

export default mapInfo
