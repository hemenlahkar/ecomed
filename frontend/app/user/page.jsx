'use client'

// pages/index.js
import { useEffect, useRef } from 'react';
import Head from 'next/head';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Link from 'next/link';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Dashboard() {
  const dashboardRef = useRef(null);
  const mainBoxRef = useRef(null);
  const tokenEarnBoxRef = useRef(null);
  const tokenUseBoxRef = useRef(null);
  const tokenEarnHistoryRef = useRef(null);
  const tokenUseHistoryRef = useRef(null);
  const footerRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to GSAP's ticker
    gsap.ticker.add((time) => {
      lenisRef.current.raf(time * 1000);
    });

    // Initialize GSAP animations
    const tl = gsap.timeline();
    
    // Animate header
    tl.from(dashboardRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    
    // Animate main profile box
    tl.from(mainBoxRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");
    
    // Animate token boxes with stagger
    tl.from([tokenEarnBoxRef.current, tokenUseBoxRef.current], {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "back.out(1.7)"
    }, "-=0.2");
    
    // Create scroll animations for history boxes
    gsap.from(tokenEarnHistoryRef.current, {
      scrollTrigger: {
        trigger: tokenEarnHistoryRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none reverse",
        scrub: 0.5
      },
      x: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    
    gsap.from(tokenUseHistoryRef.current, {
      scrollTrigger: {
        trigger: tokenUseHistoryRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none reverse",
        scrub: 0.5
      },
      x: 100,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    // Animate footer
    gsap.from(footerRef.current, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none reverse",
        scrub: 0.5
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });

    // Lenis scroll callback for parallax effect
    lenisRef.current.on('scroll', ({ scroll }) => {
      if (scroll > 50) {
        gsap.to(mainBoxRef.current, {
          backgroundPosition: `0 ${scroll * 0.05}px`,
          duration: 0.1,
          ease: "none"
        });
      }
    });
    
    // Clean up
    return () => {
      lenisRef.current.destroy();
      gsap.ticker.remove(lenisRef.current);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <Head>
        <title>Token Dashboard</title>
        <meta name="description" content="Token management dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Home Button */}
        <div className="text-right">
          <Link href="/">
            <p className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Home</p>
          </Link>
        </div>

        {/* Dashboard Header */}
        <div 
          ref={dashboardRef}
          className="border-2 border-gray-300 py-3 text-center bg-white rounded-md"
        >
          <h1 className="text-xl font-bold">Profile</h1>
        </div>

        {/* Main Profile Box */}
        <div 
          ref={mainBoxRef}
          className="username-and-details bg-blue-500 rounded-2xl p-4 flex justify-between items-center"
        >
          {/* Username and Details */}
          <div className="text-white">
            <h2 className="text-lg font-semibold">Username</h2>
            <p className="text-sm">User details go here</p>
          </div>
          
          {/* Orange Box */}
          <div className="activity-statistic bg-orange-500 h-16 w-40 rounded-md"></div>
        </div>

        {/* User Activity Statistic Graph */}
        <div className="bg-white rounded-2xl p-4 mt-6">
          <h2 className="font-semibold mb-4">User Activity</h2>
          <div className="h-64">
            {/* Placeholder for the graph */}
            <canvas id="activityChart"></canvas>
          </div>
        </div>

        {/* Token Earn/Use Boxes */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Token Earn Box */}
          <div 
            ref={tokenEarnBoxRef}
            className="flex-1 bg-blue-500 rounded-2xl p-4"
          >
            <div className="bg-white p-3 rounded-md">
              <h2 className="font-semibold">Token earn</h2>
              <div className="h-16"></div>
            </div>
          </div>
          
          {/* Token Use Box */}
          <div 
            ref={tokenUseBoxRef}
            className="flex-1 bg-blue-500 rounded-2xl p-4"
          >
            <div className="bg-white p-3 rounded-md">
              <h2 className="font-semibold">Token use</h2>
              <div className="h-16"></div>
            </div>
          </div>
        </div>

        {/* Token Earn History */}
        <div 
          ref={tokenEarnHistoryRef}
          className="bg-blue-500 rounded-2xl p-6 flex justify-center"
        >
          <div className=" header-history text-black bg-white py-2 px-4 rounded-md w-4/5">
            <h2 className="font-semibold">Token earn history</h2>
          </div>
          <div className="lists">

          </div>
        </div>

        {/* Token Use History */}
        <div 
          ref={tokenUseHistoryRef}
          className="bg-blue-500 rounded-2xl p-6 flex justify-center"
        >
          <div className="bg-white py-2 px-4 rounded-md w-3/5">
            <h2 className="font-semibold">Token use history</h2>
          </div>
        </div>

        {/* Footer */}
        <footer 
          ref={footerRef}
          className="bg-gray-800 text-white py-4 text-center rounded-md h-[20rem]"
        >
          <p>&copy; 2025 EcoMed. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}