import type { Metadata } from 'next'
import Link from 'next/link'
import { ScrollText, ArrowRight, Star, Heart, Leaf, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { WhyChooseUs } from '@/components/why-choose-us'
import { ContactUs } from '@/components/contact-us'

export const metadata: Metadata = {
  title: 'Our Story | Mithila Makhana — Heritage & Tradition',
  description: 'Learn about Mithila Makhana\'s journey from the wetlands of Bihar to your home. GI-tagged, organic superfood rooted in centuries of tradition.',
}

export default function About() {
  return (
    <div className="bg-cream-bg selection:bg-gold-accent/30">
      {/* 1. Cinematic "Legacy" Hero */}
      <header className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" alt="Mithila wetlands" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1hqNmvBs3nNUMKlm_qe4pEJeHyD1sbzy6HIy84vBmGkBn2wEmsiHDm2jjHREhm81TA-q0k5x_z8RlSAiQXYr4JRwLuPU4EH2zN_A-TUtI_8zA3en0_k6p7XtO267izloqk2KbKFcx2m_i12Ph3no4bVEM6L4EbMI0iFNzjMYwwt-gDyjxiE40TZbSd-8lGpreppKjSJSSceunm6vm8iaJdfaKGU1YlhuFTHv4YtSzISvP4NHt5WOSC3GvbMa9jks7H_F_ca17QL2" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-16 rounded-[3rem] shadow-2xl inline-block max-w-4xl transform hover:scale-[1.02] transition-transform duration-700">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gold-accent text-forest-deep font-bold text-xs uppercase tracking-widest shadow-lg">
              <Star className="w-3 h-3 fill-forest-deep" /> Est. 1000 Years Ago
            </span>
            <h1 className="font-display-lg text-5xl md:text-7xl text-white mb-6 leading-tight">
              The Legacy of <br/> <span className="text-gold-accent italic font-serif">Mithila</span>
            </h1>
            <p className="font-body-md text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Discover the journey of the "White Gold" — a superfood nurtured by the sacred wetlands of Bihar and preserved through a millennium of tradition.
            </p>
          </div>
        </div>
        
        {/* Transition fade to next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-cream-bg to-transparent"></div>
      </header>

      {/* 2. The 1000-Year History (Bento Box) */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
            {/* Large Content Block */}
            <div className="md:col-span-8 bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-center relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700"></div>
              
              <h2 className="font-display-sm text-4xl text-forest-deep mb-6 relative z-10">A Millennium of <span className="text-primary-custom italic">Vitality</span></h2>
              <p className="font-body-md text-lg text-on-surface-variant mb-8 leading-relaxed max-w-2xl relative z-10">
                For over ten centuries, the region of Mithila has been the heartland of Euryale ferox, popularly known as Makhana. Ancient scriptures from the Mauryan era reference these fox nuts as a staple for vitality and mental clarity.
              </p>
              
              <div className="flex items-center gap-5 mt-auto relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gold-accent/10 flex items-center justify-center text-gold-accent shadow-inner border border-gold-accent/20">
                  <ScrollText className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-label-lg font-bold text-forest-deep uppercase tracking-widest text-sm">Historical Roots</p>
                  <p className="text-on-surface-variant font-bold text-sm">Traceable to the 4th Century BC</p>
                </div>
              </div>
            </div>
            
            {/* Vertical Feature Image */}
            <div className="md:col-span-4 relative group overflow-hidden rounded-3xl shadow-sm border border-outline-variant/30 h-[400px] md:h-auto bg-white flex items-center justify-center">
              <img className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110" alt="Madhubani art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Z_W_dS-sv_hAg7HrNy7aG96TYJK0gQ53mEPbQHcT_Klq4OA1MCC8Lw-9tRRKd-lsxSqT-_IGzn9Sukg7ZnlRU8Avv38HTENmCHgmKANh_m9gjbpJEZEHEKoDDHRT9svPygv3IVkhHdu458An-gMt2ffLxH0Zx1UPAdhxLMBKk9esLEvb2MX3LVn44f05uEc6r-EQn1ss3CHXJc1yuaZ_cPr4xN0JQOgR_j8fdwNRf6iL31wdbD4QEEgfEkJt4RkuAVT0t3mQzvdD" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/20 to-transparent flex items-end p-8 pointer-events-none">
                <div>
                  <p className="text-white font-display-sm text-2xl font-bold mb-1">Cultural Identity</p>
                  <p className="text-white/80 font-bold text-sm tracking-wider uppercase">Madhubani Heritage</p>
                </div>
              </div>
            </div>
            
            {/* Small Grid Items */}
            <div className="md:col-span-4 bg-gold-accent/10 border border-gold-accent/20 p-8 rounded-3xl shadow-sm relative overflow-hidden group text-forest-deep flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500">
              <ShieldCheck className="w-10 h-10 mb-4 text-gold-accent" />
              <div>
                <h3 className="font-display-sm text-3xl font-bold mb-2">GI Tagged</h3>
                <p className="font-bold text-sm text-forest-deep/80 leading-relaxed">Officially recognized for its unique geographical origin and traditional harvesting methods.</p>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-primary-custom flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display-sm text-2xl font-bold text-forest-deep mb-2">Ayurvedic Link</h3>
                <p className="text-sm font-bold text-on-surface-variant leading-relaxed">Revered in Ayurveda for balancing Vata and Pitta, promoting longevity and heart health.</p>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-forest-deep p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary-custom/20 rounded-full blur-[30px] group-hover:scale-150 transition-transform"></div>
              <h3 className="font-display-lg text-6xl text-gold-accent mb-2 tracking-tighter">1,000+</h3>
              <div>
                <h4 className="text-white font-bold text-xl mb-1">Years of Cultivation</h4>
                <p className="text-sm text-white/70 leading-relaxed">Continuous cultivation by the Mallah community, passed down through generations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The "White Gold" Harvesting Timeline (Dark Mode) */}
      <section className="bg-[#1A2E20] py-32 px-6 relative overflow-hidden text-white">
        {/* Subtle background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 text-gold-accent font-bold text-xs uppercase tracking-widest shadow-sm">
              <CheckCircle2 className="w-3 h-3" /> The Artisan Process
            </span>
            <h2 className="font-display-lg text-5xl md:text-6xl mb-6">Harvesting <span className="text-primary-custom italic font-serif">"White Gold"</span></h2>
            <p className="text-lg text-white/70 leading-relaxed">The journey from the wetland floor to your table is an art form requiring immense patience, physical strength, and ancestral knowledge.</p>
          </div>
          
          <div className="space-y-32 relative">
            {/* Glowing connecting line */}
            <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-accent/30 to-transparent hidden lg:block"></div>

            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16 relative">
              <div className="w-full lg:w-1/2 flex justify-end">
                <div className="relative w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 group">
                  <div className="absolute inset-0 bg-gold-accent/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img className="w-full aspect-square md:aspect-video lg:aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-1000" alt="Wetland Foraging" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB2MACOJWNBIZCjhAKOgvHOKLF8N2_tK9ri7pbp41dcHw4KbB1i3JluOV-trTmfVEnSM1LiZ_reZu836CwIwLhWGSEHIWmeis8H6J0jZv2Kga8x6yoAPzauhqx8sNuxQyGIKqfbhVFklLgPsjIOlLbdz0sNU3b2xxzOLlnVVd5PJDrnfInQywN8lV61FsNtNOXdo7E5c0tYJvooJ7TeteVzu6k7N0fSe0LdAUXJ3vyki9l4VjB1muAeV30iPMoIyOiQ_91wuJ5qxx9" />
                </div>
              </div>
              
              {/* Center Dot */}
              <div className="hidden lg:flex absolute left-[50%] -translate-x-1/2 w-8 h-8 rounded-full bg-[#1A2E20] border-4 border-gold-accent items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] z-20">
                <div className="w-2 h-2 rounded-full bg-gold-accent"></div>
              </div>
              
              <div className="w-full lg:w-1/2 lg:pl-16">
                <div className="inline-block px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gold-accent font-display-sm text-2xl font-bold mb-6">01</div>
                <h3 className="font-display-sm text-4xl mb-4">Wetland Foraging</h3>
                <p className="font-body-md text-lg text-white/70 leading-relaxed max-w-md">
                  Harvesting begins before dawn. Skilled farmers dive into knee-deep ponds, holding their breath to manually collect the heavy, thorny seeds from the muddy floor. This back-breaking process protects the delicate wetland ecosystem from mechanical harm.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16 relative">
              <div className="w-full lg:w-1/2 flex justify-start">
                <div className="relative w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 group">
                  <div className="absolute inset-0 bg-vermillion-clay/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img className="w-full aspect-square md:aspect-video lg:aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-1000" alt="The Roasting Ritual" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlHex2oZec_GJW5VD8xYpOrMhN0c8ncK3C8r2mswjrW9tNy5VBqJOv0uhnji6hddRMyuYRcNbdyZFXir6YMcpZcBlrZswvQkL-iC2xXqfD1RXAnwzFydxK8Bax4w6qUEi6r1cfw116v7OngummfPLo0BQkjucWmF1j1Jc3F-NX_fux4cVv4Ryit08DzUjIRqOwHYz4WYN8QMQCrIKsjuNjgYwRMv63oVyv1l9v4XaXJlz7UKU3AhXcqUcO238nIhcAE15Thuv8pah-" />
                </div>
              </div>
              
              {/* Center Dot */}
              <div className="hidden lg:flex absolute left-[50%] -translate-x-1/2 w-8 h-8 rounded-full bg-[#1A2E20] border-4 border-gold-accent items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] z-20">
                <div className="w-2 h-2 rounded-full bg-gold-accent"></div>
              </div>
              
              <div className="w-full lg:w-1/2 lg:pr-16 text-left lg:text-right flex flex-col items-start lg:items-end">
                <div className="inline-block px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gold-accent font-display-sm text-2xl font-bold mb-6">02</div>
                <h3 className="font-display-sm text-4xl mb-4">The Roasting Ritual</h3>
                <p className="font-body-md text-lg text-white/70 leading-relaxed max-w-md text-left lg:text-right">
                  The black seeds are sun-dried and tempered over an open flame in earthen or cast-iron pots. The crucial "popping" — smashing the hot shell with a wooden mallet to reveal the puffed white nut — requires split-second timing. It is a rhythmic, dangerous dance of heat and precision.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-16 relative">
              <div className="w-full lg:w-1/2 flex justify-end">
                <div className="relative w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 group">
                  <div className="absolute inset-0 bg-primary-custom/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img className="w-full aspect-square md:aspect-video lg:aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-1000" alt="Pure Selection" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPu0j-XmGTveFoL1LgBD1kG_rGB14YaR3z9WRc7KsgpAaIJLEc_BsO6HD5PHhpG7lTa6clBlYPTW_kBY9HKmrrZM2_v3-VSWM1rkgN33GP62QcHCe0PMSD_wY5_eRaOwF68jWbfqavDX52Y12c_cDirGnzOs8MUMKSGmK4wFoRCto-KBMfDWIu2vAToZENyJkvD6F52mZDY40vn1ZbzZ3g_6zA2Cj0LjzEmOIBWqYXe-Po-InGjKtTZ3pZZbRqhTL8oOZiik-XO7_m" />
                </div>
              </div>
              
              {/* Center Dot */}
              <div className="hidden lg:flex absolute left-[50%] -translate-x-1/2 w-8 h-8 rounded-full bg-[#1A2E20] border-4 border-gold-accent items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.5)] z-20">
                <div className="w-2 h-2 rounded-full bg-gold-accent"></div>
              </div>
              
              <div className="w-full lg:w-1/2 lg:pl-16">
                <div className="inline-block px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gold-accent font-display-sm text-2xl font-bold mb-6">03</div>
                <h3 className="font-display-sm text-4xl mb-4">Pure Selection</h3>
                <p className="font-body-md text-lg text-white/70 leading-relaxed max-w-md">
                  Only the largest, whitest, and fluffiest nuts pass our quality checks. Every single Mithila Makhana is hand-sorted by skilled women artisans to ensure uniform size, perfect crunch, and zero shell residue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Community & Impact (Masonry) */}
      <section className="py-32 px-6 max-w-[1280px] mx-auto bg-cream-bg">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-outline-variant/30 shadow-sm mb-6">
              <Heart className="w-4 h-4 text-vermillion-clay" />
              <span className="text-forest-deep text-xs font-bold tracking-widest uppercase">Social Impact</span>
            </div>
            
            <h2 className="font-display-lg text-4xl md:text-5xl text-forest-deep mb-8 leading-tight">Empowering the Heart of <span className="text-primary-custom italic font-serif">Mithila</span></h2>
            
            <p className="font-body-md text-xl text-on-surface-variant mb-10 leading-relaxed">
              Makhana is more than a crop; it is the lifeblood of over 50,000 farming families. By choosing us, you are directly supporting fair-trade practices that empower the Mallah community and invest in ecological preservation.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-4xl font-display-lg text-gold-accent mb-2 group-hover:scale-110 transition-transform origin-left">50K+</p>
                <p className="font-bold text-sm uppercase tracking-widest text-forest-deep">Farmers Supported</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow group">
                <p className="text-4xl font-display-lg text-primary-custom mb-2 group-hover:scale-110 transition-transform origin-left">100%</p>
                <p className="font-bold text-sm uppercase tracking-widest text-forest-deep">Sustainable</p>
              </div>
            </div>
            
            <Link href="/impact" className="group inline-flex items-center gap-3 px-8 py-4 bg-forest-deep text-white rounded-xl font-bold hover:bg-primary-custom transition-colors shadow-lg">
              Read Impact Report
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Magazine-style Masonry */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 h-[600px]">
            <div className="space-y-4 h-full flex flex-col">
              <div className="rounded-3xl overflow-hidden h-[55%] relative shadow-lg group">
                <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Woman farmer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBibSVKWb8ZMSGQbI__2CIWDMmzJb700i-8AuImh9t_gTXvs4lGg1eAZ5uhuXX6onjRQrDRDunv4S8qM1naTIPPMDRe3JO8N_8xsRbjnyu7T2yReQy7GWy3vo19yiOaDzd8u9l5x0LXQCkAPQHJXlw7G-GQHfRiWQ79KPTcCPx8rK9PruHn5rgjI1uAexMjvBeK1_U1NlJh3IcYzlD7DS-_Y2mQSPmJZ3swt_T_NAE1gVBlyuSNFxvjA68_Yg79htHMUruFRC2d-grW" />
              </div>
              <div className="rounded-3xl overflow-hidden h-[45%] bg-forest-deep flex items-center justify-center p-6 text-center shadow-lg relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-custom/20 rounded-full blur-[30px] group-hover:scale-150 transition-transform duration-700"></div>
                <p className="text-white font-headline-md text-xl italic relative z-10 leading-relaxed">"Makhana is our heritage, our dignity, and our future."</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-12 h-full flex flex-col">
              <div className="rounded-3xl overflow-hidden h-[45%] relative shadow-lg group">
                <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Local children" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkPGTJagykCY9k87keM1EkC-eVDWQ1j6g_gi1b25chwo01zctMhLxdaXYTDSZoJXa5GJnqlyh3pgPGOW439v_nyHI04he89LLckw7MAFhEpi_tS7-3s4prfhycDBMgyao3VtKQjxfPwkzL1S_A_Bj-1y_xkQVgZpAzjN-p1whH37zWLP87ALhMAeKu3baPbl4SHYpvINIHudly_c7MJWInSY1F7q8oLg6VFNq0grR0McQDVcmaJeUfPEXOgPZkgXZ9R3AbIZFmFVGH" />
              </div>
              <div className="rounded-3xl overflow-hidden h-[55%] relative shadow-lg group">
                <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Aerial drone shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3xI-VnMvAuCGp3HsVGvFjssr7OpI-D8nZ6I_rnFSyEO2lM3CLdLb8vD2oc6r3jvHAooWPMlNfmhKR6dLPycdL0aXv6SWIWRqlbuJY9yx_OwMoC85yjaCJI0Nf9erH5gq74AeQodvKzwz7TkjwpMVr-DEKWy_2eFIHEDzto9rVce3OscWFr0Znu3d2P228OZw_WR2fsBU67VYAIM0qTRwVrtPI970rWxUd34_Wmw8XFThI1qJ2AMrU3Ogkz7UkonTDvXhCR-nExbeO" />
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Contact Us */}
      <ContactUs />

      {/* 7. Beautiful CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-primary-container/10"></div>
        <div className="max-w-4xl mx-auto p-12 md:p-16 rounded-[3rem] text-center border border-outline-variant/30 bg-white/60 backdrop-blur-xl shadow-xl relative z-10 overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-accent/20 rounded-full blur-[80px] -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
          
          <h2 className="font-display-lg text-4xl md:text-5xl text-forest-deep mb-6">Taste the <span className="italic text-primary-custom font-serif">Tradition</span></h2>
          <p className="font-body-md text-xl text-on-surface-variant mb-10 max-w-xl mx-auto">Experience the crunch and nutritional power of authentic, GI-tagged Mithila Makhana.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link className="px-10 py-4 bg-gradient-to-r from-gold-accent to-yellow-400 text-forest-deep font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" href="/shop">
              Shop The Collection
            </Link>
            <Link className="px-10 py-4 bg-white border-2 border-forest-deep text-forest-deep font-bold rounded-xl shadow-sm hover:bg-forest-deep hover:text-white transition-all" href="/contact">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
