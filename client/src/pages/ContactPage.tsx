import type { JSX } from "react/jsx-runtime";
import { Icon } from "@/components/Icon";
import { useState } from "react";
import { toast } from "sonner";

export function ContactPage(): JSX.Element {
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e: React.FormEvent): void {
        e.preventDefault();
        setSubmitted(true);
        toast.success("Message sent successfully! We will get back to you shortly.");
    }

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-stack-xl animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-300/40 border border-champagne-500/30 text-champagne-700 font-label-md text-xs tracking-widest uppercase mb-6 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-champagne-500 animate-pulse" />
                    Get in Touch
                </span>
                <h1 className="font-display-lg-mobile md:font-display-lg text-3xl md:text-5xl text-primary mb-4 font-bold">
                    Contact <span className="text-gradient-gold">Ashnoor Mirror Store</span>
                </h1>
                <p className="font-body-lg text-on-surface-variant text-base">
                    Have questions about custom mirror sizes, orders, or interior styling in Karachi? Our concierge team is here to assist you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Contact Information Cards */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-champagne-300/50 shadow-premium space-y-8">
                        <h2 className="font-headline-md text-2xl text-primary font-bold">Store & Studio</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-700 flex items-center justify-center shrink-0 shadow-sm border border-champagne-300">
                                    <Icon name="location_on" className="text-xl" />
                                </div>
                                <div>
                                    <p className="font-label-md text-sm text-primary font-bold uppercase tracking-wider">Location</p>
                                    <p className="font-body-md text-sm text-on-surface-variant mt-1">Karachi, Pakistan</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-700 flex items-center justify-center shrink-0 shadow-sm border border-champagne-300">
                                    <Icon name="mail" className="text-xl" />
                                </div>
                                <div>
                                    <p className="font-label-md text-sm text-primary font-bold uppercase tracking-wider">Email Us</p>
                                    <p className="font-body-md text-sm text-on-surface-variant mt-1">support@ashnoormirrorstore.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-700 flex items-center justify-center shrink-0 shadow-sm border border-champagne-300">
                                    <Icon name="call" className="text-xl" />
                                </div>
                                <div>
                                    <p className="font-label-md text-sm text-primary font-bold uppercase tracking-wider">Phone / WhatsApp</p>
                                    <p className="font-body-md text-sm text-on-surface-variant mt-1">+92 300 1234567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-champagne-700 flex items-center justify-center shrink-0 shadow-sm border border-champagne-300">
                                    <Icon name="schedule" className="text-xl" />
                                </div>
                                <div>
                                    <p className="font-label-md text-sm text-primary font-bold uppercase tracking-wider">Working Hours</p>
                                    <p className="font-body-md text-sm text-on-surface-variant mt-1">Mon - Sat: 10:00 AM - 8:00 PKT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-7">
                    <div className="bg-white p-8 md:p-10 rounded-3xl border border-champagne-300/50 shadow-premium">
                        <h2 className="font-headline-md text-2xl text-primary font-bold mb-2">Send Us a Message</h2>
                        <p className="font-body-md text-sm text-on-surface-variant mb-8">Fill out the form below and our customer support team will get back to you promptly.</p>

                        {submitted ? (
                            <div className="bg-champagne-100/60 border border-champagne-300 p-8 rounded-2xl text-center space-y-4">
                                <div className="w-16 h-16 bg-champagne-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                                <h3 className="font-headline-md text-xl text-primary font-bold">Message Received!</h3>
                                <p className="font-body-md text-sm text-on-surface-variant">Thank you for reaching out to Ashnoor Mirror Store. We will connect with you very soon.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-4 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md text-xs uppercase tracking-wider font-semibold">Send Another Message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-2">Your Name</label>
                                        <input required type="text" placeholder="Ashar Khan" className="w-full border border-champagne-300/80 bg-champagne-100/20 px-4 py-3 rounded-xl font-body-md text-sm focus:outline-none focus:border-secondary transition-all" />
                                    </div>
                                    <div>
                                        <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-2">Email Address</label>
                                        <input required type="email" placeholder="ashar@example.com" className="w-full border border-champagne-300/80 bg-champagne-100/20 px-4 py-3 rounded-xl font-body-md text-sm focus:outline-none focus:border-secondary transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-2">Phone Number</label>
                                    <input required type="tel" placeholder="+92 3XXXXXXXXX" className="w-full border border-champagne-300/80 bg-champagne-100/20 px-4 py-3 rounded-xl font-body-md text-sm focus:outline-none focus:border-secondary transition-all" />
                                </div>
                                <div>
                                    <label className="block font-label-md text-xs text-primary uppercase tracking-wider font-bold mb-2">Message</label>
                                    <textarea required rows={5} placeholder="Tell us about your custom mirror requirements or inquiry..." className="w-full border border-champagne-300/80 bg-champagne-100/20 px-4 py-3 rounded-xl font-body-md text-sm focus:outline-none focus:border-secondary transition-all" />
                                </div>
                                <button type="submit" className="w-full bg-gradient-gold text-charcoal-900 py-4 rounded-xl font-label-md text-sm uppercase tracking-widest shadow-md hover:shadow-luxury-glow transition-all font-bold flex items-center justify-center gap-2">
                                    Send Inquiry <Icon name="send" className="text-lg" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
