import React, { useState } from 'react';
import {useNavigate,Link} from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Menu, X, Users, Target, Calendar, Video, MessageSquare, Award, Github, Twitter, Linkedin } from 'lucide-react';
import logo from '../../Asset/mentor+logo.png';
import heroImg from '../../Asset/illustration-1.svg';
import landimg from '../../Asset/unsplash.jpg';


const Landing: React.FC = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      name: 'Expert Mentors',
      description: 'Connect with professionals who can guide you through your career journey.',
      icon: Users,
    },
    {
      name: 'Personalized Matching',
      description: 'Find mentors who align with your professional goals and experience.',
      icon: Target,
    },
    {
      name: 'Flexible Scheduling',
      description: 'Book sessions at your convenience to fit your busy professional life.',
      icon: Calendar,
    },
    {
      name: 'Virtual Sessions',
      description: 'Access mentorship from anywhere in the world, wherever you are.',
      icon: Video,
    },
    {
      name: 'Direct Communication',
      description: 'Maintain ongoing communication with your mentor through our platform.',
      icon: MessageSquare,
    },
    {
      name: 'Skill Development',
      description: 'Track your growth and continuously improve through actionable feedback.',
      icon: Award,
    },
  ];

  return (
    <div>
      <header className='fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-grey-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <img className='w-100 h-24 cover' src={logo} alt='MentorPlus' />
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex gap-4'>
              <Link to='/auth/apply_as_mentor' className='px-4 py-2 bg-[#ff8800] text-white rounded-lg hover:bg-[#ff9900] transition-colors font-bold'>
                Become a Mentor
              </Link>
              <Link to='/auth/signup' className='px-4 py-2 border-2 border-black text-black hover:bg-grey-50 rounded-lg transition-colors font-bold hover:bg-slate-200'>
                Sign Up
              </Link>
              <Link to='/auth/login/mentee' className='px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors font-bold'>
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className='md:hidden p-2 rounded-lg hover:bg-gray-100' onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className='md:hidden py-4 space-y-3'>
              <button

                onClick={()=>navigate('/auth/apply_as_mentor')}
                className='w-full px-4 py-2 bg-[#ff8800] text-white rounded-lg hover:bg-[#ff9900] transition-colors font-medium text-sm'
              >
                Become a Mentor
              </button>
              <button
                onClick={()=>navigate('/auth/signup')}
                className='w-full px-4 py-2 border-2 border-black text-black hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm'
              >
                Sign Up
              </button>
              <button
                onClick={()=>navigate('/auth/login/mentee')}
                className='w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm'
              >
                Login
              </button>
            </div>

          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative bg-transparent pt-32'>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-14 lg:pt-30'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
            <div className='order-2 lg:order-1'>
              <img src={heroImg} alt='Mentoring illustration' className='w-full lg:w-[120%] h-auto max-w-none lg:transform lg:scale-125' />
            </div>
            <div className='order-2 lg:order-2'>
              <div className='border-2 p-4 rounded-xl sm:p-8 bg-white shadow-lg'>
                <h1 className='font-display text-4xl sm:text-5xl font-medium -tracking-tight text-black'>
                  Accelerate Your Career with{' '}
                  <span className='relative whitespace-nowrap text-[#ff8800]'>
                    <span className='relative'>Expert Mentorship</span>
                  </span>
                </h1>
                <p className='mt-6 text-base sm:text-lg tracking-tight text-grey-600'>
                  Connect with industry experts who can guide you through your professional journey and help you achieve your career goals.
                </p>
                <div className='mt-8 sm:mt-10 flex justify-start sm:justify-end gap-x-6'>
                  <Link
                    to='/auth/signup'
                    className='group inline-flex items-center justify-center rounded-lg py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-[#ff8800] text-white hover:bg-[#ff9900] active:bg-[#ff7700] focus-visible:outline-[#ff8800]'
                  >
                    Get Started
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='bg-white py-16 sm:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-base font-semibold leading-7 text-[#ff8800]'>Everything you need</h2>
            <p className='mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-black lg:text-4xl'>
              Powerful Features for Career Growth
            </p>
            <p className='mt-6 text-base sm:text-lg leading-8 text-grey-600'>
              Our platform provides all tools you need to connect with mentors and accelerate your career growth.
            </p>
          </div>

          <div className='mx-auto mt-12 sm:mt-16 max-w-7xl lg:mt-24'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {features.map((feature) => (
                <div key={feature.name} className='relative bg-white p-6 sm:p-8 rounded-2xl shadow-sm ring-1 ring-grey-200 hover:shadow-md transition-shadow'>
                  <div className='flex items-center gap-x-3'>
                    <feature.icon className='h-6 w-6 text-[#ff8800]' />
                    <h3 className='text-base sm:text-lg font-semibold leading-7 text-black'>{feature.name}</h3>
                  </div>
                  <p className='mt-4 text-sm sm:text-base leading-7 text-grey-600'>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='mt-16 sm:mt-24 relative h-64 sm:h-96 overflow-hidden'>
          <img src={landimg} alt='Landing image' className='mt-16 w-full h-full object-cover' />
        </div>
      </section>

      {/* Call to Action */}
      <section className='bg-[#ff8800] py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-4xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight'>
            Reach your goals with expert mentors
          </h2>
          <p className='mt-6 text-xl text-white/90 max-w-2xl mx-auto'>
            Join thousands of professionals who have accelerated their careers through mentorship
          </p>
          <Link
            to='/auth/signup'
            className='mt-8 inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium text-lg'
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-black text-white'>
        <div className='mx-auto max-w-7xl px-4 sm:px-8 lg:px-8 py-8 sm:py-12'>
          <div className='mb-2 sm:mb-12'>

            <img className='w-100 h-10 bg-white' src={logo} alt='Mentor Plus' />
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8'>
            {/* Platform Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-[#ff8800]'>Platform</h3>
              <ul className='space-y-3 text-sm sm:text-base'>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    How it Works
                  </a>
                </li>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    Features
                  </a>
                </li>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-[#ff8800]'>Resources</h3>
              <ul className='space-y-3 text-sm sm:text-base'>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    Blog
                  </a>
                </li>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    Success Stories
                  </a>
                </li>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-[#ff8800]'>Company</h3>
              <ul className='space-y-3 text-sm sm:text-base'>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    About Us
                  </a>
                </li>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    Careers
                  </a>
                </li>
                <li>
                  <a className='hover:text-[#ff8800] transition-colors' href='#'>
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-[#ff8800]'>Connect</h3>
              <div className='flex space-x-4'>
                <a href='#' className='text-grey-300 hover:text-[#ff8800] transition-colors'>
                  <Github className='h-5 w-5 sm:h-6 sm:w-6' />
                </a>
                <a href='#' className='text-grey-300 hover:text-[#ff8800] transition-colors'>
                  <Twitter className='h-5 w-5 sm:h-6 sm:w-6' />
                </a>
                <a href='#' className='text-grey-300 hover:text-[#ff8800] transition-colors'>
                  <Linkedin className='h-5 w-5 sm:h-6 sm:w-6' />
                </a>
              </div>
            </div>
          </div>
          <div className='mt-8 sm:mt-12 pt-8 border-t border-grey-800'>
            <p className='text-center text-xs sm:text-sm text-grey-400'>
              &copy; {new Date().getFullYear()} Mentor+. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
