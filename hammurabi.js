// Hammurabi's Code packet
// Same question format as packet1.js. The first choice is the right answer
// unless "answer" gives a different number (0 = first choice).
(function () {
  var BASE = { src: 'mesopotamia-map.png', w: 941, h: 713, view: [250, 60, 691, 520] };
  var BAB = [556, 345];
  var LABELS = {
    taurus: { x: 392, y: 112, text: '▲▲▲ Taurus Mountains ▲▲▲' },
    tigris: { x: 608, y: 250, text: 'Tigris River', rotate: 62 },
    euphrates: { x: 398, y: 290, text: 'Euphrates River', rotate: 32 },
    meso: { x: 470, y: 245, text: 'MESOPOTAMIA', rotate: 35, italic: true },
    gulf: { x: 720, y: 470, text: 'Persian Gulf', rotate: 32 },
    med: { x: 262, y: 390, text: 'Mediterranean Sea' }
  };
  function map(show, extra) {
    return { base: BASE, labels: show.map(function (k) { return LABELS[k]; }), star: BAB, marks: extra || [], zoom: false, north: true };
  }

  var mapQs = [
    { q: 'Look at the map. Hammurabi ruled from the city at the star ★. What is this city?', choices: ['Babylon', 'Egypt', 'Persia', 'Anatolia'],
      explain: 'The star shows Babylon. Hammurabi was the king of Babylon.', map: map(['tigris', 'euphrates', 'gulf', 'med']) },
    { q: 'Look at the map. Is Babylon (★) on the Tigris River or the Euphrates River?', choices: ['the Euphrates River', 'the Tigris River'], order: true,
      explain: 'Babylon is on the Euphrates River. The Euphrates is the river in the west.', map: map(['gulf', 'med']) },
    { q: 'Look at the map. What is the water at the question mark ❓?', choices: ['the Persian Gulf', 'the Mediterranean Sea', 'the Red Sea', 'the Dead Sea'],
      explain: 'The Tigris and Euphrates Rivers flow into the Persian Gulf.', map: map(['tigris', 'euphrates'], [{ q: 1, x: 750, y: 495 }]) },
    { q: 'Look at the map. What is the name of the land at the question mark ❓, between the two rivers?', choices: ['Mesopotamia', 'Egypt', 'Babylon', 'the Taurus Mountains'],
      explain: 'Mesopotamia means "the land between the rivers."', map: map(['tigris', 'euphrates', 'gulf'], [{ q: 1, x: 520, y: 260 }]) },
    { q: 'Look at the map. The rivers flow downstream from the mountains into the Persian Gulf. Which way do they flow?', choices: ['to the southeast', 'to the northwest', 'to the west', 'to the north'],
      explain: 'The rivers start in the Taurus Mountains in the north and flow southeast to the Persian Gulf.', map: map(['taurus', 'tigris', 'euphrates', 'gulf']) },
    { q: 'Look at the map. Where do the Tigris and Euphrates Rivers start?', choices: ['in the Taurus Mountains', 'in the Persian Gulf', 'in Babylon', 'in the Mediterranean Sea'],
      explain: 'Both rivers start in the Taurus Mountains in the north.', map: map(['taurus', 'tigris', 'euphrates', 'gulf', 'med']) },
    { q: 'Babylon was almost 4,000 years ago. Today, this land is in which country?', choices: ['Iraq', 'Afghanistan', 'Egypt', 'France'],
      explain: 'Mesopotamia and Babylon were in the land that is now Iraq.', map: map(['tigris', 'euphrates', 'gulf', 'med']) }
  ];

  var readQs = [
    { q: 'When did the story of Hammurabi happen?', choices: ['almost 4,000 years ago', 'about 100 years ago', 'last year', 'about 400 years ago'], explain: 'Hammurabi lived almost 4,000 years ago.' },
    { q: 'What is a city-state?', choices: ['a city and the farm land around it, with its own ruler', 'a large ocean', 'a book of laws', 'a kind of river boat'], explain: 'Each city-state was a city with farms around it, and each one had its own king and its own rules.' },
    { q: 'Why did farmers dig irrigation canals?', choices: ['to bring river water to their crops', 'to keep enemies away', 'to make salt', 'to build houses'], explain: 'Farmers dug irrigation canals to bring river water to their crops.' },
    { q: 'More food meant more people. What happened next?', choices: ['Small villages grew into big cities.', 'People moved to the desert.', 'The rivers dried up.', 'People stopped farming.'], explain: 'More food meant more people. Small villages grew into big cities.' },
    { q: 'Why did people living by the rivers need rules?', choices: ['They shared the same water and had conflicts about water, land, and trade.', 'They did not like to farm.', 'The rivers were too small to see.', 'They all lived far away from each other.'], explain: 'Living close together and sharing river water caused conflicts. People needed rules to settle them.' },
    { q: 'If one farmer did not fix his dam, what could happen?', choices: ['The water could flood his neighbor’s field.', 'The river would turn into salt water.', 'The king would give him money.', 'Nothing would happen.'], explain: 'A broken dam could flood a neighbor’s field and ruin the crops.' },
    { q: 'Who was Hammurabi?', choices: ['the king of Babylon', 'a farmer in Egypt', 'a god of the river', 'a scribe in Paris'], explain: 'Hammurabi was the king of Babylon, a city on the Euphrates River.' },
    { q: 'What did Hammurabi’s army do?', choices: ['It conquered the other city-states and made one empire.', 'It built the pyramids.', 'It moved everyone to Egypt.', 'It stopped all farming.'], explain: 'Hammurabi’s army conquered the other city-states. He joined them into one large empire.' },
    { q: 'Hammurabi made the government centralized. What does that mean?', choices: ['The king in Babylon made the big decisions for the whole empire.', 'Every village had its own king.', 'There was no government.', 'The farmers made all the laws.'], explain: 'Centralized means controlled from one center. The king in Babylon made the big decisions.' },
    { q: 'How many laws did Hammurabi write?', choices: ['282', '10', '7', '1,000'], explain: 'Around 1754 BCE, Hammurabi wrote 282 laws.' },
    { q: 'Why did Hammurabi want one set of laws?', choices: ['so the whole empire had the same rules', 'so each city could have different rules', 'so nobody had to follow rules', 'so only the king knew the rules'], explain: 'Before Hammurabi, each city-state had its own rules. He wanted one set of laws for his whole empire.' },
    { q: '"An eye for an eye, a tooth for a tooth" means ___.', choices: ['the punishment should match the crime', 'everyone should see a doctor', 'people must share their food', 'the king is always right'], explain: 'It means the punishment should match the crime. If you hurt someone’s eye, your eye will be hurt too.' },
    { q: 'Most of Hammurabi’s laws were about ___.', choices: ['property', 'sports', 'music', 'school'], explain: 'Most of the laws were about property: land, houses, animals, and other things people owned.' },
    { q: 'Some laws protected widows. What is a widow?', choices: ['a woman whose husband has died', 'a king’s daughter', 'a woman who sells goods', 'a girl who goes to school'], explain: 'A widow is a woman whose husband has died. The code tried to protect widows.' },
    { q: 'True or false: Hammurabi’s laws were the same for everyone.', choices: ['True', 'False'], answer: 1, order: true, explain: 'False. Rich people, poor people, and enslaved people got different punishments for the same crime.' },
    { q: 'The laws were written in ___, the writing of Mesopotamia.', choices: ['cuneiform', 'English', 'Arabic', 'pictures of animals'], explain: 'The laws were written in cuneiform. Cuneiform is made with wedge shapes.' },
    { q: 'Why did the stele stand where people could see it?', choices: ['so everyone could know the rules', 'so people could climb it', 'to hold back the river', 'to show where to buy food'], explain: 'The stele stood where people could see it, so everyone could know the rules.' },
    { q: 'How tall is the stele of Hammurabi?', choices: ['more than 7 feet, taller than a grown man', 'as small as a book', 'as tall as a child', 'as tall as a mountain'], explain: 'The stele is more than 7 feet tall. That is taller than a grown man.' },
    { q: 'Look at the top of the stele. Who sits on the right?', choices: ['Shamash, the god of justice', 'a farmer', 'a merchant', 'a widow'], img: { src: 'stele.webp', alt: 'Top of the stele of Hammurabi' }, explain: 'Hammurabi stands on the left. Shamash, the god of justice, sits on the right. The picture told people the gods wanted fair laws.' },
    { q: 'Look at this clay tablet. What are the wedge-shaped marks called?', choices: ['cuneiform', 'a map', 'a dam', 'a stele'], img: { src: 'tablet.jpg', alt: 'Clay tablet with cuneiform writing' }, explain: 'The wedge-shaped marks are cuneiform. Scribes copied the laws onto clay tablets like this one.' },
    { q: 'Where is the stele of Hammurabi today?', choices: ['in a museum in Paris, France (the Louvre)', 'in the Persian Gulf', 'in a school in Babylon', 'it was lost forever'], explain: 'Today the stele is in the Louvre, a museum in Paris, France.' },
    { q: 'River water → farming → extra food → ___ → conflicts → written laws. What goes in the blank?', choices: ['cities', 'deserts', 'mountains', 'boats'], explain: 'Extra food let people build cities. Cities had conflicts, so they needed written laws.' },
    { q: 'Why do many of Hammurabi’s laws talk about water, farms, crops, and boats?', choices: ['Life in Mesopotamia depended on the rivers.', 'Hammurabi lived in the desert.', 'There were no rivers in Mesopotamia.', 'People did not eat crops.'], explain: 'Geography shaped the laws. People depended on the rivers for water, farming, and trade.' }
  ];

  var lawQs = [
    { q: 'Law 53: "If a man is too lazy to keep his dam strong, and the dam breaks and floods the fields, he will be sold. The money will pay for the crops that were ruined." What is the problem in this law?', choices: ['A dam breaks and floods the fields.', 'A boat leaks.', 'A house falls down.', 'A man hurts another man’s eye.'], explain: 'The problem: a lazy man’s dam breaks and floods the fields.' },
    { q: 'Law 53: A lazy man’s dam breaks and floods the fields. What is his punishment?', choices: ['He will be sold, and the money pays for the ruined crops.', 'He gets a new dam for free.', 'He must leave the city for one day.', 'Nothing happens to him.'], explain: 'He will be sold. The money pays for the crops that were ruined.' },
    { q: 'Law 55: "If a man opens his canal to water his crops, but he is careless and the water floods his neighbor’s field, he must pay his neighbor grain for the loss." What must he do?', choices: ['pay his neighbor grain', 'build a new house', 'give his neighbor a boat', 'leave Babylon'], explain: 'He must pay his neighbor grain for the crops that were lost.' },
    { q: 'Law 48: A farmer owes a debt. A storm or flood ruins his crops. What does the law say?', choices: ['He does not have to pay that year.', 'He must pay two times more.', 'He will be put to death.', 'He must give the king his house.'], explain: 'If a storm, a flood, or no water ruins his crops, he does not have to pay that year.' },
    { q: 'Law 48 helps farmers when floods or no water ruin their crops. What does this tell you about life near the rivers?', choices: ['Floods and dry times were real dangers for farmers.', 'The rivers never flooded.', 'Farmers did not need water.', 'Nobody lived near the rivers.'], explain: 'Farmers depended on the rivers. Floods and dry times were real dangers, so the law protected them.' },
    { q: 'Law 235: "If a boat builder makes a boat that leaks, and it is damaged that same year, he must fix the boat with his own money." What is this law about?', choices: ['river trade and boats', 'eyes and teeth', 'houses', 'widows'], explain: 'Law 235 is about boats. People used boats on the rivers for trade.' },
    { q: 'Law 196: "If a man destroys another man’s eye, his own eye will be destroyed." Which famous words match this law?', choices: ['"An eye for an eye"', '"Fresh water is good"', '"The king is a god"', '"Build a strong dam"'], explain: 'Law 196 is "an eye for an eye." The punishment matches the crime.' },
    { q: 'Law 229: A builder builds a house that is not strong. The house falls down and kills the owner. What is the punishment?', choices: ['The builder will be put to death.', 'The builder pays one grain.', 'The builder builds a boat.', 'Nothing happens.'], explain: 'The builder will be put to death. The punishments in the code were very harsh.' },
    { q: 'Which law is about water or farming?', choices: ['Law 55 (a canal floods a neighbor’s field)', 'Law 196 (an eye for an eye)', 'Law 229 (a house falls down)'], explain: 'Laws 53, 55, 48, and 235 are about water, farming, or boats. Laws 196 and 229 are about other things.' },
    { q: 'Which law is NOT about water, farming, or boats?', choices: ['Law 229 (a house falls down)', 'Law 53 (a dam breaks)', 'Law 48 (a flood ruins crops)', 'Law 235 (a boat leaks)'], explain: 'Law 229 is about building houses in the city. The others are about water, farming, or boats.' },
    { q: 'Hammurabi wrote that his job was "so that the strong should not harm the weak." What does this mean?', choices: ['He wanted to protect weak people from strong people.', 'He wanted strong people to win every fight.', 'He wanted everyone to be strong.', 'He wanted to build strong dams.'], explain: 'Hammurabi said his job was to make the land fair and protect weak people from strong people.' },
    { q: 'Hammurabi’s laws are a primary source. What is a primary source?', choices: ['something made by people who lived at that time', 'a book written last year about the past', 'a map of the world today', 'a story that is not true'], explain: 'A primary source is something made by people who lived at that time, like a letter or a law.' },
    { q: 'Claim: The rivers helped Mesopotamia create laws. Which law is the best evidence?', choices: ['Law 53: a man whose dam breaks must pay for the ruined crops.', 'Law 196: an eye for an eye.', 'Law 229: a builder whose house falls is put to death.'], explain: 'Law 53 is about a dam and flooded fields. It shows life near the rivers shaped the laws.' }
  ];

  var CUNEI = '<svg width="40" height="40" viewBox="0 0 22 22"><path d="M2,3 l6,0 l-3,9 z M10,3 l6,0 l-3,9 z M3,15 l0,6 l9,-3 z M14,14 l7,3.5 l-7,3.5 z" fill="#5a3b14"/></svg>';
  var WORDS = [
    ['📜', 'law', 'a rule that everyone must follow'],
    ['📚', 'code', 'a written list of laws'],
    ['👑', 'Hammurabi', 'a king of Babylon who wrote a famous list of laws'],
    ['🏙️', 'Babylon', 'a big city on the Euphrates River in Mesopotamia'],
    ['🪨', 'stele', 'a tall stone with words carved on it', 'STEE-lee'],
    [CUNEI, 'cuneiform', 'the writing of Mesopotamia, made with wedge shapes'],
    ['⚖️', 'justice', 'being fair; giving people what is right'],
    ['🚫', 'punishment', 'what happens to a person who breaks a law'],
    ['🌊', 'irrigation canal', 'a ditch that carries river water to crops'],
    ['🧱', 'dam', 'a wall that holds back water'],
    ['🌾', 'crops', 'plants that farmers grow for food, like wheat and barley'],
    ['🗯️', 'conflict', 'a fight or a disagreement'],
    ['🏛️', 'civilization', 'a large group of people with cities, government, laws, and culture'],
    ['📄', 'primary source', 'something made by people who lived at that time, like a letter or a law'],
    ['🏘️', 'city-state', 'a city and the farm land around it, with its own ruler'],
    ['⚔️', 'conquer', 'to take over a place by fighting'],
    ['🗺️', 'empire', 'many lands and peoples ruled by one ruler'],
    ['🏛️', 'government', 'the group of people who make rules and lead a place'],
    ['🎯', 'centralized', 'controlled from one center, by one main leader'],
    ['💰', 'taxes', 'money or goods people must pay to the government'],
    ['🏠', 'property', 'things a person owns, like land, a house, or animals'],
    ['✋', 'rights', 'things the law says a person is allowed to have or do'],
    ['🪙', 'loan / debt', 'a loan is something you borrow; a debt is what you must pay back'],
    ['🐪', 'merchant', 'a person who buys and sells goods; a trader'],
    ['🖤', 'widow', 'a woman whose husband has died'],
    ['🟰', 'equality', 'when everyone is treated the same']
  ].map(function (w) {
    return { word: w[1], meaning: w[2], say: w[3], icon: w[0].charAt(0) === '<' ? w[0] : '<span class="emo">' + w[0] + '</span>' };
  });

  window.QUIZZES = window.QUIZZES || [];
  window.QUIZZES.push({
    id: 'hammurabi',
    title: 'Hammurabi’s Code: Laws by the River',
    short: 'Hammurabi’s Code',
    emoji: '📜',
    sections: [
      { id: 'words', title: 'Word Bank', emoji: '🔤', vocab: WORDS },
      { id: 'map', title: 'Where Was Babylon?', emoji: '🧭', questions: mapQs },
      { id: 'reading', title: 'The Reading', emoji: '📖', questions: readQs },
      { id: 'laws', title: 'The Laws (Primary Source)', emoji: '⚖️', questions: lawQs }
    ]
  });
})();
