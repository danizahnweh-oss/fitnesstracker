// lib.js — vanilla data + helpers shared by all theme variants

// ─────────────────────────────────────────────────────────────
// TRAINING PLAN  (Restart Phase — Start 25.05.2026)
// ─────────────────────────────────────────────────────────────
const TRAINING_PLAN = {
  A: {
    id: 'A',
    name: 'Kraft A',
    day: 'Montag',
    focus: 'Ganzkörper · Kraft',
    exercises: [
      {
        id: 'squat',
        name: 'Kniebeugen',
        warmups: [{ w: 'Stange', r: 10 }, { w: 40, r: 5 }, { w: 55, r: 3 }],
        sets: 3, reps: 5, weight: 70, rest: 150,
        restRange: '2–3 min',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'bench',
        name: 'Bankdrücken',
        warmups: [{ w: 'Stange', r: 10 }, { w: 30, r: 5 }],
        sets: 3, reps: 5, weight: 45, rest: 105,
        restRange: '90–120 s',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'row',
        name: 'Langhantelrudern',
        warmups: [{ w: 30, r: 8 }],
        sets: 3, reps: 8, weight: 45, rest: 90,
        restRange: '90 s',
        type: 'compound', increment: 2.5, bar: 20,
      },
    ],
  },
  B: {
    id: 'B',
    name: 'Oberkörper',
    day: 'Mittwoch',
    focus: 'Hypertrophie',
    exercises: [
      {
        id: 'inclbench',
        name: 'Schrägbankdrücken',
        warmups: [], sets: 3, reps: 10, weight: 40, rest: 90,
        restRange: '90 s',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'row2',
        name: 'Rudern',
        warmups: [], sets: 3, reps: 10, weight: 40, rest: 90,
        restRange: '90 s',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'ohp_b',
        name: 'Overhead Press',
        warmups: [], sets: 3, reps: 12, weight: 22.5, rest: 90,
        restRange: '90 s',
        type: 'compound', increment: 1.25, bar: 20,
      },
      {
        id: 'curl',
        name: 'Bizepscurls',
        warmups: [], sets: 3, reps: 12, weight: 20, rest: 75,
        restRange: '60–90 s',
        type: 'isolation', increment: 1.25, bar: 20,
      },
      {
        id: 'lat',
        name: 'Seitheben',
        warmups: [], sets: 3, reps: 15, weight: 6, rest: 60,
        restRange: '60 s',
        type: 'isolation_db', increment: 1, bar: 0,
      },
    ],
  },
  C: {
    id: 'C',
    name: 'Kraft B',
    day: 'Freitag',
    focus: 'Ganzkörper · Kraft',
    exercises: [
      {
        id: 'squat',
        name: 'Kniebeugen',
        warmups: [{ w: 'Stange', r: 10 }, { w: 40, r: 5 }, { w: 55, r: 3 }],
        sets: 3, reps: 5, weight: 70, rest: 150,
        restRange: '2–3 min',
        type: 'compound', increment: 2.5, bar: 20,
      },
      {
        id: 'ohp',
        name: 'Overhead Press',
        warmups: [{ w: 'Stange', r: 10 }, { w: 20, r: 5 }],
        sets: 3, reps: 5, weight: 30, rest: 105,
        restRange: '90–120 s',
        type: 'compound', increment: 1.25, bar: 20,
      },
      {
        id: 'deadlift',
        name: 'Kreuzheben',
        warmups: [{ w: 40, r: 5 }, { w: 60, r: 3 }],
        sets: 1, reps: 5, weight: 80, rest: 180,
        restRange: '3 min',
        type: 'compound', increment: 5, bar: 20,
      },
    ],
  },
};

const SESSION_ORDER = ['A', 'B', 'C'];
const SESSION_DOW = { 1: 'A', 3: 'B', 5: 'C' }; // Mo, Mi, Fr

