"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, Menu, X, ArrowRight, CheckCircle, Clock, Shield, Zap, Users, Gift, IndianRupee } from "lucide-react";

const PHONE = "+91 7878407051";
const EMAIL = "info@vidyaitservices.com";
const WHATSAPP = "917878407051";
const ADDRESS = "251, Pakka Bagh, Anaj Mandi Hapur 245101, Uttar Pradesh";

const services = [
  { icon: "🌐", title: "Web Development", desc: "Professional websites & e-commerce solutions", price: "₹8,999", color: "#0056b3" },
  { icon: "📷", title: "CCTV Installation", desc: "Advanced surveillance systems for homes & offices", price: "₹4,999", color: "#ff6b35" },
  { icon: "📱", title: "Digital Marketing", desc: "Grow your online presence with proven strategies", price: "₹4,999", color: "#1a70cc" },
  { icon: "💻", title: "Hardware Services", desc: "Complete computer & IT hardware support", price: "₹299", color: "#374151" },
  { icon: "☁️", title: "Cloud Solutions", desc: "Scalable cloud infrastructure for modern businesses", price: "₹2,999", color: "#0056b3" },
  { icon: "⚙️", title: "Custom Software", desc: "Tailor-made software for your business needs", price: "₹19,999", color: "#ff6b35" },
];

const testimonials = [
  { name: "Rajesh Kumar", company: "Kumar Electronics, Hapur", text: "Vidya IT Services ne humari business transform kar di. Website se pehle mahine mein 200+ online orders aaye. Excellent team!", rating: 5 },
  { name: "Priya Sharma", company: "Sharma Coaching Institute", text: "CCTV installation bahut professional tarike se ki. Mobile app perfect kaam karta hai. Highly recommended!", rating: 5 },
  { name: "Mohit Agarwal", company: "Agarwal Traders", text: "Digital marketing team ne 3 mahine mein Instagram followers 200 se 5000 kar diye. Sales triple ho gayi!", rating: 5 },
  { name: "Sunita Verma", company: "Verma Fashions", text: "E-commerce website amazing lagti hai. Payment gateway flawlessly kaam karta hai. Great support!", rating: 4 },
];

