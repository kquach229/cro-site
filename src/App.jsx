import { useState } from "react";
import { SITE, SERVICES, WORK, PROCESS } from "./content.js";
import Logo from "./Logo.jsx";
import FunnelDemo from "./FunnelDemo.jsx";
import { useCountUp } from "./useCountUp.js";
function Header() {
  return (
    <header>
      <div className="wrap">
        <nav>
          <a className="logo" href="#top" aria-label={`${SITE.brand} home`}>
            <Logo />
          </a>
          <ul>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a className="btn small" href="#contact">
                Get in touch
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <h1>More of your visitors, becoming customers.</h1>
          <p className="lead">
            I find where your website loses people and run tested changes that
            turn more of them into sign-ups, bookings, and sales.
          </p>
          <div className="cta-row">
            <a className="btn" href="#contact">
              Increase your site conversion
            </a>
            <a className="btn ghost" href="#work">
              See results
            </a>
          </div>
        </div>
        <FunnelDemo />
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="band">
      <div className="wrap">
        <h2>What I do</h2>
        <p className="lead">
          Every project starts with data, not opinions about button colors.
        </p>
        <div className="grid3">
          {SERVICES.map((s) => (
            <div className="card" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value }) {
  const match = value.match(/^([+−-]?)(\d+)(.*)$/);
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = useCountUp(seen && match ? Number(match[2]) : 0);
  if (!match) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {match[1]}
      {Math.round(n)}
      {match[3]}
    </span>
  );
}

function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <h2>Selected work</h2>
        <p className="lead">A few recent projects and what changed.</p>
        <div className="work">
          {WORK.map((w) => (
            <article className="case" key={w.title}>
              <div className="shot">
                {w.image ? (
                  <img src={w.image} alt={`${w.title} screenshot`} />
                ) : (
                  "Project screenshot"
                )}
              </div>
              <div className="body">
                <div className="stat">{w.stat}</div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="band">
      <div className="wrap">
        <h2>How we work together</h2>
        <div className="tracks">
          {PROCESS.map((track) => (
            <div className="track" key={track.title}>
              <h3>{track.title}</h3>
              <p className="lead">{track.summary}</p>
              <ol className="steps">
                {track.steps.map((s) => (
                  <li key={s.title}>
                    <strong>{s.title}</strong>
                    <span>{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const src = "/profile.jpeg";

  return (
    <section id="about">
      <div className="wrap about">
        <div className="photo">
          <img src={src} alt={`Portrait`} />
        </div>
        <div>
          <h2>Hi, I’m {SITE.name}.</h2>
          <p className="lead">
            I come from software engineering, so I look at a website as a
            system: where people enter, where they stall, and what it takes to
            move them forward. I work with a small number of clients at a time
            so each one gets real attention.
          </p>
          <div className="cta-row">
            <a className="btn" href="#contact">
              Work with me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", site: "", msg: "" });
  const [status, setStatus] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\nWebsite: ${form.site}\n\n${form.msg}`;
    const subject = `Website inquiry from ${form.name}`;
    setStatus("Opening your email app. Press send there to finish.");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <h2>Let’s talk about your site</h2>
        <p className="lead">
          Tell me about your business and what you want to improve. I reply
          within two business days.
        </p>
        <form onSubmit={onSubmit}>
          <label className="f">
            Your name
            <input
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={set("name")}
            />
          </label>
          <label className="f">
            Your email
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
            />
          </label>
          <label className="f">
            Website address
            <input
              type="text"
              autoComplete="url"
              value={form.site}
              onChange={set("site")}
            />
          </label>
          <label className="f">
            What would you like to improve?
            <textarea required value={form.msg} onChange={set("msg")} />
          </label>
          <button className="btn" type="submit">
            Send message
          </button>
          <p role="status" className="lead status">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Services />
        <Work />
        <Process />
        <About />
        <Contact />
      </main>
      <footer>
        <div className="wrap">
          © {new Date().getFullYear()} {SITE.brand}. Conversion rate
          optimization.
        </div>
      </footer>
    </>
  );
}