// ─────────────────────────────────────────────────────────────
// MOBILITY  (separate routines — Beweglichkeit, getrennt vom Krafttraining)
// Übung: {id, name, side, pose, dur|reps, setup, steps[], tip, mistakes[]}
//   - pose = Schlüssel für die Strichfigur in app-mobility.jsx (MOBILITY_POSES)
//   - Links/rechts = zwei Einträge mit _l/_r, gleiche pose
// ─────────────────────────────────────────────────────────────
const MOBILITY_ROUTINES = {
  hips: {
    id: 'hips',
    name: 'Hüfte',
    focus: 'Hüftöffner · Mobilität',
    est: 9,
    exercises: [
      {
        id: 'hip_90_90', name: '90/90 Hüftwechsel', side: 'both', pose: 'hip_90_90', dur: 60,
        setup: 'Aufrecht auf dem Boden sitzen: vorderes Bein 90° vor dir, hinteres Bein 90° zur Seite. Beide Knie und Knöchel berühren möglichst den Boden.',
        steps: [
          'Brustbein hoch, Rücken lang — keine Rundung.',
          'Knie und Hüfte aktiv in Richtung Boden drücken, Sitz fühlen.',
          '3–4 Sekunden halten, dann durch die Mitte zur anderen Seite kippen.',
          'Wechsel kontrolliert und langsam, nicht werfen.',
        ],
        tip: 'Wenn das vordere Knie nicht runter kommt: Po leicht heben oder die hintere Hand zur Stütze setzen.',
        mistakes: [
          'Mit krummem Rücken vornüber kippen',
          'Hektisch hin- und herwerfen statt kontrolliert wechseln',
          'Auf das Knie pressen statt aktiv reindrücken',
        ],
      },
      {
        id: 'couch_l', name: 'Couch-Stretch (links)', side: 'left', pose: 'couch_stretch', dur: 45,
        setup: 'Im Halbkniestand vor einer Wand / Couch. Linkes Knie am Boden, Schienbein/Fußrücken an die Wand. Rechtes Bein vorn 90°.',
        steps: [
          'Becken aktiv nach oben/vorn aufrichten — Po fest anspannen.',
          'Bauch leicht anspannen, Rippen runter.',
          'Oberkörper aufrecht halten oder leicht zurück lehnen.',
          'Tief atmen, im Dehngefühl bleiben, nicht zerren.',
        ],
        tip: 'Erst wenn das Becken aufgerichtet ist, beginnt der eigentliche Dehnreiz im Hüftbeuger.',
        mistakes: [
          'Hohlkreuz: Becken kippt vor statt aufzurichten',
          'Knie weh weil zu wenig Polster — Handtuch drunter',
          'Im Schmerz dehnen statt im Dehngefühl',
        ],
      },
      {
        id: 'couch_r', name: 'Couch-Stretch (rechts)', side: 'right', pose: 'couch_stretch', dur: 45,
        setup: 'Im Halbkniestand vor einer Wand / Couch. Rechtes Knie am Boden, Schienbein/Fußrücken an die Wand. Linkes Bein vorn 90°.',
        steps: [
          'Becken aktiv nach oben/vorn aufrichten — Po fest anspannen.',
          'Bauch leicht anspannen, Rippen runter.',
          'Oberkörper aufrecht halten oder leicht zurück lehnen.',
          'Tief atmen, im Dehngefühl bleiben, nicht zerren.',
        ],
        tip: 'Erst wenn das Becken aufgerichtet ist, beginnt der eigentliche Dehnreiz im Hüftbeuger.',
        mistakes: [
          'Hohlkreuz: Becken kippt vor statt aufzurichten',
          'Knie weh weil zu wenig Polster — Handtuch drunter',
          'Im Schmerz dehnen statt im Dehngefühl',
        ],
      },
      {
        id: 'deep_squat', name: 'Tiefe Hocke halten', side: 'both', pose: 'deep_squat', dur: 60,
        setup: 'Füße schulterbreit, Zehen leicht nach außen. Tief in die Hocke setzen — Po geht Richtung Fersen.',
        steps: [
          'Fersen bleiben am Boden — wenn nicht, Stand etwas breiter machen.',
          'Brust hoch, Blick nach vorn, langer Rücken.',
          'Ellenbogen zwischen die Knie und sanft nach außen drücken.',
          'Locker atmen, in die Position hinein entspannen.',
        ],
        tip: 'Fersen heben sich? Eine zusammengerollte Matte oder Buchkante unter die Fersen.',
        mistakes: [
          'Rücken rundet stark ein',
          'Knie kippen nach innen',
          'Fersen heben sich heimlich',
        ],
      },
      {
        id: 'fire_hydrant', name: 'Fire Hydrants', side: 'both', pose: 'fire_hydrant', reps: 10,
        setup: 'Im Vierfüßler: Hände unter Schultern, Knie unter Hüfte. Rücken neutral, Bauch leicht angespannt.',
        steps: [
          'Ein Knie kontrolliert seitlich nach oben heben — Winkel im Knie bleibt bei 90°.',
          'Becken bleibt parallel zum Boden — nicht mitkippen.',
          'Oben kurz halten, dann langsam zurück.',
          '10 Wdh pro Seite, dann wechseln.',
        ],
        tip: 'Hand auf die Hüfte legen kann helfen zu spüren, ob das Becken stabil bleibt.',
        mistakes: [
          'Becken kippt zur Seite weg',
          'Mit Schwung statt aus dem Po',
          'Bein zu hoch — Qualität vor Höhe',
        ],
      },
    ],
  },
  shoulders: {
    id: 'shoulders',
    name: 'Schultern',
    focus: 'Schultergürtel · Rotatoren',
    est: 8,
    exercises: [
      {
        id: 'sh_cars_l', name: 'Schulter-CARs (links)', side: 'left', pose: 'shoulder_cars', reps: 5,
        setup: 'Aufrecht stehen, Füße hüftbreit. Rechte Hand fasst die linke Schulter zur Stabilisierung.',
        steps: [
          'Linken Arm gestreckt nach vorn und langsam einen großen Kreis zeichnen.',
          'So langsam wie möglich — 5 Sekunden pro Kreis, voller Bewegungsumfang.',
          'Rest des Körpers bleibt still — nur die Schulter arbeitet.',
          '5 Kreise vorwärts, dann 5 rückwärts.',
        ],
        tip: 'CARs = Controlled Articular Rotations. Je langsamer, desto mehr Kontrolle und Reiz.',
        mistakes: [
          'Schultern mitziehen / Oberkörper drehen',
          'Zu schnell — Schwung statt Kontrolle',
          'Halber Kreis statt voller Bewegungsumfang',
        ],
      },
      {
        id: 'sh_cars_r', name: 'Schulter-CARs (rechts)', side: 'right', pose: 'shoulder_cars', reps: 5,
        setup: 'Aufrecht stehen, Füße hüftbreit. Linke Hand fasst die rechte Schulter zur Stabilisierung.',
        steps: [
          'Rechten Arm gestreckt nach vorn und langsam einen großen Kreis zeichnen.',
          'So langsam wie möglich — 5 Sekunden pro Kreis, voller Bewegungsumfang.',
          'Rest des Körpers bleibt still — nur die Schulter arbeitet.',
          '5 Kreise vorwärts, dann 5 rückwärts.',
        ],
        tip: 'CARs = Controlled Articular Rotations. Je langsamer, desto mehr Kontrolle und Reiz.',
        mistakes: [
          'Schultern mitziehen / Oberkörper drehen',
          'Zu schnell — Schwung statt Kontrolle',
          'Halber Kreis statt voller Bewegungsumfang',
        ],
      },
      {
        id: 'band_dislocate', name: 'Band Pass-Throughs', side: 'both', pose: 'band_dislocate', reps: 12,
        setup: 'Theraband oder Besenstil sehr weit greifen — breiter als Schulterbreite. Aufrecht stehen.',
        steps: [
          'Mit gestreckten Armen das Band/den Stab nach vorn halten.',
          'Langsam über den Kopf nach hinten führen, ohne Arme zu beugen.',
          'Hinten unten halten, dann den Weg zurück.',
          'Arme die ganze Zeit gestreckt, Schultern entspannt.',
        ],
        tip: 'Wenn es nicht durchgeht: Hände weiter auseinander. Mit der Zeit kannst du enger greifen.',
        mistakes: [
          'Arme beugen sich, um Mobilität vorzutäuschen',
          'Hohlkreuz beim Überkopfführen',
          'Ruckartig statt fließend',
        ],
      },
      {
        id: 'wall_slides', name: 'Wall Slides', side: 'both', pose: 'wall_slides', dur: 45,
        setup: 'Rücken, Po, Kopf an einer Wand. Ellenbogen 90°, Handrücken berühren ebenfalls die Wand.',
        steps: [
          'Arme langsam an der Wand nach oben gleiten lassen — Kontakt halten.',
          'Soweit hoch, wie Handrücken UND unterer Rücken an der Wand bleiben.',
          'Dann kontrolliert zurück, Schulterblätter nach unten ziehen.',
          'Gleichmäßiges Tempo, ruhig atmen.',
        ],
        tip: 'Wenn Handrücken sich lösen, bist du am Limit — nicht erzwingen, mit der Zeit wird\'s besser.',
        mistakes: [
          'Hohlkreuz machen, um die Arme hochzukriegen',
          'Hände lösen sich von der Wand',
          'Schultern hochziehen statt unten lassen',
        ],
      },
      {
        id: 'thread_needle', name: 'Thread the Needle', side: 'both', pose: 'thread_needle', dur: 40,
        setup: 'Im Vierfüßler starten. Hände unter Schultern, Knie unter Hüfte.',
        steps: [
          'Rechten Arm gestreckt unter dem Körper hindurch nach links führen.',
          'Schulter und Wange sinken Richtung Boden.',
          '20 Sekunden im Dehngefühl bleiben, dann Seite wechseln.',
          'Ruhig atmen, Brust öffnen.',
        ],
        tip: 'Den linken Arm nach oben zur Decke strecken intensiviert die BWS-Rotation.',
        mistakes: [
          'Hüfte mitkippen statt stabil halten',
          'In den Schmerz gehen',
          'Zu schnelle Bewegung',
        ],
      },
    ],
  },
  tspine: {
    id: 'tspine',
    name: 'Brustwirbelsäule',
    focus: 'BWS-Rotation · Extension',
    est: 8,
    exercises: [
      {
        id: 'open_book_l', name: 'Open Book (links)', side: 'left', pose: 'open_book', reps: 8,
        setup: 'Rechte Seitlage. Knie 90° gebeugt aufeinander, beide Arme nach vorn ausgestreckt auf Schulterhöhe.',
        steps: [
          'Linken Arm wie ein Buchdeckel öffnen — Richtung Boden hinter dir.',
          'Blick folgt der Hand, Brust öffnet sich.',
          'Knie bleiben unten und zusammen — Hüfte wird NICHT mitgedreht.',
          'Kurz halten, dann kontrolliert zurück.',
        ],
        tip: 'Wenn der Arm den Boden nicht berührt: kein Problem, Bewegungsumfang wird mit der Zeit größer.',
        mistakes: [
          'Hüfte/Knie kippen mit auf — Rotation kommt dann aus der LWS',
          'Schulter hochgezogen',
          'Atem anhalten',
        ],
      },
      {
        id: 'open_book_r', name: 'Open Book (rechts)', side: 'right', pose: 'open_book', reps: 8,
        setup: 'Linke Seitlage. Knie 90° gebeugt aufeinander, beide Arme nach vorn ausgestreckt auf Schulterhöhe.',
        steps: [
          'Rechten Arm wie ein Buchdeckel öffnen — Richtung Boden hinter dir.',
          'Blick folgt der Hand, Brust öffnet sich.',
          'Knie bleiben unten und zusammen — Hüfte wird NICHT mitgedreht.',
          'Kurz halten, dann kontrolliert zurück.',
        ],
        tip: 'Wenn der Arm den Boden nicht berührt: kein Problem, Bewegungsumfang wird mit der Zeit größer.',
        mistakes: [
          'Hüfte/Knie kippen mit auf — Rotation kommt dann aus der LWS',
          'Schulter hochgezogen',
          'Atem anhalten',
        ],
      },
      {
        id: 'cat_cow', name: 'Katze-Kuh', side: 'both', pose: 'cat_cow', dur: 60,
        setup: 'Vierfüßler — Hände unter Schultern, Knie unter Hüfte. Wirbelsäule neutral.',
        steps: [
          'EINATMEN: Brust raus, Steißbein hoch, Bauch fällt Richtung Boden (Kuh).',
          'AUSATMEN: Wirbel für Wirbel einrollen, Rücken hoch, Kinn zur Brust (Katze).',
          'Bewegung kommt aus der ganzen Wirbelsäule — nicht nur LWS.',
          'Langsam mit dem Atem, etwa 3-4 Sekunden pro Phase.',
        ],
        tip: 'Stell dir vor, jeder Wirbel bewegt sich einzeln — von Becken bis Hals.',
        mistakes: [
          'Nur die LWS bewegt sich',
          'Arme/Beine kollabieren',
          'Mit dem Atem nicht synchron',
        ],
      },
      {
        id: 'tspine_ext', name: 'BWS-Extension (Rolle)', side: 'both', pose: 'tspine_ext', dur: 45,
        setup: 'Foam Roller quer unter der oberen Brustwirbelsäule. Hände hinterm Kopf, Ellenbogen vor dem Gesicht, Füße aufgestellt.',
        steps: [
          'Po bleibt am Boden, Bauch leicht aktiv.',
          'Brust langsam nach hinten/unten öffnen — Kopf folgt entspannt.',
          'Pro Position 3-5 Atemzüge halten.',
          'Roller etwas verschieben (jeweils ~2 cm) und nächste Position.',
        ],
        tip: 'Nur die BWS soll sich strecken, NICHT die LWS — deshalb Po unten lassen.',
        mistakes: [
          'In die LWS strecken (Po hebt sich)',
          'Roller zu tief — gehört oberhalb der unteren Rippen',
          'Hände in den Nacken zerren',
        ],
      },
      {
        id: 'quadruped_rot', name: 'Quadruped Rotation', side: 'both', pose: 'quadruped_rot', reps: 8,
        setup: 'Vierfüßler. Rechte Hand an den Hinterkopf, Ellenbogen zeigt nach unten.',
        steps: [
          'Rechten Ellenbogen langsam zur Decke öffnen — Rotation aus der BWS.',
          'Brust folgt der Bewegung, Hüfte bleibt stabil.',
          'Blick begleitet den Ellenbogen.',
          'Kontrolliert zurück. 8 Wdh, dann Seite wechseln.',
        ],
        tip: 'Hand am Hinterkopf hilft, dass die Rotation aus der Brustwirbelsäule kommt — nicht aus dem Hals.',
        mistakes: [
          'Becken kippt mit',
          'Nur der Kopf dreht statt der gesamte Oberkörper',
          'Standhand kollabiert',
        ],
      },
    ],
  },
  ankles: {
    id: 'ankles',
    name: 'Sprunggelenke',
    focus: 'Dorsalflexion · Stabilität',
    est: 6,
    exercises: [
      {
        id: 'ankle_rock_l', name: 'Knee-to-Wall (links)', side: 'left', pose: 'knee_to_wall', dur: 40,
        setup: 'Im Halbkniestand vor einer Wand. Linker Fuß vorn, Zehen ~10 cm von der Wand entfernt. Ferse fest am Boden.',
        steps: [
          'Linkes Knie Richtung Wand schieben.',
          'Ferse bleibt zu 100% am Boden — wenn sie sich hebt, Fuß näher ran.',
          'Knie berührt die Wand idealerweise rechts und links neben dem Knöchel.',
          '20–30 Wiederholungen leicht wippend.',
        ],
        tip: 'Mit der Zeit Fuß weiter weg von der Wand stellen, um mehr Dorsalflexion zu fordern.',
        mistakes: [
          'Ferse hebt sich heimlich',
          'Knie kippt nach innen statt geradeaus',
          'Hüfte bricht zur Seite weg',
        ],
      },
      {
        id: 'ankle_rock_r', name: 'Knee-to-Wall (rechts)', side: 'right', pose: 'knee_to_wall', dur: 40,
        setup: 'Im Halbkniestand vor einer Wand. Rechter Fuß vorn, Zehen ~10 cm von der Wand entfernt. Ferse fest am Boden.',
        steps: [
          'Rechtes Knie Richtung Wand schieben.',
          'Ferse bleibt zu 100% am Boden — wenn sie sich hebt, Fuß näher ran.',
          'Knie berührt die Wand idealerweise rechts und links neben dem Knöchel.',
          '20–30 Wiederholungen leicht wippend.',
        ],
        tip: 'Mit der Zeit Fuß weiter weg von der Wand stellen, um mehr Dorsalflexion zu fordern.',
        mistakes: [
          'Ferse hebt sich heimlich',
          'Knie kippt nach innen statt geradeaus',
          'Hüfte bricht zur Seite weg',
        ],
      },
      {
        id: 'calf_raise', name: 'Wadenheben langsam', side: 'both', pose: 'calf_raise', reps: 15,
        setup: 'Aufrecht stehen, Füße hüftbreit. Optional an einer Stufe für mehr Bewegungsumfang.',
        steps: [
          '3 Sekunden langsam hoch auf die Zehenspitzen.',
          '1 Sekunde oben halten — hoch wie möglich.',
          '3 Sekunden langsam ablassen — voller Bewegungsumfang.',
          'Gleichmäßiges Tempo, ohne Schwung.',
        ],
        tip: 'Wenn auf einer Stufe: Ferse darf unten unter Stufenniveau gehen — voller Range.',
        mistakes: [
          'Schwung statt Kontrolle',
          'Halber Range — kaum hoch, kaum runter',
          'Knie beugen sich',
        ],
      },
      {
        id: 'ankle_circles', name: 'Fußkreisen', side: 'both', pose: 'ankle_circles', dur: 40,
        setup: 'Sitzend oder stehend, ein Bein leicht angehoben.',
        steps: [
          'Langsame, große Kreise mit dem Fuß zeichnen.',
          'Voller Bewegungsumfang — Zehen so weit wie möglich rotieren.',
          '10 Kreise pro Richtung, dann Seite wechseln.',
          'Rest des Beins bleibt still — nur der Fuß bewegt sich.',
        ],
        tip: 'Stell dir vor, du malst mit der großen Zehe ein riesiges Kreissymbol an die Wand.',
        mistakes: [
          'Mini-Kreise statt voller Bewegungsumfang',
          'Ganzes Bein dreht mit',
          'Zu schnell',
        ],
      },
    ],
  },
  fullbody: {
    id: 'fullbody',
    name: 'Ganzkörper',
    focus: 'Mobility-Flow · 6 Übungen',
    est: 11,
    exercises: [
      {
        id: 'fb_cat_cow', name: 'Katze-Kuh', side: 'both', pose: 'cat_cow', dur: 45,
        setup: 'Vierfüßler — Hände unter Schultern, Knie unter Hüfte.',
        steps: [
          'EINATMEN: Brust raus, Steißbein hoch (Kuh).',
          'AUSATMEN: Wirbel für Wirbel einrollen (Katze).',
          'Wirbelsäule warm-bewegen vom Becken bis zum Hals.',
          'Synchron mit dem Atem.',
        ],
        tip: 'Locker beginnen, der Bewegungsumfang wird mit jedem Atemzug größer.',
        mistakes: [
          'Nur die LWS bewegt sich',
          'Schultern hochgezogen',
        ],
      },
      {
        id: 'fb_worlds_greatest_l', name: "World's Greatest Stretch (links)", side: 'left', pose: 'worlds_greatest', dur: 40,
        setup: 'Tiefer Ausfallschritt mit dem linken Fuß vorn. Hände links und rechts vom linken Fuß auf dem Boden.',
        steps: [
          'Rechten (hinteres Bein) Knie aufgestellt oder am Boden.',
          'Linken Ellenbogen Richtung linken Fuß senken — Hüfte sinkt mit.',
          'Dann linken Arm zur Decke öffnen, Brust dreht auf — Blick folgt.',
          'Halten und atmen.',
        ],
        tip: 'Klassischer Warm-up "Best of" — eine Übung für Hüfte + BWS + Schulter gleichzeitig.',
        mistakes: [
          'Vorderes Knie kippt nach innen',
          'Rotation kommt aus der LWS',
          'Hektisch durchziehen',
        ],
      },
      {
        id: 'fb_worlds_greatest_r', name: "World's Greatest Stretch (rechts)", side: 'right', pose: 'worlds_greatest', dur: 40,
        setup: 'Tiefer Ausfallschritt mit dem rechten Fuß vorn. Hände links und rechts vom rechten Fuß auf dem Boden.',
        steps: [
          'Linken (hinteres Bein) Knie aufgestellt oder am Boden.',
          'Rechten Ellenbogen Richtung rechten Fuß senken — Hüfte sinkt mit.',
          'Dann rechten Arm zur Decke öffnen, Brust dreht auf — Blick folgt.',
          'Halten und atmen.',
        ],
        tip: 'Klassischer Warm-up "Best of" — eine Übung für Hüfte + BWS + Schulter gleichzeitig.',
        mistakes: [
          'Vorderes Knie kippt nach innen',
          'Rotation kommt aus der LWS',
          'Hektisch durchziehen',
        ],
      },
      {
        id: 'fb_deep_squat', name: 'Tiefe Hocke halten', side: 'both', pose: 'deep_squat', dur: 60,
        setup: 'Füße schulterbreit, Zehen leicht raus. Tief in die Hocke.',
        steps: [
          'Fersen am Boden, Brust hoch.',
          'Ellenbogen zwischen die Knie, sanft nach außen drücken.',
          'In der Position locker atmen.',
        ],
        tip: 'Hier setzt sich die Hüfte aus der vorherigen Übung — Position ankommen lassen.',
        mistakes: [
          'Rücken rundet ein',
          'Fersen heben sich',
        ],
      },
      {
        id: 'fb_band_dislocate', name: 'Band Pass-Throughs', side: 'both', pose: 'band_dislocate', reps: 12,
        setup: 'Band oder Stab weit greifen, aufrecht stehen.',
        steps: [
          'Gestreckte Arme von vorn über den Kopf nach hinten führen.',
          'Dann zurück, gleichmäßig und fließend.',
          'Arme bleiben gestreckt.',
        ],
        tip: 'Schließt die Schultern an den Mobility-Flow an.',
        mistakes: [
          'Arme beugen sich',
          'Hohlkreuz beim Überkopfführen',
        ],
      },
      {
        id: 'fb_hip_90_90', name: '90/90 Hüftwechsel', side: 'both', pose: 'hip_90_90', dur: 60,
        setup: 'Auf dem Boden sitzen, beide Beine 90/90.',
        steps: [
          'Kontrolliert zur anderen Seite wechseln.',
          'Brust hoch, langer Rücken.',
          'Pro Seite 3–4 Sekunden halten.',
        ],
        tip: 'Abschluss-Übung — bringt die Hüfte gemütlich zur Ruhe.',
        mistakes: [
          'Runder Rücken',
          'Hektisches Werfen',
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// STORAGE  (theme-scoped so the 3 variants don't fight)
// ─────────────────────────────────────────────────────────────
function storageKey(theme) {
  return `fittracker_v2_${theme || 'default'}`;
}

function loadState(theme) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(theme)) || '{}');
  } catch { return {}; }
}

function saveState(theme, state) {
  try { localStorage.setItem(storageKey(theme), JSON.stringify(state)); }
  catch (e) { console.warn('save failed', e); }
}

function defaultState() {
  return {
    sessions: [],   // {date, sessionId, week, exercises, feel, notes, recovery:{sleep,soreness,energy,water}, prs}
    bodyweight: [], // {date, kg}
    water: [],      // {date, glasses}
    mobility: [],   // {date, routineId, durationSec, completed}
    currentSessionIdx: 0,
    weekNo: 1,
    customExercises: [],   // user-added
    replacements: {},      // {[sessionId-exId]: customExId}  -- swaps
    videoAnalyses: {},     // {[exerciseId]: { keyframes, summary, generatedAt }}
    settings: {
      soundEnabled: true,
      soundKind: 'bell',         // bell | ding | beep | silent
      vibrationEnabled: true,
      barWeight: 20,
      rpeMode: 'rpe',            // 'rpe' (5-10) | 'rir' (0-4)
      warmupStyle: 'standard',   // 'standard' | 'wendler'
      pauseFirst: true,          // start pause immediately, log details during
      wakeLockEnabled: true,
      availablePlates: { 25: 2, 20: 2, 15: 2, 10: 2, 5: 2, 2.5: 2, 1.25: 2 },
    },
  };
}

function mergeDefaults(state) {
  const def = defaultState();
  return { ...def, ...state, settings: { ...def.settings, ...(state.settings || {}) } };
}

// ─────────────────────────────────────────────────────────────
// PROGRESSION
// Rule: if last session had all sets at target reps AND avg RPE ≤ ceiling,
// suggest +increment. Otherwise keep last weight.
// ─────────────────────────────────────────────────────────────
function rpeCeiling(ex) {
  if (ex.type === 'isolation' || ex.type === 'isolation_db') return 8.5;
  return 8;
}

function suggestNextWeight(ex, lastSession) {
  if (!lastSession) return ex.weight;
  const exHist = (lastSession.exercises || []).find(e => e.id === ex.id);
  if (!exHist) return ex.weight;
  const sets = exHist.sets || [];
  const lastWeight = exHist.weight ?? ex.weight;
  if (!sets.length) return lastWeight;
  const allDone = sets.length >= ex.sets && sets.every(s => (s.reps || 0) >= ex.reps);
  const rpes = sets.map(s => s.rpe).filter(r => r > 0);
  const avgRPE = rpes.length ? rpes.reduce((a, b) => a + b, 0) / rpes.length : 0;
  if (allDone && avgRPE > 0 && avgRPE <= rpeCeiling(ex)) {
    return lastWeight + ex.increment;
  }
  return lastWeight;
}

function findLastSession(state, sessionId) {
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    if (state.sessions[i].sessionId === sessionId) return state.sessions[i];
  }
  return null;
}

