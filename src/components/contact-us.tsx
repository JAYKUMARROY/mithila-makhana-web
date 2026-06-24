import { Mail, Phone, MapPin } from 'lucide-react'

export function ContactUs() {
  return (
    <section className="py-24 px-6 md:px-12 bg-forest-deep relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7Z_W_dS-sv_hAg7HrNy7aG96TYJK0gQ53mEPbQHcT_Klq4OA1MCC8Lw-9tRRKd-lsxSqT-_IGzn9Sukg7ZnlRU8Avv38HTENmCHgmKANh_m9gjbpJEZEHEKoDDHRT9svPygv3IVkhHdu458An-gMt2ffLxH0Zx1UPAdhxLMBKk9esLEvb2MX3LVn44f05uEc6r-EQn1ss3CHXJc1yuaZ_cPr4xN0JQOgR_j8fdwNRf6iL31wdbD4QEEgfEkJt4RkuAVT0t3mQzvdD')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="text-white">
            <h2 className="font-headline-lg text-headline-lg text-primary-fixed mb-6">Start a Conversation</h2>
            <p className="text-primary-fixed-dim/80 mb-10 font-body-lg">
              Whether you're interested in wholesale, have a question about our process, or just want to say hello, we'd love to hear from you.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="text-gold-accent w-6 h-6" />
                <div>
                  <p className="font-label-lg text-label-lg">Email Us</p>
                  <p className="text-primary-fixed-dim/70">hello@mithilamakhana.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-gold-accent w-6 h-6" />
                <div>
                  <p className="font-label-lg text-label-lg">Call Us</p>
                  <p className="text-primary-fixed-dim/70">+91 612 234 5678</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-gold-accent w-6 h-6" />
                <div>
                  <p className="font-label-lg text-label-lg">Visit Us</p>
                  <p className="text-primary-fixed-dim/70">Mithila Region, North Bihar, India</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-label-lg text-forest-deep mb-2">Name</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-surface-container focus:border-gold-accent focus:ring-gold-accent outline-none transition-colors" placeholder="Your Name" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-label-lg text-forest-deep mb-2">Email</label>
                  <input className="w-full px-4 py-3 rounded-lg border border-surface-container focus:border-gold-accent focus:ring-gold-accent outline-none transition-colors" placeholder="your@email.com" type="email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-label-lg text-forest-deep mb-2">Message</label>
                <textarea className="w-full px-4 py-3 rounded-lg border border-surface-container focus:border-gold-accent focus:ring-gold-accent outline-none transition-colors" placeholder="How can we help?" rows={4}></textarea>
              </div>
              <button className="w-full py-4 bg-gold-accent text-charcoal-text rounded-lg font-label-lg text-label-lg hover:bg-gold-accent/90 transition-all uppercase tracking-widest" type="button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
