import _T from '../i18n/i18n';

export default {
  "construction_ponctuelle-Croix": {
    get title() { return _T('place:croix:title'); },
    get info() { return _T('place:croix:info'); },
    "actions": [
      [
        {
          "type": "info",
          get desc() { return _T('place:croix:0:0:desc'); },
          get action() { return _T('place:croix:0:0:action'); }
        },
        {
          "type": "drink",
          get desc() { return _T('place:croix:0:1:desc'); },
          get action() { return _T('place:croix:0:1:action'); }
        },
        {
          "type": "food",
          get title() { return _T('place:croix:0:2:title'); },
          "what": "apple",
          get desc() { return _T('place:croix:0:2:desc'); },
          get action() { return _T('place:croix:0:2:action'); }
        },
        {
          "type": "info",
          get desc() { return _T('place:croix:0:3:desc'); },
          get action() { return _T('place:croix:0:3:action'); }
        }
      ]
    ]
  },
  "detail_hydrographique-Fontaine": {
    get title() { return _T('place:fontaine:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:fontaine:0:0:desc'); },
          get action() { return _T('place:fontaine:0:0:action'); }
        }
      ]
    ]
  },
  "detail_hydrographique-Citerne": {
    get title() { return _T('place:citerne:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:citerne:0:0:desc'); },
          get action() { return _T('place:citerne:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:citerne:0:1:desc'); }
        }
      ]
    ]
  },
  "detail_hydrographique-Source captée": {
    get title() { return _T('place:sourcecap:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:sourcecap:0:0:desc'); },
          get action() { return _T('place:sourcecap:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:sourcecap:0:1:desc'); }
        }
      ]
    ]
  },
  "detail_hydrographique-Source": {
    get title() { return _T('place:source:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:source:0:0:desc'); },
          get action() { return _T('place:source:0:0:action'); }
        }
      ]
    ]
  },
  "detail_hydrographique-Lavoir": {
    get title() { return _T('place:lavoir:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:lavoir:0:0:desc'); },
          get action() { return _T('place:lavoir:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:lavoir:0:1:desc'); }
        }
      ]
    ]
  },
  "cimetiere": {
    "search": /^cimetiere-/,
    get title() { return _T('place:cimetiere:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:cimetiere:0:0:desc'); },
          get action() { return _T('place:cimetiere:0:0:action'); }
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Camping": {
    get title() { return _T('place:camping:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:camping:0:0:desc'); },
          get action() { return _T('place:camping:0:0:action'); }
        }
      ],
      [
        {
          "type": "object",
          "object": "bottle",
          get title() { return _T('place:camping:1:0:title'); },
          get desc() { return _T('place:camping:1:0:desc'); },
          get action() { return _T('place:camping:1:0:action'); }
        },
        {
          "type": "food",
          get title() { return _T('place:camping:1:1:title'); },
          "what": "bar",
          get desc() { return _T('place:camping:1:1:desc'); },
          get action() { return _T('place:camping:1:1:action'); }
        },
        {
          "type": "object",
          "object": "shoes",
          get desc() { return _T('place:camping:1:2:desc'); },
          get action() { return _T('place:camping:1:2:action'); },
          get ok() { return _T('place:camping:1:2:ok'); },
          get nok() { return [_T('place:camping:1:2:nok0'), _T('place:camping:1:2:nok1')]; }
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Centre équestre": {
    get title() { return _T('place:equestre:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:equestre:0:0:desc'); },
          get action() { return _T('place:equestre:0:0:action'); }
        },
        {
          "type": "object",
          "object": "bottle",
          get title() { return _T('place:equestre:0:1:title'); },
          get desc() { return _T('place:equestre:0:1:desc'); },
          get action() { return _T('place:equestre:0:1:action'); }
        },
        {
          "type": "food",
          get title() { return _T('place:equestre:0:2:title'); },
          "what": "apple",
          get desc() { return _T('place:equestre:0:2:desc'); },
          get action() { return _T('place:equestre:0:2:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:equestre:0:3:desc'); }
        }
      ]
    ]
  },
  "construction_lineaire-Ruines": {
    get title() { return _T('place:ruines:title'); },
    "actions": [
      [
        {
          "type": "rest",
          get desc() { return _T('place:ruines:0:0:desc'); },
          get action() { return _T('place:ruines:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:ruines:0:1:desc'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:ruines:0:2:desc'); }
        }
      ]
    ]
  },
  "detail_orographique-grotte": {
    get title() { return _T('place:grotte:title'); },
    "actions": [
      [
        {
          "type": "rest",
          get desc() { return _T('place:grotte:0:0:desc'); },
          get action() { return _T('place:grotte:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:grotte:0:1:desc'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:grotte:0:2:desc'); }
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Refuge": {
    get title() { return _T('place:refuge:title'); },
    "actions": [
      [
        {
          "type": "rest",
          get desc() { return _T('place:refuge:0:0:desc'); },
          get action() { return _T('place:refuge:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:refuge:0:1:desc'); }
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Mégalithe": {
    get title() { return _T('place:megalith:title'); },
    "actions": [
      [
        {
          "type": "rest",
          get desc() { return _T('place:megalith:0:0:desc'); },
          get action() { return _T('place:megalith:0:0:action'); }
        },
        {
          "type": "info",
          get desc() { return _T('place:megalith:0:1:desc'); },
          get action() { return _T('place:megalith:0:1:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:megalith:0:2:desc'); }
        }
      ]
    ]
  },
  "batiment-Tribune": {
    get title() { return _T('place:tribune:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:tribune:0:0:desc'); },
          get action() { return _T('place:tribune:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:tribune:0:1:desc'); }
        }
      ]
    ]
  },
  "batiment-Chapelle": {
    get title() { return _T('place:chapelle:title'); },
    "actions": [
      [
        {
          "type": "rest",
          get desc() { return _T('place:chapelle:0:0:desc'); },
          get action() { return _T('place:chapelle:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:chapelle:0:1:desc'); }
        }
      ]
    ]
  },
  "batiment-Fort, blockhaus, casemate": {
    get title() { return _T('place:fort:title'); },
    "actions": [
      [
        {
          "type": "rest",
          get desc() { return _T('place:fort:0:0:desc'); },
          get action() { return _T('place:fort:0:0:action'); }
        }
      ]
    ]
  },
  "batiment-Serre": {
    get title() { return _T('place:serre:title'); },
    "actions": [
      [
        {
          "type": "food",
          get title() { return _T('place:serre:0:0:title'); },
          "what": "fruit",
          get desc() { return _T('place:serre:0:0:desc'); },
          get action() { return _T('place:serre:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:serre:0:1:desc'); }
        }
      ],
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:serre:1:0:desc'); },
          get action() { return _T('place:serre:1:0:action'); }
        }
      ]
    ]
  },
  "zone_de_vegetation-Bananeraie": {
    get title() { return _T('place:bananerie:title'); },
    "actions": [
      [
        {
          "type": "food",
          get title() { return _T('place:bananerie:0:0:title'); },
          "what": "banana",
          get desc() { return _T('place:bananerie:0:0:desc'); },
          get action() { return _T('place:bananerie:0:0:action'); }
        }
      ],
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:bananerie:1:0:desc'); },
          get action() { return _T('place:bananerie:1:0:action'); }
        }
      ]
    ]
  },
  "zone_de_vegetation-Verger": {
    get title() { return _T('place:verger:title'); },
    "actions": [
      [
        {
          "type": "food",
          get title() { return _T('place:verger:0:0:title'); },
          "what": "fruit",
          get desc() { return _T('place:verger:0:0:desc'); },
          get action() { return _T('place:verger:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:verger:0:1:desc'); }
        }
      ]
    ]
  },
  "zone_de_vegetation-Vigne": {
    get title() { return _T('place:vigne:title'); },
    "actions": [
      [
        {
          "type": "food",
          get title() { return _T('place:vigne:0:0:title'); },
          "what": "grape",
          get desc() { return _T('place:vigne:0:0:desc'); },
          get action() { return _T('place:vigne:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:vigne:0:1:desc'); }
        }
      ]
    ]
  },
  "batiment-Industriel, agricole ou commercial": {
    get title() { return _T('place:entrepot:title'); },
    get "title-Agricole"() { return _T('place:entrepot:titleAgricole'); },
    get "title-Industriel"() { return _T('place:entrepot:titleIndustriel'); },
    "actions": [
      [
        {
          "type": "object",
          "object": "bottle",
          get title() { return _T('place:entrepot:0:0:title'); },
          get desc() { return _T('place:entrepot:0:0:desc'); },
          get action() { return _T('place:entrepot:0:0:action'); }
        },
        {
          "type": "object",
          "object": "shoes",
          get desc() { return _T('place:entrepot:0:1:desc'); },
          get action() { return _T('place:entrepot:0:1:action'); },
          get ok() { return _T('place:entrepot:0:1:ok'); },
          get nok() { return [_T('place:entrepot:0:1:nok0'), _T('place:entrepot:0:1:nok1')]; }
        },
        {
          "type": "none",
          get desc() { return _T('place:entrepot:0:2:desc'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:entrepot:0:3:desc'); }
        }
      ]
    ]
  },
  "batiment-Moulin à vent": {
    get title() { return _T('place:moulin:title'); },
    "actions": [
      [
        {
          "type": "drink",
          get desc() { return _T('place:moulin:0:0:desc'); },
          get action() { return _T('place:moulin:0:0:action'); }
        },
        {
          "type": "food",
          get title() { return _T('place:moulin:0:1:title'); },
          "what": "bread",
          get desc() { return _T('place:moulin:0:1:desc'); },
          get action() { return _T('place:moulin:0:1:action'); }
        },
        {
          "type": "drink",
          get desc() { return _T('place:moulin:0:2:desc'); },
          get action() { return _T('place:moulin:0:2:action'); }
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Aire de détente": {
    get title() { return _T('place:detente:title'); },
    "actions": [
      [
        {
          "type": "object",
          "object": "bottle",
          get title() { return _T('place:detente:0:0:title'); },
          get desc() { return _T('place:detente:0:0:desc'); },
          get action() { return _T('place:detente:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:detente:0:1:desc'); }
        }
      ]
    ]
  },
  "equipement_de_transport-Parking": {
    get title() { return _T('place:parking:title'); },
    "actions": [
      [
        {
          "type": "object",
          "object": "bottle",
          get title() { return _T('place:parking:0:0:title'); },
          get desc() { return _T('place:parking:0:0:desc'); },
          get action() { return _T('place:parking:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:parking:0:1:desc'); }
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Police": {
    get title() { return _T('place:police:title'); },
    "actions": [
      [
        {
          "type": "danger",
          get desc() { return _T('place:police:0:0:desc'); },
          get action() { return _T('place:police:0:0:action'); }
        }
      ]
    ]
  },
  "gare": {
    "search": /zone_d_activite_ou_d_interet-Gare.*/,
    get title() { return _T('place:gare:title'); },
    "actions": [
      [
        {
          "type": "none",
          get desc() { return _T('place:gare:0:0:desc'); }
        }
      ]
    ]
  },
  "gare2": {
    "search": /equipement_de_transport-Gare.*/,
    get title() { return _T('place:gare:title'); },
    "actions": [
      [
        {
          "type": "none",
          get desc() { return _T('place:gare:0:0:desc'); }
        }
      ]
    ]
  },
  "lieu_dit_non_habite-Arbre": {
    get title() { return _T('place:arbre:title'); },
    get info() { return _T('place:arbre:info'); },
    "actions": [
      [
        {
          "type": "info",
          get desc() { return _T('place:arbre:0:0:desc'); },
          get action() { return _T('place:arbre:0:0:action'); }
        },
        {
          "type": "drink",
          get desc() { return _T('place:arbre:0:1:desc'); },
          get action() { return _T('place:arbre:0:1:action'); }
        },
        {
          "type": "food",
          get title() { return _T('place:arbre:0:2:title'); },
          "what": "apple",
          get desc() { return _T('place:arbre:0:2:desc'); },
          get action() { return _T('place:arbre:0:2:action'); }
        },
        {
          "type": "info",
          get desc() { return _T('place:arbre:0:3:desc'); },
          get action() { return _T('place:arbre:0:3:action'); }
        }
      ]
    ]
  },
  "detail_hydrographique-Résurgence": {
    get title() { return _T('place:resurgence:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:resurgence:0:0:desc'); },
          get action() { return _T('place:resurgence:0:0:action'); }
        }
      ]
    ]
  },
  "detail_hydrographique-Point d'eau": {
    get title() { return _T('place:pointdeau:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:pointdeau:0:0:desc'); },
          get action() { return _T('place:pointdeau:0:0:action'); }
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Point de vue": {
    get title() { return _T('place:pointvue:title'); },
    "actions": [
      [
        {
          "type": "info",
          get desc() { return _T('place:pointvue:0:0:desc'); },
          get action() { return _T('place:pointvue:0:0:action'); }
        }
      ]
    ]
  },
  "equipement_de_transport-Port": {
    get title() { return _T('place:port:title'); },
    "actions": [
      [
        {
          "type": ["water", "drink"],
          get desc() { return _T('place:port:0:0:desc'); },
          get action() { return _T('place:port:0:0:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:port:0:1:desc'); }
        }
      ],
      [
        {
          "type": "object",
          "object": "bottle",
          get desc() { return _T('place:port:1:0:desc'); },
          get action() { return _T('place:port:1:0:action'); },
          get title() { return _T('place:port:1:0:title'); }
        },
        {
          "type": "food",
          get title() { return _T('place:port:1:1:title'); },
          "what": "bar",
          get desc() { return _T('place:port:1:1:desc'); },
          get action() { return _T('place:port:1:1:action'); }
        },
        {
          "type": "none",
          get desc() { return _T('place:port:1:2:desc'); }
        }
      ]
    ]
  }
}
