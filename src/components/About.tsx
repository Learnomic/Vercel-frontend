import video1 from "../assets/Video1.mp4";
import video2 from "../assets/Video2.mp4";
import img1 from "../assets/thumb.jpg"

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Our Educational Platform</h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to Learnomic, where we believe that education should be accessible, engaging, and transformative. 
          Our mission is to provide high-quality educational content that empowers learners of all ages to reach their full potential.
        </p>
        
        {/* Modified to create square boxes instead of full height */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* First row, first column: Video */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative" style={{ paddingBottom: "100%" }}>
              <video 
                className="absolute inset-0 w-full h-full object-cover"
                controls
                controlsList="nodownload nofullscreen"
                poster={img1}
              >
                <source src={video1} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          {/* First row, second column: Text */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 flex items-center justify-center aspect-square">
            <div>
              <h3 className="text-xl font-semibold mb-2">Our Learning Methodology</h3>
              <p className="text-gray-600 mb-4">
                Discover how our research-backed approach to education combines cognitive science, 
                active learning principles, and personalized feedback systems to create an effective 
                learning experience for students of all backgrounds.
              </p>
              <p className="text-gray-600">
                Our adaptive learning technology identifies your strengths and areas for improvement, 
                customizing content delivery to match your pace and learning style. This approach has led to 
                a 43% improvement in concept retention compared to traditional learning methods.
              </p>
            </div>
          </div>
          
          {/* Second row, first column: Text */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 flex items-center justify-center aspect-square">
            <div>
              <h3 className="text-xl font-semibold mb-2">Meet Our Educators</h3>
              <p className="text-gray-600 mb-4">
                Our team consists of passionate educators, industry experts, and instructional 
                designers who collaborate to create learning experiences that bridge theory and practice,
                preparing you for real-world challenges.
              </p>
              <p className="text-gray-600">
                With an average of 12+ years of experience in their respective fields, our educators 
                bring diverse perspectives from academia and industry. They undergo rigorous training in 
                our teaching methodology to ensure content quality and engaging delivery that inspires learners.
              </p>
            </div>
          </div>
          
          {/* Second row, second column: Video */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative" style={{ paddingBottom: "100%" }}>
              <video 
                className="absolute inset-0 w-full h-full object-cover"
                controls
                controlsList="nodownload nofullscreen"
                poster={img1}
              >
                <source src={video2} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Educational Philosophy</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Learn by Doing</h3>
            <p className="text-gray-700 mb-3">
              We believe that practical application is essential for deep understanding. 
              Our courses incorporate hands-on projects, simulations, and real-world case studies.
            </p>
            <p className="text-gray-700">
              Studies show that active learning increases knowledge retention by up to 75%. That's why every 
              module in our curriculum includes interactive elements and practical exercises that reinforce 
              theoretical concepts through immediate application.
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <h3 className="text-xl font-semibold text-green-800 mb-3">Community-Centered</h3>
            <p className="text-gray-700 mb-3">
              Learning happens best in community. Our platform fosters collaboration through
              discussion forums, peer reviews, and group projects that enhance the learning experience.
            </p>
            <p className="text-gray-700">
              Our vibrant learning communities connect students across geographical boundaries, creating 
              networks that often extend beyond coursework. Many of our students form study groups, 
              mentorship relationships, and even professional collaborations that last for years.
            </p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-800 mb-3">Lifelong Growth</h3>
            <p className="text-gray-700 mb-3">
              Education is a journey, not a destination. We support continuous learning with
              regularly updated content, advanced courses, and career development resources.
            </p>
            <p className="text-gray-700">
              Our alumni receive lifetime access to course updates and a 25% discount on additional courses. 
              We also host monthly webinars with industry leaders and provide personalized learning path 
              recommendations based on your career goals and previous learning experiences.
            </p>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Impact</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-lg text-gray-700 mb-6">
              Since our founding in 2018, we've helped over 500,000 learners worldwide achieve their 
              educational and career goals. Our courses have been adopted by universities, corporations, 
              and independent learners across six continents.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We're committed to making education accessible to underserved communities through 
              scholarships, partnerships with non-profit organizations, and specialized programs 
              for regions with limited educational resources.
            </p>
            <p className="text-lg text-gray-700">
              Our impact extends beyond individual learners. Through our corporate partnerships, we've helped 
              organizations upskill their workforce, resulting in measurable productivity improvements and 
              employee retention rates 32% higher than industry averages. Our university collaborations have 
              enabled innovative blended learning models that expand educational access.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <span className="text-4xl font-bold text-blue-600 block mb-2">500K+</span>
              <span className="text-gray-600">Active Learners</span>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <span className="text-4xl font-bold text-green-600 block mb-2">120+</span>
              <span className="text-gray-600">Countries Reached</span>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <span className="text-4xl font-bold text-purple-600 block mb-2">200+</span>
              <span className="text-gray-600">Expert Instructors</span>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <span className="text-4xl font-bold text-orange-600 block mb-2">92%</span>
              <span className="text-gray-600">Completion Rate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;