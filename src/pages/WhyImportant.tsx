import React from 'react';
import Header from '@/components/Header';

const WhyImportant = () => {
  const points = [
    {
      title: "Lack of Published Platforms",
      description: "In the 2025 Canadian Federal Election, none of the major parties have published comprehensive platforms, making it difficult for voters to make informed decisions."
    },
    {
      title: "Real-time Promise Tracking",
      description: "We're taking the candidates at their word by tracking their promises and commitments as they make them, creating a real-time platform for voters."
    },
    {
      title: "Informed Democratic Process",
      description: "Build Canada believes in a prosperous future for Canada and that starts with voters having access to all available information about candidate positions."
    },
    {
      title: "Accountability & Transparency",
      description: "By documenting commitments as they're made, we're creating a record that can later be used to hold elected officials accountable to their promises."
    }
  ];

  return (
    <div className="min-h-screen bg-beige text-gray-800 pb-20">
      <Header />
      <div className="container mx-auto px-4 pt-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-title tracking-wide mb-6 text-center">
            Why This Is Important
          </h1>
          <p className="text-gray-600 text-lg text-center mb-8">
            Democracy works best when voters are well-informed about their choices.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              In the 2025 Canadian Federal Election, voters face a challenge: none of the major parties have published comprehensive platforms. This makes it difficult to understand what each candidate stands for and what they plan to do if elected.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Build Canada believes in building a prosperous future for all Canadians, and that begins with an informed electorate. That's why we've created this tool - to ensure voters have access to all available information.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              We're taking the candidates at their word! By tracking every promise and commitment made during speeches, interviews, and public appearances, we're building a real-time platform for YOU, the voter, to make informed decisions at the ballot box.
            </p>
          </div>

          <div className="space-y-8">
            {points.map((point, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
                <h2 className="text-xl font-oswald tracking-wide mb-3 text-gray-800">
                  {point.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {point.description}
                </p>
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

export default WhyImportant; 