function findLastForExercise(state, exId) {
  // last session that contained this exercise
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    const s = state.sessions[i];
    const e = (s.exercises || []).find(x => x.id === exId);
    if (e) return { date: s.date, weight: e.weight, sets: e.sets, sessionId: s.sessionId };
  }
  return null;
}

function exerciseHistory(state, exId, limit = 30) {
  const out = [];
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    const s = state.sessions[i];
    const e = (s.exercises || []).find(x => x.id === exId);
    if (e) out.push({ date: s.date, weight: e.weight, sets: e.sets });
    if (out.length >= limit) break;
  }
  return out.reverse();
}

// ─────────────────────────────────────────────────────────────
// 1RM  (Epley) and warmup generator
// ─────────────────────────────────────────────────────────────
function estimate1RM(weight, reps) {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
}

function bestEstimate1RM(state, exId) {
  const hist = exerciseHistory(state, exId, 999);
  let best = 0;
  hist.forEach(h => {
    (h.sets || []).forEach(s => {
      const r = estimate1RM(h.weight, s.reps);
      if (r > best) best = r;
    });
  });
  return best;
}

// Auto-warmups: if no explicit warmups, build 2 from the work weight
function generateWarmups(ex, workWeight) {
  if (ex.warmups && ex.warmups.length) {
    // explicit, but anchor working sets onto suggested weight
    return ex.warmups;
  }
  if (ex.type === 'isolation' || ex.type === 'isolation_db') return [];
  const w1 = Math.max(ex.bar || 20, roundToPlate(workWeight * 0.5));
  const w2 = roundToPlate(workWeight * 0.75);
  if (w2 <= (ex.bar || 20)) return [];
  return [
    { w: w1, r: 8 },
    { w: w2, r: 5 },
  ];
}

