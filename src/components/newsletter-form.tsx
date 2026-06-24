"use client";

import { useState } from 'react';
import { useToast } from './toast';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast("Thank you for subscribing to our newsletter!");
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-20">
      <input 
        className="flex-grow rounded-lg border border-outline-variant bg-white px-6 py-4 focus:ring-2 focus:ring-gold-accent focus:border-gold-accent transition-all" 
        placeholder="Your email address" 
        type="email" 
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button 
        className="bg-forest-deep text-white px-8 py-4 rounded-lg font-label-lg text-label-lg hover:bg-opacity-90 transition-all shadow-md active:scale-95" 
        type="submit"
      >
        Subscribe
      </button>
    </form>
  );
}
