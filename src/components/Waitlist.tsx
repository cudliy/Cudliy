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
      const { data: existingUser, error: checkError } = await supabase
        .from('waitlist')
        .select('email, role')
        .eq('email', formData.email)
        .eq('role', selectedRole)
        .single();

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
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email,
          role: selectedRole,
          experience: selectedRole === "designer" ? formData.experience : null,
          production_style: selectedRole === "maker" ? formData.production_style : null
        });

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
    <div className="min-h-screen flex">
      {/* Left Section - Waitlist Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
        <div className={`w-full max-w-lg transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className={`text-center mb-6 sm:mb-8 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h1 className="text-2xl sm:text-3xl font-abril font-bold text-black mb-2">Cudliy.</h1>
            <h2 className="text-xl sm:text-2xl font-abril font-bold text-black mb-2">
              {selectedRole === "designer" ? "Where Vibe Designers Meet Makers" : "Join the Maker Economy"}
            </h2>
            <p className="text-gray-600 font-manrope text-sm sm:text-base">Your imagination deserves to become real.</p>
          </div>

          <div 
            className={`space-y-4 sm:space-y-6 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            onSubmit={handleSubmit}
          >
            {/* Role Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1 mx-auto" style={{ width: '138px', height: '39px' }}>
              <button
                type="button"
                onClick={() => handleRoleChange("designer")}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-md font-medium transition-colors flex items-center justify-center text-sm sm:text-base ${
                  selectedRole === "designer" ? "bg-black text-white shadow-sm" : "bg-white text-gray-600 hover:text-black"
                }`}
                style={{ borderRadius: '40px' }}
              >
                Designer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("maker")}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-md font-medium transition-colors flex items-center justify-center text-sm sm:text-base ${
                  selectedRole === "maker" ? "bg-black text-white shadow-sm" : "bg-white text-gray-600 hover:text-black"
                }`}
                style={{ borderRadius: '40px' }}
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
              className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent"
              style={{ 
                width: '100%', 
                maxWidth: '508px', 
                height: '50px', 
                padding: '14px 20px',
                borderRadius: '25px',
                border: '0.5px solid #000000',
                boxSizing: 'border-box'
              }}
              required
            />

            {/* Last Name Input */}
            <Input
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent"
              style={{ 
                width: '100%', 
                maxWidth: '508px', 
                height: '50px', 
                padding: '14px 20px',
                borderRadius: '25px',
                border: '0.5px solid #000000',
                boxSizing: 'border-box'
              }}
              required
            />

            {/* Email Input */}
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent"
              style={{ 
                width: '100%', 
                maxWidth: '508px', 
                height: '50px', 
                padding: '14px 20px',
                borderRadius: '25px',
                border: '0.5px solid #000000',
                boxSizing: 'border-box'
              }}
              required
            />

            {/* Dynamic Dropdown based on Role */}
            {selectedRole === "designer" ? (
              /* 3D Experience Dropdown for Designer */
              <div className="relative" ref={designerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDesignerDropdown(!showDesignerDropdown)}
                  className="w-full text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent bg-white"
                  style={{ 
                    width: '100%', 
                    maxWidth: '508px', 
                    height: '50px', 
                    padding: '14px 20px',
                    borderRadius: '25px',
                    border: '0.5px solid #000000',
                    boxSizing: 'border-box'
                  }}
                >
                  <span className={formData.experience ? "text-black" : "text-gray-500"}>
                    {formData.experience || "3D Experience"}
                  </span>
                  <span className="float-right">▼</span>
                </button>
                
                <div 
                  className={`absolute top-full left-0 mt-2 z-50 transition-all duration-300 ease-in-out ${
                    showDesignerDropdown 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                  style={{ 
                    width: '508px',
                    maxWidth: '100vw',
                    height: 'auto',
                    minHeight: '286px',
                    padding: '32px',
                    background: '#FFFFFF',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1), 5px 3px 16px rgba(198, 198, 198, 0.31)',
                    borderRadius: '30px',
                    border: 'none',
                    transform: 'translateX(0)',
                    overflow: 'hidden'
                  }}
                >
                  <div className="dropdown-label" style={{
                    width: '100%',
                    height: '19px',
                    fontFamily: 'Inter',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '16px',
                    lineHeight: '19px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#2C2E3D',
                    marginBottom: '24px'
                  }}>
                    Select One
                  </div>
                  <div className="dropdown-options" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: '100%',
                    height: 'auto'
                  }}>
                    {["No Experience", "Basic CAD Knowledge", "Advanced Designer"].map((option, index) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleDropdownOptionClick(option)}
                        className="custom-dropdown-item hover:bg-gray-50 transition-colors"
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '16px 20px',
                          gap: '9.31px',
                          width: '100%',
                          height: '52px',
                          border: index === 0 ? '0.5px solid #767676' : index === 1 ? '0.5px solid #B7B7B7' : '0.5px solid #969696',
                          borderRadius: '26px',
                          fontFamily: 'Manrope',
                          fontStyle: 'normal',
                          fontWeight: '500',
                          fontSize: '16px',
                          lineHeight: '22px',
                          color: '#2C2E3D',
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Production Style Dropdown for Maker */
              <div className="relative" ref={makerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowMakerDropdown(!showMakerDropdown)}
                  className="w-full text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E70A55] focus:border-transparent bg-white"
                  style={{ 
                    width: '100%', 
                    maxWidth: '508px', 
                    height: '50px', 
                    padding: '14px 20px',
                    borderRadius: '25px',
                    border: '0.5px solid #000000',
                    boxSizing: 'border-box'
                  }}
                >
                  <span className={formData.production_style ? "text-black" : "text-gray-500"}>
                    {formData.production_style || "Production Style"}
                  </span>
                  <span className="float-right">▼</span>
                </button>
                
                <div 
                  className={`absolute top-full left-0 mt-2 z-50 transition-all duration-300 ease-in-out ${
                    showMakerDropdown 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                  style={{ 
                    width: '508px',
                    maxWidth: '100vw',
                    height: 'auto',
                    minHeight: '286px',
                    padding: '32px',
                    background: '#FFFFFF',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1), 5px 3px 16px rgba(198, 198, 198, 0.31)',
                    borderRadius: '30px',
                    border: 'none',
                    transform: 'translateX(0)',
                    overflow: 'hidden'
                  }}
                >
                  <div className="dropdown-label" style={{
                    width: '100%',
                    height: '19px',
                    fontFamily: 'Inter',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '16px',
                    lineHeight: '19px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#2C2E3D',
                    marginBottom: '24px'
                  }}>
                    Select One
                  </div>
                  <div className="dropdown-options" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: '100%',
                    height: 'auto'
                  }}>
                    {["Digital Production", "Handcrafted Production", "Hybrid"].map((option, index) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleDropdownOptionClick(option)}
                        className="custom-dropdown-item hover:bg-gray-50 transition-colors"
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '16px 20px',
                          gap: '9.31px',
                          width: '100%',
                          height: '52px',
                          border: index === 0 ? '0.5px solid #767676' : index === 1 ? '0.5px solid #B7B7B7' : '0.5px solid #969696',
                          borderRadius: '26px',
                          fontFamily: 'Manrope',
                          fontStyle: 'normal',
                          fontWeight: '500',
                          fontSize: '16px',
                          lineHeight: '22px',
                          color: '#2C2E3D',
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center my-8">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="text-white font-medium transition-colors hover:bg-[#d1094a]"
                style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                  padding: '14px 40px', gap: '10px', width: '131px', height: '55px',
                  background: '#E70A55', borderRadius: '22px', border: 'none'
                }}
              >
                {isLoading ? "Joining..." : "Join"}
              </Button>
            </div>

            {/* Free Early Access Text */}
            <div className="text-center">
              <p className="text-gray-500 text-sm font-manrope">Free Early Access</p>
            </div>

            {/* Countdown Timer */}
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-black mb-2">
                {formatNumber(countdown.days)} : {formatNumber(countdown.hours)} : {formatNumber(countdown.minutes)} : {formatNumber(countdown.seconds)}
              </div>
              <p className="text-sm text-gray-600">
                Get Ready For <span className="text-[#E70A55] font-semibold">October 1st</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Visual Branding */}
      <div 
        className={`hidden lg:flex lg:w-1/2 relative overflow-hidden transform transition-all duration-1000 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
        style={{ 
          backgroundColor: '#FBB871',
          borderTopLeftRadius: '40px',
          borderBottomLeftRadius: '40px'
        }}
      >
        {/* Central Image - Background layer */}
        <div className={`absolute inset-0 flex items-center justify-center transform transition-all duration-1000 delay-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <img
            src={selectedRole === "designer" ? "/image 2.png" : "/image 1.png"}
            alt={selectedRole === "designer" ? "Designer Background" : "Maker Background"}
            className="object-contain"
            style={{ 
              width: 'min(90vw, 900px)', 
              height: 'min(90vh, 600px)', 
              minWidth: '500px',
              minHeight: '350px',
              maxWidth: '1000px',
              maxHeight: '700px'
            }}
          />
        </div>

        {/* Text Overlay Layer - This will be on top */}
        <div className="absolute inset-0 pointer-events-none">
          {/* CUD Text - Top Left */}
          <div 
            className={`absolute top-8 left-8 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div 
              className="font-bold select-none"
              style={{ 
                fontSize: 'clamp(3rem, 8vw, 8rem)',
                fontFamily: 'Manrope',
                color: 'transparent',
                WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.58)',
                background: 'transparent',
                lineHeight: 0.8
              } as React.CSSProperties}
            >
              CUD
            </div>
          </div>

          {/* LIY Text - Bottom Right */}
          <div 
            className={`absolute bottom-8 right-8 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div 
              className="font-bold select-none"
              style={{ 
                fontSize: 'clamp(3rem, 8vw, 8rem)',
                fontFamily: 'Manrope',
                color: 'transparent',
                WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.58)',
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