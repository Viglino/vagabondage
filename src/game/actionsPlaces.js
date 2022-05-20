export default {
  info: {
    'construction_ponctuelle-Croix': {

    },
    'lieu_dit_non_habite-Arbre': {},
  },
  water: {
    'detail_hydrographique-Fontaine': {},
    'detail_hydrographique-Citerne': {},
    'detail_hydrographique-Source captée': {},
    'detail_hydrographique-Source': {},
    'detail_hydrographique-Résurgence': {},
    'detail_hydrographique-Point d\'eau': {},
    'detail_hydrographique-Lavoir': {},
    'cimetiere': {
      search: /^cimetiere-/,
    },
    'zone_d_activite_ou_d_interet-Camping': {},
    'zone_d_activite_ou_d_interet-Centre équestre': {},
  },
  sleeping: {
    'zone_d_activite_ou_d_interet-Mégalithe': {},
    'batiment-Chapelle': {},
    'batiment-Fort, blockhaus, casemate': {},
    'zone_d_activite_ou_d_interet-Camping': {}
  },
  eating: {
    'batiment-Serre': {},
    'zone_d_activite_ou_d_interet-Camping': {},
    'zone_de_vegetation-Bananeraie': {},
    'zone_de_vegetation-Verger': {},
    'zone_de_vegetation-Vigne': {},
  },
  objects: {
    'batiment-Industriel, agricole ou commercial': {},
    'batiment-Moulin à vent': {},
  },
  detente: {
    'zone_d_activite_ou_d_interet-Aire de détente': {},
    'equipement_de_transport-Parking': {},
  },
  danger: {
    'zone_d_activite_ou_d_interet-Police': {},
    'Gare': {
      search: /zone_d_activite_ou_d_interet-Gare.*/,
    },
    'Gare2': {
      search: /equipement_de_transport-Gare.*/,
    }
  },
  other: {
    'zone_d_activite_ou_d_interet-Espace public': {},
    'construction_ponctuelle-Eolienne': {},
  }
}
