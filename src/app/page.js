import Banner from "@/components/Banner";
import FAQ from "@/components/FaQ";
import FeaturedEbooks from "@/components/Featuredebooks";
import GenreShowcase from "@/components/GenreShowcase";
import TopWriters from "@/components/TopWriters";
import WhyChooseUs from "@/components/whyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <Banner></Banner>
    <FeaturedEbooks></FeaturedEbooks>
    <TopWriters></TopWriters>
    <GenreShowcase></GenreShowcase>
    <WhyChooseUs></WhyChooseUs>
    <FAQ></FAQ>
   </div>
  );
}
