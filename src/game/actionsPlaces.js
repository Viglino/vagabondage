export default {
  "construction_ponctuelle-Croix": {
    "title": "Une croix plantée sur le bord du chemin.",
    "info": "la croix",
    "actions": [
      [
        {
          "type": "info",
          "desc": "Un vieil homme est assis sous %info%.",
          "action": "Il t'indique un raccourcis."
        },
        {
          "type": "drink",
          "desc": "Un promeneur vient à passer.",
          "action": "Il te donne à boire."
        },
        {
          "type": "food",
          "title": "une pomme",
          "desc": "Une vielle femme porte des paniers plein. Elle trébuche et tu l'aides à se relever.",
          "action": "Elle te donne une pomme."
        },
        {
          "type": "info",
          "desc": "Un paysan laboure son champ non loin de là.",
          "action": "Il t'indique un raccourcis."
        }
      ]
    ]
  },
  "detail_hydrographique-Fontaine": {
    "title": "Une fontaine.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "De l'eau fraiche coule d'une fontaine.",
          "action": "Remplir une bouteille ou boire un coup."
        }
      ]
    ]
  },
  "detail_hydrographique-Citerne": {
    "title": "Une citerne.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Cette citerne est pleine !",
          "action": "Remplir une bouteille ou boire un coup"
        },
        {
          "type": "none",
          "desc": "L'eau dans cette citerne n'a pas l'air potable..."
        }
      ]
    ]
  },
  "detail_hydrographique-Source captée": {
    "title": "Une source captée.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "De l'eau coule de cette source...",
          "action": "Remplir une bouteille ou boire un coup"
        },
        {
          "type": "none",
          "desc": "Impossible d'accéder à cette sources..."
        }
      ]
    ]
  },
  "detail_hydrographique-Source": {
    "title": "Une source.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Tu entends le glou-glou caractéristique, il y a de l'eau pas loin.",
          "action": "Remplir une bouteille ou boire un coup"
        }
      ]
    ]
  },
  "detail_hydrographique-Lavoir": {
    "title": "Un lavoir.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Ce lavoir a l'air en bon état.",
          "action": "Remplir une bouteille ou boire un coup"
        },
        {
          "type": "none",
          "desc": "Un panneau indique \"eau non potable\"..."
        }
      ]
    ]
  },
  "cimetiere": {
    search: /^cimetiere-/,
    "title": "Un cimetière.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "A l'entrée du cimetière tu trouves un robinet destiné à arroser les fleur.",
          "action": "Remplir une bouteille ou boire un coup"
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Camping": {
    "title": "Un camping.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Tu trouves un robinet du côté des sanitaires du camping.",
          "action": "Remplir une bouteille ou boire un coup"
        }
      ],
      [
        {
          "type": "object",
          "object": "bottle",
          "title": "une bouteille",
          "desc": "Tu trouve une bouteille vide dans une poubelle.",
          "action": "Prendre la bouteille"
        },
        {
          "type": "food",
          "title": "une barre de céréales",
          "dec": "Quelqu'un a oublié une barre de céréale sur une chaise.",
          "action": "Prendre la barre de céréale"
        },
        {
          "type": "object",
          "object": "shoes",
          "desc": "Quelqu'un a laissé une paire de chaussure de marche près des sanitaires",
          "action": "Prendre la paire de chaussure",
          "ok": "Avec des chaussures comme cela tu marcheras bien mieux...",
          "nok": [
            "Désolé, elles ne sont pas à ta taille...",
            "Ooops, voilà son propriétaire qui revient."
          ]
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Centre équestre": {
    "title": "Un centre équestre.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Tu trouves un robinet accessible au bord sur le mur de l'écurie.",
          "action": "Remplir une bouteille ou boire un coup"
        },
        {
          "type": "object",
          "object": "bottle",
          "title": "une bouteille",
          "desc": "Tu trouve une bouteille vide dans une poubelle.",
          "action": "Prendre la bouteille"
        },
        {
          "type": "food",
          "title": "une pomme",
          "desc": "Il y a un cageot pomme déposé devant le centre.",
          "action": "Prendre une pomme discrètement"
        },
        {
          "type": "none",
          "desc": "Un cavalier te regarde avec méfiance. Il vaut mieux ne pas rester ici."
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Mégalithe": {
    "title": "Un mégalithe.",
    "actions": [
      [
        {
          "type": "rest",
          "desc": "Voilà l'endroit idéal pour se reposer un peu.",
          "action": "Se reposer"
        },
        {
          "type": "info",
          "desc": "Un vieil homme ramasse du bois près du megalithe.",
          "action": "Il t'indique un raccourcis."
        },
        {
          "type": "none",
          "desc": "Seulement quelques vielles pierres abandonnées."
        }
      ]
    ]
  },
  "batiment-Chapelle": {
    "title": "Une chapelle.",
    "actions": [
      [
        {
          "type": "rest",
          "desc": "Voilà l'endroit idéal pour se reposer un peu.",
          "action": "Se reposer"
        },
        {
          "type": "none",
          "desc": "Cette chapelle est fermée..."
        }
      ]
    ]
  },
  "batiment-Fort, blockhaus, casemate": {
    "title": "Un vieu fort.",
    "actions": [
      [
        {
          "type": "rest",
          "desc": "Voilà l'endroit idéal pour se reposer un peu.",
          "action": "Se reposer"
        }
      ]
    ]
  },
  "batiment-Serre": {
    "title": "Une serre.",
    "actions": [
      [
        {
          "type": "food",
          "title": "un fruit",
          "desc": "Des caisses de fruits sont entreposées dans un coin.",
          "action": "Prendre un fruit discrètement."
        },
        {
          "type": "none",
          "desc": "Il y a du monde dans cette serre, mieux vaut ne pas trainer ici"
        }
      ],
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Un robinet d'arrosage se trouve sur le bord du bâtiment.",
          "action": "Remplir une bouteille ou boire un coup"
        }
      ]
    ]
  },
  "zone_de_vegetation-Bananeraie": {
    "title": "Une plantation de banane.",
    "actions": [
      [
        {
          "type": "food",
          "title": "une banane",
          "desc": "Des caisses de fruits sont entreposées dans un coin.",
          "action": "Prendre une banane discrètement."
        }
      ],
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Un robinet d'arrosage se trouve sur le bord du bâtiment.",
          "action": "Remplir une bouteille ou boire un coup"
        }
      ]
    ]
  },
  "zone_de_vegetation-Verger": {
    "title": "Un verger.",
    "actions": [
      [
        {
          "type": "food",
          "title": "un fruit",
          "desc": "Ce verger a de beaux arbres fruitiers.",
          "action": "Cueillir un fruit discrètement."
        },
        {
          "type": "none",
          "desc": "Des ouvriers travaillent dans le verger et te regardent bizarrement, mieux vaut ne pas trainer ici."
        }
      ]
    ]
  },
  "zone_de_vegetation-Vigne": {
    "title": "Une vigne.",
    "actions": [
      [
        {
          "type": "food",
          "title": "une banane",
          "desc": "Des grappes de raisins pendent à la vigne",
          "action": "Cueillir des raisins discrètement."
        },
        {
          "type": "none",
          "desc": "Des ouvriers travaillent sur les plans de vigne et te regardent bizarrement, mieux vaut ne pas trainer ici."
        }
      ]
    ]
  },
  "batiment-Industriel, agricole ou commercial": {
    "title": "Un entrepôt.",
    "actions": [
      [
        {
          "type": "object",
          "object": "bottle",
          "title": "une bouteille",
          "desc": "Tu trouve une bouteille vide qui traine.",
          "action": "Prendre la bouteille"
        },
        {
          "type": "object",
          "object": "shoes",
          "desc": "Tu trouves une paire de chaussure de marche",
          "action": "Prendre la paire de chaussure",
          "ok": "Avec des chaussures comme cela tu macheras bien mieux...",
          "nok": [
            "Désolé, elles ne sont pas à ta taille...",
            "Non, elles sont en trop mauvais état..."
          ]
        },
        {
          "type": "none",
          "desc": "Ce bâtiment est fermé... rien à faire par ici"
        },
        {
          "type": "none",
          "desc": "Il y a du monde dans ce bâtiment, mieux vaut partir rapidement."
        }
      ]
    ]
  },
  "batiment-Moulin à vent": {
    "title": "Un moulin à vent.",
    "actions": [
      [
        {
          "type": "drink",
          "desc": "Une jeune fille lit un livre sur les marche du moulin.",
          "action": "Elle te propose à boire."
        },
        {
          "type": "food",
          "title": "un morceau de pain",
          "desc": "Un jeune homme au look de hippie semble habiter là.",
          "action": "Il te donne un morceau de pain."
        },
        {
          "type": "drink",
          "desc": "Un promeneur vient à passer.",
          "action": "Il te propose à boire."
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Aire de détente": {
    "title": "Une aire de détente.",
    "actions": [
      [
        {
          "type": "object",
          "object": "bottle",
          "title": "une bouteille",
          "desc": "Tu trouve une bouteille vide dans une poubelle.",
          "action": "Prendre la bouteille"
        },
        {
          "type": "none",
          "desc": "Rien de spécial par ici..."
        }
      ]
    ]
  },
  "equipement_de_transport-Parking": {
    "title": "Un parking.",
    "actions": [
      [
        {
          "type": "object",
          "object": "bottle",
          "title": "une bouteille",
          "desc": "Tu trouve une bouteille vide dans une poubelle.",
          "action": "Prendre la bouteille"
        },
        {
          "type": "none",
          "desc": "Rien de spécial par ici..."
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Police": {
    "title": "La police !",
    "actions": [
      [
        {
          "type": "danger",
          "desc": "C'est un commissariat, tu déguerpis à toute vitesse et tu perds un point de survie...",
          "action": "Tu perds un point de vie"
        }
      ]
    ]
  },
  "gare": {
    search: /zone_d_activite_ou_d_interet-Gare.*/,
    "title": "Une gare",
    "actions": [
      [
        {
          "type": "none",
          "desc": "Mieux vaut ne pas rester par ici, il y a trop de monde..."
        }
      ]
    ]
  },
  "gare2": {
    search: /equipement_de_transport-Gare.*/,
    "title": "Une gare",
    "actions": [
      [
        {
          "type": "none",
          "desc": "Mieux vaut ne pas rester par ici, il y a trop de monde..."
        }
      ]
    ]
  },
  "lieu_dit_non_habite-Arbre": {
    "title": "Un arbre majestueux.",
    "info": "l'arbre",
    "actions": [
      [
        {
          "type": "info",
          "desc": "Un viel homme est assis sous %info%.",
          "action": "Il t'indique un raccourcis."
        },
        {
          "type": "drink",
          "desc": "Un promeneur vient à passer.",
          "action": "Il te donne à boire."
        },
        {
          "type": "food",
          "title": "une pomme",
          "desc": "Une vielle femme porte des paniers plein. Elle trébuche et tu l'aides à se relever.",
          "action": "Elle te donne une pomme."
        },
        {
          "type": "info",
          "desc": "Un paysan laboure son champ non loins de là.",
          "action": "Il t'indique un raccourcis."
        }
      ]
    ]
  },
  "detail_hydrographique-Résurgence": {
    "title": "Une résurgence.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Tu entends le glou-glou caractérique, il y a de l'eau pas loin.",
          "action": "Remplir une bouteille ou boire un coup"
        }
      ]
    ]
  },
  "detail_hydrographique-Point d'eau": {
    "title": "Un point d'eau.",
    "actions": [
      [
        {
          "type": [
            "watter",
            "drink"
          ],
          "desc": "Tu entends le glou-glou caractérique, il y a de l'eau pas loin.",
          "action": "Remplir une bouteille ou boire un coup"
        }
      ]
    ]
  }
}