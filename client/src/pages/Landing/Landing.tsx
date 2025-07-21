import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Menu, X, Github, Twitter, Linkedin } from "lucide-react";
import logo from "../../Asset/mentor+logo.png";
import heroImg from "../../Asset/illustration-1.svg";
import { ROUTES } from "../../Constants/message";
import { features } from "../../Constants/constValues";

const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-grey-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img className="w-100 h-24 cover" src={logo} alt="MentorPlus" />
            </div>

            <div className="hidden md:flex gap-4">
              <Link
                to={ROUTES?.MENTOR_APPLY}
                className="px-4 py-2   bg-white text-[#ff9900] rounded-lg hover:bg-[#ff8800] hover:text-white transition-colors font-normal items-center justify-center flex border"
              >
                Become a Tech Mentor
              </Link>
              <Link
                to={ROUTES?.MENTEE_SINGUP}
                className="px-4 py-2 border border-gray-200 text-black hover:bg-gray-800 hover:text-white rounded-lg transition-colors font-normal flex items-center justify-center group"
              >
                Sign Up
              </Link>
              <Link
                to={ROUTES?.MENTEE_LOGIN}
                className="px-4 py-2 bg-black text-white rounded-lg transition-colors font-normal items-center justify-center flex  hover:bg-gray-50 hover:text-gray-950 border "
              >
                Login
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-transparent pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-14 lg:pt-30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-medium text-black">
                Empower Your Tech Career with{" "}
                <span className="text-[#ff8800]">Expert Mentorship</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg tracking-tight text-grey-600">
                Learn from top software engineers, AI experts, data scientists,
                and tech leaders to navigate your career path.
              </p>
              <div className="mt-8 sm:mt-10">
                <Link
                  to={ROUTES?.MENTEE_SINGUP}
                  className="group inline-flex items-center justify-center rounded-lg py-2 px-4 text-sm font-semibold focus:outline-none bg-[#ff8800] text-white hover:bg-gray-100 hover:text-[#ff8800] border border-gray-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div>
              <img  loading="lazy"
                src={heroImg}
                alt="Tech mentoring"
                className="w-full lg:w-[120%] h-auto max-w-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold text-[#ff8800]">
              Tech Focused
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-black">
              Unlock Your Potential with Specialized Mentorship
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features?.map((feature) => (
              <div
                key={feature?.name}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <feature.icon className="h-6 w-6 text-[#ff8800]" />
                  <h3 className="text-lg font-semibold">{feature?.name}</h3>
                </div>
                <p className="mt-4 text-gray-600">{feature?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#ff8800] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight">
            Reach your goals with expert mentors
          </h2>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers
            through mentorship
          </p>
          <Link
            to={ROUTES?.MENTEE_SINGUP}
            className="mt-8 inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium text-lg"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-8 py-8 sm:py-12">
          <div className="mb-2 sm:mb-12">
            <img className="w-100 h-10 bg-white" src={logo} alt="Mentor Plus" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Platform Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#ff8800]">Platform</h3>
              <ul className="space-y-3 text-sm sm:text-base">
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#ff8800]">
                Resources
              </h3>
              <ul className="space-y-3 text-sm sm:text-base">
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#ff8800]">Company</h3>
              <ul className="space-y-3 text-sm sm:text-base">
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#ff8800] transition-colors"
                    href="#"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#ff8800]">Connect</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-grey-300 hover:text-[#ff8800] transition-colors"
                >
                  <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a
                  href="#"
                  className="text-grey-300 hover:text-[#ff8800] transition-colors"
                >
                  <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
                <a
                  href="#"
                  className="text-grey-300 hover:text-[#ff8800] transition-colors"
                >
                  <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 pt-8 border-t border-grey-800">
            <p className="text-center text-xs sm:text-sm text-grey-400">
              &copy; {new Date().getFullYear()} Mentor+. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
