'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Head from 'next/head';
import Image from "next/image";
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const sectionRefs = useRef([]);
  const [visible, setVisible] = useState(false);
  const { login, authenticated, user, logout } = usePrivy();

  useEffect(() => {
    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Show features section after a short delay
    setTimeout(() => {
      setVisible(true);
    }, 500);

    // Set up intersection observers for each section
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        } else {
          entry.target.classList.remove('section-visible');
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach(section => {
      if (section) {
        sectionObserver.observe(section);
      }
    });

    return () => {
      lenis.destroy();
      sectionRefs.current.forEach(section => {
        if (section) {
          sectionObserver.unobserve(section);
        }
      });
    };
  }, []);

  // Data for the sections
  const sections = [
    {
      id: 'dispose-safely',
      title: 'Dispose Safely',
      description: 'Safely dispose of your unused or expired medications at our designated collection points. Our eco-friendly disposal process ensures pharmaceuticals don\'t end up in water systems or landfills, protecting both the environment and public health.',
      image: '/step01.webp',
      alt: 'Person disposing medication at a collection point'
    },
    {
      id: 'earn-carbon-credits',
      title: 'Earn Carbon Credits',
      description: 'Every time you properly dispose of medications through our service, you earn carbon credits. These credits reflect the positive environmental impact of your actions, as our process prevents harmful chemicals from contaminating soil and water resources.',
      image: '/step02.webp',
      alt: 'Digital representation of carbon credits being earned'
    },
    {
      id: 'buy-discounted-medicine',
      title: 'Buy Medicine at a Discount',
      description: 'Redeem your accumulated carbon credits for discounts on future medication purchases. Our partner pharmacies offer exclusive discounts to reward your eco-conscious choices, making healthcare more affordable while you help protect the planet.',
      image: '/step03.webp',
      alt: 'Person purchasing discounted medication at pharmacy'
    }
  ];

  return (
    <>
      <Head>
        <title>EcoMed</title>
        <meta name="description" content="A health platform for eco-friendly solutions" />
      </Head>
      <main className="w-[100%] h-[100%] bg-[#54aab6] overflow-hidden">
        <section className="landingPage w-[100%] h-[100vh] flex flex-col justify-center items-center">
          <nav className="bg-black fixed top-2 my-4 h-[3rem] rounded-full w-[70vw] py-1 px-8 flex justify-between items-center z-99">
            <div className="logo font-bold Sigmar">EcoMed</div>
            <div className="routes flex gap-6">
              <Link href="#" className="hover:text-teal-300 transition cursor-pointer">Home</Link>
              <Link href="#" className="hover:text-teal-300 transition cursor-pointer">How it works ?</Link>
              <Link href="/user/store" className="hover:text-teal-300 transition cursor-pointer">Store</Link>
              <Link href="#" className="hover:text-teal-300 transition cursor-pointer">About us</Link>
            </div>
            <div className="right-nav flex gap-2 items-center">
              <div className="notification">
                <span className="material-symbols-outlined cursor-pointer">notifications</span>
              </div>
              {authenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{user?.email || 'User'}</span>
                  <button 
                    onClick={logout}
                    className="bg-white rounded-4xl p-3 text-black h-[2rem] flex items-center cursor-pointer hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="bg-white rounded-4xl p-3 text-black h-[2rem] flex items-center cursor-pointer hover:bg-gray-200"
                >
                  Login
                </button>
              )}
            </div>
          </nav>
          <div className="tagline flex flex-col items-end animate-fadeIn">
            <h1 className="text-white text-[4rem] anton">Earn Rewards</h1>
            <h1 className="text-white text-[4rem] anton">For Safe Medicine Disposal</h1>
            <p className=" text-[#000]">Dispose of expired medicines responsibly and earn Carbon Credits (CCT).</p>
            <button className="bg-[#000] text-white rounded p-2 hover:text-green-500 hover:bg-white hover:font-bold cursor-pointer transition duration-300">Dispose & Earn</button>
          </div>
        </section>
        <section className={`features flex items-center justify-evenly h-[10rem] z-10 absolute top-[88vh] left-[12rem] rounded-xl bg-[#fff] w-[70vw] mx-auto my-4 text-green-500 font-semibold transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Add your features content here */}
          <div className="eco-friendl relative w-[33%] flex flex-col gap-2 items-center justify-center">
            <Image 
              src="/EcoFriendly.webp"
              alt="eco-friendly"
              width={64}
              height={64}
            />
            <p>Eco-Friendly</p>
          </div>
          <div className="horizonal bg-[#57fd8e] h-[80%] rounded-full w-[3px]"></div>
          <div className="eco-friendl relative w-[33%] flex flex-col gap-2 items-center justify-center">
            <Image 
              src="/EarnRewards.webp"
              alt="Earn Reward"
              width={64}
              height={64}
            />
            <p>Earn Rewards</p>
          </div>
          <div className="horizonal bg-[#57fd8e] h-[80%] rounded-full w-[3px]"></div>
          <div className="eco-friendl relative w-[33%] flex flex-col gap-2 items-center justify-center">
            <Image 
              src="/Decentralized.webp"
              alt="Decentralized Marketplace"
              width={64}
              height={64}
            />
            <p>Decentralized Marketplace</p>
          </div>
        </section>
        {/* How It Works Section */}
        <section className="relative h-screen flex items-center justify-center text-center bg-gradient-to-b from-green-50 to-blue-50 animate-fadeIn">
          <div className="max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-green-800">How It Works</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Our innovative system helps you dispose of medications safely, earn rewards, and save money on future purchases.
            </p>
            <div className="animate-bounce mt-16">
              <p className="text-sm text-gray-500 mb-2">Scroll to learn more</p>
              <svg className="w-6 h-6 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>
        {sections.map((section, index) => {
          const isEven = index % 2 === 0;

          return (
            <section 
              key={section.id}
              id={section.id}
              ref={el => sectionRefs.current[index] = el}
              className={`min-h-screen flex items-center py-16 px-4 md:px-8 transition-all duration-1000 ease-out section-animation ${isEven ? 'even-section' : 'odd-section'}`}
              style={{ background: isEven ? '#f8fafc' : '#ffffff' }}
            >
              <div className="container mx-auto">
                <div className={`flex flex-col ${index === 1 ? 'md:flex-row' : isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}>
                  <div className={`w-full md:w-1/2 image-content ${index === 1 ? 'order-first md:order-first' : isEven ? 'order-last md:order-last' : 'order-first md:order-first'}`}>
                    <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden shadow-xl">
                      <Image 
                        src={section.image}
                        alt={section.alt}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>

                  <div className={`w-full md:w-1/2 text-content ${index === 1 ? 'order-last md:order-last' : isEven ? 'order-first md:order-first' : 'order-last md:order-last'}`}>
                    <div className="max-w-md mx-auto">
                      <div className="inline-block bg-green-100 text-green-800 rounded-full px-4 py-1 text-sm font-semibold mb-4">
                        Step {index + 1}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">{section.title}</h2>
                      <p className="text-lg text-gray-700 leading-relaxed">{section.description}</p>
                      <div className="mt-8">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <section className="nearbypharamacy">
          
        </section>

        {/* Call to action section */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">Join our community of environmentally conscious individuals making a difference one medication at a time.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {authenticated ? (
                <button className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                  Go to Dashboard
                </button>
              ) : (
                <button 
                  onClick={login}
                  className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
                >
                  Sign Up Now
                </button>
              )}
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                Find Disposal Locations
              </button>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .section-animation {
          opacity: 0;
          transform: translateY(50px);
        }
        
        .section-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .even-section .text-content {
          opacity: 0;
          transform: translateX(-100px);
          transition: opacity 1s ease, transform 1s ease;
        }
        
        .even-section .image-content {
          opacity: 0;
          transform: translateX(100px);
          transition: opacity 1s ease, transform 1s ease;
        }
        
        .odd-section .image-content {
          opacity: 0;
          transform: translateX(-100px);
          transition: opacity 1s ease, transform 1s ease;
        }
        
        .odd-section .text-content {
          opacity: 0;
          transform: translateX(100px);
          transition: opacity 1s ease, transform 1s ease;
        }
        
        .section-visible .text-content,
        .section-visible .image-content {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </>
  );
}