function roundToPlate(w, step = 2.5) {
  return Math.round(w / step) * step;
}

// ─────────────────────────────────────────────────────────────
// PLATE CALCULATOR
// ─────────────────────────────────────────────────────────────
const PLATE_COLORS = {
  25: '#EF4444', 20: '#3B82F6', 15: '#F59E0B',
  10: '#10B981', 5: '#FFFFFF', 2.5: '#1F2937', 1.25: '#94A3B8',
};

function calcPlates(target, bar = 20) {
  const out = [];
  if (target < bar) return { ok: false, plates: [], remainder: target, bar };
  let perSide = (target - bar) / 2;
  const sizes = [25, 20, 15, 10, 5, 2.5, 1.25];
  for (const p of sizes) {
    while (perSide >= p - 0.0001) {
      out.push(p);
      perSide -= p;
    }
  }
  return { ok: Math.abs(perSide) < 0.0001, plates: out, remainder: perSide, bar };
}

// ─────────────────────────────────────────────────────────────
// BOXING BELL  via Web Audio (no asset, no licensing)
// ─────────────────────────────────────────────────────────────
let _ac = null;
function getAC() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  if (_ac.state === 'suspended') _ac.resume();
  return _ac;
}

// Build the bell sound at an absolute AudioContext time `start`.
// Returns the oscillators so a scheduled sound can later be cancelled.
function _bellAt(ctx, start) {
  const osc = [];
  // 3 quick strikes of the bell — boxing round ending
  [0, 0.18, 0.36].forEach((delay) => {
    // Bell = inharmonic stack
    const partials = [
      { f: 920,  g: 0.45, t: 'triangle' },
      { f: 1380, g: 0.30, t: 'sine'     },
      { f: 2300, g: 0.18, t: 'sine'     },
      { f: 3300, g: 0.10, t: 'sine'     },
    ];
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.0001, start + delay);
    masterGain.gain.exponentialRampToValueAtTime(1.0, start + delay + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.001, start + delay + 1.3);

    partials.forEach(p => {
      const o = ctx.createOscillator();
      o.type = p.t; o.frequency.value = p.f;
      const g = ctx.createGain();
      g.gain.value = p.g;
      o.connect(g); g.connect(masterGain);
      o.start(start + delay);
      o.stop(start + delay + 1.4);
      osc.push(o);
    });
  });
  return osc;
}

