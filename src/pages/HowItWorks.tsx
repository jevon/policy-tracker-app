import React from 'react';
import Header from '@/components/Header';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Real-time Video Sourcing",
      description: "We continuously monitor and source videos from YouTube and other platforms where candidates make public statements and announcements."
    },
    {
      number: "02",
      title: "Accurate Transcription",
      description: "Each video is carefully transcribed to capture the candidate's exact words, ensuring we only use their direct statements and commitments."
    },
    {
      number: "03",
      title: "Promise Analysis",
      description: "Our system analyzes speeches and comments to identify specific promises and commitments made by the candidates."
    },
    {
      number: "04",
      title: "Categorization & Summarization",
      description: "Each promise is categorized and summarized to provide clear, concise information about what was committed."
    },
    {
      number: "05",
      title: "Real-time Platform Development",
      description: "As new promises are identified, they are immediately published to this site, allowing you to track each party's platform as it develops."
    }
  ];

  return (
    <div className="min-h-screen bg-beige text-gray-800 pb-20">
      <Header />
      <div className="container mx-auto px-4 pt-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas tracking-wide mb-6 text-center">
            How Policy Explorer Works
          </h1>
          <p className="text-gray-600 text-lg text-center mb-16 font-montserrat">
            We track and analyze political promises in real-time, ensuring accuracy and transparency in the election process.
          </p>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="text-carney text-4xl font-bebas tracking-wider md:w-32 flex-shrink-0">
                    {step.number}
                  </div>
                  <div>
                    <h2 className="text-2xl font-oswald tracking-wide mb-4 text-gray-800">
                      {step.title}
                    </h2>
                    <p className="text-gray-600 font-montserrat leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-4 md:left-16 top-24 bottom-0 w-px bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 