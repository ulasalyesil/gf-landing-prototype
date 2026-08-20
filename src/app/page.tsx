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
          site chrome like the header, not page content. The on-screen placement
          switch that used to sit beside it is gone (owner, 2026-08-20: "remove
          this tag for good"); the drawer is the default arrangement and the
          header variant is now reachable only via ?pnib=header. */}
      <ParanaiyibakDrawer />
    </>
  );
}