function playBell(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAC();
    _bellAt(ctx, ctx.currentTime);
  } catch (e) { console.warn('bell failed', e); }
}

function playClick() {
  try {
    const ctx = getAC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square'; o.frequency.value = 1200;
    o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.start(t); o.stop(t + 0.08);
  } catch {}
}

// ─────────────────────────────────────────────────────────────
// FORMAT / DATE HELPERS
// ─────────────────────────────────────────────────────────────
function fmtTime(s) {
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

function daysAgo(iso) {
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return 'heute';
  if (diff === 1) return 'gestern';
  return `vor ${diff} T`;
}

function fmtWeight(w) {
  if (w === 'Stange' || w == null) return w || '';
  if (Number.isInteger(w)) return String(w);
  return w.toString().replace('.', ',');
}

function suggestSessionToday(state) {
  // Cycle through A → B → C. Pick the next-in-cycle. If today matches Mon/Wed/Fri
  // and that matches the next one, perfect; if user is "off-cycle" we still
  // suggest the next-in-cycle so they don't repeat one.
  const idx = state.currentSessionIdx ?? 0;
  return SESSION_ORDER[idx % SESSION_ORDER.length];
}

// ─────────────────────────────────────────────────────────────
// MUSCLE GROUPS + FORM CUES (for Coach screen)
// ─────────────────────────────────────────────────────────────
const MUSCLE_MAP = {
  squat: ['Beine', 'Glutes', 'Core'],
  bench: ['Brust', 'Schultern', 'Trizeps'],
  inclbench: ['Brust (oben)', 'Schultern', 'Trizeps'],
  row: ['Rücken', 'Bizeps'],
  row2: ['Rücken', 'Bizeps'],
  ohp: ['Schultern', 'Trizeps', 'Core'],
  ohp_b: ['Schultern', 'Trizeps', 'Core'],
  deadlift: ['Rücken', 'Beine', 'Glutes'],
  curl: ['Bizeps'],
  lat: ['Schultern (Seite)'],
};

const FORM_CUES = {
  squat: {
    setup: 'Stange auf hinteren Schultern, Schulterblätter zusammen, schulterbreit + Zehen leicht raus.',
    cues: ['Druck in den Boden — Füße spreizen', 'Hüfte und Knie gleichzeitig beugen', 'Brust raus, neutraler Rücken', 'So tief bis Hüfte unter Knie'],
    mistakes: ['Knie kollabieren nach innen', 'Hacken heben sich', 'Hüfte schießt vor Brust hoch'],
  },
  bench: {
    setup: 'Augen unter Stange, Schulterblätter zurück + runter, leichter Brustbogen, Füße fest am Boden.',
    cues: ['Stange zum Brustbein', 'Ellenbogen ~45° (nicht ausgestellt)', 'Druck durch Mitte der Hand', 'Latissimus aktivieren'],
    mistakes: ['Ellenbogen flaggen aus', 'Po hebt von Bank', 'Stange wandert hoch zum Hals'],
  },
  inclbench: {
    setup: 'Bank 30–45°, sonst wie Flach-Bank. Stange landet höher (oberes Brustbein).',
    cues: ['Stange Richtung Schlüsselbein', 'Schulterblätter aktiv runter', 'Tempo: 2 sek excentric'],
    mistakes: ['Bank zu steil → wird OHP', 'Schultern ziehen hoch'],
  },
  row: {
    setup: 'Hüft-Hinge, ~30–45° Oberkörper, Knie leicht gebeugt, Stange am Bauchnabel.',
    cues: ['Ellenbogen zur Decke', 'Schulterblätter zusammen', 'Stange am Körper entlang', 'Rücken neutral'],
    mistakes: ['Oberkörper schwingt', 'Mit Bizeps statt Rücken ziehen', 'Tieflage zu flach'],
  },
  row2: {
    setup: 'Wie Langhantelrudern. Bei Maschine/Kabel: Sitz fest, Brust raus.',
    cues: ['Spüre den Rücken — nicht die Arme', 'Voll durchziehen', '2 sek Halten in Kontraktion'],
    mistakes: ['Schwung', 'Schulter rollen vor'],
  },
  ohp: {
    setup: 'Hüftbreit, Stange auf vorderen Schultern, Ellenbogen leicht vor Stange.',
    cues: ['Glutes + Core fest', 'Kopf leicht zurück, dann durchgehen', 'Stange grade nach oben', 'Triceps lockout'],
    mistakes: ['Übermäßige Hyperextension Wirbelsäule', 'Stange wandert vor', 'Kein Lockout'],
  },
  ohp_b: {
    setup: 'Gleich wie OHP — hier mit etwas höherem Volumen (12 Wdh).',
    cues: ['Bar Path: gerade hoch', 'Knöchel über Ellenbogen', 'Voller ROM'],
    mistakes: ['Halbe Wdh', 'Lower-Back-Hohlkreuz'],
  },
  deadlift: {
    setup: 'Mid-foot unter Stange, hüftbreit, Stange grenzt an Schienbein. Hüft-Hinge, Brust raus.',
    cues: ['Lat aktivieren — "Orangen unter Achseln"', 'Stange dicht am Körper', 'Push den Boden weg', 'Glutes oben anspannen'],
    mistakes: ['Rundrücken', 'Stange weg vom Körper', 'Hyperextension oben'],
  },
  curl: {
    setup: 'Stange schulterbreit, Ellenbogen am Körper fixiert.',
    cues: ['Nur Unterarm bewegt sich', 'Voller ROM (oben & unten)', 'Bicep peak halten'],
    mistakes: ['Schwung', 'Ellenbogen wandert vor', 'Halbe Wdh'],
  },
  lat: {
    setup: 'Stehen oder sitzen, leichte Knie-Beuge, Kurzhanteln neben Körper.',
    cues: ['Heben bis Schulterhöhe', 'Handgelenk neutral / leicht runter', 'Langsam ablassen (3 sek)', '"Wasser ausschütten"'],
    mistakes: ['Trapezius hochziehen', 'Schwingen', 'Über Schulterhöhe gehen'],
  },
};

function getCues(exId) { return FORM_CUES[exId] || null; }
function getMuscles(exId) { return MUSCLE_MAP[exId] || []; }

// ─────────────────────────────────────────────────────────────
// FORM ANGLES — soll-bereiche pro übung & phase
// Werte sind grobe biomechanische Richtwerte, verfeinerbar.
// ─────────────────────────────────────────────────────────────
const FORM_ANGLES = {
  squat: {
    label: 'Kniebeuge',
    phases: {
      bottom: {
        label: 'Tiefster Punkt',
        targets: {
          knee:    { range: [70, 110], label: 'Kniewinkel',  tip: 'Hüfte unter Knie für volle Tiefe' },
          hip:     { range: [40, 90],  label: 'Hüftwinkel',  tip: 'Hüfte tief beugen' },
          backLean:{ range: [25, 55],  label: 'Rumpf-Neigung', tip: 'Brust hoch, nicht zu weit nach vorne kippen' },
        },
      },
      lockout: {
        label: 'Lockout (oben)',
        targets: {
          knee: { range: [160, 185], label: 'Kniewinkel', tip: 'Voll durchstrecken' },
          hip:  { range: [160, 185], label: 'Hüftwinkel', tip: 'Glutes anspannen' },
        },
      },
    },
  },
  bench: {
    label: 'Bankdrücken',
    phases: {
      bottom: {
        label: 'Stange an Brust',
        targets: {
          elbow:    { range: [55, 95],  label: 'Ellenbogenwinkel', tip: 'Ellenbogen ~45° zum Körper, nicht ganz ausstellen' },
          shoulder: { range: [40, 80],  label: 'Schulterwinkel',   tip: 'Latissimus aktiv, Schulter nicht nach vorne rollen' },
        },
      },
      lockout: {
        label: 'Lockout (oben)',
        targets: {
          elbow: { range: [160, 185], label: 'Ellenbogenwinkel', tip: 'Voller Lockout über Schulter' },
        },
      },
    },
  },
  deadlift: {
    label: 'Kreuzheben',
    phases: {
      start: {
        label: 'Startposition',
        targets: {
          hip:      { range: [40, 95],  label: 'Hüftwinkel',  tip: 'Hüfte höher als Knie, Schultern leicht vor Stange' },
          knee:     { range: [100, 145], label: 'Kniewinkel', tip: 'Knie nicht zu tief beugen' },
          backLean: { range: [25, 60],  label: 'Rumpf-Neigung', tip: 'Neutrales Rücken-Setup, kein Rundrücken' },
        },
      },
      lockout: {
        label: 'Lockout',
        targets: {
          hip:      { range: [160, 185], label: 'Hüftwinkel',  tip: 'Hüfte voll durchstrecken' },
          knee:     { range: [160, 185], label: 'Kniewinkel',  tip: 'Knie voll strecken' },
          backLean: { range: [-10, 15],  label: 'Rumpf-Neigung', tip: 'Aufrechter Stand, keine Hyperextension' },
        },
      },
    },
  },
};
function getFormAngles(exId) { return FORM_ANGLES[exId] || null; }

// ─────────────────────────────────────────────────────────────
// STREAK + STATS HELPERS
// ─────────────────────────────────────────────────────────────
function calcStreak(state) {
  if (!state.sessions.length) return 0;
  const dates = new Set(state.sessions.map(s => s.date));
  // Walk back from today; on each Mon/Wed/Fri, check if there's a session.
  let streak = 0;
  const today = new Date();
  // Allow today to be missing (workout maybe hasn't happened yet)
  for (let d = new Date(today), guard = 0; guard < 90; guard++, d.setDate(d.getDate() - 1)) {
    const dow = d.getDay();
    if (dow !== 1 && dow !== 3 && dow !== 5) continue;
    const iso = d.toISOString().slice(0, 10);
    if (dates.has(iso)) {
      streak++;
    } else {
      // skip today's missing — gym day not done yet
      if (iso === today.toISOString().slice(0, 10)) continue;
      break;
    }
  }
  return streak;
}

function sessionVolume(session) {
  return (session.exercises || []).reduce((vol, e) => {
    return vol + (e.sets || []).reduce((v, s) => v + (s.reps || 0) * (e.weight || 0), 0);
  }, 0);
}

function volumeByMuscle(state, days = 7) {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  const result = {};
  state.sessions.forEach(s => {
    if (s.date < cutoffISO) return;
    (s.exercises || []).forEach(e => {
      const muscles = getMuscles(e.id);
      if (!muscles.length) return;
      const exVol = (e.sets || []).reduce((v, st) => v + (st.reps || 0) * (e.weight || 0), 0);
      const per = exVol / muscles.length;
      muscles.forEach(m => { result[m] = (result[m] || 0) + per; });
    });
  });
  return result;
}

// PR detection: compare current session's estimated 1RM vs all prior history
function detectPRs(state, currentSessionLog) {
  const prs = [];
  (currentSessionLog.exercises || []).forEach(e => {
    if (!e.sets?.length) return;
    const bestSetThis = e.sets.reduce((b, s) =>
      ((s.reps || 0) > 0 && estimate1RM(e.weight, s.reps) > (b ? estimate1RM(e.weight, b.reps) : 0))
        ? s : b, null);
    if (!bestSetThis) return;
    let bestPrior = 0;
    state.sessions.forEach(s => {
      (s.exercises || []).forEach(prev => {
        if (prev.id !== e.id) return;
        (prev.sets || []).forEach(ps => {
          const r = estimate1RM(prev.weight, ps.reps);
          if (r > bestPrior) bestPrior = r;
        });
      });
    });
    const thisEst = estimate1RM(e.weight, bestSetThis.reps);
    if (thisEst > bestPrior + 0.5 && bestPrior > 0) {
      prs.push({ id: e.id, name: e.name, weight: e.weight, reps: bestSetThis.reps, est: Math.round(thisEst) });
    }
  });
  return prs;
}

// Detect stall — 2+ sessions same type, same weight, missed reps
function detectStall(state, sessionId, exId) {
  const sessions = state.sessions.filter(s => s.sessionId === sessionId);
  if (sessions.length < 2) return false;
  const [a, b] = sessions.slice(-2);
  const eA = (a.exercises || []).find(e => e.id === exId);
  const eB = (b.exercises || []).find(e => e.id === exId);
  if (!eA || !eB) return false;
  return eA.weight === eB.weight;
}

// PR list (all-time best 1RM per exercise)
function allTimePRs(state) {
  const m = {};
  state.sessions.forEach(s => {
    (s.exercises || []).forEach(e => {
      (e.sets || []).forEach(st => {
        const est = estimate1RM(e.weight, st.reps);
        if (!m[e.id] || est > m[e.id].est) {
          m[e.id] = { id: e.id, name: e.name, weight: e.weight, reps: st.reps, est, date: s.date };
        }
      });
    });
  });
  return Object.values(m).sort((a, b) => b.est - a.est);
}

// ─────────────────────────────────────────────────────────────
// WARMUP GENERATORS
// ─────────────────────────────────────────────────────────────
function generateWarmupsWendler(ex, workWeight) {
  if (ex.type === 'isolation' || ex.type === 'isolation_db') return [];
  if (workWeight <= (ex.bar || 20)) return [];
  return [
    { w: Math.max(ex.bar || 20, roundToPlate(workWeight * 0.4, 2.5)), r: 5 },
    { w: Math.max(ex.bar || 20, roundToPlate(workWeight * 0.5, 2.5)), r: 5 },
    { w: Math.max(ex.bar || 20, roundToPlate(workWeight * 0.6, 2.5)), r: 3 },
  ];
}

function generateWarmupsBy(style, ex, workWeight) {
  // Respect plan-provided warmups regardless of style
  if (ex.warmups && ex.warmups.length) return ex.warmups;
  if (style === 'wendler') return generateWarmupsWendler(ex, workWeight);
  return generateWarmups(ex, workWeight);
}

// ─────────────────────────────────────────────────────────────
// SOUND VARIANTS
// ─────────────────────────────────────────────────────────────
function _dingAt(ctx, start) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = 1480;
  o.connect(g); g.connect(ctx.destination);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(0.4, start + 0.005);
  g.gain.exponentialRampToValueAtTime(0.001, start + 1.6);
  o.start(start); o.stop(start + 1.7);
  return [o];
}

