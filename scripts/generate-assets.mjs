/*
  Ассет-кит MERIDIAN через Google AI Studio (Gemini API, free tier).
  Запуск:  GEMINI_API_KEY=<ключ с aistudio.google.com> node scripts/generate-assets.mjs
  Модель:  gemini-2.5-flash-image (Nano Banana); GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview для Pro.
  Генерирует по одной, уже скачанные пропускает — можно перезапускать.
*/
import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PRINT_ONLY = process.argv.includes('--print')
const KEY = process.env.GEMINI_API_KEY
if (!KEY && !PRINT_ONLY) {
  console.error('Нет GEMINI_API_KEY. Возьми бесплатный ключ: https://aistudio.google.com/apikey')
  process.exit(1)
}
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'kit')
mkdirSync(OUT, { recursive: true })

/* единая серия: один свет, одна поверхность, один фон — иначе кит разъедется */
const LIGHT = 'single soft directional light from upper-left at 45 degrees, no harsh shadows'
const SURFACE = 'warm beige limestone slab'
const BG = 'minimal off-white #FAFAF9 background with very subtle gradient toward shadow'
const CAMERA =
  'photoreal high-end commercial product photography, 100mm macro equivalent lens, f/5.6, micro-contrast on material surface, subtle reflection underneath product'
const BAN =
  'unbranded clean dial with no brand name, no text, no logo, no labels, no captions, no watermarks, no people, no hands, no UI elements'
const MOOD = 'Mood: museum-piece, intentional, premium, Hermes product catalogue aesthetic.'

const ASSETS = [
  {
    name: 'hero-watch',
    aspect: '16:9',
    prompt: `Premium e-commerce hero: a handcrafted mechanical wristwatch with a dark charcoal guilloché dial and champagne-gold applied hour markers, sapphire caseback turned slightly so the mechanical movement with golden gears is partially visible, photographed at a clean three-quarter front angle lying on a ${SURFACE}, ${LIGHT}, ${CAMERA}, muted color palette, ${BAN}. Background: ${BG}. ${MOOD}`,
  },
  {
    name: 'product-noon',
    aspect: '4:5',
    prompt: `Premium e-commerce product hero: a handcrafted dress wristwatch with a pale opaline guilloché dial, warm pale-gold case and sand-colored alligator leather strap, photographed at a clean three-quarter front angle standing on a ${SURFACE}, ${LIGHT}, ${CAMERA}, muted color palette, ${BAN}. Background: ${BG}. ${MOOD}`,
  },
  {
    name: 'product-midnight',
    aspect: '4:5',
    prompt: `Premium e-commerce product hero: a handcrafted dress wristwatch with a deep black guilloché dial, blued steel hands, brushed steel case and black alligator leather strap, photographed at a clean three-quarter front angle standing on a ${SURFACE}, ${LIGHT}, ${CAMERA}, muted color palette, ${BAN}. Background: ${BG}. ${MOOD}`,
  },
  {
    name: 'product-gmt',
    aspect: '4:5',
    prompt: `Premium e-commerce product hero: a handcrafted traveller's wristwatch with a deep navy-blue guilloché dial, an additional slim gold 24-hour hand, brushed steel case and black rubber strap, photographed at a clean three-quarter front angle standing on a ${SURFACE}, ${LIGHT}, ${CAMERA}, muted color palette, ${BAN}. Background: ${BG}. ${MOOD}`,
  },
  {
    name: 'detail-dial',
    aspect: '1:1',
    prompt: `Extreme macro detail shot: clous de Paris hobnail guilloché pattern on a watch dial, champagne-gold applied hour marker catching the light, ${LIGHT}, ${CAMERA}, muted color palette, ${BAN}. ${MOOD}`,
  },
  {
    name: 'detail-movement',
    aspect: '4:3',
    prompt: `Extreme macro detail shot: a mechanical watch movement with Geneva stripes on the bridges, golden gear train, ruby jewel bearings in gold chatons and a balance wheel with hairspring, ${LIGHT}, ${CAMERA}, muted color palette, ${BAN}. ${MOOD}`,
  },
  {
    name: 'detail-strap',
    aspect: '1:1',
    prompt: `Extreme macro detail shot: hand-stitched sand-colored alligator leather watch strap with a brushed steel pin buckle, visible leather grain texture, lying on a ${SURFACE}, ${LIGHT}, ${CAMERA}, muted color palette, ${BAN}. ${MOOD}`,
  },
]

if (PRINT_ONLY) {
  for (const a of ASSETS) {
    console.log(`\n───── ${a.name}.png · aspect ${a.aspect} ─────\n${a.prompt}`)
  }
  process.exit(0)
}

const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`

async function generate({ name, prompt, aspect }) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: aspect },
      },
    }),
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  const data = await res.json()
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part) throw new Error(`нет изображения в ответе: ${JSON.stringify(data).slice(0, 300)}`)
  writeFileSync(join(OUT, `${name}.png`), Buffer.from(part.inlineData.data, 'base64'))
}

for (const asset of ASSETS) {
  const file = join(OUT, `${asset.name}.png`)
  if (existsSync(file)) {
    console.log(`⏭  ${asset.name}.png уже есть — пропускаю`)
    continue
  }
  process.stdout.write(`→ ${asset.name} (${asset.aspect}) ... `)
  try {
    await generate(asset)
    console.log('ok')
  } catch (e) {
    console.log(`ОШИБКА: ${e.message.slice(0, 300)}`)
  }
  await new Promise((r) => setTimeout(r, 7000))
}
console.log(`\nГотово. Файлы в public/assets/kit/ (модель: ${MODEL})`)
