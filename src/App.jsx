import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')
const samples = [
  { id: 1, title: 'Історії, які хочеться пам’ятати', category: 'Фотографія', description: 'Живі емоції, природне світло й увага до деталей. Зберігаю атмосферу важливих подій у кадрах, до яких хочеться повертатися.', image_url: '/assets/wedding.jpg', accent: 'orange' },
  { id: 2, title: 'Відео з характером', category: 'Відеовиробництво', description: 'Композиція, рух камери, світло й монтаж поєднуються у цілісну візуальну розповідь.', image_url: '/assets/навчання.png', accent: 'blue' },
  { id: 3, title: 'Навчання бачити кадр', category: 'Освіта та креатив', description: 'Розвиваю операторське мислення: від побудови кадру й роботи з фокусом до власних відеоісторій.', image_url: '/assets/навчання композиції.png', accent: 'mint' },
]
const testimonials = [
  ['Олена', 'Фотозйомка події', 'Дуже комфортна атмосфера під час зйомки. Отримали живі кадри, які хочеться переглядати знову і знову.'],
  ['Андрій', 'Відеопроєкт', 'Уважність до деталей і чудове відчуття моменту. Відео передало саме ті емоції, які ми хотіли зберегти.'],
  ['Марія', 'Індивідуальна зйомка', 'Усе чітко й професійно — від підготовки до готового матеріалу. Комунікація була легкою на кожному етапі.'],
  ['Дмитро', 'Навчальний проєкт', 'Пояснення прості та зрозумілі, а практики достатньо, щоб одразу спробувати нові прийоми.'],
]

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header"><a href="#home" className="brand">ЮД<span>.</span></a><button className="menu-button" aria-label="Меню" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><nav className={open ? 'nav nav-open' : 'nav'}>{[['Проєкти','#cases'],['Відгуки','#testimonials'],['Роботи','#work']].map(([label,href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Обговорити проєкт <ArrowUpRight size={15}/></a></nav></header>
}