const whyUs = [
  { icon: Zap, title: "Fast Delivery", desc: "Projects on time, every time. Agile process ensures quick turnaround." },
  { icon: Clock, title: "24/7 Support", desc: "Round the clock support via call, WhatsApp or email." },
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Best quality at prices that fit every budget. No hidden charges." },
  { icon: Users, title: "Expert Team", desc: "25-member team with diverse expertise across all IT domains." },
  { icon: Shield, title: "Quality Assured", desc: "Rigorous quality checks before delivery. 100% satisfaction guarantee." },
  { icon: Gift, title: "Free Consultation", desc: "Get expert advice completely free. No obligation." },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + target / 60, target);
          setCount(Math.floor(current));
          if (current >= target) clearInterval(timer);
        }, 2000 / 60);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <div ref={ref}>{count}{suffix}</div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tIdx, setTIdx] = useState(0);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [typingText, setTypingText] = useState("Web Development");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    const tTimer = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 4000);
    const texts = ["Web Development", "CCTV Installation", "Digital Marketing", "Cloud Solutions"];
    let ti = 0;
    const typeTimer = setInterval(() => { ti = (ti + 1) % texts.length; setTypingText(texts[ti]); }, 2500);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(tTimer); clearInterval(typeTimer); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello! New inquiry from vidyaitservices.com:\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || 'N/A'}\nService: ${formData.service || 'General'}\nMessage: ${formData.message}`;
    // Send email to both addresses
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          emails: ['info@vidyaitservices.com', 'vaibhav2007sharma@gmail.com']
        })
      });
    } catch(err) { console.log('Email send failed', err); }
    // Also open WhatsApp
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    setFormSent(true);
  };

  return (
    <main>
      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-transparent"}`}>
        {!scrolled && (
          <div className="bg-brand-blue text-white text-xs py-1.5 hidden md:block">
            <div className="section-container flex justify-between">
              <span>📍 {ADDRESS}</span>
              <div className="flex gap-4">
                <a href={`tel:${PHONE}`} className="hover:text-orange-300">📞 {PHONE}</a>
                <a href={`mailto:${EMAIL}`} className="hover:text-orange-300">✉ {EMAIL}</a>
              </div>
            </div>
          </div>
        )}
        <nav className="section-container py-3 flex items-center justify-between">
          <Link href="/"><Image src="/logo.png" alt="Vidya IT Services" width={160} height={54} className="h-11 w-auto object-contain" priority /></Link>
          <div className="hidden lg:flex items-center gap-1">
            {[["#home","Home"],["#services","Services"],["#about","About"],["#testimonials","Reviews"],["#contact","Contact"]].map(([href, label]) => (
              <a key={href} href={href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-brand-blue hover:bg-blue-50" : "text-white hover:text-orange-300"}`}>{label}</a>
            ))}
            <a href="#contact" className="ml-2 btn-primary text-sm py-2.5">Get Free Quote <ArrowRight size={14} /></a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className={`lg:hidden p-2 rounded-lg ${scrolled ? "text-gray-700" : "text-white"}`}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl px-4 py-4 space-y-1">
            {[["#home","Home"],["#services","Services"],["#about","About"],["#testimonials","Reviews"],["#contact","Contact"]].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-brand-blue font-medium">{label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center mt-2">Get Free Quote</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden" style={{background:"linear-gradient(135deg,#0056b3 0%,#001f4d 60%,#050510 100%)"}}>
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)",backgroundSize:"40px 40px"}} />
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full blur-3xl animate-float" style={{background:"rgba(255,107,53,0.2)"}} />
        <div className="section-container relative z-10 py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              🇮🇳 Trusted IT Partner Since 2016 — Hapur, UP
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Transform Your <span className="text-brand-orange">Business</span><br/>
              with Expert <span className="border-r-2 border-brand-orange pr-1">{typingText}</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl leading-relaxed">India's trusted IT company offering premium technology solutions at affordable prices. From websites to CCTV to cloud — we handle it all.</p>
            <div className="flex flex-wrap gap-4 mb-8">
              {["Free Consultation","All India Service","500+ Projects Done","8+ Years Experience"].map(b => (
                <span key={b} className="flex items-center gap-1.5 text-sm text-blue-100"><CheckCircle size={14} className="text-green-400"/>{b}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#contact" className="btn-primary text-base px-8 py-4">🚀 Get Free Quote <ArrowRight size={16}/></a>
              <a href="#services" className="btn-outline text-base px-8 py-4">Explore Services</a>
            </div>
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="flex -space-x-2">
                {["RK","PS","MA","SV"].map((init,i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white" style={{background:i%2===0?"#ff6b35":"#1a70cc"}}>{init}</div>
                ))}
              </div>
              <div>
                <div className="text-yellow-400 text-lg">★★★★★</div>
                <p className="text-blue-100 text-sm"><strong className="text-white">300+</strong> happy clients across India</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg"><path d="M0 60L1440 60L1440 30C1200 0 960 60 720 30C480 0 240 60 0 30Z" fill="white"/></svg>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white">
        <div className="section-container grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[{icon:"🏆",target:8,suffix:"+",label:"Years Experience"},{icon:"✅",target:500,suffix:"+",label:"Projects Completed"},{icon:"👨‍💻",target:25,suffix:"",label:"Expert Team Members"},{icon:"❤️",target:300,suffix:"+",label:"Happy Clients"}].map((s,i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl transition-transform group-hover:scale-110" style={{background:i%2===0?"#0056b315":"#ff6b3515"}}>{s.icon}</div>
              <div className="text-4xl font-bold text-gray-900"><Counter target={s.target} suffix={s.suffix}/></div>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-brand-blue font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="section-title">Our IT <span className="text-brand-orange">Services</span></h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">From websites to CCTV to cloud — everything your business needs under one roof.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s,i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{background:s.color}}/>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl mt-1 group-hover:scale-110 transition-transform" style={{background:`${s.color}15`}}>{s.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm mb-5">{s.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div><p className="text-xs text-gray-400">Starting from</p><p className="font-bold text-lg" style={{color:s.color}}>{s.price}</p></div>
                  <a href="#contact" className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{color:s.color}}>Learn More <ArrowRight size={14}/></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="about" className="py-20" style={{background:"linear-gradient(135deg,#0056b3 0%,#003d80 100%)"}}>
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-orange-300 font-semibold text-sm uppercase tracking-widest mb-3">Our Advantage</p>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Why Choose <span className="text-brand-orange">Vidya IT?</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item,i) => (
              <div key={i} className="bg-white/10 border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-all group">
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <item.icon size={26} className="text-brand-orange"/>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-brand-blue font-semibold text-sm uppercase tracking-widest mb-3">Client Love</p>
            <h2 className="section-title">What Our <span className="text-brand-orange">Clients Say</span></h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-10 shadow-lg text-center">
              <div className="text-yellow-400 text-2xl mb-5">{"★".repeat(testimonials[tIdx].rating)}{"☆".repeat(5-testimonials[tIdx].rating)}</div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">&ldquo;{testimonials[tIdx].text}&rdquo;</p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{background:"linear-gradient(135deg,#0056b3,#ff6b35)"}}>
                  {testimonials[tIdx].name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">{testimonials[tIdx].name}</p>
                  <p className="text-gray-500 text-sm">{testimonials[tIdx].company}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_,i) => (
                <button key={i} onClick={()=>setTIdx(i)} className={`h-2.5 rounded-full transition-all ${i===tIdx?"bg-brand-blue w-7":"bg-gray-300 w-2.5"}`}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{background:"rgba(0,86,179,0.2)"}}/>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{background:"rgba(255,107,53,0.15)"}}/>
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to Grow<br/>Your <span className="text-brand-orange">Business?</span></h2>
              <p className="text-gray-400 text-lg mb-10">Free consultation, no obligation.</p>
              {[{icon:Phone,label:"Call Us",value:PHONE,href:`tel:${PHONE}`},{icon:Mail,label:"Email Us",value:EMAIL,href:`mailto:${EMAIL}`},{icon:MapPin,label:"Visit Us",value:"251, Pakka Bagh, Hapur, UP",href:"#"}].map(({icon:Icon,label,value,href})=>(
                <a key={label} href={href} className="flex items-center gap-4 mb-5 group">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors flex-shrink-0"><Icon size={20} className="text-brand-orange"/></div>
                  <div><p className="text-gray-400 text-xs">{label}</p><p className="text-white font-medium">{value}</p></div>
                </a>
              ))}
              <a href={`https://wa.me/${WHATSAPP}?text=Hello! I need IT services.`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white px-6 py-4 rounded-2xl font-semibold transition-colors mt-4 w-fit" style={{background:"#25D366"}}>
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              {formSent ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">We will get back to you within 2 hours.</p>
                  <button onClick={()=>setFormSent(false)} className="btn-secondary">Send Another</button>
                </div>
              ):(
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Free Consultation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input required value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Your Name" className="form-input"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input required value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} placeholder="+91 99999 99999" className="form-input"/></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} placeholder="your@email.com" className="form-input"/></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                    <select value={formData.service} onChange={e=>setFormData({...formData,service:e.target.value})} className="form-input">
                      <option value="">Select a service</option>
                      {services.map(s=><option key={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Message *</label><textarea required rows={4} value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})} placeholder="Tell us about your project..." className="form-input resize-none"/></div>
                  <button type="submit" className="btn-primary w-full justify-center text-base py-4">🚀 Send Message</button>
                  <p className="text-center text-xs text-gray-400">Free consultation • No spam • Reply within 2 hours</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-gray-400 pt-14 pb-8">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <Image src="/logo.png" alt="Vidya IT Services" width={160} height={54} className="h-11 w-auto object-contain brightness-0 invert mb-4"/>
              <p className="text-sm leading-relaxed mb-5">Your trusted IT partner since 2016. Helping businesses across India grow with smart technology.</p>
            </div>
            <div>
              <p className="text-white font-bold text-base mb-4">Our Services</p>
              <ul className="space-y-2">{services.map(s=><li key={s.title}><a href="#services" className="text-sm hover:text-white transition-colors">› {s.title}</a></li>)}</ul>
            </div>
            <div>
              <p className="text-white font-bold text-base mb-4">Contact Us</p>
              <div className="space-y-3 text-sm">
                <p>📍 {ADDRESS}</p>
                <p><a href={`tel:${PHONE}`} className="hover:text-white">📞 {PHONE}</a></p>
                <p><a href={`mailto:${EMAIL}`} className="hover:text-white">✉ {EMAIL}</a></p>
                <p>🕐 Mon-Sat: 9AM–7PM</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs">
            <p>© {new Date().getFullYear()} Vidya IT Services. All rights reserved. Est. 2016, Hapur, UP.</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP */}
      <a href={`https://wa.me/${WHATSAPP}?text=Hello!`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50" aria-label="WhatsApp">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"/>
          <div className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{background:"#25D366"}}>
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
        </div>
      </a>
    </main>
  );
}
