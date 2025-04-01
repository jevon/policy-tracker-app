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
          <h1 className="text-4xl md:text-5xl font-title tracking-wide mb-6 text-center">
            How Policy Explorer Works
          </h1>
          <p className="text-gray-600 text-lg text-center mb-8">
            We track and analyze political promises in real-time, ensuring accuracy and transparency in the election process.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Policy Explorer is a non-partisan tool designed to help voters easily access and compare campaign promises made by candidates during the 2025 Canadian Federal Election.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              Our approach is based on transparency and accuracy. We carefully source, document, and organize statements directly from candidates to create a comprehensive picture of their proposed platforms.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="text-rose font-title text-2xl">
                    {step.number}
                  </div>
                  <div>
                    <h2 className="text-xl font-oswald tracking-wide mb-3 text-gray-800">
                      {step.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="/" 
              className="inline-flex items-center text-rose hover:text-carney transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Policy Explorer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 