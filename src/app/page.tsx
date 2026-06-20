"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, Check, AlertCircle } from "lucide-react";

const VENTURES = [
  {
    name: "Zee Chai",
    description: "Premium chai lounges bringing a modern, warm tea experience.",
    url: "https://zeechai.com", // Example URL
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
    url: "https://leweekend.com",
  },
];

const CATEGORIES = ["ZeeSip", "Zee Chai", "Eallisto", "General"];

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      // Connect to API route
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          ...formData,
        }),
      });

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
        setErrors({ submit: "Something went wrong. Please try again." });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
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
        <div className="flex justify-between items-start">
          <span className="font-serif text-lg tracking-wider font-semibold">K.M.</span>
          <span className="text-xs uppercase tracking-[0.2em] border border-black px-3 py-1">
            Personal Hub
          </span>
        </div>

        <div className="my-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-serif text-6xl sm:text-7xl md:text-9xl tracking-tight leading-none mb-6">
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
            <p className="font-serif text-xl sm:text-2xl text-black/80 italic">
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
              enquiry hub below. It feeds directly into my team's admin panel for a faster response.
            </p>
          </motion.div>
        </div>

        <div className="flex justify-between items-center text-xs uppercase tracking-[0.2em]">
          <button 
            onClick={() => scrollToSection("about")}
            className="hover:underline underline-offset-4 flex items-center gap-1 group"
          >
            Scroll to explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <span>Est. 2024</span>
        </div>
      </section>

      {/* 2. NAVBAR (Appears after hero, on scroll) */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full z-50 bg-[#F5F0E6]/95 backdrop-blur-md border-b border-black/10 px-6 py-4 md:px-24 flex justify-between items-center"
          >
            <button 
              onClick={() => scrollToSection("home")}
              className="font-serif text-xl font-bold tracking-tight"
            >
              Kaif Muhammad
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] font-medium">
              <button onClick={() => scrollToSection("about")} className="hover:underline underline-offset-4">About</button>
              <button onClick={() => scrollToSection("ventures")} className="hover:underline underline-offset-4">Ventures</button>
              <button onClick={() => scrollToSection("enquire")} className="hover:underline underline-offset-4">Enquire</button>
              <button onClick={() => scrollToSection("contact")} className="hover:underline underline-offset-4">Contact</button>
            </div>

            {/* Mobile Burger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1 border border-black/10 hover:border-black transition-colors"
            >
              <span className="text-xs uppercase tracking-wider font-semibold">Menu</span>
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#F5F0E6] flex flex-col justify-between p-8"
          >
            <div className="flex justify-between items-center">
              <span className="font-serif text-lg font-bold">K.M.</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="border border-black px-4 py-2 text-xs uppercase tracking-wider font-semibold"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-8 my-auto text-4xl sm:text-5xl font-serif">
              <button onClick={() => scrollToSection("about")} className="text-left hover:italic">About</button>
              <button onClick={() => scrollToSection("ventures")} className="text-left hover:italic">Ventures</button>
              <button onClick={() => scrollToSection("enquire")} className="text-left hover:italic">Enquire</button>
              <button onClick={() => scrollToSection("contact")} className="text-left hover:italic">Contact</button>
            </div>

            <div className="flex justify-between text-xs uppercase tracking-widest text-black/60">
              <span>kaif@gmail.com</span>
              <span>© 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ABOUT SECTION (Extra block to connect About navigation link) */}
      <section 
        id="about" 
        className="py-24 px-6 md:px-24 border-t border-black bg-black text-[#F5F0E6]"
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] opacity-60 block mb-6">01 / Biography</span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight mb-8">
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
              <span className="text-xs uppercase tracking-[0.3em] text-black/60 block mb-3">02 / Portfolio</span>
              <h2 className="font-serif text-5xl md:text-6xl tracking-tight">Active Ventures</h2>
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
                  <span className="font-serif text-3xl font-light tracking-tight group-hover:italic">
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
            <span className="text-xs uppercase tracking-[0.3em] opacity-60 block mb-3">03 / Communication</span>
            <h2 className="font-serif text-5xl md:text-6xl tracking-tight mb-4">Enquiry Hub</h2>
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
                    <label htmlFor="category" className="block text-xs uppercase tracking-[0.2em] font-medium opacity-80">
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
                      <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] opacity-80">Name *</label>
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
                      <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] opacity-80">Email *</label>
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
                      <label htmlFor="phone" className="block text-xs uppercase tracking-[0.2em] opacity-80">Phone Number *</label>
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
                      <label htmlFor="place" className="block text-xs uppercase tracking-[0.2em] opacity-80">Place (City/Location) *</label>
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
                    <label htmlFor="message" className="block text-xs uppercase tracking-[0.2em] opacity-80">Message *</label>
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
                    <div className="p-4 border border-red-500 text-red-500 text-sm">
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
                  <h3 className="font-serif text-3xl sm:text-4xl tracking-tight">Enquiry Received</h3>
                  <p className="text-sm opacity-70 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your enquiry has been added to our dashboard. 
                    Kaif or a representative of the team will review the details and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="border border-[#F5F0E6] px-8 py-3 text-xs uppercase tracking-widest text-[#F5F0E6] hover:bg-[#F5F0E6] hover:text-black transition-all duration-300 rounded-none"
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. SOCIALS/CONTACT BAR (Footer) */}
      <footer 
        id="contact" 
        className="py-16 px-6 md:px-24 border-t border-black bg-[#F5F0E6] text-black flex flex-col md:flex-row justify-between items-center gap-8"
      >
        <div className="text-center md:text-left">
          <span className="font-serif text-2xl font-bold tracking-tight block">Kaif Muhammad</span>
          <span className="text-xs uppercase tracking-[0.2em] text-black/50">© 2026. All Rights Reserved.</span>
        </div>

        <div className="flex gap-8 text-xs uppercase tracking-[0.2em] font-semibold">
          <a
            href="https://instagram.com" // Example Instagram link
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
            href="https://wa.me/919876543210" // Example WhatsApp click-to-chat link
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline underline-offset-4 flex items-center gap-1.5"
          >
            WhatsApp 
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </a>
          <a
            href="mailto:kaif@gmail.com"
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
