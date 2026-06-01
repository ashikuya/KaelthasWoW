import Navbar from "@/components/layout/Navbar";
import HeroSlider from "@/components/features/HeroSlider";
import ServerStats from "@/components/features/ServerStats";
import NewsSection from "@/components/features/NewsSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import RatesSection from "@/components/features/RatesSection";
import HowToPlay from "@/components/features/HowToPlay";
import RegisterBanner from "@/components/features/RegisterBanner";
import CommunitySection from "@/components/features/CommunitySection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,4%)" }}>
      <Navbar />
      <HeroSlider />
      <ServerStats />
      <NewsSection />
      <FeaturesSection />
      <RatesSection />
      <HowToPlay />
      <RegisterBanner />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
