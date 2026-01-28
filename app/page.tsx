"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ManifestationFormProvider, useManifestationForm } from "@/hooks/use-manifestation-form";
import { HomeScreen } from "@/components/steps/home-screen";
import { IdentificationStep } from "@/components/steps/identification-step";
import { SubjectStep } from "@/components/steps/subject-step";
import { ChannelStep } from "@/components/steps/channel-step";
import { ContentStep } from "@/components/steps/content-step";
import { ReviewStep } from "@/components/steps/review-step";
import { ConfirmationStep } from "@/components/steps/confirmation-step";

function FormContent() {
  const { currentStep } = useManifestationForm();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <HomeScreen />;
      case 1:
        return <IdentificationStep />;
      case 2:
        return <SubjectStep />;
      case 3:
        return <ChannelStep />;
      case 4:
        return <ContentStep />;
      case 5:
        return <ReviewStep />;
      case 6:
        return <ConfirmationStep />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <main id="main-content" className="flex-1 py-8" tabIndex={-1}>
      {renderStep()}
    </main>
  );
}

export default function Home() {
  return (
    <ManifestationFormProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <FormContent />
        <Footer />
      </div>
    </ManifestationFormProvider>
  );
}
