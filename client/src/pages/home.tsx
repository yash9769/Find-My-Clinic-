import Hero from "@/components/sections/hero";
import ProblemSolution from "@/components/sections/problem-solution";
import HowItWorks from "@/components/sections/how-it-works";
import FindMyClinic from "@/components/sections/clinic-finder";
import Features from "@/components/sections/features";
import ForClinics from "@/components/sections/for-clinics";
import Technology from "@/components/sections/technology";
import Team from "@/components/sections/team";
import CTA from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <FindMyClinic />
      <Features />
      <ForClinics />
      <Technology />
      <Team />
      <CTA />
    </>
  );
}
