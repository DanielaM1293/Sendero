export type L = { es: string; en: string }
export type Tag = 'nature' | 'adventure' | 'culture' | 'food' | 'relax'
export type Pace = 'slow' | 'medium' | 'fast'
export type Group = 'solo' | 'couple' | 'friends' | 'family'
export type SceneKind = 'cocora' | 'tayrona' | 'guatape' | 'tatacoa' | 'cartagena' | 'cafe'

const l = (es: string, en: string): L => ({ es, en })

export interface Experience {
  slug: string
  scene: SceneKind
  title: L
  region: L
  tagline: L
  desc: L
  priceUSD: number
  duration: L
  days: number
  difficulty: 1 | 2 | 3
  rating: number
  reviews: number
  maxGroup: number
  tags: Tag[]
  pace: Pace
  highlights: L[]
  itinerary: { t: L; title: L; text: L }[]
  includes: L[]
}

export const EXPERIENCES: Experience[] = [
  {
    slug: 'valle-de-cocora',
    scene: 'cocora',
    title: l('Valle de Cocora al amanecer', 'Cocora Valley at sunrise'),
    region: l('Salento, Quindío', 'Salento, Quindío'),
    tagline: l('Camina entre las palmas más altas del mundo.', 'Walk among the tallest palms on Earth.'),
    desc: l(
      'Salimos antes del alba en jeep Willys, cruzamos el bosque de niebla y subimos hasta el mirador donde las palmas de cera, el árbol nacional de Colombia, se asoman entre las nubes. Terminas con almuerzo campesino y café de la zona.',
      'We leave before dawn in a Willys jeep, cross the cloud forest and climb to the viewpoint where wax palms, Colombia’s national tree, rise through the clouds. You finish with a farmhouse lunch and local coffee.'
    ),
    priceUSD: 79,
    duration: l('1 día', '1 day'),
    days: 1,
    difficulty: 2,
    rating: 4.9,
    reviews: 412,
    maxGroup: 10,
    tags: ['nature', 'adventure'],
    pace: 'medium',
    highlights: [
      l('Amanecer sobre el valle', 'Sunrise over the valley'),
      l('Colibríes en la finca Acaime', 'Hummingbirds at Acaime farm'),
      l('Jeep Willys clásico', 'Classic Willys jeep ride'),
    ],
    itinerary: [
      { t: l('05:30', '5:30 am'), title: l('Salida en jeep', 'Jeep departure'), text: l('Parte desde la plaza de Salento con termo de café caliente.', 'Leaves from Salento’s main square with a thermos of hot coffee.') },
      { t: l('07:00', '7:00 am'), title: l('Bosque de niebla', 'Cloud forest trail'), text: l('Cruzamos puentes colgantes y arroyos con un guía naturalista.', 'We cross hanging bridges and streams with a naturalist guide.') },
      { t: l('10:00', '10:00 am'), title: l('Mirador de las palmas', 'Palm viewpoint'), text: l('El punto más alto: tiempo para fotos y para sentarse a mirar.', 'The highest point: time for photos and for simply sitting and looking.') },
      { t: l('12:30', '12:30 pm'), title: l('Almuerzo campesino', 'Farmhouse lunch'), text: l('Trucha, patacón y aguapanela en una finca local.', 'Trout, fried plantain and panela drink at a local farm.') },
    ],
    includes: [l('Guía bilingüe', 'Bilingual guide'), l('Jeep ida y vuelta', 'Round-trip jeep'), l('Desayuno y almuerzo', 'Breakfast and lunch'), l('Entradas a la reserva', 'Reserve entry fees')],
  },
  {
    slug: 'tayrona-selva-y-mar',
    scene: 'tayrona',
    title: l('Tayrona: selva y mar', 'Tayrona: jungle and sea'),
    region: l('Santa Marta, Magdalena', 'Santa Marta, Magdalena'),
    tagline: l('Duerme en hamaca frente al Caribe.', 'Sleep in a hammock facing the Caribbean.'),
    desc: l(
      'Dos días caminando por la selva hasta playas de arena dorada donde las montañas de la Sierra Nevada caen al mar. Dormimos en hamacas sobre un acantilado y despertamos con el sol saliendo del agua.',
      'Two days walking through the jungle to golden beaches where the Sierra Nevada mountains drop into the sea. We sleep in hammocks on a cliff and wake up to the sun rising out of the water.'
    ),
    priceUSD: 189,
    duration: l('2 días', '2 days'),
    days: 2,
    difficulty: 2,
    rating: 4.8,
    reviews: 286,
    maxGroup: 12,
    tags: ['nature', 'relax', 'adventure'],
    pace: 'slow',
    highlights: [l('Noche en hamaca frente al mar', 'Night in a hammock by the sea'), l('Snorkel en Piscina natural', 'Snorkeling in the natural pool'), l('Caminata por la selva', 'Jungle hike')],
    itinerary: [
      { t: l('Día 1 · 07:00', 'Day 1 · 7:00 am'), title: l('Entrada por El Zaino', 'Entry through El Zaino'), text: l('Una hora de caminata suave bajo la selva con guía local.', 'A gentle hour-long walk under the jungle canopy with a local guide.') },
      { t: l('Día 1 · 13:00', 'Day 1 · 1:00 pm'), title: l('Cabo San Juan', 'Cabo San Juan'), text: l('Almuerzo con vista y tarde libre para nadar.', 'Lunch with a view and a free afternoon to swim.') },
      { t: l('Día 2 · 05:30', 'Day 2 · 5:30 am'), title: l('Amanecer en el mirador', 'Sunrise at the lookout'), text: l('Café caliente mientras el cielo cambia de color.', 'Hot coffee while the sky changes color.') },
      { t: l('Día 2 · 10:00', 'Day 2 · 10:00 am'), title: l('Snorkel y regreso', 'Snorkel and return'), text: l('Mañana de agua clara antes de volver a Santa Marta.', 'A morning in clear water before heading back to Santa Marta.') },
    ],
    includes: [l('Guía bilingüe', 'Bilingual guide'), l('Hamaca y noche de alojamiento', 'Hammock and one night’s stay'), l('Todas las comidas', 'All meals'), l('Entrada al parque', 'Park entry')],
  },
  {
    slug: 'guatape-y-el-penol',
    scene: 'guatape',
    title: l('Guatapé y el Peñol', 'Guatapé and El Peñol'),
    region: l('Guatapé, Antioquia', 'Guatapé, Antioquia'),
    tagline: l('740 escalones para ver un lago lleno de islas.', '740 steps to see a lake full of islands.'),
    desc: l(
      'Subimos la roca del Peñol para ver el embalse desde arriba, navegamos entre islas y caminamos por las calles de zócalos de colores del pueblo. Un día redondo, a dos horas de Medellín.',
      'We climb El Peñol rock to see the reservoir from above, sail between islands and stroll the town’s colorful baseboard-painted streets. A well-rounded day, two hours from Medellín.'
    ),
    priceUSD: 65,
    duration: l('1 día', '1 day'),
    days: 1,
    difficulty: 1,
    rating: 4.7,
    reviews: 530,
    maxGroup: 14,
    tags: ['culture', 'relax'],
    pace: 'medium',
    highlights: [l('Vista desde la cima del Peñol', 'View from the top of El Peñol'), l('Paseo en lancha entre islas', 'Boat ride among islands'), l('Pueblo de zócalos', 'The baseboard-art village')],
    itinerary: [
      { t: l('08:00', '8:00 am'), title: l('Salida desde Medellín', 'Departure from Medellín'), text: l('Transporte cómodo con parada para desayunar.', 'Comfortable transport with a breakfast stop.') },
      { t: l('10:30', '10:30 am'), title: l('Subida al Peñol', 'Climb El Peñol'), text: l('Escalera de 740 peldaños, con descansos y miradores.', '740-step staircase with rest stops and viewpoints.') },
      { t: l('13:00', '1:00 pm'), title: l('Almuerzo y lancha', 'Lunch and boat'), text: l('Comida junto al embalse y paseo en lancha.', 'Lunch by the reservoir and a boat ride.') },
      { t: l('16:00', '4:00 pm'), title: l('Pueblo de Guatapé', 'Guatapé village'), text: l('Tiempo libre para fotos, helado y artesanías.', 'Free time for photos, ice cream and crafts.') },
    ],
    includes: [l('Transporte desde Medellín', 'Transport from Medellín'), l('Guía local', 'Local guide'), l('Entrada al Peñol', 'El Peñol entry'), l('Paseo en lancha', 'Boat ride')],
  },
  {
    slug: 'tatacoa-noche-de-estrellas',
    scene: 'tatacoa',
    title: l('Tatacoa: noche de estrellas', 'Tatacoa: night of stars'),
    region: l('Villavieja, Huila', 'Villavieja, Huila'),
    tagline: l('El desierto donde la Vía Láctea se ve a simple vista.', 'The desert where the Milky Way is visible to the naked eye.'),
    desc: l(
      'Recorremos los cañones rojos y grises al atardecer y, ya de noche, observamos el cielo con telescopios guiados por un astrónomo local. Dormimos en una cabaña con vista al desierto.',
      'We walk the red and gray canyons at sunset and, once it’s dark, stargaze through telescopes led by a local astronomer. We sleep in a cabin overlooking the desert.'
    ),
    priceUSD: 149,
    duration: l('2 días', '2 days'),
    days: 2,
    difficulty: 2,
    rating: 4.9,
    reviews: 198,
    maxGroup: 8,
    tags: ['adventure', 'nature'],
    pace: 'medium',
    highlights: [l('Observación con telescopio', 'Telescope stargazing'), l('Cañones al atardecer', 'Canyons at sunset'), l('Piscina natural en pleno desierto', 'Natural pool in the desert')],
    itinerary: [
      { t: l('Día 1 · 15:00', 'Day 1 · 3:00 pm'), title: l('Laberinto rojo', 'The red labyrinth'), text: l('Caminata entre formaciones de arcilla con el sol bajo.', 'A walk through clay formations in low sun.') },
      { t: l('Día 1 · 20:00', 'Day 1 · 8:00 pm'), title: l('Noche de estrellas', 'Night of stars'), text: l('Telescopios, constelaciones y mitos muiscas contados por el astrónomo.', 'Telescopes, constellations and Muisca myths told by the astronomer.') },
      { t: l('Día 2 · 06:00', 'Day 2 · 6:00 am'), title: l('Amanecer en el desierto', 'Desert sunrise'), text: l('Desayuno con vista a los cañones grises.', 'Breakfast overlooking the gray canyons.') },
      { t: l('Día 2 · 10:00', 'Day 2 · 10:00 am'), title: l('Los Hoyos', 'Los Hoyos pool'), text: l('Baño en una piscina natural antes del regreso.', 'A dip in a natural pool before heading back.') },
    ],
    includes: [l('Astrónomo guía', 'Astronomer guide'), l('Cabaña y desayuno', 'Cabin and breakfast'), l('Cena', 'Dinner'), l('Uso de telescopios', 'Telescope use')],
  },
  {
    slug: 'cartagena-sabores-del-caribe',
    scene: 'cartagena',
    title: l('Cartagena: sabores del Caribe', 'Cartagena: flavors of the Caribbean'),
    region: l('Cartagena, Bolívar', 'Cartagena, Bolívar'),
    tagline: l('Seis paradas, seis platos, una ciudad amurallada.', 'Six stops, six dishes, one walled city.'),
    desc: l(
      'Una tarde caminando por el centro histórico con una cocinera cartagenera. Probamos arepa de huevo, ceviche, cazuela de mariscos y dulces de coco mientras escuchamos las historias detrás de cada receta.',
      'An afternoon walking the historic center with a local cook. We taste egg arepa, ceviche, seafood stew and coconut sweets while hearing the stories behind each recipe.'
    ),
    priceUSD: 95,
    duration: l('1 tarde', '1 afternoon'),
    days: 1,
    difficulty: 1,
    rating: 4.8,
    reviews: 341,
    maxGroup: 8,
    tags: ['food', 'culture'],
    pace: 'slow',
    highlights: [l('Seis degustaciones', 'Six tastings'), l('Plaza de la Trinidad', 'Trinidad Square'), l('Atardecer sobre la muralla', 'Sunset on the city wall')],
    itinerary: [
      { t: l('15:00', '3:00 pm'), title: l('Mercado de Bazurto', 'Bazurto market'), text: l('Conocemos los ingredientes con quienes los venden.', 'We meet the ingredients and the people who sell them.') },
      { t: l('16:30', '4:30 pm'), title: l('Arepas y ceviche', 'Arepas and ceviche'), text: l('Dos paradas en Getsemaní, el barrio más vivo.', 'Two stops in Getsemaní, the liveliest neighborhood.') },
      { t: l('18:00', '6:00 pm'), title: l('Cazuela de mariscos', 'Seafood stew'), text: l('Plato principal en un restaurante familiar.', 'Main dish at a family-run restaurant.') },
      { t: l('19:00', '7:00 pm'), title: l('Dulces en la muralla', 'Sweets on the wall'), text: l('Postres de coco mientras cae el sol.', 'Coconut sweets as the sun sets.') },
    ],
    includes: [l('Guía cocinera', 'Cook-guide'), l('Seis degustaciones', 'Six tastings'), l('Bebidas', 'Drinks'), l('Propina incluida', 'Tip included')],
  },
  {
    slug: 'finca-cafetera-semilla-a-taza',
    scene: 'cafe',
    title: l('Finca cafetera: de la semilla a la taza', 'Coffee farm: from seed to cup'),
    region: l('Eje Cafetero, Caldas', 'Coffee Region, Caldas'),
    tagline: l('Recoge, tuesta y prepara tu propio café.', 'Pick, roast and brew your own coffee.'),
    desc: l(
      'Pasamos el día con una familia cafetera de tercera generación. Recoges cerezas en el cafetal, ves el beneficio, tuestas tu propio lote y lo preparas con ellos en la cocina.',
      'We spend the day with a third-generation coffee-growing family. You pick cherries in the field, see the processing, roast your own batch and brew it with them in the kitchen.'
    ),
    priceUSD: 59,
    duration: l('1 día', '1 day'),
    days: 1,
    difficulty: 1,
    rating: 4.9,
    reviews: 377,
    maxGroup: 10,
    tags: ['food', 'relax'],
    pace: 'slow',
    highlights: [l('Tuesta tu propio lote', 'Roast your own batch'), l('Cafetal entre colinas', 'Coffee fields among hills'), l('Almuerzo con la familia', 'Lunch with the family')],
    itinerary: [
      { t: l('09:00', '9:00 am'), title: l('Recolección', 'Picking'), text: l('Aprendes a elegir solo las cerezas maduras.', 'You learn to choose only the ripe cherries.') },
      { t: l('11:00', '11:00 am'), title: l('Beneficio', 'Processing'), text: l('Despulpado, fermentado y secado, paso a paso.', 'Pulping, fermenting and drying, step by step.') },
      { t: l('13:00', '1:00 pm'), title: l('Almuerzo familiar', 'Family lunch'), text: l('Sancocho y arepas en la cocina de la finca.', 'Sancocho and arepas in the farm kitchen.') },
      { t: l('15:00', '3:00 pm'), title: l('Tostión y cata', 'Roasting and tasting'), text: l('Tuestas tu lote y te lo llevas a casa.', 'You roast your batch and take it home.') },
    ],
    includes: [l('Guía caficultor', 'Farmer guide'), l('Almuerzo', 'Lunch'), l('250 g de café tostado', '250 g roasted coffee'), l('Transporte desde Manizales', 'Transport from Manizales')],
  },
]

