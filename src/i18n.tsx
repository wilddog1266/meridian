import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'ru' | 'en'

const ru = {
  header: {
    themeToggle: 'Переключить тему',
    langToggle: 'Switch to English',
    preorder: 'Предзаказ',
  },
  hero: {
    label: 'Мануфактура · осн. 1987',
    line1: 'Время',
    line2: 'ручной работы',
    lead: 'Механические калибры собственной разработки. Тиражи до пятидесяти экземпляров в год.',
    dialAria: 'Циферблат MERIDIAN, показывает текущее время',
  },
  sections: {
    manifesto: {
      label: '01 · Манифест',
      title: 'Время не спешит. Настоящие часы - тоже.',
      copy: 'Мы делаем пятьдесят часов в год. Каждый экземпляр проходит двадцать один день сборки и пятьсот часов испытаний. Спешка — единственное, чего вы не найдёте в нашем ателье.',
      photoAlt: 'Корпус часов MERIDIAN и открытый механизм на каменной поверхности',
    },
    movement: {
      label: '02 · Механизм',
      title: 'Калибр M-01 · послойная сборка',
      calibreAria: 'Калибр M-01: колёсная передача вращается, баланс осциллирует',
      steps: [
        {
          title: 'Основная плата',
          copy: 'Фундамент калибра. Перляж наносится вручную — каждый круг перекрывает предыдущий ровно наполовину.',
        },
        {
          title: 'Колёсная передача',
          copy: 'Четыре колеса передают энергию заводного барабана. Анкерное колесо отпускает её шагами — шесть раз в секунду.',
        },
        {
          title: 'Мосты',
          copy: 'Держат оси колёс и принимают на себя износ. Côtes de Genève под углом 24 градуса — подпись мануфактуры.',
        },
        {
          title: 'Баланс',
          copy: 'Сердце часов: 21 600 полуколебаний в час. Точность хода регулируется шестью золотыми винтами на ободе.',
        },
      ],
    },
    collection: {
      label: '03 · Коллекция',
      title: 'Три модели. Пятьдесят экземпляров в год.',
      open: 'Подробнее',
      close: 'Закрыть',
      preorder: 'Оформить предзаказ',
      deposit: 'Депозит 20% при предзаказе · остаток при вручении в ателье',
      delivery: 'доставка — весна 2027',
      chapters: [
        {
          name: 'Полдень',
          tag: 'Опаловый циферблат, корпус из светлого золота. Часы для длинного дня.',
          price: "CHF 12'400",
          description:
            'Самая светлая модель мануфактуры: опаловый циферблат с гильоше clous de Paris ловит рассеянный свет, а корпус из светлого золота почти не заметен на запястье — до момента, когда на него падает солнце.',
          materials: ['Золото 750', 'Опаловый циферблат', 'Аллигатор песочный'],
          specs: [
            { k: 'Корпус', v: '38,5 мм' },
            { k: 'Калибр', v: 'M-01 · 72 ч' },
            { k: 'Тираж', v: '50 экз. / год' },
          ],
        },
        {
          name: 'Полночь',
          tag: 'Вороненая сталь и гильоше глубокой ночи. Первая модель мануфактуры.',
          price: "CHF 13'800",
          description:
            'Первая модель MERIDIAN и до сих пор самая узнаваемая. Вороненые стрелки над чёрным гильоше читаются мгновенно при любом освещении, а сталь 904L с годами лишь набирает характер.',
          materials: ['Сталь 904L', 'Вороненые стрелки', 'Аллигатор чёрный'],
          specs: [
            { k: 'Корпус', v: '40 мм' },
            { k: 'Калибр', v: 'M-01 · 72 ч' },
            { k: 'Тираж', v: '50 экз. / год' },
          ],
        },
        {
          name: 'Меридиан GMT',
          tag: 'Второй часовой пояс на 24-часовой стрелке. Для живущих в двух городах.',
          price: "CHF 18'200",
          description:
            'Калибр M-02 добавляет четвёртую стрелку: второй часовой пояс на 24-часовой шкале. Сине-стальной циферблат — отсылка к ночному небу над Шаффхаузеном, каким его видно из окон ателье.',
          materials: ['Сталь 904L', 'Циферблат синий', 'Каучук и аллигатор'],
          specs: [
            { k: 'Корпус', v: '40 мм' },
            { k: 'Калибр', v: 'M-02 GMT · 70 ч' },
            { k: 'Тираж', v: '30 экз. / год' },
          ],
        },
      ],
    },
    manufacture: {
      label: '04 · Мануфактура',
      title: 'Ателье в Шаффхаузене',
      copy: 'Двенадцать мастеров, четыре верстака у северных окон и ни одного конвейера. Каждый калибр собирает один часовщик — от первой платы до финальной регулировки.',
      photos: [
        { caption: 'Калибр M-01, мосты и колёсная передача', alt: 'Макросъёмка механизма: полосы Женевы, золотые колёса и рубины' },
        { caption: 'Гильоше clous de Paris', alt: 'Макросъёмка гильоширования циферблата с золотой метой' },
        { caption: 'Контроль под микроскопом', alt: 'Часовщик работает за микроскопом в ателье' },
        { caption: 'Ремешок ручной прошивки', alt: 'Макросъёмка ремешка из аллигатора со стальной пряжкой' },
      ],
    },
    specs: {
      label: '05 · Спецификации',
      title: 'Паспорт калибра',
      rows: [
        { k: 'Калибр', v: 'M-01' },
        { k: 'Завод', v: 'автоматический, ротор из золота 22 к' },
        { k: 'Частота', v: '21 600 пк/ч · 3 Гц' },
        { k: 'Запас хода', v: '72 часа' },
        { k: 'Камни', v: '27' },
        { k: 'Корпус', v: '40 мм · сталь 904L' },
        { k: 'Стекло', v: 'сапфир, двойной антиблик' },
        { k: 'Водозащита', v: '5 атм' },
        { k: 'Отделка', v: 'гильоше и перляж вручную' },
      ],
      serial: '№ 001 / 050 · Шаффхаузен',
    },
    final: {
      label: '06 · Ателье',
      title: 'Запись на примерку',
      line1: 'Ваше время',
      line2: 'уже собирается',
      button: 'Записаться на примерку',
      note: 'atelier@meridian-manufacture.ch · Rheinquai 8, Schaffhausen',
      rights: '© MMXXVI · сайт-концепт для портфолио',
    },
  },
}

