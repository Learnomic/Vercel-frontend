import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to Learnomic
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Your platform for continuous learning and growth
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Feature {item}</h3>
              <p className="mt-2 text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h2>
        <p className="text-gray-600 mb-4">
          Join thousands of learners who have already taken the first step towards their goals.
        </p>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign up now
        </button>
      </section>
    </div>
  );
};

export default Home; 