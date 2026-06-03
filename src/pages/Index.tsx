import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/HeroSection";
import ServerStats from "@/components/features/ServerStats";
import NewsSection from "@/components/features/NewsSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import RatesSection from "@/components/features/RatesSection";
import GallerySection from "@/components/features/GallerySection";
import VoteLeaderboard from "@/components/features/VoteLeaderboard";
import HowToPlay from "@/components/features/HowToPlay";
import CommunitySection from "@/components/features/CommunitySection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: "hsl(222,47%,4%)" }}>
      <Navbar />
      <HeroSection />
      <ServerStats />
      <NewsSection />
      <FeaturesSection />
      <RatesSection />
      <GallerySection />
      <VoteLeaderboard />
      <HowToPlay />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
