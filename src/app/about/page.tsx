import Link from 'next/link'
import { ScrollText, ArrowRight } from 'lucide-react'
import { WhyChooseUs } from '@/components/why-choose-us'
import { ContactUs } from '@/components/contact-us'

export default function About() {
  return (
    <>
      {/* Hero Section: The Legacy of Mithila */}
      <header className="relative h-[819px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" alt="Mithila wetlands" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1hqNmvBs3nNUMKlm_qe4pEJeHyD1sbzy6HIy84vBmGkBn2wEmsiHDm2jjHREhm81TA-q0k5x_z8RlSAiQXYr4JRwLuPU4EH2zN_A-TUtI_8zA3en0_k6p7XtO267izloqk2KbKFcx2m_i12Ph3no4bVEM6L4EbMI0iFNzjMYwwt-gDyjxiE40TZbSd-8lGpreppKjSJSSceunm6vm8iaJdfaKGU1YlhuFTHv4YtSzISvP4NHt5WOSC3GvbMa9jks7H_F_ca17QL2" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cream-bg"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gold-accent/20 text-gold-accent font-label-lg text-label-lg uppercase tracking-widest">Est. 1000 Years Ago</span>
          <h1 className="font-display-lg text-display-lg md:text-[64px] text-forest-deep mb-6 text-balance leading-tight">The Legacy of Mithila</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Discover the journey of the "White Gold" — a superfood nurtured by the wetlands of Bihar and preserved through a millennium of tradition.</p>
        </div>
      </header>

      {/* Bento Grid: The 1000-Year History */}
      <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto transition-all duration-1000 ease-out">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Content Block */}
          <div className="md:col-span-7 bg-white p-8 md:p-12 rounded-xl shadow-sm flex flex-col justify-center border border-surface-container">
            <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-6">A Millennium of Vitality</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
              For over ten centuries, the region of Mithila has been the heartland of Euryale ferox, popularly known as Makhana. Ancient scriptures from the Mauryan era reference these fox nuts as a staple for vitality and mental clarity. What began as a local dietary secret has evolved into a global symbol of heritage and holistic health.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-forest-deep">
                <ScrollText className="w-6 h-6" />
              </div>
              <div>
                <p className="font-label-lg text-label-lg text-forest-deep">Historical Roots</p>
                <p className="text-sm text-on-surface-variant">Traceable to the 4th Century BC</p>
              </div>
            </div>
          </div>
          {/* Vertical Feature Image */}
          <div className="md:col-span-5 relative group overflow-hidden rounded-xl h-[400px] md:h-full">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Madhubani art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Z_W_dS-sv_hAg7HrNy7aG96TYJK0gQ53mEPbQHcT_Klq4OA1MCC8Lw-9tRRKd-lsxSqT-_IGzn9Sukg7ZnlRU8Avv38HTENmCHgmKANh_m9gjbpJEZEHEKoDDHRT9svPygv3IVkhHdu458An-gMt2ffLxH0Zx1UPAdhxLMBKk9esLEvb2MX3LVn44f05uEc6r-EQn1ss3CHXJc1yuaZ_cPr4xN0JQOgR_j8fdwNRf6iL31wdbD4QEEgfEkJt4RkuAVT0t3mQzvdD" />
            <div className="absolute inset-0 bg-forest-deep/20 flex items-end p-8">
              <p className="text-white font-headline-md text-headline-md">Cultural Identity</p>
            </div>
          </div>
          {/* Small Grid Items */}
          <div className="md:col-span-4 bg-gold-accent/10 p-8 rounded-xl border border-gold-accent/20">
            <h3 className="font-headline-md text-headline-md text-forest-deep mb-2">GI Tagged</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Officially recognized for its unique geographical origin and traditional harvesting methods.</p>
          </div>
          <div className="md:col-span-4 bg-white p-8 rounded-xl shadow-sm border border-surface-container">
            <h3 className="font-headline-md text-headline-md text-forest-deep mb-2">Ayurvedic Link</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Revered in Ayurveda for balancing Vata and Pitta, promoting longevity and heart health.</p>
          </div>
          <div className="md:col-span-4 bg-forest-deep p-8 rounded-xl">
            <h3 className="font-headline-md text-headline-md text-primary-fixed mb-2">1,000+ Years</h3>
            <p className="font-body-md text-body-md text-primary-fixed-dim/80">Continuous cultivation by the Mallah community, passed down through generations.</p>
          </div>
        </div>
      </section>

      {/* Process Section: The White Gold Harvesting */}
      <section className="bg-forest-deep py-24 px-6 md:px-12 relative overflow-hidden transition-all duration-1000 ease-out">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#D4AF37 0.5px, transparent 0.5px)", backgroundSize: "16px 16px" }}></div>
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="mb-16 text-center">
            <h2 className="font-headline-lg text-headline-lg text-primary-fixed mb-4">Harvesting "White Gold"</h2>
            <p className="text-primary-fixed-dim max-w-2xl mx-auto">The journey from the wetland floor to your table is an art form requiring patience, strength, and ancestral knowledge.</p>
          </div>
          <div className="space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img className="w-full aspect-video object-cover" alt="Wetland Foraging" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB2MACOJWNBIZCjhAKOgvHOKLF8N2_tK9ri7pbp41dcHw4KbB1i3JluOV-trTmfVEnSM1LiZ_reZu836CwIwLhWGSEHIWmeis8H6J0jZv2Kga8x6yoAPzauhqx8sNuxQyGIKqfbhVFklLgPsjIOlLbdz0sNU3b2xxzOLlnVVd5PJDrnfInQywN8lV61FsNtNOXdo7E5c0tYJvooJ7TeteVzu6k7N0fSe0LdAUXJ3vyki9l4VjB1muAeV30iPMoIyOiQ_91wuJ5qxx9" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-display-lg text-gold-accent opacity-50">01</span>
                  <div className="h-px flex-1 bg-gold-accent/30"></div>
                </div>
                <h3 className="font-headline-md text-headline-md text-white mb-4">Wetland Foraging</h3>
                <p className="font-body-md text-body-md text-primary-fixed-dim leading-relaxed">
                  Harvesting begins in the early morning. Skilled farmers dive into the knee-deep ponds to collect the heavy seeds from the muddy floor. This labor-intensive process is entirely manual, ensuring no mechanical harm to the delicate wetland ecosystem.
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img className="w-full aspect-video object-cover" alt="The Roasting Ritual" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlHex2oZec_GJW5VD8xYpOrMhN0c8ncK3C8r2mswjrW9tNy5VBqJOv0uhnji6hddRMyuYRcNbdyZFXir6YMcpZcBlrZswvQkL-iC2xXqfD1RXAnwzFydxK8Bax4w6qUEi6r1cfw116v7OngummfPLo0BQkjucWmF1j1Jc3F-NX_fux4cVv4Ryit08DzUjIRqOwHYz4WYN8QMQCrIKsjuNjgYwRMv63oVyv1l9v4XaXJlz7UKU3AhXcqUcO238nIhcAE15Thuv8pah-" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-display-lg text-gold-accent opacity-50">02</span>
                  <div className="h-px flex-1 bg-gold-accent/30"></div>
                </div>
                <h3 className="font-headline-md text-headline-md text-white mb-4">The Roasting Ritual</h3>
                <p className="font-body-md text-body-md text-primary-fixed-dim leading-relaxed">
                  The seeds are sun-dried and then tempered over a controlled flame. The "popping" — where the hard black shell is cracked to reveal the white nut — must happen at the exact moment of peak heat. It is a rhythmic ritual of sound and temperature.
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img className="w-full aspect-video object-cover" alt="Pure Selection" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPu0j-XmGTveFoL1LgBD1kG_rGB14YaR3z9WRc7KsgpAaIJLEc_BsO6HD5PHhpG7lTa6clBlYPTW_kBY9HKmrrZM2_v3-VSWM1rkgN33GP62QcHCe0PMSD_wY5_eRaOwF68jWbfqavDX52Y12c_cDirGnzOs8MUMKSGmK4wFoRCto-KBMfDWIu2vAToZENyJkvD6F52mZDY40vn1ZbzZ3g_6zA2Cj0LjzEmOIBWqYXe-Po-InGjKtTZ3pZZbRqhTL8oOZiik-XO7_m" />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-display-lg text-gold-accent opacity-50">03</span>
                  <div className="h-px flex-1 bg-gold-accent/30"></div>
                </div>
                <h3 className="font-headline-md text-headline-md text-white mb-4">Pure Selection</h3>
                <p className="font-body-md text-body-md text-primary-fixed-dim leading-relaxed">
                  Only the largest, brightest nuts make the cut. Every Mithila Makhana product is hand-sorted to ensure uniform size and crunch, preserving the integrity of the "White Gold" label that represents the pinnacle of Mithila's export.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section: Community & Sustainability */}
      <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto bg-cream-bg transition-all duration-1000 ease-out">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-6">Empowering the Heart of Mithila</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              Makhana is more than a crop; it is the lifeblood of over 50,000 farming families in North Bihar. By choosing Mithila Makhana, you are directly supporting fair-trade practices that empower the Mallah community and invest in the ecological preservation of the Bihar wetlands.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-display-lg text-gold-accent">50K+</p>
                <p className="font-label-lg text-label-lg text-forest-deep">Farmers Supported</p>
              </div>
              <div>
                <p className="text-3xl font-display-lg text-gold-accent">100%</p>
                <p className="font-label-lg text-label-lg text-forest-deep">Sustainable Growth</p>
              </div>
              <div>
                <p className="text-3xl font-display-lg text-gold-accent">Direct</p>
                <p className="font-label-lg text-label-lg text-forest-deep">Farm-to-Table</p>
              </div>
              <div>
                <p className="text-3xl font-display-lg text-gold-accent">Eco</p>
                <p className="font-label-lg text-label-lg text-forest-deep">Bio-diverse Ponds</p>
              </div>
            </div>
            <Link href="/impact" className="mt-12 w-fit px-8 py-4 bg-forest-deep text-white rounded-lg font-label-lg text-label-lg hover:bg-forest-deep/90 transition-all flex items-center gap-2">
              View Our Impact Report
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden h-64">
                <img className="w-full h-full object-cover" alt="Woman farmer from Mithila" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBibSVKWb8ZMSGQbI__2CIWDMmzJb700i-8AuImh9t_gTXvs4lGg1eAZ5uhuXX6onjRQrDRDunv4S8qM1naTIPPMDRe3JO8N_8xsRbjnyu7T2yReQy7GWy3vo19yiOaDzd8u9l5x0LXQCkAPQHJXlw7G-GQHfRiWQ79KPTcCPx8rK9PruHn5rgjI1uAexMjvBeK1_U1NlJh3IcYzlD7DS-_Y2mQSPmJZ3swt_T_NAE1gVBlyuSNFxvjA68_Yg79htHMUruFRC2d-grW" />
              </div>
              <div className="rounded-xl overflow-hidden h-48 bg-secondary-container flex items-center justify-center p-6 text-center">
                <p className="text-on-secondary-container font-headline-md text-headline-md italic">"Makhana is our heritage, our dignity, and our future."</p>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-xl overflow-hidden h-48">
                <img className="w-full h-full object-cover" alt="Local children in Bihar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkPGTJagykCY9k87keM1EkC-eVDWQ1j6g_gi1b25chwo01zctMhLxdaXYTDSZoJXa5GJnqlyh3pgPGOW439v_nyHI04he89LLckw7MAFhEpi_tS7-3s4prfhycDBMgyao3VtKQjxfPwkzL1S_A_Bj-1y_xkQVgZpAzjN-p1whH37zWLP87ALhMAeKu3baPbl4SHYpvINIHudly_c7MJWInSY1F7q8oLg6VFNq0grR0McQDVcmaJeUfPEXOgPZkgXZ9R3AbIZFmFVGH" />
              </div>
              <div className="rounded-xl overflow-hidden h-64">
                <img className="w-full h-full object-cover" alt="Aerial drone shot of the Bihar wetlands" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3xI-VnMvAuCGp3HsVGvFjssr7OpI-D8nZ6I_rnFSyEO2lM3CLdLb8vD2oc6r3jvHAooWPMlNfmhKR6dLPycdL0aXv6SWIWRqlbuJY9yx_OwMoC85yjaCJI0Nf9erH5gq74AeQodvKzwz7TkjwpMVr-DEKWy_2eFIHEDzto9rVce3OscWFr0Znu3d2P228OZw_WR2fsBU67VYAIM0qTRwVrtPI970rWxUd34_Wmw8XFThI1qJ2AMrU3Ogkz7UkonTDvXhCR-nExbeO" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Contact Us */}
      <ContactUs />

      {/* CTA Section */}
      <section className="py-20 px-6 transition-all duration-1000 ease-out">
        <div className="max-w-4xl mx-auto p-12 rounded-3xl text-center border border-gold-accent/20" style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(12px)" }}>
          <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-6">Taste the Tradition</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">Experience the crunch and nutritional power of authentic, GI-tagged Mithila Makhana.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link className="px-10 py-4 bg-gold-accent text-charcoal-text rounded-lg font-label-lg text-label-lg hover:scale-105 transition-transform" href="/shop">Explore the Collection</Link>
            <Link className="px-10 py-4 border-2 border-forest-deep text-forest-deep rounded-lg font-label-lg text-label-lg hover:bg-forest-deep hover:text-white transition-all" href="/about">Our Brand Story</Link>
          </div>
        </div>
      </section>
    </>
  )
}
