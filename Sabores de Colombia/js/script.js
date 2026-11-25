/**
 * Sabores de Colombia · interactividad y personalización
 *
 * Módulos independientes (cada uno se ignora solo si su HTML no existe,
 * así que el mismo archivo sirve también para las páginas de /recetas):
 *   Dropdown → RF-01 · menús desplegables
 *   Slider   → RF-02 · carruseles de imágenes
 *   I18n     → RF-03 · idioma y mensaje de bienvenida
 *   Culture  → RF-04 · fecha, momento del día y tono local
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // localStorage puede estar bloqueado (modo privado, políticas): no debe romper la página.
  const storage = (() => {
    try {
      localStorage.setItem('__t', '1');
      localStorage.removeItem('__t');
      return localStorage;
    } catch (_) {
      return { getItem: () => null, setItem: () => {} };
    }
  })();

  /* ====================================================================
   * Textos por idioma (RF-03) y datos culturales (RF-04)
   * Para añadir un idioma: nuevo bloque aquí + enlace con data-lang en el HTML.
   * ==================================================================== */
  const LANGUAGES = {
    es: {
      intl: 'es-CO',
      text: {
        'meta.title': 'Sabores de Colombia - Gastronomía Tradicional',
        'nav.label': 'Principal',
        'nav.home': 'INICIO', 'nav.regions': 'REGIONES', 'nav.recipes': 'RECETAS',
        'nav.allRegions': 'Ver todas las regiones',
        'region.andina': 'Región Andina', 'region.caribe': 'Región Caribe',
        'region.pacifica': 'Región Pacífica', 'region.orinoquia': 'Región Orinoquía',
        'region.amazonica': 'Región Amazónica', 'region.insular': 'Región Insular',
        'hero.title': 'COLOMBIA A TRAVÉS DE SUS SABORES',
        'hero.subtitle': 'Descubre la diversidad gastronómica de Colombia',
        'gallery.title': 'COLOMBIA EN IMÁGENES',
        'regions.title': 'EXPLORA LAS REGIONES',
        'recipes.title': 'RECETAS DESTACADAS',
        'recipes.all': 'VER TODAS LAS RECETAS',
        'recipe.view': 'VER RECETA',
        'recipe.arroz': 'Plato tradicional de la región Caribe.',
        'recipe.bandeja': 'Plato tradicional de la región Andina.',
        'recipe.sancocho': 'Plato tradicional de la región Pacífica.',
        'footer.rights': '© 2026 Sabores de Colombia. Una experiencia digital cultural y gastronómica.',
        'slider.label': 'Postales de las regiones',
        'slider.prev': 'Anterior', 'slider.next': 'Siguiente',
        'slider.dot': 'Ir a la diapositiva {n} de {total}',
        'slide.andina': 'Región Andina: sabores de montaña',
        'slide.caribe': 'Región Caribe: sol, mar y mariscos',
        'slide.pacifica': 'Región Pacífica: selva y litoral',
        'slide.orinoquia': 'Región Orinoquía: llanos y ríos',
        'slide.amazonica': 'Región Amazónica: sabores de selva',
        'slide.insular': 'Región Insular: islas y atardeceres',
        'alt.andina': 'Fotografía de un paisaje montañoso y tradicional de la Región Andina',
        'alt.caribe': 'Fotografía de la costa tropical y mar de la Región Caribe',
        'alt.pacifica': 'Fotografía de la selva biodiversa y litoral de la Región Pacífica',
        'alt.orinoquia': 'Fotografía de un barco pesquero de madera de color rojo sobre la orilla de un río o lago de la Región Orinoquía',
        'alt.amazonica': 'Fotografía de un mono tití subiendo por la rama de un árbol en medio de la vegetación de la Región Amazónica',
        'alt.insular': 'Fotografía de un atardecer sobre el mar con tonos rojizos y anaranjados en el horizonte de la Región Insular',
        'alt.arroz': 'Plato servido de arroz con camarones acompañado de patacones y ensalada',
        'alt.bandeja': 'Plato tradicional de Bandeja Paisa con frijoles, carne molida, chicharrón, huevo frito y arepa',
        'alt.sancocho': 'Plato hondo de Sancocho Serrano servido con trozos de yuca, plátano y carne',
        // Bienvenida y contexto cultural
        'greet.morning': 'Buenos días', 'greet.afternoon': 'Buenas tardes', 'greet.evening': 'Buenas noches',
        'welcome': '{greeting}, te damos la bienvenida a Sabores de Colombia',
        'local.today': 'Hoy en Colombia: {date}',
        'meal.breakfast': 'Es hora del desayuno, ¡buen provecho!',
        'meal.lunch': 'Es hora del almuerzo, ¡buen provecho!',
        'meal.onces': 'Es hora de las onces, ¿un tinto con pan?',
        'meal.dinner': 'Es hora de la comida, ¡buen provecho!',
        'meal.night': 'Noche tranquila: un chocolate con queso nunca falla.',

        // ---- Páginas de recetas ----
        'recipe.back': '← Volver a recetas',
        'recipe.history': 'Historia y Tradición',
        'recipe.ingredients': 'Ingredientes',
        'recipe.method': 'Preparación',

        'title.arroz': 'Arroz con Camarones - Sabores de Colombia',
        'arroz.title': 'Arroz con Camarones',
        'arroz.region': 'Región Caribe • Colombia',
        'arroz.history': 'El arroz con camarones está relacionado principalmente con las regiones costeras de Colombia, especialmente el Caribe y el Pacífico, donde los productos provenientes del mar forman parte importante de la alimentación tradicional. La combinación del arroz con camarones, verduras, condimentos y preparaciones propias de cada región refleja la influencia de las comunidades costeras y su relación histórica con los recursos marítimos y fluviales. Es un plato que evidencia la diversidad cultural y gastronómica de las costas colombianas, donde los ingredientes locales se integran con diferentes técnicas culinarias transmitidas entre generaciones.',
        'arroz.ing.1': '500 g. de camarones',
        'arroz.ing.2': '1 taza de arroz lavado',
        'arroz.ing.3': '½ taza de leche de coco',
        'arroz.ing.4': '½ taza de hogao o guiso',
        'arroz.ing.5': '1 cucharada de perejil',
        'arroz.ing.6': 'Sal y pimienta',
        'arroz.step.1': 'Limpie los camarones (pele y desvene). Cocine las cáscaras en una taza de agua por 5 minutos. Cuele el caldo y resérvelo.',
        'arroz.step.2': 'Caliente el hogao en una cazuela grande. Saltee los camarones brevemente, luego agregue el arroz, el caldo de las cáscaras y dos tazas de agua. Sazone con sal y pimienta, y cocine por 20 minutos.',
        'arroz.step.3': 'Añada la leche de coco, revuelva y deje cocinar a fuego muy lento por 10 minutos más (debe quedar húmedo). Espolvoree el perejil y sirva.',

        'title.bandeja': 'Bandeja Paisa - Sabores de Colombia',
        'bandeja.title': 'Bandeja Paisa',
        'bandeja.region': 'Región Andina • Colombia',
        'bandeja.history': 'La bandeja paisa es uno de los platos más representativos de la gastronomía de la región Andina, especialmente de Antioquia y el Eje Cafetero. Se caracteriza por ser una preparación abundante que reúne diferentes alimentos como fríjoles, arroz, carne molida, chicharrón, chorizo, huevo, plátano maduro, aguacate y arepa. Su composición refleja una tradición campesina en la que se buscaba proporcionar suficiente energía para las largas jornadas de trabajo agrícola. Culturalmente, representa la generosidad, abundancia y tradición familiar de la cultura paisa, y actualmente es reconocida como uno de los referentes de la identidad gastronómica colombiana.',
        'bandeja.ing.1': '150 g. de frijoles cocinados con un pocillo de hogao o guiso',
        'bandeja.ing.2': '500 g. de carne de res, molida',
        'bandeja.ing.3': '1 pocillo de hogao o guiso',
        'bandeja.ing.4': '500 g. de tocineta cortada en cuatro trozos',
        'bandeja.ing.5': 'Arroz blanco',
        'bandeja.ing.6': 'Patacones',
        'bandeja.ing.7': 'Arepas',
        'bandeja.ing.8': 'Aguacate',
        'bandeja.ing.9': 'Huevos',
        'bandeja.ing.10': 'Aceite',
        'bandeja.step.1': 'Fría la carne en un poco de aceite, agregue el hogao y cocine durante unos minutos, revolviendo de vez en cuando con una cuchara de madera.',
        'bandeja.step.2': 'A continuación, fría los trozos de tocineta en su propia grasa, hasta que esté tostada y se haga chicharrón.',
        'bandeja.step.3': 'Seguidamente, prepare el arroz blanco, los patacones y las arepas y guarde aparte.',
        'bandeja.step.4': 'Corte el aguacate por la mitad. Reparta todos los ingredientes preparados en bandejas individuales.',
        'bandeja.step.5': 'Por último, fría los huevos en aceite, ponga uno en cada bandeja y sirva.',

        'title.sancocho': 'Sancocho Serrano - Sabores de Colombia',
        'sancocho.title': 'Sancocho serrano',
        'sancocho.region': 'Región Pacífica • Colombia',
        'sancocho.history': 'El sancocho serrano hace parte de la tradición culinaria de las zonas andinas y montañosas de Colombia. El sancocho, en sus diferentes versiones, suele prepararse con carnes, plátano, yuca, papa, mazorca, cebolla, cilantro y otros ingredientes disponibles en cada territorio. El término "serrano" hace referencia a su relación con las regiones de montaña y a las particularidades locales de su preparación. Más allá de ser un alimento, el sancocho tiene un fuerte significado social y comunitario: tradicionalmente se prepara en grandes cantidades para compartir en reuniones familiares, encuentros entre amigos, celebraciones y actividades comunitarias. Por ello, representa valores como la hospitalidad, la unión y el compartir.',
        'sancocho.ing.1': '500 g de carne serrana, cortada en dados.',
        'sancocho.ing.2': '2 cebollas largas.',
        'sancocho.ing.3': '4 plátanos verdes, pelados y partidos a mano.',
        'sancocho.ing.4': '300 g de yuca.',
        'sancocho.ing.5': '200 g de papas.',
        'sancocho.ing.6': '1 tomate maduro, picado.',
        'sancocho.ing.7': '3 hojas de chillangua (cilantro cimarrón), molidas.',
        'sancocho.ing.8': '1 cucharadita de poleo molido.',
        'sancocho.ing.9': '1 aguacate.',
        'sancocho.ing.10': 'Sal y pimienta al gusto.',
        'sancocho.step.1': 'Corte la yuca y las papas en trozos. Agréguelas a la cacerola junto con los ingredientes restantes, excepto el aguacate.',
        'sancocho.step.2': 'Sazone con sal y pimienta al gusto. Cocine durante 20 minutos más, o hasta que todos los ingredientes estén tiernos.',
        'sancocho.step.3': 'Para finalizar, abra el aguacate por la mitad en sentido longitudinal, retire la pepa y córtelo en cuatro gajos.',
        'sancocho.step.4': 'Sirva el sancocho bien caliente acompañado de los gajos de aguacate.',
      },
    },
    en: {
      intl: 'en-US',
      text: {
        'meta.title': 'Flavors of Colombia - Traditional Cuisine',
        'nav.label': 'Main',
        'nav.home': 'HOME', 'nav.regions': 'REGIONS', 'nav.recipes': 'RECIPES',
        'nav.allRegions': 'See all regions',
        'region.andina': 'Andean Region', 'region.caribe': 'Caribbean Region',
        'region.pacifica': 'Pacific Region', 'region.orinoquia': 'Orinoquía Region',
        'region.amazonica': 'Amazon Region', 'region.insular': 'Island Region',
        'hero.title': 'COLOMBIA THROUGH ITS FLAVORS',
        'hero.subtitle': "Discover Colombia's culinary diversity",
        'gallery.title': 'COLOMBIA IN PICTURES',
        'regions.title': 'EXPLORE THE REGIONS',
        'recipes.title': 'FEATURED RECIPES',
        'recipes.all': 'VIEW ALL RECIPES',
        'recipe.view': 'VIEW RECIPE',
        'recipe.arroz': 'Traditional dish from the Caribbean region: rice with shrimp.',
        'recipe.bandeja': 'Traditional dish from the Andean region: a hearty platter of beans, ground beef, pork crackling, fried egg and arepa.',
        'recipe.sancocho': 'Traditional dish from the Pacific region: a hearty soup with yuca, plantain and meat.',
        'footer.rights': '© 2026 Flavors of Colombia. A cultural and culinary digital experience.',
        'slider.label': 'Postcards from the regions',
        'slider.prev': 'Previous', 'slider.next': 'Next',
        'slider.dot': 'Go to slide {n} of {total}',
        'slide.andina': 'Andean Region: flavors of the mountains',
        'slide.caribe': 'Caribbean Region: sun, sea and seafood',
        'slide.pacifica': 'Pacific Region: rainforest and coastline',
        'slide.orinoquia': 'Orinoquía Region: plains and rivers',
        'slide.amazonica': 'Amazon Region: rainforest flavors',
        'slide.insular': 'Island Region: islands and sunsets',
        'alt.andina': 'Photograph of a traditional mountain landscape in the Andean Region',
        'alt.caribe': 'Photograph of the tropical coast and sea of the Caribbean Region',
        'alt.pacifica': 'Photograph of the biodiverse rainforest and coastline of the Pacific Region',
        'alt.orinoquia': 'Photograph of a red wooden fishing boat on the shore of a river or lake in the Orinoquía Region',
        'alt.amazonica': 'Photograph of a tamarin monkey climbing a tree branch among the vegetation of the Amazon Region',
        'alt.insular': 'Photograph of a sunset over the sea with red and orange tones on the horizon of the Island Region',
        'alt.arroz': 'Plate of rice with shrimp served with fried plantain and salad',
        'alt.bandeja': 'Traditional Bandeja Paisa platter with beans, ground beef, pork crackling, fried egg and arepa',
        'alt.sancocho': 'Bowl of Sancocho Serrano served with pieces of yuca, plantain and meat',
        'greet.morning': 'Good morning', 'greet.afternoon': 'Good afternoon', 'greet.evening': 'Good evening',
        'welcome': '{greeting}, welcome to Flavors of Colombia',
        'local.today': 'Today in Colombia: {date}',
        'meal.breakfast': "It's breakfast time in Colombia. ¡Buen provecho!",
        'meal.lunch': "It's lunchtime in Colombia. ¡Buen provecho!",
        'meal.onces': "It's “onces” time in Colombia, the afternoon coffee-and-snack break.",
        'meal.dinner': "It's dinner time in Colombia. ¡Buen provecho!",
        'meal.night': 'Late night in Colombia: hot chocolate with cheese, anyone?',

        // ---- Recipe pages (local terms explained, metric + US measures) ----
        'recipe.back': '← Back to recipes',
        'recipe.history': 'History and Tradition',
        'recipe.ingredients': 'Ingredients',
        'recipe.method': 'Method',

        'title.arroz': 'Arroz con Camarones (Shrimp Rice) - Flavors of Colombia',
        'arroz.title': 'Arroz con Camarones (Shrimp Rice)',
        'arroz.region': 'Caribbean Region • Colombia',
        'arroz.history': "Rice with shrimp is mainly associated with Colombia's coastal regions, especially the Caribbean and the Pacific, where seafood is an important part of the traditional diet. The combination of rice, shrimp, vegetables, seasonings and regional preparations reflects the influence of coastal communities and their long relationship with sea and river resources. It is a dish that shows the cultural and culinary diversity of the Colombian coasts, where local ingredients blend with cooking techniques passed down through generations.",
        'arroz.ing.1': '500 g (about 1 lb) of shrimp',
        'arroz.ing.2': '1 cup of rinsed rice',
        'arroz.ing.3': '½ cup of coconut milk',
        'arroz.ing.4': '½ cup of hogao (Colombian tomato and scallion sauce, also called guiso)',
        'arroz.ing.5': '1 tablespoon of parsley',
        'arroz.ing.6': 'Salt and pepper',
        'arroz.step.1': 'Clean the shrimp (peel and devein). Simmer the shells in 1 cup of water for 5 minutes. Strain the broth and set it aside.',
        'arroz.step.2': 'Heat the hogao in a large pot. Briefly sauté the shrimp, then add the rice, the shell broth and 2 cups of water. Season with salt and pepper and cook for 20 minutes.',
        'arroz.step.3': 'Add the coconut milk, stir and cook over very low heat for 10 more minutes (it should stay moist). Sprinkle with parsley and serve.',

        'title.bandeja': 'Bandeja Paisa (Paisa Platter) - Flavors of Colombia',
        'bandeja.title': 'Bandeja Paisa (Paisa Platter)',
        'bandeja.region': 'Andean Region • Colombia',
        'bandeja.history': "The bandeja paisa is one of the most representative dishes of the Andean region's cuisine, especially in Antioquia and the Coffee Region (Eje Cafetero). It is a generous platter that brings together beans, rice, ground beef, pork crackling, chorizo, egg, ripe plantain, avocado and arepa. Its makeup reflects a rural tradition of providing enough energy for long days of farm work. Culturally, it stands for the generosity, abundance and family tradition of paisa culture, and it is now recognized as a reference point of Colombian culinary identity.",
        'bandeja.ing.1': '150 g (about 5 oz) of beans, cooked with 1 pocillo (a small cup, roughly ¼ cup) of hogao (Colombian tomato and scallion sauce, also called guiso)',
        'bandeja.ing.2': '500 g (about 1 lb) of ground beef',
        'bandeja.ing.3': '1 pocillo (a small cup, roughly ¼ cup) of hogao',
        'bandeja.ing.4': '500 g (about 1 lb) of tocineta (bacon or pork belly), cut into four pieces',
        'bandeja.ing.5': 'White rice',
        'bandeja.ing.6': 'Patacones (twice-fried green plantain)',
        'bandeja.ing.7': 'Arepas (Colombian corn cakes)',
        'bandeja.ing.8': 'Avocado',
        'bandeja.ing.9': 'Eggs',
        'bandeja.ing.10': 'Oil',
        'bandeja.step.1': 'Fry the beef in a little oil, add the hogao and cook for a few minutes, stirring from time to time with a wooden spoon.',
        'bandeja.step.2': 'Next, fry the tocineta pieces in their own fat until they are toasted and turn into chicharrón (crackling).',
        'bandeja.step.3': 'Then prepare the white rice, the patacones and the arepas, and set them aside.',
        'bandeja.step.4': 'Cut the avocado in half. Divide all the prepared ingredients among individual plates.',
        'bandeja.step.5': 'Finally, fry the eggs in oil, place one on each plate and serve.',

        'title.sancocho': 'Sancocho Serrano (Mountain-Style Stew) - Flavors of Colombia',
        'sancocho.title': 'Sancocho Serrano (Mountain-Style Stew)',
        'sancocho.region': 'Pacific Region • Colombia',
        'sancocho.history': "Sancocho serrano is part of the culinary tradition of Colombia's Andean and mountain areas. Sancocho, in its many versions, is usually made with meats, plantain, yuca, potato, corn on the cob, onion, cilantro and other ingredients available in each territory. The word \"serrano\" refers to its connection with mountain regions and the local particularities of its preparation. More than a meal, sancocho carries strong social and community meaning: it is traditionally made in large quantities to share at family gatherings, get-togethers with friends, celebrations and community events. That is why it stands for values such as hospitality, unity and sharing.",
        'sancocho.ing.1': '500 g (about 1 lb) of meat (carne serrana), cut into cubes.',
        'sancocho.ing.2': '2 long scallions (cebolla larga).',
        'sancocho.ing.3': '4 green plantains, peeled and broken into pieces by hand.',
        'sancocho.ing.4': '300 g (about 10 oz) of yuca (cassava).',
        'sancocho.ing.5': '200 g (about 7 oz) of potatoes.',
        'sancocho.ing.6': '1 ripe tomato, chopped.',
        'sancocho.ing.7': '3 chillangua leaves (cilantro cimarrón, similar to culantro), ground.',
        'sancocho.ing.8': '1 teaspoon of ground poleo (a mint-like Andean herb).',
        'sancocho.ing.9': '1 avocado.',
        'sancocho.ing.10': 'Salt and pepper to taste.',
        'sancocho.step.1': 'Cut the yuca and potatoes into pieces. Add them to the pot together with the remaining ingredients, except the avocado.',
        'sancocho.step.2': 'Season with salt and pepper to taste. Cook for another 20 minutes, or until everything is tender.',
        'sancocho.step.3': 'To finish, cut the avocado in half lengthwise, remove the pit and cut it into four wedges.',
        'sancocho.step.4': 'Serve the sancocho piping hot with the avocado wedges.',
      },
    },
  };

  const DEFAULT_LANGUAGE = 'es';
  const STORAGE_KEY = 'sabores.lang';
  const COLOMBIA_TZ = 'America/Bogota';

  /* ====================================================================
   * RF-03 · Idioma
   * ==================================================================== */
  const I18n = {
    lang: DEFAULT_LANGUAGE,

    init() {
      this.lang = this.detect();
      $$('[data-lang]').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault(); // cambia en la misma página, sin recargar
          this.set(link.dataset.lang);
        });
      });
      this.apply();
    },

    // Prioridad: preferencia guardada → idioma del navegador → español.
    detect() {
      const saved = storage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES[saved]) return saved;
      for (const tag of navigator.languages || [navigator.language]) {
        const base = String(tag).slice(0, 2).toLowerCase();
        if (LANGUAGES[base]) return base;
      }
      return DEFAULT_LANGUAGE;
    },

    set(lang) {
      if (!LANGUAGES[lang] || lang === this.lang) return;
      this.lang = lang;
      storage.setItem(STORAGE_KEY, lang);
      this.apply();
    },

    t(key, vars = {}) {
      const template = LANGUAGES[this.lang].text[key] ?? key;
      return template.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
    },

    // textContent y setAttribute (nunca innerHTML) para evitar inyección de HTML.
    apply() {
      document.documentElement.lang = this.lang === 'es' ? 'es-CO' : 'en';
      // Cada página puede indicar su clave de título con <html data-title-key="...">
      document.title = this.t(document.documentElement.dataset.titleKey || 'meta.title');

      requestAnimationFrame(() => {
        $$('[data-i18n]').forEach((el) => { el.textContent = this.t(el.dataset.i18n); });
        $$('[data-i18n-alt]').forEach((el) => el.setAttribute('alt', this.t(el.dataset.i18nAlt)));
        $$('[data-i18n-label]').forEach((el) => el.setAttribute('aria-label', this.t(el.dataset.i18nLabel)));

        $$('[data-lang]').forEach((link) => {
          const active = link.dataset.lang === this.lang;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });

        document.dispatchEvent(new CustomEvent('languagechange:site', { detail: { lang: this.lang } }));
      });
    },
  };

  /* ====================================================================
   * RF-04 · Adaptación cultural
   * Fecha con el formato de cada público, hora de Colombia y el momento
   * del día según las comidas del país (desayuno, almuerzo, onces, comida).
   * ==================================================================== */
  const Culture = {
    init() {
      document.addEventListener('languagechange:site', () => this.render());
    },

    colombiaHour() {
      const hour = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric', hourCycle: 'h23', timeZone: COLOMBIA_TZ,
      }).format(new Date());
      return Number(hour);
    },

    render() {
      const hour = this.colombiaHour();
      const greeting = hour < 12 ? 'morning' : hour < 19 ? 'afternoon' : 'evening';

      const welcome = $('#welcome-greeting');
      if (welcome) {
        welcome.textContent = I18n.t('welcome', { greeting: I18n.t(`greet.${greeting}`) });
      }

      const info = $('#local-info');
      if (info) {
        const date = new Intl.DateTimeFormat(LANGUAGES[I18n.lang].intl, {
          dateStyle: 'full', timeZone: COLOMBIA_TZ,
        }).format(new Date());
        const meal =
          hour >= 5 && hour < 11 ? 'breakfast' :
          hour >= 11 && hour < 15 ? 'lunch' :
          hour >= 15 && hour < 18 ? 'onces' :
          hour >= 18 && hour < 22 ? 'dinner' : 'night';
        info.textContent = `${I18n.t('local.today', { date })}. ${I18n.t(`meal.${meal}`)}`;
      }
    },
  };

  /* ====================================================================
   * RF-01 · Menús desplegables
   * Clic / Enter / Espacio abren y cierran; ↑ ↓ Inicio Fin navegan;
   * Esc cierra y devuelve el foco; clic fuera o perder el foco cierran.
   * ==================================================================== */
  const Dropdown = {
    init() {
      const instances = $$('[data-dropdown]').map((root) => this.create(root));
      document.addEventListener('click', (event) => {
        instances.forEach((dd) => { if (!dd.root.contains(event.target)) dd.close(); });
      });
    },

    create(root) {
      const toggle = $('.dropdown__toggle', root);
      const menu = $('.dropdown__menu', root);
      if (!toggle || !menu) return { root, close() {} };

      const links = () => $$('a', menu);
      const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

      const open = (focusFirst = false) => {
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        if (focusFirst) links()[0]?.focus();
      };
      const close = (returnFocus = false) => {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (returnFocus) toggle.focus();
      };

      toggle.addEventListener('click', () => (isOpen() ? close() : open()));
      toggle.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') { event.preventDefault(); open(true); }
        if (event.key === 'Escape') close();
      });

      menu.addEventListener('click', (event) => { if (event.target.closest('a')) close(); });
      menu.addEventListener('keydown', (event) => {
        const list = links();
        const i = list.indexOf(document.activeElement);
        const target = {
          ArrowDown: (i + 1) % list.length,
          ArrowUp: (i - 1 + list.length) % list.length,
          Home: 0,
          End: list.length - 1,
        }[event.key];

        if (target !== undefined) { event.preventDefault(); list[target].focus(); }
        else if (event.key === 'Escape') close(true);
      });

      root.addEventListener('focusout', (event) => {
        if (event.relatedTarget && !root.contains(event.relatedTarget)) close();
      });

      return { root, close };
    },
  };

  /* ====================================================================
   * RF-02 · Sliders (puede haber varios en la misma página)
   * Botones, puntos, flechas del teclado, deslizamiento táctil y autoplay
   * opcional (data-autoplay en milisegundos).
   * ==================================================================== */
  const Slider = {
    init() { $$('[data-slider]').forEach((root) => this.create(root)); },

    create(root) {
      const track = $('.slider__track', root);
      const slides = $$('.slide', track);
      const dotsBox = $('.slider__dots', root);
      if (!track || slides.length === 0) return;

      const delay = Number(root.dataset.autoplay) || 0;
      let current = 0;
      let timer = null;

      const dots = slides.map((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider__dot';
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', () => goTo(index));
        dotsBox?.appendChild(dot);
        return dot;
      });

      const labelDots = () => dots.forEach((dot, i) => {
        dot.setAttribute('aria-label', I18n.t('slider.dot', { n: i + 1, total: slides.length }));
      });

      function goTo(index) {
        current = (index + slides.length) % slides.length; // circular
        track.style.transform = `translateX(-${current * 100}%)`;
        slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
        dots.forEach((dot, i) => dot.setAttribute('aria-selected', String(i === current)));
      }

      const next = () => goTo(current + 1);
      const prev = () => goTo(current - 1);

      $('.slider__btn--next', root)?.addEventListener('click', next);
      $('.slider__btn--prev', root)?.addEventListener('click', prev);

      root.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') next();
        if (event.key === 'ArrowLeft') prev();
      });

      let startX = null;
      root.addEventListener('pointerdown', (event) => { startX = event.clientX; });
      root.addEventListener('pointerup', (event) => {
        if (startX === null) return;
        const dx = event.clientX - startX;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        startX = null;
      });

      // Autoplay: se pausa con mouse/foco/pestaña oculta y respeta "reducir movimiento".
      const start = () => {
        if (!delay || prefersReducedMotion || timer) return;
        timer = setInterval(next, delay);
      };
      const stop = () => { clearInterval(timer); timer = null; };

      ['mouseenter', 'focusin'].forEach((evt) => root.addEventListener(evt, stop));
      ['mouseleave', 'focusout'].forEach((evt) => root.addEventListener(evt, start));
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
      document.addEventListener('languagechange:site', labelDots);

      labelDots();
      goTo(0);
      start();
    },
  };

  /* ====================================================================
   * Punto de entrada
   * ==================================================================== */
  function init() {
    Culture.init(); // escucha el cambio de idioma antes de que I18n lo emita
    Dropdown.init();
    Slider.init();
    I18n.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