function playDing() {
  try { const ctx = getAC(); _dingAt(ctx, ctx.currentTime); } catch {}
}

function _beepAt(ctx, start) {
  const osc = [];
  [0, 0.18].forEach((d) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square'; o.frequency.value = 1000;
    o.connect(g); g.connect(ctx.destination);
    const t = start + d;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.start(t); o.stop(t + 0.2);
    osc.push(o);
  });
  return osc;
}

function playBeep() {
  try { const ctx = getAC(); _beepAt(ctx, ctx.currentTime); } catch {}
}

// ─────────────────────────────────────────────────────────────
// PRE-SCHEDULED END-OF-REST SOUND (background-resilient)
// ─────────────────────────────────────────────────────────────
// Queue the rest-end sound `delaySeconds` into the future on the Web Audio
// render thread. That thread keeps running even when the page's JS timers are
// throttled — i.e. when the app is backgrounded or the phone screen is locked
// during a pause. Returns a handle whose cancel() stops the queued sound (used
// when the user skips, adjusts, or closes the timer early).
//
// Limits worth knowing: this cannot fire if the browser process is fully
// closed (no code runs at all), and iOS Safari suspends the AudioContext when
// backgrounded — so it is best effort within what the web platform allows.
function scheduleSound(kind, settings, delaySeconds) {
  const noop = { cancel() {} };
  if (!settings || !settings.soundEnabled) return noop;
  if (kind === 'silent' || kind === 'none') return noop;
  try {
    const ctx = getAC();
    const start = ctx.currentTime + Math.max(0, delaySeconds || 0);
    let osc;
    if (kind === 'ding') osc = _dingAt(ctx, start);
    else if (kind === 'beep') osc = _beepAt(ctx, start);
    else osc = _bellAt(ctx, start);
    return {
      cancel() {
        osc.forEach(o => {
          try { o.stop(); } catch {}
          try { o.disconnect(); } catch {}
        });
      },
    };
  } catch { return noop; }
}

