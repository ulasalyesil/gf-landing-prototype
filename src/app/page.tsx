import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Rates from "@/components/Rates";
import Features from "@/components/Features";
import CampaignsCarousel from "@/components/CampaignsCarousel";
import Loan from "@/components/Loan";
import Faiz from "@/components/Faiz";
import Calculator from "@/components/Calculator";
import DebitCard from "@/components/DebitCard";
import Transfer from "@/components/Transfer";
import AppFeatures from "@/components/AppFeatures";
import AiAssistant from "@/components/AiAssistant";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ParanaiyibakDrawer from "@/components/ParanaiyibakDrawer";
import ParanaiyibakFlag from "@/components/ParanaiyibakFlag";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Rates />
        <Features />
        <CampaignsCarousel />
        
        {/* Loan, Faiz and Calculator sections mapped inside background groupings */}
        <div className="bg-lilac-wrap">
          <Loan />
        </div>
        
        <Faiz />
        <Calculator />
        <DebitCard />
        <Transfer />
        <AppFeatures />
        <AiAssistant />
        <Newsletter />
      </main>
      <Footer />
      {/* Compact-only (≤920) persistent #paranaiyibak bar. Outside <main> — it's
          site chrome like the header, not page content. The flag next to it is
          temporary review scaffolding; both go when a placement is chosen. */}
      <ParanaiyibakDrawer />
      <ParanaiyibakFlag />
    </>
  );
}
