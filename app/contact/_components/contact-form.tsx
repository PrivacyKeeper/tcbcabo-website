'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Phone, Mail, MapPin, Check, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch {
      toast.error('Failed to send message. Please try calling us.');
    } finally {
      setSubmitting(false);
    }
  }, [formData]);

  if (submitted) {
    return (
      <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">Message Sent!</h2>
          <p className="text-muted-foreground mb-6">We&apos;ll get back to you as soon as possible.</p>
          <Button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}>Send Another Message</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-sm tracking-[0.15em] uppercase mb-2">Get In Touch</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Contact <span className="text-gold-gradient">Striped World</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Have questions about our charters? Planning a group trip? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-xs text-muted-foreground mb-1 block">Full Name *</Label>
                <Input id="name" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e?.target?.value ?? '' })} placeholder="John Smith" />
              </div>
              <div>
                <Label htmlFor="cemail" className="text-xs text-muted-foreground mb-1 block">Email *</Label>
                <Input id="cemail" type="email" value={formData.email} onChange={(e: any) => setFormData({ ...formData, email: e?.target?.value ?? '' })} placeholder="john@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cphone" className="text-xs text-muted-foreground mb-1 block">Phone</Label>
                <Input id="cphone" type="tel" value={formData.phone} onChange={(e: any) => setFormData({ ...formData, phone: e?.target?.value ?? '' })} placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="subject" className="text-xs text-muted-foreground mb-1 block">Subject *</Label>
                <Input id="subject" value={formData.subject} onChange={(e: any) => setFormData({ ...formData, subject: e?.target?.value ?? '' })} placeholder="Charter inquiry" />
              </div>
            </div>
            <div>
              <Label htmlFor="message" className="text-xs text-muted-foreground mb-1 block">Message *</Label>
              <Textarea id="message" value={formData.message} onChange={(e: any) => setFormData({ ...formData, message: e?.target?.value ?? '' })} placeholder="Tell us about your trip plans..." rows={5} />
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
            </Button>
            <p className="text-xs text-muted-foreground">Your information is stored securely and used only to respond to your inquiry.</p>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/30 rounded-lg p-6">
            <h3 className="font-display font-semibold mb-4">Direct Contact</h3>
            <p className="text-sm font-medium text-foreground mb-4">Capitán Francisco Ruiz</p>
            <div className="space-y-4">
              <a href="tel:+526241225441" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Call Us</p>
                  <p className="font-mono text-sm">+52 624 122 5441</p>
                </div>
              </a>
              <a href="mailto:info@stripedworldcharters.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">info@stripedworldcharters.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm">Cabo San Lucas B.C.S., México</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h4 className="font-semibold text-primary text-sm mb-2">Quick Booking?</h4>
            <p className="text-muted-foreground text-sm mb-3">For the fastest response, call us directly. We&apos;re happy to walk you through all options.</p>
            <a href="tel:+526241225441">
              <Button size="sm" className="w-full">
                <Phone className="w-4 h-4 mr-2" /> Call Now
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