function playSound(kind, settings) {
  if (!settings || !settings.soundEnabled) {
    if (settings?.vibrationEnabled && navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
    return;
  }
  if (settings.vibrationEnabled && navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
  if (kind === 'silent' || kind === 'none') return;
  if (kind === 'ding') return playDing();
  if (kind === 'beep') return playBeep();
  return playBell(true);
}

// ─────────────────────────────────────────────────────────────
// WAKE LOCK (keep screen awake during workout)
// ─────────────────────────────────────────────────────────────
let _wakeLock = null;
async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return false;
  try {
    _wakeLock = await navigator.wakeLock.request('screen');
    return true;
  } catch { return false; }
}
function releaseWakeLock() {
  if (_wakeLock) { try { _wakeLock.release(); } catch {} _wakeLock = null; }
}

// ─────────────────────────────────────────────────────────────
// RPE/RIR conversion
// ─────────────────────────────────────────────────────────────
function rpeToRir(rpe) { return Math.max(0, 10 - rpe); }
function rirToRpe(rir) { return 10 - rir; }

// ─────────────────────────────────────────────────────────────
// CUSTOM EXERCISES (merge with plan via replacements map)
// ─────────────────────────────────────────────────────────────
function getSessionExercises(state, sessionId) {
  const session = TRAINING_PLAN[sessionId];
  if (!session) return [];
  return session.exercises.map(ex => {
    const key = `${sessionId}-${ex.id}`;
    const replId = state.replacements?.[key];
    if (replId) {
      const custom = (state.customExercises || []).find(c => c.id === replId);
      if (custom) return { ...custom, replacedFrom: ex.id };
    }
    return ex;
  });
}

function getMobilityRoutine(id) { return MOBILITY_ROUTINES[id] || null; }
function listMobilityRoutines() { return Object.values(MOBILITY_ROUTINES); }

// ─────────────────────────────────────────────────────────────
// POSE ANALYZER — MediaPipe-basierte Video-Analyse (Browser-only)
// ─────────────────────────────────────────────────────────────
const POSE_SAMPLE_MS = 250;        // Sampling-Abstand zwischen Frames
const POSE_MAX_DURATION = 60;      // max. Videolänge in Sekunden
const POSE_SCREENSHOT_HEIGHT = 360; // Höhe für Key-Screenshots
const POSE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';
const POSE_VISION_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';
const POSE_WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';

// MediaPipe Landmark-Indizes (Subset)
const LM = {
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,    RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,    RIGHT_WRIST: 16,
  LEFT_HIP: 23,      RIGHT_HIP: 24,
  LEFT_KNEE: 25,     RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,    RIGHT_ANKLE: 28,
};

let _poseLandmarkerPromise = null;

async function loadPoseLandmarker(onProgress) {
  if (_poseLandmarkerPromise) return _poseLandmarkerPromise;
  _poseLandmarkerPromise = (async () => {
    onProgress?.('📦 Lade Pose-Modell (~3 MB) …');
    const vision = await import(/* @vite-ignore */ POSE_VISION_CDN);
    const fileset = await vision.FilesetResolver.forVisionTasks(POSE_WASM_BASE);
    const landmarker = await vision.PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: POSE_MODEL_URL, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return landmarker;
  })().catch(err => { _poseLandmarkerPromise = null; throw err; });
  return _poseLandmarkerPromise;
}

function avgPoint(a, b) {
  if (!a || !b) return null;
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: ((a.z || 0) + (b.z || 0)) / 2, v: Math.min(a.visibility ?? 1, b.visibility ?? 1) };
}

function angleBetween(a, b, c) {
  if (!a || !b || !c) return null;
  const ux = a.x - b.x, uy = a.y - b.y;
  const vx = c.x - b.x, vy = c.y - b.y;
  const dot = ux * vx + uy * vy;
  const mag = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
  if (mag < 1e-6) return null;
  const cos = Math.max(-1, Math.min(1, dot / mag));
  return Math.acos(cos) * 180 / Math.PI;
}

function trunkLeanFromVertical(shoulder, hip) {
  if (!shoulder || !hip) return null;
  const dx = shoulder.x - hip.x;
  const dy = shoulder.y - hip.y;
  const angRad = Math.atan2(Math.abs(dx), Math.abs(dy));
  return angRad * 180 / Math.PI;
}

function computeFrameAngles(landmarks) {
  if (!landmarks || landmarks.length < 29) return null;
  const ls = landmarks[LM.LEFT_SHOULDER], rs = landmarks[LM.RIGHT_SHOULDER];
  const le = landmarks[LM.LEFT_ELBOW],    re = landmarks[LM.RIGHT_ELBOW];
  const lw = landmarks[LM.LEFT_WRIST],    rw = landmarks[LM.RIGHT_WRIST];
  const lh = landmarks[LM.LEFT_HIP],      rh = landmarks[LM.RIGHT_HIP];
  const lk = landmarks[LM.LEFT_KNEE],     rk = landmarks[LM.RIGHT_KNEE];
  const la = landmarks[LM.LEFT_ANKLE],    ra = landmarks[LM.RIGHT_ANKLE];

  const sh = avgPoint(ls, rs);
  const hp = avgPoint(lh, rh);

  const kneeL = angleBetween(lh, lk, la);
  const kneeR = angleBetween(rh, rk, ra);
  const hipL  = angleBetween(ls, lh, lk);
  const hipR  = angleBetween(rs, rh, rk);
  const elbL  = angleBetween(ls, le, lw);
  const elbR  = angleBetween(rs, re, rw);
  const shdL  = angleBetween(le, ls, lh);
  const shdR  = angleBetween(re, rs, rh);

  function meanDefined(vals) {
    const v = vals.filter(x => x != null);
    if (!v.length) return null;
    return v.reduce((a, b) => a + b, 0) / v.length;
  }

  return {
    knee:     meanDefined([kneeL, kneeR]),
    hip:      meanDefined([hipL, hipR]),
    elbow:    meanDefined([elbL, elbR]),
    shoulder: meanDefined([shdL, shdR]),
    backLean: trunkLeanFromVertical(sh, hp),
    hipY:     hp?.y ?? null,
    sh, hp,
  };
}

function verdictForAngle(value, range) {
  if (value == null) return { state: 'unknown', diff: null };
  const [lo, hi] = range;
  if (value >= lo && value <= hi) return { state: 'ok', diff: 0 };
  const span = Math.max(1, hi - lo);
  const out = value < lo ? lo - value : value - hi;
  const rel = out / span;
  if (rel <= 0.15) return { state: 'warning', diff: value < lo ? -out : out };
  return { state: 'error', diff: value < lo ? -out : out };
}

function pickKeyFrames(exerciseId, frames) {
  const valid = frames.filter(f => f.angles);
  if (!valid.length) return [];
  const first = valid[0], last = valid[valid.length - 1];

  if (exerciseId === 'squat') {
    const bottom = valid.reduce((best, f) =>
      (f.angles.hipY != null && (best == null || f.angles.hipY > best.angles.hipY)) ? f : best, null);
    const out = [];
    if (first) out.push({ ...first, phase: 'lockout' });
    if (bottom && bottom !== first && bottom !== last) out.push({ ...bottom, phase: 'bottom' });
    if (last && last !== first) out.push({ ...last, phase: 'lockout' });
    return out;
  }
  if (exerciseId === 'bench') {
    const bottom = valid.reduce((best, f) =>
      (f.angles.elbow != null && (best == null || f.angles.elbow < best.angles.elbow)) ? f : best, null);
    const top = valid.reduce((best, f) =>
      (f.angles.elbow != null && (best == null || f.angles.elbow > best.angles.elbow)) ? f : best, null);
    const out = [];
    if (bottom) out.push({ ...bottom, phase: 'bottom' });
    if (top && top !== bottom) out.push({ ...top, phase: 'lockout' });
    return out;
  }
  if (exerciseId === 'deadlift') {
    const start = valid.reduce((best, f) =>
      (f.angles.hipY != null && (best == null || f.angles.hipY > best.angles.hipY)) ? f : best, null);
    const lockout = valid.reduce((best, f) =>
      (f.angles.hipY != null && (best == null || f.angles.hipY < best.angles.hipY)) ? f : best, null);
    const out = [];
    if (start) out.push({ ...start, phase: 'start' });
    if (lockout && lockout !== start) out.push({ ...lockout, phase: 'lockout' });
    return out;
  }
  const mid = valid[Math.floor(valid.length / 2)];
  return [
    { ...first, phase: 'lockout' },
    ...(mid && mid !== first && mid !== last ? [{ ...mid, phase: 'bottom' }] : []),
    ...(last && last !== first ? [{ ...last, phase: 'lockout' }] : []),
  ];
}

