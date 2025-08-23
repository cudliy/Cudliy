import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Waitlist = () => {
  const [selectedRole, setSelectedRole] = useState<"designer" | "maker">("designer");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    experience: "",
    production_style: ""
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDesignerDropdown, setShowDesignerDropdown] = useState(false);
  const [showMakerDropdown, setShowMakerDropdown] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const { toast } = useToast();
  const designerDropdownRef = useRef<HTMLDivElement>(null);
  const makerDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('October 1, 2025 00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        // Countdown has ended
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Update countdown immediately
    updateCountdown();

    // Update countdown every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (designerDropdownRef.current && !designerDropdownRef.current.contains(event.target as Node)) {
        setShowDesignerDropdown(false);
      }
      if (makerDropdownRef.current && !makerDropdownRef.current.contains(event.target as Node)) {
        setShowMakerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!formData.first_name.trim()) {
        toast({
          title: "Error",
          description: "Please enter your first name",
          variant: "destructive",
        });
        return;
      }

      if (!formData.last_name.trim()) {
        toast({
          title: "Error",
          description: "Please enter your last name",
          variant: "destructive",
        });
        return;
      }

      if (!formData.email) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive",
        });
        return;
      }

      // Check if email already exists for this role
      let existingUser = null;
      let checkError = null;
      
      try {
        const result = await supabase
          .from('waitlist')
          .select('email, role')
          .eq('email', formData.email)
          .eq('role', selectedRole)
          .single();
        
        existingUser = result.data;
        checkError = result.error;
      } catch (error) {
        console.error("Network error checking existing user:", error);
        toast({
          title: "Connection Error",
          description: "Unable to connect to server. Please check your internet connection and try again.",
          variant: "destructive",
        });
        return;
      }

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected
        console.error("Error checking existing user:", checkError);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (existingUser) {
        toast({
          title: "Already Registered",
          description: `This email is already registered as a ${selectedRole}.`,
          variant: "destructive",
        });
        return;
      }

      // Insert new waitlist entry with separate first and last name
      let insertError = null;
      
      try {
        const result = await supabase
          .from('waitlist')
          .insert({
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email,
            role: selectedRole,
            experience: selectedRole === "designer" ? formData.experience : null,
            production_style: selectedRole === "maker" ? formData.production_style : null
          });
        
        insertError = result.error;
      } catch (error) {
        console.error("Network error inserting waitlist entry:", error);
        toast({
          title: "Connection Error",
          description: "Unable to connect to server. Please check your internet connection and try again.",
          variant: "destructive",
        });
        return;
      }

      if (insertError) {
        console.error("Error inserting waitlist entry:", insertError);
        toast({
          title: "Error",
          description: "Failed to join waitlist. Please try again.",
          variant: "destructive",
        });
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success
      toast({
        title: "Success!",
        description: `Welcome to the ${selectedRole} waitlist! We'll be in touch soon.`,
      });

      // Reset form
      setFormData({ first_name: "", last_name: "", email: "", experience: "", production_style: "" });

    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset dropdown values when role changes
  const handleRoleChange = (role: "designer" | "maker") => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      experience: "",
      production_style: ""
    }));
    setShowDesignerDropdown(false);
    setShowMakerDropdown(false);
  };

  const handleDropdownOptionClick = (value: string) => {
    if (selectedRole === "designer") {
      handleInputChange("experience", value);
      setShowDesignerDropdown(false);
    } else {
      handleInputChange("production_style", value);
      setShowMakerDropdown(false);
    }
  };

  // Format countdown numbers to always show two digits
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Left Section - Waitlist Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 lg:py-8 overflow-y-auto">
        <div className={`w-full max-w-md lg:max-w-lg xl:max-w-xl transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Logo and Header */}
          <div className={`text-center transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <img
              src="/download.png"
              alt="Cudliy logo"
              className="mx-auto mb-4"
              style={{ 
                width: 'clamp(80px, 20vw, 160px)',
                height: 'auto',
                objectFit: 'contain',
                maxHeight: '120px',
                aspectRatio: 'auto'
              }}
            />
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-abril font-bold text-black mb-3" style={{ fontFamily: '"Abril Fatface", serif' }}>
              {selectedRole === "designer" ? "Where Vibe Designers Meet Makers" : "Join the Maker Economy"}
            </h2>
            <p className="text-gray-600 font-manrope text-sm sm:text-base mb-6 px-4 lg:px-0">
              {selectedRole === "designer"
                ? "Your imagination deserves to become real."
                : "Behind every designer's creation is a maker like you who turns this idea into something they can hold. your craft gets paid what it's worth."}
            </p>
          </div>

                      {/* Form Section */}
            <div className={`space-y-3 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Role Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1 mx-auto w-40 sm:w-48">
              <button
                type="button"
                onClick={() => handleRoleChange("designer")}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-medium transition-colors flex items-center justify-center text-sm sm:text-base ${
                  selectedRole === "designer" ? "bg-black text-white shadow-sm" : "bg-white text-gray-600 hover:text-black"
                }`}
                style={{ borderRadius: '20px' }}
              >
                Designer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("maker")}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-md font-medium transition-colors flex items-center justify-center text-sm sm:text-base ${
                  selectedRole === "maker" ? "bg-black text-white shadow-sm" : "bg-white text-gray-600 hover:text-black"
                }`}
                style={{ borderRadius: '20px' }}
              >
                Maker
              </button>
            </div>

            {/* First Name Input */}
            <Input
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent text-sm sm:text-base bg-white"
              required
            />

            {/* Last Name Input */}
            <Input
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent text-sm sm:text-base bg-white"
              required
            />

            {/* Email Input */}
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full h-12 sm:h-14 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent text-sm sm:text-base bg-white"
              required
            />

            {/* Dynamic Dropdown based on Role */}
            {selectedRole === "designer" ? (
              /* 3D Experience Dropdown for Designer */
              <div className="relative" ref={designerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDesignerDropdown(!showDesignerDropdown)}
                  className="w-full h-12 sm:h-14 px-4 text-left border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent bg-white text-sm sm:text-base"
                >
                  <span className={formData.experience ? "text-black" : "text-gray-500"}>
                    {formData.experience || "3D Experience"}
                  </span>
                  <span className="float-right">▼</span>
                </button>
                
                <div 
                  className={`absolute top-full left-0 right-0 mt-2 z-50 transition-all duration-300 ease-in-out ${
                    showDesignerDropdown 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                  style={{ 
                    background: '#FFFFFF',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid #e5e7eb',
                    maxHeight: '300px',
                    overflow: 'hidden'
                  }}
                >
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      Select One
                    </div>
                    <div className="space-y-2">
                      {["No Experience", "Basic CAD Knowledge", "Advanced Designer"].map((option, index) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleDropdownOptionClick(option)}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base border border-gray-200"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Production Style Dropdown for Maker */
              <div className="relative" ref={makerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowMakerDropdown(!showMakerDropdown)}
                  className="w-full h-12 sm:h-14 px-4 text-left border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent bg-white text-sm sm:text-base"
                >
                  <span className={formData.production_style ? "text-black" : "text-gray-500"}>
                    {formData.production_style || "Production Style"}
                  </span>
                  <span className="float-right">▼</span>
                </button>
                
                <div 
                  className={`absolute top-full left-0 right-0 mt-2 z-50 transition-all duration-300 ease-in-out ${
                    showMakerDropdown 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                  style={{ 
                    background: '#FFFFFF',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid #e5e7eb',
                    maxHeight: '300px',
                    overflow: 'hidden'
                  }}
                >
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      Select One
                    </div>
                    <div className="space-y-2">
                      {["Digital Production", "Handcrafted Production", "Hybrid"].map((option, index) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleDropdownOptionClick(option)}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base border border-gray-200"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-32 h-12 sm:h-14 text-white font-medium transition-colors hover:bg-[#d1094a] rounded-full text-sm sm:text-base"
                style={{
                  background: '#E70A55',
                  border: 'none'
                }}
              >
                {isLoading ? "Joining..." : "Join"}
              </Button>
            </div>

            {/* Free Early Access Text */}
            <div className="text-center">
              <p className="text-gray-500 text-sm sm:text-base font-manrope">Free Early Access</p>
            </div>

            {/* Countdown Timer */}
            <div className="text-center pt-12 lg:pt-20">
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-black mb-1">
                {formatNumber(countdown.days)} : {formatNumber(countdown.hours)} : {formatNumber(countdown.minutes)} : {formatNumber(countdown.seconds)}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Get Ready For <span className="text-[#E70A55] font-semibold">October 1st</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Visual Branding */}
      <div 
        className={`hidden lg:flex lg:w-1/2 relative transform transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
        style={{ 
          backgroundColor: '#FBB871',
          borderTopLeftRadius: '40px',
          borderBottomLeftRadius: '40px',
          overflow: 'hidden'
        }}
      >
        {/* Central Image - Background layer */}
        <div className={`absolute inset-0 flex items-center justify-center transform transition-all duration-1000 delay-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{ zIndex: 1 }}>
          <img
            src={selectedRole === "designer" ? "/WaitImage1.jpg" : "/Waitimage.jpg"}
            alt={selectedRole === "designer" ? "Designer Background" : "Maker Background"}
            className="object-contain"
            style={{ 
              width: 'min(90%, 800px)', 
              height: 'min(90%, 900px)', 
              maxWidth: '900px',
              maxHeight: '1000px'
            }}
          />
        </div>

        {/* Text Overlay Layer - CUD and LIY positioned precisely on image */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          {/* CUD Text - Top Left of image area */}
          <div 
            className={`absolute transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{
              left: 'clamp(2rem, 15%, 8rem)',
              top: 'clamp(3rem, 20%, 12rem)',
              transform: 'rotate(-15deg)',
            }}
          >
            <div 
              className="font-bold select-none"
              style={{ 
                fontSize: 'clamp(3rem, 8vw, 10rem)',
                fontFamily: 'Manrope',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.58)',
                background: 'transparent',
                lineHeight: 0.8
              } as React.CSSProperties}
            >
              CUD
            </div>
          </div>

          {/* LIY Text - Bottom Right of image area */}
          <div 
            className={`absolute transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{
              right: 'clamp(2rem, 15%, 8rem)',
              bottom: 'clamp(3rem, 20%, 12rem)',
              transform: 'rotate(15deg)',
            }}
          >
            <div 
              className="font-bold select-none"
              style={{ 
                fontSize: 'clamp(3rem, 8vw, 10rem)',
                fontFamily: 'Manrope',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.58)',
                background: 'transparent',
                lineHeight: 0.8
              } as React.CSSProperties}
            >
              LIY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;