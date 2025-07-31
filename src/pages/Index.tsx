import { WaitlistForm } from "@/components/WaitlistForm";
import { Countdown } from "@/components/Countdown";
import { TypingEffect } from "@/components/TypingEffect";
import heroTeddy from "@/assets/hero-teddy.jpg";
import { Heart, Sparkles, Package, Star, Zap, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Content - Takes more space on desktop */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
                  <Sparkles className="h-4 w-4" />
                  Coming Soon
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight min-h-[120px] md:min-h-[140px] lg:min-h-[180px]">
                  <TypingEffect 
                    text="Custom" 
                    speed={150}
                    className="block"
                  />
                  <TypingEffect 
                    text=" 3D Printed" 
                    speed={120}
                    delay={800}
                    className="bg-gradient-primary bg-clip-text text-transparent"
                  />
                  <br />
                  <TypingEffect 
                    text="Creations" 
                    speed={140}
                    delay={2200}
                    className="text-2xl md:text-3xl lg:text-5xl block"
                  />
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mx-auto lg:mx-0 min-h-[60px]">
                  <TypingEffect 
                    text="Bring your imagination to life with personalized 3D printed toys and collectibles. Each one crafted with love, precision, and cutting-edge technology."
                    speed={50}
                    delay={3500}
                  />
                </p>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-accent rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-secondary rounded-full border-2 border-white"></div>
                  </div>
                  <span className="ml-2">500+ creators joined</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>Early access</span>
                </div>
              </div>

              {/* Waitlist Form Container */}
              <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
                <div className="w-full max-w-md">
                  <WaitlistForm />
                </div>
                <p className="text-xs text-muted-foreground text-center lg:text-left">
                  Join 500+ makers waiting for launch. No spam, ever.
                </p>
              </div>
            </div>

            {/* Hero Image - Better mobile positioning */}
            <div className="lg:col-span-5 order-first lg:order-last">
              <div className="relative w-full max-w-md mx-auto lg:max-w-none">
                {/* Mobile: smaller height, Desktop: larger */}
                <div className="relative w-full h-64 sm:h-80 lg:h-96">
                  {/* Glow effects */}
                  <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                  <div className="absolute -inset-4 bg-gradient-primary rounded-3xl blur-3xl opacity-10"></div>
                  
                  <img
                    src={heroTeddy}
                    alt="Custom 3D printed creation"
                    className="relative z-10 w-full h-full object-cover rounded-3xl shadow-soft hover:shadow-glow transition-all duration-500 transform hover:scale-105"
                  />
                  
                  {/* Floating elements for visual interest */}
                  <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20 animate-bounce">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20 animate-bounce" style={{ animationDelay: '0.5s' }}>
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Section */}
      <div className="relative py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <Countdown />
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="relative py-20 bg-gradient-to-b from-transparent to-white/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Our Promise
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 min-h-[48px] md:min-h-[56px]">
              <TypingEffect 
                text="Why Choose "
                speed={120}
                delay={1000}
              />
              <TypingEffect 
                text="Cudliy"
                speed={150}
                delay={2500}
                className="bg-gradient-primary bg-clip-text text-transparent"
              />
              <TypingEffect 
                text="?"
                speed={200}
                delay={3500}
              />
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed min-h-[50px]">
              <TypingEffect 
                text="Revolutionizing creativity with cutting-edge 3D printing technology and unmatched attention to detail"
                speed={60}
                delay={4000}
              />
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group text-center space-y-6 p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">Made with Love</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every creation is crafted with attention to detail and care that shows in the final product. Our artisans pour their heart into each piece.
                </p>
              </div>
            </div>

            <div className="group text-center space-y-6 p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">Fully Customizable</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose colors, sizes, accessories, and even add personal messages to make it truly unique. Your imagination is the only limit.
                </p>
              </div>
            </div>

            <div className="group text-center space-y-6 p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border border-white/50">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">Premium Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Using high-grade materials and precision 3D printing for durability and safety. Built to last and safe for all ages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-t from-white to-transparent border-t border-white/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cudliy
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                Bringing imagination to life, one creation at a time. Where creativity meets precision in the world of 3D printing.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span>Made with love</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Safe & secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Premium quality</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/20">
              <p className="text-xs text-muted-foreground">
                © 2025 Cudliy. All rights reserved. | Crafted with precision and passion.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;