function captureFrameDataURL(video, targetHeight = POSE_SCREENSHOT_HEIGHT, quality = 0.75) {
  const ratio = video.videoWidth / video.videoHeight || 1;
  const h = Math.min(targetHeight, video.videoHeight || targetHeight);
  const w = Math.round(h * ratio);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);
  return c.toDataURL('image/jpeg', quality);
}

function seekVideo(video, t) {
  return new Promise((resolve, reject) => {
    let done = false;
    function onSeeked() {
      if (done) return;
      done = true;
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      resolve();
    }
    function onError(e) {
      if (done) return;
      done = true;
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      reject(e);
    }
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    try { video.currentTime = Math.min(t, video.duration - 0.01); }
    catch (e) { onError(e); }
  });
}

async function analyzeVideoForPose(file, exerciseId, onProgress) {
  if (!file) throw new Error('Keine Datei.');
  const formAngles = FORM_ANGLES[exerciseId];
  if (!formAngles) throw new Error('Übung wird (noch) nicht unterstützt.');

  const landmarker = await loadPoseLandmarker(onProgress);
  onProgress?.('🎞 Lade Video …', 0.05);

  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.style.position = 'fixed';
  video.style.left = '-9999px';
  video.style.top = '0';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.src = url;
  document.body.appendChild(video);

  const cleanup = () => {
    try { URL.revokeObjectURL(url); } catch {}
    try { video.removeAttribute('src'); video.load(); } catch {}
    try { video.remove(); } catch {}
  };

  try {
    await new Promise((resolve, reject) => {
      let done = false;
      video.addEventListener('loadedmetadata', () => { if (!done) { done = true; resolve(); } });
      video.addEventListener('error', e => { if (!done) { done = true; reject(new Error('Video konnte nicht geladen werden.')); } });
      setTimeout(() => { if (!done) { done = true; reject(new Error('Timeout beim Laden des Videos.')); } }, 15000);
    });

    const duration = Math.min(video.duration || 0, POSE_MAX_DURATION);
    if (!duration || !isFinite(duration)) throw new Error('Videolänge konnte nicht bestimmt werden.');

    const frames = [];
    const steps = Math.max(2, Math.floor(duration * 1000 / POSE_SAMPLE_MS));
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * duration;
      await seekVideo(video, t);
      const tsMs = Math.floor(t * 1000);
      let result;
      try { result = landmarker.detectForVideo(video, tsMs); }
      catch (e) { console.warn('detectForVideo failed at', t, e); continue; }
      const lm = result?.landmarks?.[0];
      const angles = computeFrameAngles(lm);
      frames.push({ t, angles });
      onProgress?.(`🧠 Analysiere Frames … ${i + 1}/${steps + 1}`, 0.1 + 0.6 * (i / steps));
    }

    const detected = frames.filter(f => f.angles).length;
    if (detected < 3) {
      throw new Error('Keine Pose erkannt — achte darauf, dass dein ganzer Körper im Bild ist (seitliche Aufnahme funktioniert am besten).');
    }

    onProgress?.('📸 Wähle Key-Frames …', 0.75);
    const keys = pickKeyFrames(exerciseId, frames);
    if (!keys.length) throw new Error('Konnte keine Key-Frames bestimmen.');

    const phases = formAngles.phases;
    const keyframes = [];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      await seekVideo(video, k.t);
      const dataUrl = captureFrameDataURL(video);
      const phaseDef = phases[k.phase] || Object.values(phases)[0];
      const checks = [];
      for (const [name, def] of Object.entries(phaseDef.targets)) {
        const value = k.angles[name];
        const verdict = verdictForAngle(value, def.range);
        checks.push({ name, value: value != null ? Math.round(value) : null, range: def.range, label: def.label, tip: def.tip, state: verdict.state, diff: verdict.diff != null ? Math.round(verdict.diff) : null });
      }
      keyframes.push({ t: k.t, phase: k.phase, phaseLabel: phaseDef.label, dataUrl, checks });
      onProgress?.(`📸 Screenshot ${i + 1}/${keys.length}`, 0.8 + 0.15 * (i / keys.length));
    }

    const issues = [];
    keyframes.forEach(kf => {
      kf.checks.forEach(c => {
        if (c.state === 'error') issues.push(`${kf.phaseLabel}: ${c.label} bei ${c.value}° (Soll ${c.range[0]}–${c.range[1]}°) — ${c.tip}`);
      });
    });
    let summary;
    if (!issues.length) {
      const warns = keyframes.flatMap(kf => kf.checks.filter(c => c.state === 'warning').map(c => `${kf.phaseLabel}: ${c.label} ${c.value}° (knapp am Limit)`));
      summary = warns.length
        ? `Saubere Ausführung — alle Hauptwinkel im grünen Bereich. Knapp:\n- ${warns.join('\n- ')}`
        : `Saubere Ausführung — alle erkannten Winkel innerhalb der Soll-Bereiche. Weiter so!`;
    } else {
      summary = `Verbesserungs­potenzial gefunden:\n- ${issues.join('\n- ')}`;
    }

    onProgress?.('✅ Fertig', 1);

    return {
      exerciseId,
      exerciseLabel: formAngles.label,
      keyframes,
      summary,
      generatedAt: Date.now(),
      framesAnalyzed: detected,
      durationSec: Math.round(duration * 10) / 10,
    };
  } finally {
    cleanup();
  }
}

function shrinkDataUrl(dataUrl, targetHeight, quality) {
  if (!dataUrl) return dataUrl;
  try {
    const img = new Image();
    img.src = dataUrl;
    if (!img.complete || !img.naturalWidth) return dataUrl;
    const ratio = img.naturalWidth / img.naturalHeight;
    const h = Math.min(targetHeight, img.naturalHeight);
    const w = Math.round(h * ratio);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    return c.toDataURL('image/jpeg', quality);
  } catch { return dataUrl; }
}

function saveVideoAnalysis(setState, exerciseId, report) {
  const SIZE_LIMIT = 800_000;
  let toSave = report;
  let payload = JSON.stringify(toSave);
  if (payload.length > SIZE_LIMIT) {
    toSave = { ...report, keyframes: report.keyframes.map(kf => ({ ...kf, dataUrl: shrinkDataUrl(kf.dataUrl, 220, 0.55) })) };
    payload = JSON.stringify(toSave);
  }
  if (payload.length > SIZE_LIMIT) {
    toSave = { ...report, keyframes: report.keyframes.map(kf => ({ ...kf, dataUrl: null })), imagesDroppedForStorage: true };
  }
  setState(s => ({
    ...s,
    videoAnalyses: { ...(s.videoAnalyses || {}), [exerciseId]: toSave },
  }));
  return toSave;
}

// ─────────────────────────────────────────────────────────────
// EXPORT TO WINDOW
// ─────────────────────────────────────────────────────────────
window.FT = {
  TRAINING_PLAN, SESSION_ORDER, SESSION_DOW, PLATE_COLORS,
  MUSCLE_MAP, FORM_CUES, FORM_ANGLES, MOBILITY_ROUTINES,
  loadState, saveState, defaultState, mergeDefaults,
  suggestNextWeight, findLastSession, findLastForExercise, exerciseHistory,
  estimate1RM, bestEstimate1RM, generateWarmups, generateWarmupsWendler, generateWarmupsBy,
  roundToPlate, calcPlates,
  playBell, playDing, playBeep, playClick, playSound, scheduleSound,
  fmtTime, todayISO, fmtDate, daysAgo, fmtWeight,
  suggestSessionToday, rpeCeiling,
  // new
  calcStreak, sessionVolume, volumeByMuscle, detectPRs, detectStall, allTimePRs,
  getCues, getMuscles, getFormAngles, getSessionExercises,
  getMobilityRoutine, listMobilityRoutines,
  requestWakeLock, releaseWakeLock,
  rpeToRir, rirToRpe,
  // pose video analysis
  analyzeVideoForPose, saveVideoAnalysis, loadPoseLandmarker,
};
