import React from 'react';

const interests = [
  {
    title: 'AI & Machine Learning',
    description: 'Building real-world AI models with Scikit-learn, working on classification, regression, and computer vision as part of the Microsoft x AICTE program.',
    icon: '🤖'
  },
  {
    title: 'Full-Stack Development',
    description: 'Creating modern web applications using React, Node.js, Firebase, and MySQL—like TradeMyTicket for ticket reselling.',
    icon: '💻'
  },
  {
    title: 'Tech Leadership',
    description: 'Leading teams and events like E-Summit’25 and Startup Fair’24 to promote entrepreneurship and innovation on campus.',
    icon: '🧭'
  },
  {
    title: 'Problem Solving & DSA',
    description: 'Passionate about clean, scalable code and solving real-world problems with strong fundamentals in C++ and Python.',
    icon: '🧠'
  },
  {
    title: 'Cloud & DevOps',
    description: 'Deploying scalable apps with Firebase and learning Azure through real project experience and mentorship.',
    icon: '☁️'
  },
  {
    title: 'Community & Learning',
    description: 'Actively involved in PEC’s EIC, contributing to a culture of learning and innovation through collaboration and mentorship.',
    icon: '🌱'
  }
];


function Services() {
  return (
    <section id="interests" className="py-20 bg-[#0a192f] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-[#00B0FF] mb-4">
          My Interests
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Here are some of the fields I'm deeply passionate about — driving innovation, creativity, and continuous learning.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {interests.map((interest, idx) => (
            <div
              key={idx}
              className="bg-[#112240] hover:bg-[#1c3b5a] transition duration-300 ease-in-out rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{interest.icon}</div>
              <h3 className="text-2xl font-semibold text-[#00B0FF] mb-2">{interest.title}</h3>
              <p className="text-gray-300 text-sm">{interest.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
