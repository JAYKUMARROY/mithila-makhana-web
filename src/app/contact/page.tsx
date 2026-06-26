"use client"
import { Mail, MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="pt-32 pb-24 bg-cream-bg min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6">
        <header className="mb-12 text-center">
          <h1 className="font-display-lg text-4xl md:text-5xl text-forest-deep mb-4">Contact Us</h1>
          <p className="font-body-lg text-on-surface-variant text-lg max-w-2xl mx-auto">
            Have questions about our GI-tagged Makhana or need help with your order? Our team is here to assist you.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/30">
              <h3 className="font-headline-md text-2xl text-forest-deep mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-gold-accent" />
                  </div>
                  <div>
                    <h4 className="font-label-lg text-forest-deep mb-1">Our Headquarters</h4>
                    <p className="text-on-surface-variant font-body-md">Mithila Makhana Foods<br/>Darbhanga, Bihar<br/>India 846004</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-gold-accent" />
                  </div>
                  <div>
                    <h4 className="font-label-lg text-forest-deep mb-1">Call Us</h4>
                    <p className="text-on-surface-variant font-body-md">+91 98765 43210<br/>Mon-Fri, 9am to 6pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-gold-accent" />
                  </div>
                  <div>
                    <h4 className="font-label-lg text-forest-deep mb-1">Email Us</h4>
                    <p className="text-on-surface-variant font-body-md">support@mithilamakhana.com<br/>We reply within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/30">
            <h3 className="font-headline-md text-2xl text-forest-deep mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Full Name</label>
                <input required className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Email Address</label>
                <input required type="email" className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Message</label>
                <textarea required rows={5} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary-custom outline-none custom-scrollbar" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-forest-deep text-white font-label-lg rounded-xl hover:bg-primary-custom transition-colors shadow-sm" onClick={() => alert('Thanks for contacting us! We will get back to you shortly.')}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