export type Dict = typeof ru

const en: Dict = {
  header: {
    themeToggle: 'Toggle theme',
    langToggle: 'Переключить на русский',
    preorder: 'Pre-order',
  },
  hero: {
    label: 'Manufacture · est. 1987',
    line1: 'Time,',
    line2: 'made by hand',
    lead: 'Mechanical calibres of our own design. Limited to fifty pieces a year.',
    dialAria: 'MERIDIAN dial showing the current time',
  },
  sections: {
    manifesto: {
      label: '01 · Manifesto',
      title: 'Time cannot be rushed. Neither can a fine watch.',
      copy: 'We make fifty watches a year. Each piece takes twenty-one days to assemble and five hundred hours of testing. Haste is the one thing you will not find in our atelier.',
      photoAlt: 'A MERIDIAN watch case and its open movement on a stone surface',
    },
    movement: {
      label: '02 · Movement',
      title: 'Calibre M-01 · exploded view',
      calibreAria: 'Calibre M-01: the gear train turns, the balance wheel oscillates',
      steps: [
        {
          title: 'Mainplate',
          copy: 'The foundation of the calibre. Perlage is applied by hand — every circle overlaps the previous one by exactly half.',
        },
        {
          title: 'Gear train',
          copy: 'Four wheels carry the energy of the mainspring barrel. The escape wheel releases it in steps — six times a second.',
        },
        {
          title: 'Bridges',
          copy: 'They hold the wheel arbors and take the wear. Côtes de Genève at 24 degrees is the signature of the manufacture.',
        },
        {
          title: 'Balance',
          copy: 'The heart of the watch: 21,600 beats per hour. The rate is set by six gold screws on the rim.',
        },
      ],
    },
    collection: {
      label: '03 · Collection',
      title: 'Three models. Fifty pieces a year.',
      open: 'Discover',
      close: 'Close',
      preorder: 'Place a pre-order',
      deposit: '20% deposit on pre-order · balance due at the atelier',
      delivery: 'delivery — spring 2027',
      chapters: [
        {
          name: 'Noon',
          tag: 'Opaline dial, pale gold case. A watch for the long day.',
          price: "CHF 12'400",
          description:
            'The lightest model of the manufacture: an opaline dial with clous de Paris guilloché catches diffused light, while the pale gold case stays almost invisible on the wrist — until the sun finds it.',
          materials: ['18k gold', 'Opaline dial', 'Sand alligator'],
          specs: [
            { k: 'Case', v: '38.5 mm' },
            { k: 'Calibre', v: 'M-01 · 72 h' },
            { k: 'Edition', v: '50 pcs / year' },
          ],
        },
        {
          name: 'Midnight',
          tag: 'Blued steel and deep-night guilloché. The first model of the manufacture.',
          price: "CHF 13'800",
          description:
            'The first MERIDIAN model and still the most recognisable. Blued hands over black guilloché read instantly in any light, and 904L steel only gains character with the years.',
          materials: ['904L steel', 'Blued hands', 'Black alligator'],
          specs: [
            { k: 'Case', v: '40 mm' },
            { k: 'Calibre', v: 'M-01 · 72 h' },
            { k: 'Edition', v: '50 pcs / year' },
          ],
        },
        {
          name: 'Meridian GMT',
          tag: 'A second time zone on a 24-hour hand. For those who live in two cities.',
          price: "CHF 18'200",
          description:
            'Calibre M-02 adds a fourth hand: a second time zone on a 24-hour scale. The blue-steel dial recalls the night sky over Schaffhausen as seen from the atelier windows.',
          materials: ['904L steel', 'Blue dial', 'Rubber & alligator'],
          specs: [
            { k: 'Case', v: '40 mm' },
            { k: 'Calibre', v: 'M-02 GMT · 70 h' },
            { k: 'Edition', v: '30 pcs / year' },
          ],
        },
      ],
    },
    manufacture: {
      label: '04 · Manufacture',
      title: 'The atelier in Schaffhausen',
      copy: 'Twelve masters, four benches by the north windows and no assembly line. Each calibre is built by a single watchmaker — from the first plate to the final regulation.',
      photos: [
        { caption: 'Calibre M-01, bridges and gear train', alt: 'Macro photograph of a movement: Geneva stripes, golden wheels and rubies' },
        { caption: 'Clous de Paris guilloché', alt: 'Macro photograph of dial guilloché with a gold hour marker' },
        { caption: 'Inspection under the microscope', alt: 'A watchmaker working at a microscope in the atelier' },
        { caption: 'Hand-stitched strap', alt: 'Macro photograph of an alligator strap with a steel buckle' },
      ],
    },
    specs: {
      label: '05 · Specifications',
      title: 'Calibre passport',
      rows: [
        { k: 'Calibre', v: 'M-01' },
        { k: 'Winding', v: 'automatic, 22k gold rotor' },
        { k: 'Frequency', v: '21,600 vph · 3 Hz' },
        { k: 'Power reserve', v: '72 hours' },
        { k: 'Jewels', v: '27' },
        { k: 'Case', v: '40 mm · 904L steel' },
        { k: 'Crystal', v: 'sapphire, double AR coating' },
        { k: 'Water resistance', v: '5 atm' },
        { k: 'Finishing', v: 'hand guilloché and perlage' },
      ],
      serial: 'No. 001 / 050 · Schaffhausen',
    },
    final: {
      label: '06 · Atelier',
      title: 'Book a fitting',
      line1: 'Your time',
      line2: 'is already in assembly',
      button: 'Book a fitting',
      note: 'atelier@meridian-manufacture.ch · Rheinquai 8, Schaffhausen',
      rights: '© MMXXVI · portfolio concept site',
    },
  },
}

const dict: Record<Lang, Dict> = { ru, en }

const I18nContext = createContext<{
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dict
} | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() =>
    localStorage.getItem('meridian-lang') === 'en' ? 'en' : 'ru',
  )

  useEffect(() => {
    localStorage.setItem('meridian-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)!
}
