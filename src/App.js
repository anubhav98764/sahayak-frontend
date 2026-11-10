import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartHandshake, ArrowUpRight, ShieldCheck, Users, Activity, Menu, X,
  UserRound, HandHeart, LayoutDashboard, CheckCircle2, BellRing, MapPin, Lock
} from 'lucide-react';
import { useState } from 'react';
import api from './api';

function Brand({ size = 22 }) {
  return (
    <Link to="/" className="brand">
      <span className="brand-icon"><HeartHandshake size={size} /></span>
      <span className="brand-text">
        <strong>Sahayak</strong>
        <small>Community care network</small>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="nav">
      <div className="nav-inner">
        <Brand />
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav-links show' : 'nav-links'}>
          <a href="/#how" onClick={close}>How it works</a>
          <a href="/#join" onClick={close}>Join us</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <Brand size={20} />
        <p>A community-powered support network for older adults.</p>
        <small>© 2026 Sahayak · Prototype</small>
      </div>
    </footer>
  );
}

function Home() {
  const { state } = useLocation();
  return (
    <>
      {state?.message && (
        <div className="container">
          <div className="banner" role="status"><CheckCircle2 size={20} /> {state.message}</div>
        </div>
      )}

      <section className="hero container">
        <div className="hero-copy">
          <span className="pill"><i /> Community-powered care</span>
          <h1>Care that connects. Help that arrives.</h1>
          <p className="lead">
            Sahayak links older adults with verified, responsive volunteers and a coordinator who keeps every request on track.
          </p>
          <div className="actions">
            <Link className="button primary large" to="/register/user">Register as a user <ArrowUpRight size={18} /></Link>
            <Link className="button secondary large" to="/register/volunteer">Register as a volunteer</Link>
          </div>
          <ul className="trust">
            <li><ShieldCheck size={18} /> Secure profiles</li>
            <li><Users size={18} /> Community support</li>
            <li><Activity size={18} /> Coordinated care</li>
          </ul>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="status-card">
            <div className="status-head">
              <span><i /> Sample request</span>
              <b>Groceries &amp; pharmacy</b>
            </div>
            <ol className="status-list">
              <li className="done"><span><CheckCircle2 size={18} /></span><div><b>Request received</b><small>Coordinator notified</small></div></li>
              <li className="done"><span><HandHeart size={18} /></span><div><b>Volunteer matched</b><small>Skills and area checked</small></div></li>
              <li className="live"><span><MapPin size={18} /></span><div><b>On the way</b><small>Arriving shortly</small></div></li>
            </ol>
            <div className="status-foot"><BellRing size={16} /> Family contact is kept informed</div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="container">
          <div className="section-title">
            <h2>One platform, three clear roles</h2>
            <p>Separate experiences for the people who need support, those who provide it, and those who coordinate it.</p>
          </div>
          <div className="feature-grid">
            <article className="feature">
              <div className="feature-icon blue"><UserRound /></div>
              <h3>For older adults</h3>
              <p>Create a profile with essential personal, medical and emergency contact information.</p>
              <Link to="/register/user">Register as a user <ArrowUpRight size={16} /></Link>
            </article>
            <article className="feature">
              <div className="feature-icon green"><HandHeart /></div>
              <h3>For volunteers</h3>
              <p>Share your skills and availability, then wait for account verification by the coordinator.</p>
              <Link to="/register/volunteer">Register as a volunteer <ArrowUpRight size={16} /></Link>
            </article>
            <article className="feature">
              <div className="feature-icon gold"><LayoutDashboard /></div>
              <h3>For coordinators</h3>
              <p>Volunteer applications are reviewed and managed by the Sahayak coordination team.</p>
              <span className="feature-note">Coordinator-managed</span>
            </article>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="steps">
          <div><b>1</b><span>Register securely</span></div>
          <div><b>2</b><span>Get connected</span></div>
          <div><b>3</b><span>Receive coordinated help</span></div>
        </div>
      </section>

      <section className="container" id="join">
        <div className="join">
          <div>
            <h2>Small actions can make someone feel safer.</h2>
            <p>Join Sahayak as a member or a volunteer.</p>
          </div>
          <div className="join-actions">
            <Link className="button primary large" to="/register/user">Register as a user <ArrowUpRight size={18} /></Link>
            <Link className="button ghost large" to="/register/volunteer">Register as a volunteer</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Auth({ role = 'user' }) {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isVolunteer = role === 'volunteer';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (payload.password !== payload.confirm_password) {
      setError('Passwords do not match. Re-enter both fields.');
      setBusy(false);
      return;
    }
    try {
      await api.post(isVolunteer ? '/api/register/volunteer' : '/api/register', {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        age : payload.age,
        password: payload.password,
        address: payload.address,
        bloodgroup: payload.bloodgroup,
        aadhaar_number: payload.aadhaar_number,
        identity_document: payload.identity_document,
        emergency_contact: payload.emergency_contact,
        ...(isVolunteer && {
          age: payload.age,
          gender: payload.gender,
          skills: payload.skills,
          police_verification: payload.police_verification,
          availability: payload.availability,
          support_area: payload.support_area,
          experience: payload.experience,
        }),
      });
      nav('/', { state: { message: 'Registration submitted. Our coordinator will review your details.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not connect to the server. Check that the server is running.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-wrap container">
      <aside className="auth-intro">
        <h1>{isVolunteer ? 'Be someone’s helping hand.' : 'Your support network starts here.'}</h1>
        <p>
          {isVolunteer
            ? 'Tell us how you can help. Your profile lets coordinators match you with the right requests.'
            : 'Share your essential details so our team can prepare the right support.'}
        </p>
        <ul className="benefits">
          <li><span><Lock size={18} /></span>Secure password storage</li>
          <li><span><Users size={18} /></span>Role-specific account</li>
          <li><span><HeartHandshake size={18} /></span>Connected support network</li>
        </ul>
      </aside>

      <form className="form-card" onSubmit={submit}>
        <div className="form-head">
          <h2>{isVolunteer ? 'Volunteer details' : 'User details'}</h2>
          <p>Fields marked * are required.</p>
        </div>

        {isVolunteer && (
          <div className="form-note">
            <HandHeart size={20} />
            <span>
              <strong>Volunteer profile</strong>
              <small>These details help our coordinator understand where you can make the biggest difference.</small>
            </span>
          </div>
        )}
        {error && <div className="form-error" role="alert">{error}</div>}

        <fieldset>
          <legend>Personal details</legend>
          <div className="form-grid">
            <label>Full name *<input name="name" required placeholder="Enter your full name" /></label>
            <label>Mobile number *<input name="phone" required inputMode="numeric" pattern="[0-9]{10,15}" placeholder="10–15 digits" /></label>
            <label>Email address *<input name="email" type="email" required placeholder="name@example.com" /></label>
            <label>Age<input name="age" type="number" min="18" max="120" placeholder="Your age" /></label>
            <label>Gender
              <select name="gender">
                <option value="">Select</option><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option>
              </select>
            </label>
            <label>Blood group *
              <select name="bloodgroup" required>
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(x => <option key={x}>{x}</option>)}
              </select>
            </label>
            {isVolunteer && <label>Primary skill *<input name="skills" required placeholder="First aid, driving, caregiving" /></label>}
            <label className="wide">Address *<textarea name="address" required rows="2" placeholder="House, area, city and PIN code" /></label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Identity verification</legend>
          <div className="form-grid">
            <label>Aadhaar card number *<input name="aadhaar_number" required inputMode="numeric" pattern="[0-9]{12}" maxLength="12" placeholder="12-digit Aadhaar number" /></label>
            <label>Identity document *
              <select name="identity_document" required>
                <option value="">Select document</option>
                <option value="aadhaar">Aadhaar card</option>
                <option value="voter_id">Voter ID</option>
                <option value="driving_license">Driving licence</option>
                <option value="passport">Passport</option>
              </select>
            </label>
            {isVolunteer && (
              <label className="wide">Police verification status *
                <select name="police_verification" required>
                  <option value="">Select status</option><option>Available</option><option>In progress</option><option>Not available</option>
                </select>
              </label>
            )}
          </div>
        </fieldset>

        {isVolunteer && (
          <fieldset>
            <legend>How you can help</legend>
            <div className="form-grid">
              <label>Availability *
                <select name="availability" required>
                  <option value="">Choose availability</option>
                  <option>Weekday mornings</option><option>Weekday afternoons</option><option>Weekday evenings</option><option>Weekends</option><option>Flexible</option>
                </select>
              </label>
              <label>Preferred support *
                <select name="support_area" required>
                  <option value="">Choose an area</option>
                  <option>Companionship</option><option>Errands and transport</option><option>Health and wellness</option><option>Digital help</option><option>Other community support</option>
                </select>
              </label>
              <label className="wide">Relevant experience<textarea name="experience" rows="3" placeholder="Tell us about caregiving, community work, or other relevant experience" /></label>
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend>{isVolunteer ? 'Emergency contact' : 'Health and emergency'}</legend>
          <div className="form-grid">
            <label>Emergency contact *<input name="emergency_contact" required inputMode="numeric" pattern="[0-9]{10,15}" placeholder="Contact number" /></label>
            {!isVolunteer && (
              <>
                <label>Medical conditions<input name="medical_conditions" placeholder="Optional" /></label>
                <label className="wide">Allergies<input name="allergies" placeholder="Known allergies, or None" /></label>
              </>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend>Create password</legend>
          <div className="form-grid">
            <label>Password *<input name="password" type="password" minLength="8" required placeholder="At least 8 characters" /></label>
            <label>Confirm password *<input name="confirm_password" type="password" minLength="8" required placeholder="Re-enter password" /></label>
          </div>
        </fieldset>

        <p className="privacy">Aadhaar is collected for identity verification. Share documents only with authorized Sahayak coordinators, and keep your password private.</p>
        <button className="button primary large submit" disabled={busy}>
          {busy ? 'Submitting…' : 'Submit registration'} {!busy && <ArrowUpRight size={18} />}
        </button>
        <p className="switch">A Sahayak coordinator will review your registration.</p>
      </form>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/user" element={<Auth role="user" />} />
        <Route path="/register/volunteer" element={<Auth role="volunteer" />} />
        <Route path="*" element={<main className="container dashboard"><h1>Page not found</h1><p>The page you’re looking for doesn’t exist.</p><Link className="button primary" to="/">Return home</Link></main>} />
      </Routes>
      <Footer />
    </>
  );
}
