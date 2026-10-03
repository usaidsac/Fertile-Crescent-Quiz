// Packet 1: Map of the Fertile Crescent
// Question format:
//   q        the question
//   choices  the first choice is the right answer (the app mixes them up)
//   explain  shown after the student answers
//   map      optional map picture (see app.js)
//   order    true = keep the choices in this order (for True/False, east/west)
(function () {
  var MAP = { src: 'fc-map.svg', w: 1000, h: 648 };
  var CLOSEUP = { src: 'fc-closeup.svg', w: 420, h: 541 };

  // number on the map: [name, x, y, hint]
  var FEATURES = {
    1: ['Tigris River', 710, 209, 'The Tigris is the river in the east. It flows from the Taurus Mountains to the Persian Gulf.'],
    2: ['Euphrates River', 524, 223, 'The Euphrates is the river in the west. It is longer than the Tigris.'],
    3: ['Mesopotamia', 593, 159, 'Mesopotamia is the land between the Tigris and Euphrates Rivers.'],
    4: ['Persian Gulf', 903, 507, 'The Tigris and Euphrates Rivers flow into the Persian Gulf.'],
    5: ['Mediterranean Sea', 138, 225, 'The Mediterranean Sea is the big sea in the west.'],
    6: ['Nile River', 172, 483, 'The Nile River flows north through Egypt, in Africa.'],
    7: ['Jordan River', 333, 228, 'The Jordan River flows south into the Dead Sea.'],
    8: ['Dead Sea', 333, 397, 'The Dead Sea is at the end of the Jordan River. It is very salty.'],
    9: ['Red Sea', 383, 571, 'The Red Sea is the long, narrow sea east of Egypt.'],
    10: ['Taurus Mountains', 248, 44, 'The Taurus Mountains are in the north. The triangles show the mountains.']
  };
  var NAMES = [];
  for (var k in FEATURES) NAMES.push(FEATURES[k][0]);

  function others(name, n) {
    var list = NAMES.filter(function (x) { return x !== name; });
    return { pool: list, n: n || 3 };
  }

  var mapQs = [];
  // "What is number __?"
  Object.keys(FEATURES).forEach(function (n) {
    var f = FEATURES[n];
    var closeup = (n === '7' || n === '8');
    mapQs.push({
      q: 'Look at the map. What is number ' + n + '?',
      choices: [f[0]],
      distract: others(f[0]),
      explain: 'Number ' + n + ' is the ' + f[0] + '. ' + f[3],
      map: closeup
        ? { base: CLOSEUP, ring: [f[1], f[2]], zoom: false, note: 'This is the close-up map.' }
        : { base: MAP, ring: [f[1], f[2]], zoom: true }
    });
  });
  // "Which number is __?"
  [['Persian Gulf', '4', '3'], ['Nile River', '6', '9'], ['Taurus Mountains', '10', '5'], ['Red Sea', '9', '6'], ['Euphrates River', '2', '1']]
    .forEach(function (r) {
      var nums = Object.keys(FEATURES).filter(function (x) { return x !== r[1] && x !== r[2] && x !== '7' && x !== '8'; });
      mapQs.push({
        q: 'Look at the map. Which number is the ' + r[0] + '?',
        choices: [r[1], r[2]],
        distract: { pool: nums, n: 2 },
        explain: 'The ' + r[0] + ' is number ' + r[1] + '. ' + FEATURES[r[1]][3],
        map: { base: MAP, zoom: false, big: true }
      });
    });
  // Map check (from page 4)
  var check = [
    ['The Persian Gulf is ___ of the Mediterranean Sea.', ['east', 'west'], 'Look at the compass. The Persian Gulf (4) is on the right side. Right is east.'],
    ['The Taurus Mountains are in the ___ of the Fertile Crescent.', ['north', 'south'], 'The mountains (10) are at the top of the map. The top is north.'],
    ['The Nile River is in ___.', ['Africa', 'Asia'], 'The Nile River flows through Egypt. Egypt is in Africa.'],
    ['The Red Sea is ___ of Egypt.', ['east', 'west'], 'The Red Sea (9) is on the right side of Egypt. Right is east.'],
    ['Mesopotamia is ___.', ['between two rivers', 'next to the Red Sea'], 'Mesopotamia means "the land between the rivers."'],
    ['The Jordan River flows ___ into the Dead Sea.', ['south', 'north'], 'The Dead Sea is at the bottom of the Jordan River. The water flows south.']
  ];
  check.forEach(function (c) {
    mapQs.push({ q: 'Map check: ' + c[0], choices: c[1], explain: c[2], map: { base: MAP, zoom: false, big: true } });
  });

  var readQs = [
    { q: 'What does the name Mesopotamia mean?', choices: ['the land between the rivers', 'the land of the mountains', 'the land by the sea', 'the dry desert land'], explain: 'Mesopotamia means "the land between the rivers."' },
    { q: 'What does the word fertile mean?', choices: ['good for growing crops', 'very dry and hot', 'full of salt water', 'high and rocky'], explain: 'Fertile means good for growing crops.' },
    { q: 'Why is it called the Fertile Crescent?', choices: ['It is good land for crops, and it is shaped like a curved moon.', 'It has many mountains shaped like a circle.', 'It is a big desert shaped like a square.', 'It is a sea shaped like a moon.'], explain: 'Fertile = good for growing crops. Crescent = a curved shape, like a thin moon.' },
    { q: 'Which two rivers flow through Mesopotamia?', choices: ['the Tigris and the Euphrates', 'the Nile and the Jordan', 'the Nile and the Tigris', 'the Jordan and the Euphrates'], explain: 'The Tigris River and the Euphrates River flow through Mesopotamia.' },
    { q: 'Where do the Tigris and Euphrates Rivers start?', choices: ['in the Taurus Mountains', 'in the Persian Gulf', 'in the Red Sea', 'in Egypt'], explain: 'Both rivers start in the Taurus Mountains in the north.' },
    { q: 'Where do the Tigris and Euphrates Rivers end?', choices: ['in the Persian Gulf', 'in the Mediterranean Sea', 'in the Dead Sea', 'in the Taurus Mountains'], explain: 'They flow downstream to the southeast and empty into the Persian Gulf.' },
    { q: 'Which river flows through Egypt?', choices: ['the Nile River', 'the Tigris River', 'the Jordan River', 'the Euphrates River'], explain: 'The Nile River flows through Egypt, in Africa.' },
    { q: 'Which way does the Nile River flow?', choices: ['north', 'south', 'east', 'west'], order: true, explain: 'The Nile flows north and empties into the Mediterranean Sea.' },
    { q: 'The Jordan River flows into the ___.', choices: ['Dead Sea', 'Red Sea', 'Persian Gulf', 'Nile River'], explain: 'The Jordan River flows south into the Dead Sea.' },
    { q: 'The Dead Sea is so salty that ___.', choices: ['fish cannot live in it', 'people drink it every day', 'farmers use it for crops', 'it turns red'], explain: 'The Dead Sea is so salty that fish cannot live in it.' },
    { q: 'What kind of water is in a sea?', choices: ['salt water', 'fresh water'], order: true, explain: 'A sea is a large body of salt water. People cannot drink it.' },
    { q: 'What kind of water is in a river?', choices: ['fresh water', 'salt water'], order: true, explain: 'A river has fresh water. People can drink it and use it for crops.' },
    { q: 'True or false: People can drink salt water.', choices: ['True', 'False'], answer: 1, order: true, explain: 'False. People cannot drink salt water. They need fresh water.' },
    { q: 'Most of the land around the Fertile Crescent is ___.', choices: ['desert', 'forest', 'ocean', 'ice'], explain: 'Most of the land around it is dry desert.' },
    { q: 'Why could people grow crops in the Fertile Crescent?', choices: ['The rivers gave fresh water and rich soil.', 'It rained every day.', 'The sea water was good for plants.', 'There were no people there.'], explain: 'The rivers gave fresh water and rich soil, so people could grow crops.' },
    { q: 'Why did some of the first civilizations start near rivers?', choices: ['People needed fresh water to drink and to grow food.', 'People liked to swim.', 'Rivers kept people warm.', 'There was no desert near rivers.'], explain: 'People needed fresh water to drink and to grow food. That is why the first civilizations started near rivers.' },
    { q: 'Mesopotamia is in the ___ part of the Fertile Crescent.', choices: ['eastern', 'western'], order: true, explain: 'Mesopotamia is in the eastern part of the Fertile Crescent.' },
    { q: 'Which of these is a geographic feature?', choices: ['a river', 'a law', 'a king', 'a book'], explain: 'Rivers, seas, mountains, and deserts are geographic features.' },
    { q: 'Look at the map. The dotted area shows ___.', choices: ['the Fertile Crescent', 'the Sahara Desert', 'the Red Sea', 'the Taurus Mountains'], explain: 'The dotted area is the Fertile Crescent. It curves like a crescent moon.', map: { base: MAP, zoom: false, big: true } }
  ];

  var WORDS = [
    ['fertile', 'good for growing crops'],
    ['crescent', 'a curved shape, like a thin moon'],
    ['region', 'a large area of land'],
    ['river', 'fresh water that flows across land'],
    ['sea', 'a large body of salt water'],
    ['gulf', 'part of a sea that goes into the land'],
    ['mountain range', 'a long line of mountains'],
    ['desert', 'very dry land with little rain'],
    ['fresh water', 'water that is not salty; people can drink it'],
    ['salt water', 'water that is salty; people cannot drink it'],
    ['geographic feature', 'a part of the land or water, like a river or mountain'],
    ['civilization', 'a large group of people with cities, laws, and writing']
  ].map(function (w) { return { word: w[0], meaning: w[1], icon: (window.ICONS || {})[w[0]] }; });

  window.QUIZZES = window.QUIZZES || [];
  window.QUIZZES.push({
    id: 'packet1',
    title: 'Packet 1: Map of the Fertile Crescent',
    short: 'Fertile Crescent Map',
    emoji: '🗺️',
    sections: [
      { id: 'words', title: 'Word Bank', emoji: '🔤', vocab: WORDS },
      { id: 'map', title: 'The Map', emoji: '🧭', questions: mapQs },
      { id: 'reading', title: 'The Reading', emoji: '📖', questions: readQs }
    ]
  });
})();
