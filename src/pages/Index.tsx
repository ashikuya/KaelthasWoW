import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/HeroSection";
import ServerStats from "@/components/features/ServerStats";
import FeaturesSection from "@/components/features/FeaturesSection";
import RatesSection from "@/components/features/RatesSection";
import HowToPlay from "@/components/features/HowToPlay";
import CommunitySection from "@/components/features/CommunitySection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,4%)" }}>
      <Navbar />
      <HeroSection />
      <ServerStats />
      <FeaturesSection />
      <RatesSection />
      <HowToPlay />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
