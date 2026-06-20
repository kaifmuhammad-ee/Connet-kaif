"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, Check, AlertCircle } from "lucide-react";

const VENTURES = [
  {
    name: "Zee Chai",
    description: "Premium chai lounges bringing a modern, warm tea experience.",
    url: "https://zeechai.in",
  },
  {
    name: "ZeeSip",
    description: "Innovative beverage solutions and bottled fresh juices.",
    url: "https://zeesip.com",
  },
  {
    name: "Eallisto",
    description: "Curated luxury lifestyle, interiors, and design venture.",
    url: "https://eallisto.com",
  },
  {
    name: "Kinford School",
    description: "A modern educational space focusing on progressive learning.",
    url: "https://kinfordschool.com",
  },
  {
    name: "Le Weekend",
    description: "Curated weekend getaways, boutique travel, and experiences.",
    url: "https://leweekend.in",
  },
];

const CATEGORIES = [
  "ZeeSip", 
  "Zee Chai", 
  "Eallisto", 
  "Le Weekend", 
  "Kinford School", 
  "General"
];

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    place: "",
    message: "",
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  // Monitor scroll to show/hide navbar after hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroHeight = heroRef.current.offsetHeight;
        // Show navbar once user scrolls past 80% of hero height
        if (window.scrollY > heroHeight * 0.8) {
          setShowNavbar(true);
        } else {
          setShowNavbar(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!category) newErrors.category = "Please select a category";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.place.trim()) newErrors.place = "Place / Location is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          place: "",
          message: "",
        });
        setCategory("");
      } else {
        setErrors({ submit: result.error || "Something went wrong. Please try again." });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-black font-sans relative selection:bg-black selection:text-[#F5F0E6]">
      
      {/* 1. HERO SECTION */}
      <section 
        ref={heroRef}
        id="home"
        className="min-h-screen flex flex-col justify-between px-6 py-12 md:px-24 md:py-20 relative z-10"
      >
        <div className="flex justify-end items-start w-full">
          <span className="text-xs uppercase tracking-[0.2em] border border-black px-3 py-1 font-semibold">
            Personal Hub
          </span>
        </div>

        <div className="my-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-heading font-light text-6xl sm:text-7xl md:text-9xl tracking-normal leading-none mb-6 uppercase">
              Kaif Muhammad
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-8"
          >
            <p className="text-xs uppercase tracking-[0.3em] font-semibold bg-black text-[#F5F0E6] px-3 py-1 w-fit">
              Serial Entrepreneur
            </p>
            <p className="font-heading text-base sm:text-lg text-black/70 tracking-widest font-light uppercase">
              Building the future across hospitality, luxury, and education.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-xl border-l-2 border-black pl-6 py-2 mt-8"
          >
            <p className="text-sm sm:text-base leading-relaxed text-black/70">
              My Instagram DMs are heavily backlogged. If you have a business proposal, 
              partnership opportunity, or inquiry for any of my ventures, please use the 
              enquiry hub below. It feeds directly into my team&apos;s admin panel for a faster response.
            </p>
          </motion.div>
        </div>

        <div className="flex justify-start items-center text-xs uppercase tracking-[0.2em]">
          <button 
            onClick={() => scrollToSection("about")}
            className="hover:underline underline-offset-4 flex items-center gap-1 group font-semibold"
          >
            Scroll to explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 2. NAVBAR (Centered Floating Pill Style) */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ y: -50, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: -50, x: "-50%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/95 backdrop-blur-md border border-[#F5F0E6]/15 px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 sm:gap-8 text-[#F5F0E6] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold"
          >
            <button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors">About</button>
            <button onClick={() => scrollToSection("ventures")} className="hover:text-white transition-colors">Ventures</button>
            <button onClick={() => scrollToSection("enquire")} className="hover:text-white transition-colors">Enquire</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors">Contact</button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ABOUT SECTION */}
      <section 
        id="about" 
        className="py-24 px-6 md:px-24 border-t border-black bg-black text-[#F5F0E6]"
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] opacity-60 block mb-6 font-semibold">01 / Biography</span>
          <h2 className="font-heading font-light text-4xl sm:text-5xl md:text-6xl tracking-wide mb-8">
            An editorial approach to multi-venture execution.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base opacity-80 leading-relaxed font-light">
            <p>
              Kaif Muhammad is an entrepreneur operating across diverse industries. From reinventing the 
              traditional tea experience with Zee Chai to pioneering fresh, bottled beverage distributions through 
              ZeeSip, his projects reflect a passion for exceptional quality and distinct brand experiences.
            </p>
            <p>
              Beyond hospitality, Kaif leads Eallisto, a curated luxury design venture, as well as educational 
              initiatives like Kinford School and leisure platforms like Le Weekend. He continues to launch 
              disruptive brands, ensuring each is run by a dedicated operational team.
            </p>
          </div>
        </div>
      </section>

      {/* 3. VENTURES / PORTFOLIO STRIP */}
      <section 
        id="ventures" 
        className="py-24 px-6 md:px-24 border-t border-black bg-[#F5F0E6] text-black"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-black/60 block mb-3 font-semibold">02 / Portfolio</span>
              <h2 className="font-heading font-light text-5xl md:text-6xl tracking-wide">Active Ventures</h2>
            </div>
            <p className="text-sm text-black/60 max-w-sm">
              Click on any venture below to explore their official channels and websites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VENTURES.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-black p-8 flex flex-col justify-between h-80 transition-all duration-500 hover:bg-black hover:text-[#F5F0E6] rounded-none relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <span className="font-heading text-xl sm:text-2xl font-light tracking-wide">
                    {item.name}
                  </span>
                  <div className="border border-black group-hover:border-[#F5F0E6] p-2 transition-colors">
                    <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>

                <div className="mt-auto">
                  <p className="text-sm font-light leading-relaxed mb-4 text-black/70 group-hover:text-[#F5F0E6]/80">
                    {item.description}
                  </p>
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold border-b border-black group-hover:border-[#F5F0E6] pb-1">
                    Explore Venture
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ENQUIRY HUB (Core Feature) */}
      <section 
        id="enquire" 
        className="py-24 px-6 md:px-24 border-t border-black bg-black text-[#F5F0E6]"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] opacity-60 block mb-3 font-semibold">03 / Communication</span>
            <h2 className="font-heading font-light text-5xl md:text-6xl tracking-wide mb-4">Enquiry Hub</h2>
            <p className="text-sm opacity-70 max-w-md mx-auto">
              Select the appropriate brand category below to submit a direct message to Kaif and his team.
            </p>
          </div>

          <div className="border border-[#F5F0E6]/20 p-8 md:p-12 bg-black">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Category Dropdown */}
                  <div className="space-y-3">
                    <label htmlFor="category" className="block text-xs uppercase tracking-[0.2em] font-semibold opacity-80">
                      Select Venture / Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full bg-black border ${
                        errors.category ? "border-red-500" : "border-[#F5F0E6]/30 focus:border-[#F5F0E6]"
                      } text-[#F5F0E6] px-4 py-4 text-sm font-sans tracking-wide outline-none transition-colors appearance-none rounded-none cursor-pointer`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%23F5F0E6' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
                        backgroundPosition: "right 16px center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <option value="" disabled className="text-white/40">-- Choose Category --</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-black text-[#F5F0E6]">
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Standard Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] font-semibold opacity-80">Name *</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full bg-transparent border-b ${
                          errors.name ? "border-red-500" : "border-[#F5F0E6]/30 focus:border-[#F5F0E6]"
                        } py-3 text-sm outline-none transition-colors rounded-none placeholder:text-white/20`}
                      />
                      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] font-semibold opacity-80">Email *</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className={`w-full bg-transparent border-b ${
                          errors.email ? "border-red-500" : "border-[#F5F0E6]/30 focus:border-[#F5F0E6]"
                        } py-3 text-sm outline-none transition-colors rounded-none placeholder:text-white/20`}
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-xs uppercase tracking-[0.2em] font-semibold opacity-80">Phone Number *</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={`w-full bg-transparent border-b ${
                          errors.phone ? "border-red-500" : "border-[#F5F0E6]/30 focus:border-[#F5F0E6]"
                        } py-3 text-sm outline-none transition-colors rounded-none placeholder:text-white/20`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                    </div>

                    {/* Place */}
                    <div className="space-y-2">
                      <label htmlFor="place" className="block text-xs uppercase tracking-[0.2em] font-semibold opacity-80">Place (City/Location) *</label>
                      <input
                        id="place"
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        placeholder="Mumbai, India"
                        className={`w-full bg-transparent border-b ${
                          errors.place ? "border-red-500" : "border-[#F5F0E6]/30 focus:border-[#F5F0E6]"
                        } py-3 text-sm outline-none transition-colors rounded-none placeholder:text-white/20`}
                      />
                      {errors.place && <p className="text-red-500 text-xs">{errors.place}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-3">
                    <label htmlFor="message" className="block text-xs uppercase tracking-[0.2em] font-semibold opacity-80">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your partnership proposal or enquiry details here..."
                      className={`w-full bg-transparent border ${
                        errors.message ? "border-red-500" : "border-[#F5F0E6]/30 focus:border-[#F5F0E6]"
                      } p-4 text-sm outline-none transition-colors rounded-none placeholder:text-white/20 resize-none font-sans`}
                    />
                    {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                  </div>

                  {errors.submit && (
                    <div className="p-4 border border-red-500 text-red-500 text-sm bg-red-500/5">
                      {errors.submit}
                    </div>
                  )}

                  <button
                    id="submit-enquiry"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F5F0E6] text-black font-semibold uppercase tracking-[0.2em] text-xs py-5 transition-all hover:bg-black hover:text-[#F5F0E6] border border-[#F5F0E6] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-[#F5F0E6] text-black rounded-full flex items-center justify-center mx-auto">
                    <Check size={28} />
                  </div>
                  <h3 className="font-heading font-light text-3xl sm:text-4xl tracking-wide">Enquiry Received</h3>
                  <p className="text-sm opacity-70 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your enquiry has been added to our dashboard. 
                    Kaif or a representative of the team will review the details and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="border border-[#F5F0E6] px-8 py-3 text-xs uppercase tracking-widest text-[#F5F0E6] hover:bg-[#F5F0E6] hover:text-black transition-all duration-300 rounded-none font-semibold"
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. FOOTER / CONTACT SECTION (Simplified) */}
      <footer 
        id="contact" 
        className="py-16 px-6 md:px-24 border-t border-black bg-[#F5F0E6] text-black flex flex-col md:flex-row justify-between items-center gap-8"
      >
        <div className="text-center md:text-left">
          <span className="font-heading text-lg font-light tracking-widest block uppercase">Kaif Muhammad</span>
          <span className="text-xs uppercase tracking-[0.2em] text-black/50 font-medium">© 2026. All Rights Reserved.</span>
        </div>

        <div className="flex gap-8 text-xs uppercase tracking-[0.2em] font-bold">
          <a
            href="https://www.instagram.com/_kaif_muhammad/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4 flex items-center gap-1.5"
          >
            Instagram 
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a
            href="mailto:kaifmuhammad.zee@gmail.com"
            className="hover:underline underline-offset-4 flex items-center gap-1.5"
          >
            Email 
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
