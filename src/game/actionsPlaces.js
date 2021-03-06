export default {
  "construction_ponctuelle-Croix": {
    "title": "Une croix plantée sur le bord du chemin.",
    "info": "la croix",
    "actions": [
      [
        {
          "type": "info",
          "desc": "Un vieil homme est assis sous la croix.",
          "action": "Il t'indique un raccourcis."
        },
        {
          "type": "drink",
          "desc": "Un promeneur vient à passer. Il te propose à boire.",
          "action": "Boire un coup."
        },
        {
          "type": "food",
          "title": "une pomme",
          "what": "apple",
          "desc": "Une vielle femme porte des paniers pleins. Elle trébuche et tu l'aides à se relever.<br/>Elle te propose une pomme",
          "action": "Prendre la pomme."
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
            "water",
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
            "water",
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
            "water",
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
            "water",
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
            "water",
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
    "search": /^cimetiere-/,
    "title": "Un cimetière.",
    "actions": [
      [
        {
          "type": [
            "water",
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
            "water",
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
          "desc": "Tu trouves une bouteille vide dans une poubelle.",
          "action": "Prendre la bouteille"
        },
        {
          "type": "food",
          "title": "une barre de céréales",
          "what": "bar",
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
            "water",
            "drink"
          ],
          "desc": "Tu trouves un robinet accessible au bord sur le mur de l'écurie.",
          "action": "Remplir une bouteille ou boire un coup"
        },
        {
          "type": "object",
          "object": "bottle",
          "title": "une bouteille",
          "desc": "Tu trouves une bouteille vide dans une poubelle.",
          "action": "Prendre la bouteille"
        },
        {
          "type": "food",
          "title": "une pomme",
          "what": "apple",
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
  "construction_lineaire-Ruines": {
    "title": "Une ruine.",
    "actions": [
      [
        {
          "type": "rest",
          "desc": "Voilà l'endroit idéal pour se reposer un peu à l'abris.",
          "action": "Se reposer"
        },
        {
          "type": "none",
          "desc": "Mieux vaut éviter se se promener par là, avant qu'une pierre ne te tombe dessus.",
        },
        {
          "type": "none",
          "desc": "Il n'y a rien a faire dans ces ruines",
        }
      ]
    ]
  },
  "detail_orographique-grotte": {
    "title": "Une grotte.",
    "actions": [
      [
        {
          "type": "rest",
          "desc": "Voilà l'endroit idéal pour se reposer un peu à l'abris.",
          "action": "Se reposer"
        },
        {
          "type": "none",
          "desc": "Mieux vaut éviter se se promener par là, avant qu'une pierre ne te tombe dessus.",
        },
        {
          "type": "none",
          "desc": "Il n'y a rien a faire dans cette grotte humide.",
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Refuge": {
    "title": "Un refuge.",
    "actions": [
      [
        {
          "type": "rest",
          "desc": "Voilà l'endroit idéal pour se reposer un peu.",
          "action": "Se reposer"
        },
        {
          "type": "none",
          "desc": "Le refuge est fermé",
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
  "batiment-Tribune": {    
    "title": "Une tribune.",
    "actions": [
      [
        {
          "type": [
            "water",
            "drink"
          ],
          "desc": "Tu trouves un robinet sur le batiment.",
          "action": "Remplir une bouteille ou boire un coup"
        },
        {
          "type": "none",
          "desc": "Il ya trop de monde par ici..."
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
          "what": "fruit",
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
            "water",
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
          "what": "banana",
          "desc": "Des caisses de fruits sont entreposées dans un coin.",
          "action": "Prendre une banane discrètement."
        }
      ],
      [
        {
          "type": [
            "water",
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
          "what": "fruit",
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
          "title": "du raisin",
          "what": "grape",
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
    "title-Agricole": "Un bâtiment agricole",
    "title-Industriel": "Un bâtiment industriel",
    "actions": [
      [
        {
          "type": "object",
          "object": "bottle",
          "title": "une bouteille",
          "desc": "Tu trouves une bouteille vide qui traine.",
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
          "what": "bread",
          "desc": "Un jeune homme au look de hippie semble habiter là.",
          "action": "Il te donne un morceau de pain."
        },
        {
          "type": "drink",
          "desc": "Un promeneur vient à passer. Il te propose à boire.",
          "action": "Boire un coup."
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
          "desc": "Tu trouves une bouteille vide dans une poubelle.",
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
          "desc": "Tu trouves une bouteille vide dans une poubelle.",
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
    "search": /zone_d_activite_ou_d_interet-Gare.*/,
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
    "search": /equipement_de_transport-Gare.*/,
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
          "desc": "Un viel homme est assis sous l'arbre.",
          "action": "Il t'indique un raccourcis."
        },
        {
          "type": "drink",
          "desc": "Un promeneur vient à passer. Il te propose à boire.",
          "action": "Boire un coup."
        },
        {
          "type": "food",
          "title": "une pomme",
          "what": "apple",
          "desc": "Une vielle femme porte des paniers pleins. Elle trébuche et tu l'aides à se relever.",
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
            "water",
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
            "water",
            "drink"
          ],
          "desc": "Tu entends le glou-glou caractérique, il y a de l'eau pas loin.",
          "action": "Remplir une bouteille ou boire un coup"
        }
      ]
    ]
  },
  "zone_d_activite_ou_d_interet-Point de vue": {
    "title": "Point de vue",
    "actions": [
      [
        {
          "type": "info",
          "desc": "On a vraiment un point de vue superbe depuis ici.",
          "action": "Découvrir un raccourcis"
        }
      ]
    ]
  },
  "equipement_de_transport-Port": {
    "title": "Le port",
    "actions": [
      [
        {
          "type": [
            "water",
            "drink"
          ],
          "desc": "Il y a un robinet disponible sur le port.",
          "action": "Remplir une bouteille ou boire un coup"
        },
        {
          "type": "none",
          "desc": "La capitainerie du port t'a repéré, mieux vaut déguerpir au plus vite !"
        }
      ],
      [
        {
          "type": "object",
          "object": "bottle",
          "desc": "Tu trouves une bouteille vide dans une poubelle.",
          "action": "Prendre la bouteille",
          "title": "une bouteille"
        },
        {
          "type": "food",
          "title": "une barre de céréales",
          "what": "bar",
          "desc": "Tu trouves une barre de céréale dans une poubelle.",
          "action": "Prendre la barre de céréale",
        },
        {
          "type": "none",
          "desc": "Il ya trop de monde dans ce port, mieux vaut ne pas trainer par ici..."
        }
      ]
    ]
  }
}