import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { ContactForm } from "./contact-form";
import { Mail as MailIcon, MapPin as MapPinIcon, Phone as PhoneIcon, Clock as ClockIcon } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Vestrostyles — Support & Grievance",
  description:
    "Reach the Vestrostyles team via email, WhatsApp, or our contact form. We respond within 48 hours, Mon–Sat, 11AM–7PM IST.",
  openGraph: {
    title: "Contact Vestrostyles — Support & Grievance",
    description:
      "Reach the Vestrostyles team via email, WhatsApp, or our contact form. We respond within 48 hours, Mon–Sat, 11AM–7PM IST.",
    url: "https://www.vestrostyles.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Vestrostyles — Support & Grievance",
    description:
      "Reach the Vestrostyles team via email, WhatsApp, or our contact form.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070"
          alt="Contact Vestrostyles Boutique"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#090A0A] opacity-40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-italiana text-white uppercase mb-6 drop-shadow-md text-center max-w-4xl px-4">
            Connect With Us
          </h1>
          <p className="text-xs md:text-sm text-stone-200 font-montserrat uppercase font-medium">
            Service & Support
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Header Text */}
        <div className="max-w-2xl mx-auto text-center mb-16 lg:mb-24">
          <h2 className="text-3xl md:text-4xl font-serif text-[#090A0A] mb-6">
            How can we help?
          </h2>
          <p className="text-stone-500 font-sans text-sm md:text-base leading-relaxed">
            Whether you have a question about our latest drops, need assistance
            with an order, or would like to register a grievance, we are here to
            help. Reach out to our team using the form below or our direct
            channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white">
              <h3 className="text-xl font-serif text-[#090A0A] mb-8 border-b border-stone-100 pb-4">
                Send us a message
              </h3>
              <ContactForm />
            </div>
          </div>

          {/* Right Column: Contact Details & Grievance */}
          <div className="lg:col-span-5 space-y-16">
            {/* Quick Contact Info */}
            <div>
              <h3 className="text-xs font-montserrat font-bold uppercase tracking-[0.15em] text-brand-gold mb-8">
                Direct Contact
              </h3>

              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-[#090A0A]">
                    <MailIcon className="h-5 w-5 stroke-[1.5]" />
                    <span className="text-sm uppercase font-bold tracking-widest text-[#090A0A]">
                      Email Support
                    </span>
                  </div>
                  <Link
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-base text-stone-500 font-medium hover:text-brand-gold transition-colors pl-8"
                  >
                    {siteConfig.contact.email}
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-[#090A0A]">
                    <PhoneIcon className="h-5 w-5 stroke-[1.5]" />
                    <span className="text-sm uppercase font-bold tracking-widest text-[#090A0A]">
                      Phone & WhatsApp
                    </span>
                  </div>
                  <Link
                    href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                    className="text-base text-stone-500 font-medium hover:text-brand-gold transition-colors pl-8"
                  >
                    {siteConfig.contact.phone}
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-[#090A0A]">
                    <ClockIcon className="h-5 w-5 stroke-[1.5]" />
                    <span className="text-sm uppercase font-bold tracking-widest text-[#090A0A]">
                      Business Hours
                    </span>
                  </div>
                  <div className="text-base text-stone-500 pl-8">
                    <p>Monday – Saturday</p>
                    <p>11:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-[#090A0A]">
                    <MapPinIcon className="h-5 w-5 stroke-[1.5]" />
                    <span className="text-sm uppercase font-bold tracking-widest text-[#090A0A]">
                      Headquarters
                    </span>
                  </div>
                  <address className="not-italic text-base text-stone-500 leading-relaxed pl-8">
                    {siteConfig.business.address.building}, {siteConfig.business.address.street},
                    <br />
                    {siteConfig.business.address.district},
                    <br />
                    {siteConfig.business.address.city} — {siteConfig.business.address.pin}, India
                  </address>
                </div>
              </div>
            </div>

            {/* Grievance Mechanism Info */}
            <div className="bg-stone-50/80 p-8">
              <h3 className="text-xs font-montserrat font-bold uppercase tracking-[0.15em] text-[#090A0A] mb-4">
                Grievance Mechanism
              </h3>

              <div className="text-[#090A0A]">
                <p className="text-sm text-stone-500 leading-relaxed mb-6 font-medium">
                  In compliance with the Consumer Protection (E-Commerce) Rules,
                  2020, and the Digital Personal Data Protection Act, 2023,
                  Vestrostyles has designated a Grievance Officer.
                </p>

                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-1">
                      Designated Officer
                    </p>
                    <p className="text-lg font-serif">{siteConfig.business.legalName}</p>
                    <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider">
                      Co-Founder & Grievance Officer
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-1">
                      Escalation Direct Line
                    </p>
                    <Link
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-sm font-medium hover:text-brand-gold transition-colors"
                    >
                      {siteConfig.contact.email}
                    </Link>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-1">
                      Resolution Timeline
                    </p>
                    <p className="text-sm text-stone-500">
                      We acknowledge emails within 48 hours and strive to
                      resolve all disputes within 30 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

