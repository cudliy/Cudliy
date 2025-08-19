import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Loader2, 
  Eye, 
  Palette,
  Sparkles,
  Store,
  Printer,
  Building2,
  CheckCircle,
  Users,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UserPath = 'creator' | 'maker';
type UserRole = 
  | 'browser' 
  | 'light_customizer' 
  | 'hobbyist_designer' 
  | 'entrepreneurial_designer' 
  | 'individual_printer' 
  | 'small_business_partner';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: UserPath;
}

const roleOptions: RoleOption[] = [
  {
    id: 'browser',
    title: 'Browser',
    description: 'Explore pre-made models',
    icon: <Eye className="h-4 w-4" />,
    path: 'creator'
  },
  {
    id: 'light_customizer',
    title: 'Light Customizer',
    description: 'Tweak existing designs',
    icon: <Palette className="h-4 w-4" />,
    path: 'creator'
  },
  {
    id: 'hobbyist_designer',
    title: 'Hobbyist Designer',
    description: 'Design for personal fun',
    icon: <Sparkles className="h-4 w-4" />,
    path: 'creator'
  },
  {
    id: 'entrepreneurial_designer',
    title: 'Entrepreneurial Designer',
    description: 'Sell designs or collaborate',
    icon: <Store className="h-4 w-4" />,
    path: 'creator'
  },
  {
    id: 'individual_printer',
    title: 'Individual Printer',
    description: 'Small-scale printing (1-2 printers)',
    icon: <Printer className="h-4 w-4" />,
    path: 'maker'
  },
  {
    id: 'small_business_partner',
    title: 'Small Business Partner',
    description: 'Larger printing setup',
    icon: <Building2 className="h-4 w-4" />,
    path: 'maker'
  }
];

export const RoleBasedWaitlistForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    path: "" as UserPath | "",
    role: "" as UserRole | "",
    businessName: "",
    website: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState<UserPath | "">("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePathSelect = (path: UserPath) => {
    setSelectedPath(path);
    setSelectedRole(""); // Reset role when path changes
    setFormData(prev => ({ ...prev, path, role: "" }));
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
  };

  const getPathRoles = (path: UserPath) => {
    return roleOptions.filter(role => role.path === path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.path || !formData.role) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields and select a path and role",
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
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            path: formData.path,
            role: formData.role,
            business_name: formData.businessName,
            website: formData.website
          }
        ]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already registered!",
            description: "This email is already on our waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to Cudliy! 🎉",
          description: "You've been added to our waitlist. We'll notify you when we launch!",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          path: "",
          role: "",
          businessName: "",
          website: ""
        });
        setSelectedPath("");
        setSelectedRole("");
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prominent Path Switcher */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-2 border-2 border-[#e80b56] shadow-2xl shadow-pink-200">
          <button
            type="button"
            onClick={() => handlePathSelect('creator')}
            className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              selectedPath === 'creator'
                ? 'bg-[#e80b56] text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-[#e80b56] hover:bg-pink-50 border border-transparent hover:border-pink-200'
            }`}
          >
            <Users className="inline h-5 w-5 mr-2" />
            Creators
          </button>
          <button
            type="button"
            onClick={() => handlePathSelect('maker')}
            className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              selectedPath === 'maker'
                ? 'bg-[#e80b56] text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-[#e80b56] hover:bg-pink-50 border border-transparent hover:border-pink-200'
            }`}
          >
            <Settings className="inline h-5 w-5 mr-2" />
            Makers
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Role Selection */}
        <div className="space-y-3 mb-4">
          {selectedPath && (
            <>
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-gray-800">
                  Select Your Role as a {selectedPath === 'creator' ? 'Creator' : 'Maker'}
                </h4>
              </div>

              <div className="grid gap-2">
                {getPathRoles(selectedPath).map((role) => (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedRole === role.id
                        ? 'border-[#e80b56] bg-pink-50'
                        : 'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-25'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-lg ${
                        selectedRole === role.id
                          ? 'bg-[#e80b56] text-white'
                          : 'bg-pink-100 text-[#e80b56]'
                      }`}>
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 text-xs">{role.title}</h5>
                        <p className="text-xs text-gray-600">{role.description}</p>
                      </div>
                      {selectedRole === role.id && (
                        <CheckCircle className="h-4 w-4 text-[#e80b56] flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Personal Information */}
        <div className="space-y-3">
          <div className="text-center space-y-1">
            <h4 className="text-base font-bold text-gray-800">Personal Information</h4>
          </div>

          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">
                  First Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="pl-8 h-8 bg-white border-pink-200 text-gray-800 placeholder:text-gray-400 focus:border-[#e80b56] focus:ring-pink-100 rounded-lg text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">
                  Last Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="pl-8 h-8 bg-white border-pink-200 text-gray-800 placeholder:text-gray-400 focus:border-[#e80b56] focus:ring-pink-100 rounded-lg text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-8 h-8 bg-white border-pink-200 text-gray-800 placeholder:text-gray-400 focus:border-[#e80b56] focus:ring-pink-100 rounded-lg text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Maker-specific business fields */}
            {selectedPath === 'maker' && (
              <div className="grid md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="businessName" className="text-xs font-medium text-gray-700">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Business name (optional)"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="h-8 bg-white border-pink-200 text-gray-800 placeholder:text-gray-400 focus:border-[#e80b56] focus:ring-pink-100 rounded-lg text-sm"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="website" className="text-xs font-medium text-gray-700">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="Website (optional)"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="h-8 bg-white border-pink-200 text-gray-800 placeholder:text-gray-400 focus:border-[#e80b56] focus:ring-pink-100 rounded-lg text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center space-y-2 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || !selectedPath || !selectedRole} 
              className="w-full px-6 py-2 text-sm font-semibold bg-gradient-to-r from-[#e80b56] to-[#e80b56]/90 hover:from-[#e80b56]/90 hover:to-[#e80b56] rounded-lg shadow-2xl shadow-pink-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Joining Waitlist...
                </>
              ) : (
                <>
                  Join the Revolution
                  <Sparkles className="ml-2 h-3 w-3" />
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 leading-relaxed">
              By joining our waitlist, you'll be among the first to experience the future of 3D printing. 
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