function App() {
  const [projects, setProjects] = useState(samples)
  const [apiStatus, setApiStatus] = useState('loading')
  const [slide, setSlide] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetch(`${API}/api/projects`).then(r => { if (!r.ok) throw new Error(); return r.json() }).then(data => { if (data.length) setProjects(data); setApiStatus('online') }).catch(() => setApiStatus('offline'))
  }, [])

  async function submit(event) {
    event.preventDefault(); setSending(true); setNotice('')
    try {
      const response = await fetch(`${API}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!response.ok) throw new Error('Не вдалося надіслати повідомлення.')
      setNotice('Дякую! Повідомлення надіслано. Скоро зв’яжуся з вами.'); setForm({ name: '', email: '', phone: '', message: '' })
    } catch { setNotice('Не вдалося з’єднатися із сервером. Перевірте, чи запущений бекенд, і спробуйте ще раз.') }
    finally { setSending(false) }
  }

  const recent = [
    { title: 'Мить у фокусі', meta: 'Фотографія · Портрет', src: '/assets/header logo.jpg' },
    { title: 'Рух і світло', meta: 'Відео · Операторська робота', src: '/assets/навчання.png' },
    { title: 'За кадром', meta: 'Процес · Творчість', src: '/assets/навчання композиції.png' },
    { title: 'Світло навколо', meta: 'Візуальна історія', src: '/assets/wedding.jpg' },
  ]

  return <><Header /><main>
    <section className="hero" id="home"><div className="hero-inner"><div className="hero-copy"><p className="eyebrow">ПОРТФОЛІО · ФОТО / ВІДЕО / КРЕАТИВ</p><h1>Юрій<br/>Деркач<span className="lime">.</span></h1><p className="hero-lede">Створюю візуальні історії, що передають емоції. Фотографія, відеозйомка та креативні цифрові проєкти — від ідеї до готового результату.</p><a className="button button-lime" href="#cases">Переглянути роботи <ArrowDownRight size={18}/></a><div className="availability"><i/>Відкритий до цікавих проєктів</div></div><div className="portrait-wrap"><img src="/assets/header logo.jpg" alt="Портрет Юрія Деркача"/><div className="portrait-caption"><span>01 / 03</span><span>ТВОРЧІСТЬ У КАДРІ</span></div></div></div><div className="clients"><span>ФОТОГРАФІЯ</span><span>ВІДЕО</span><span>МОНТАЖ</span><span>КРЕАТИВ</span><span>ВІЗУАЛЬНІ ІСТОРІЇ</span></div></section>
    <section className="section projects" id="cases"><div className="section-title"><p className="eyebrow green-text">ВИБРАНІ ПРОЄКТИ</p><h2>Кейси та проєкти</h2><p>Кожен проєкт — це окрема історія, продумана від першої ідеї до фінального кадру.</p>{apiStatus === 'offline' && <span className="api-hint">Показано демо проєкти · API поки недоступний</span>}</div><div className="project-list">{projects.map((item, index) => <article className={`project-row ${index % 2 ? 'reverse' : ''}`} key={item.id}><div className="project-copy"><span className={`tag ${item.accent || ['orange','blue','mint'][index % 3]}`}>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><a className="text-link" href="#contact">Обговорити проєкт <ArrowRight size={16}/></a></div><img src={item.image_url} alt={item.title} loading="lazy"/></article>)}</div></section>
    <section className="section testimonials" id="testimonials"><div className="section-title"><p className="eyebrow green-text">ЩО КАЖУТЬ КЛІЄНТИ</p><h2>Відгуки</h2><p>Найкраща оцінка роботи — довіра та бажання працювати разом знову.</p></div><div className="quote-grid">{testimonials.map(([name, meta, quote], i) => <article className="quote" key={name}><span className="quote-mark">“</span><p>{quote}</p><div className="quote-person"><span className={`avatar avatar-${i}`}>{name[0]}</span><div><strong>{name}</strong><small>{meta}</small></div></div></article>)}</div><p className="disclaimer">Відгуки наведені як демонстраційний контент. Замініть їх на відгуки клієнтів.</p></section>
    <section className="section recent" id="work"><div className="section-title"><p className="eyebrow green-text">ЗА ЛАШТУНКАМИ</p><h2>Останні роботи</h2><p>Добірка кадрів і творчих процесів. Гортайте, щоб переглянути більше.</p></div><div className="carousel"><button className="carousel-arrow" aria-label="Попередня робота" onClick={() => setSlide((slide + recent.length - 1) % recent.length)}><ArrowLeft/></button><article className="recent-card"><img src={recent[slide].src} alt={recent[slide].title}/><h3>{recent[slide].title}</h3><p>{recent[slide].meta}</p><span className="slide-count">0{slide+1} / 0{recent.length}</span></article><button className="carousel-arrow" aria-label="Наступна робота" onClick={() => setSlide((slide + 1) % recent.length)}><ArrowRight/></button></div></section>
    <section className="section contact" id="contact"><div className="section-title"><p className="eyebrow green-text">Є ІДЕЯ?</p><h2>Давайте створимо щось особливе</h2><p>Розкажіть коротко про свій задум — і я зв’яжуся з вами, щоб обговорити деталі.</p></div><form className="contact-form" onSubmit={submit}><label htmlFor="name">Ваше ім’я</label><input id="name" required maxLength="100" placeholder="Як до вас звертатися?" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/><label htmlFor="email">Електронна пошта</label><input id="email" type="email" required maxLength="254" placeholder="name@example.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/><label htmlFor="phone">Телефон або месенджер <span>(необов’язково)</span></label><input id="phone" maxLength="40" placeholder="+380 ..." value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}/><label htmlFor="message">Розкажіть про проєкт</label><textarea id="message" required minLength="5" maxLength="5000" rows="5" placeholder="Кілька слів про вашу ідею..." value={form.message} onChange={e => setForm({...form,message:e.target.value})}/><button className="button button-lime submit" disabled={sending}>{sending ? 'Надсилаємо…' : 'Надіслати повідомлення'} <ArrowUpRight size={18}/></button>{notice && <p className={`form-notice ${notice.startsWith('Дякую') ? 'success' : 'error'}`} role="status">{notice}</p>}</form></section>
  </main><footer><a className="brand" href="#home">ЮД<span>.</span></a><p>© {new Date().getFullYear()} Юрій Деркач. Створено з увагою до деталей.</p><a href="#home">На початок ↑</a></footer></>
}

export default App
