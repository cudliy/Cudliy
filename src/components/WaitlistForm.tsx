import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const WaitlistForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email) {
      toast({
        title: "All fields required",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: email
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already on the list!",
            description: "This email is already registered for our waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to the waitlist! 🎉",
          description: "We'll notify you when we're ready to bring your ideas to life.",
        });
        setFirstName("");
        setLastName("");
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          {/* Form Header */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Join the Waitlist</h3>
            <p className="text-sm text-gray-600">Be the first to know when we launch!</p>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10 h-11 text-sm border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200 bg-white/50"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10 h-11 text-sm border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200 bg-white/50"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-primary transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 text-sm border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200 bg-white/50"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-12 text-sm font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining waitlist...
              </>
            ) : (
              <>
                Join Waitlist
                <span className="ml-1">🚀</span>
              </>
            )}
          </Button>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </div>
  );
};