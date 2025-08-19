import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type RoleOption = {
  value: string;
  title: string;
  description: string;
};

const groups: { title: string; blurb: string; options: RoleOption[] }[] = [
  {
    title: "Casual Users",
    blurb: "Explore pre-made models or make light tweaks for a touch of personalization.",
    options: [
      {
        value: "casual_browser",
        title: "Browser",
        description:
          "These are folks who mainly want to explore pre-made models with little or no customization.",
      },
      {
        value: "casual_customizer",
        title: "Light Customizer",
        description:
          "Users interested in tweaking existing designs in small ways, enjoying a bit of personalization.",
      },
    ],
  },
  {
    title: "Dedicated Designers",
    blurb: "Create your own models, for fun or to build a business.",
    options: [
      {
        value: "designer_hobbyist",
        title: "Hobbyist Designer",
        description:
          "Those who love designing toys just for personal fun and creativity.",
      },
      {
        value: "designer_entrepreneur",
        title: "Entrepreneurial Designer",
        description:
          "Creators interested in selling their designs or collaborating with others on the platform.",
      },
    ],
  },
  {
    title: "3D Printer Partners",
    blurb: "Use your printers to bring ideas to life and fulfill demand.",
    options: [
      {
        value: "printer_individual",
        title: "Individual Printer",
        description:
          "People with one or two printers who want to do small-scale printing as a side gig.",
      },
      {
        value: "printer_small_business",
        title: "Small Business Partner",
        description:
          "Those with a larger printing setup who might want a more formal or ongoing partnership.",
      },
    ],
  },
];

const Onboarding = () => {
  const [segment, setSegment] = useState<string>("");
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  const save = async () => {
    if (!user) return;
    if (!segment) {
      toast({ title: "Choose one", description: "Please select a role to continue.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("profiles").update({ segment }).eq("id", user.id);
    if (error) {
      toast({ title: "Could not save", description: error.message, variant: "destructive" });
      return;
    }
    await refreshProfile();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-xs tracking-wide">
            Step 1 of 1
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold">Are you a…</h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-3xl">
            Choose the role that best describes how you’ll use Cudliy. This helps us tailor your experience.
          </p>
        </div>

        <RadioGroup value={segment} onValueChange={setSegment}>
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-2xl font-semibold">{group.title}</h2>
                <p className="text-base text-muted-foreground mb-4">{group.blurb}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {group.options.map((opt) => {
                    const selected = segment === opt.value;
                    return (
                      <Card
                        key={opt.value}
                        className={`cursor-pointer bg-card border transition-all hover:border-primary/60 ${
                          selected ? "border-primary shadow-glow scale-[1.01]" : "border-border"
                        }`}
                        onClick={() => setSegment(opt.value)}
                      >
                        <CardHeader className="flex-row items-start gap-4">
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <div>
                            <CardTitle className="text-xl md:text-2xl">{opt.title}</CardTitle>
                            <CardDescription className="mt-1 text-base leading-relaxed text-foreground/80">
                              {opt.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="mt-10 flex items-center gap-4">
          <Button onClick={save} disabled={!segment} className="px-6">
            Continue
          </Button>
          {!segment && (
            <span className="text-sm text-muted-foreground">Select an option above to continue</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;