export const getExp = (slug: string) => EXPERIENCES.find((e) => e.slug === slug)

export interface Addon {
  id: string
  price: number
  per: 'person' | 'booking'
  icon: 'photo' | 'transport' | 'lunch' | 'insurance'
}
export const ADDONS: Addon[] = [
  { id: 'photo', price: 25, per: 'booking', icon: 'photo' },
  { id: 'transport', price: 15, per: 'person', icon: 'transport' },
  { id: 'lunch', price: 12, per: 'person', icon: 'lunch' },
  { id: 'insurance', price: 6, per: 'person', icon: 'insurance' },
]

export const TESTIMONIALS = [
  {
    name: 'Camila Rojas',
    from: l('Medellín', 'Medellín'),
    slug: 'valle-de-cocora',
    text: l(
      'Llegamos al mirador justo cuando se abrió la niebla. Nuestro guía conocía cada pájaro del camino. Lloré un poquito, no voy a mentir.',
      'We reached the viewpoint just as the fog lifted. Our guide knew every bird along the trail. I teared up a little, not going to lie.'
    ),
  },
  {
    name: 'Daniel Keller',
    from: l('Berlín', 'Berlin'),
    slug: 'tatacoa-noche-de-estrellas',
    text: l(
      'Nunca había visto tantas estrellas. El astrónomo explicó todo con paciencia y humor, y la cabaña tenía una vista increíble.',
      'I had never seen so many stars. The astronomer explained everything with patience and humor, and the cabin had an incredible view.'
    ),
  },
  {
    name: 'Laura y Santiago',
    from: l('Bogotá', 'Bogotá'),
    slug: 'cartagena-sabores-del-caribe',
    text: l(
      'Fuimos por la comida y nos llevamos la historia de la ciudad. Doña Marta nos cocinó como si fuéramos de la familia.',
      'We went for the food and came away with the city’s history. Doña Marta cooked for us as if we were family.'
    ),
  },
  {
    name: 'Emma Tran',
    from: l('Toronto', 'Toronto'),
    slug: 'finca-cafetera-semilla-a-taza',
    text: l(
      'Tosté mi propio café y es el mejor que he probado. La familia nos recibió con una calidez que no se olvida.',
      'I roasted my own coffee and it’s the best I’ve ever had. The family welcomed us with a warmth you don’t forget.'
    ),
  },
]
