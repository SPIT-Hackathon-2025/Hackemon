import React from 'react'
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import code from '../assets/code.png'

const Home = () => {
  const features = [
    "Intuitive Drag-and-Drop Interface",
    "Pre-built Action Blocks",
    "Trigger Blocks",
    "Conditional Logic",
    "Multi-App Integration",
    "Custom API Integrations",
    "User-Friendly Interface",
    "Automation Dashboard",
    "Real-Time Data Sync",
    "Task Scheduling",
    "Notifications and Alerts"
  ];

  return (
    <>
      <div className='bg-slate-950 w-full h-screen flex justify-center items-center'>
        <div className='w-full h-full flex justify-around items-center px-16'>
          {/* Left Side (Text) */}
          <div className='flex flex-col justify-center w-[10%] mr-36'>
            <motion.h1
              className='text-white text-9xl font-semibold mt-6'
              initial={{ x: '-100vw' }}  // Start position off-screen to the left
              animate={{ x: 0 }}  // Animate to normal position
              transition={{ type: 'spring', stiffness: 120, damping: 25 }} // Customize animation
            >
              App name
            </motion.h1>
          </div>

          {/* Right Side (Image and Button) */}
          <div className='flex flex-col justify-center items-center w-[40%] ml-12'>
            {/* Animated Image */}
            <motion.div
              className='flex justify-center'
              initial={{ x: '100vw' }}  // Start position off-screen to the right
              animate={{ x: 0 }}  // Animate to normal position
              transition={{ type: 'spring', stiffness: 120, damping: 25 }} // Customize animation
            >
              <img src={code} alt='Code Illustration' className='w-[550px] h-[550px] object-cover' /> {/* Customize image size */}
            </motion.div>

            {/* Centered Get Started Button */}
            <div className='flex justify-center mt-8'>
              <button
                type="button"
                className="transition group flex h-14 w-48 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-[1.5px] text-white duration-300 hover:bg-gradient-to-l hover:shadow-2xl hover:shadow-blue-600/30 shadow-blue-500/30 shadow-lg"
              >
                <div
                  className="text-2xl px-8 py-4 flex h-full w-full items-center justify-center rounded-xl bg-gray-900 transition duration-300 ease-in-out group-hover:bg-gradient-to-br group-hover:from-gray-700 group-hover:to-gray-900 group-hover:transition group-hover:duration-300 group-hover:ease-in-out hover:shadow-blue-600/30"
                >
                  Get Started
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Text */}
        <div className='flex flex-col items-start mt-8 w-1/2'>
          <h2 className='text-white/70 text-6xl font-medium'>
            <TypeAnimation
              sequence={[
                'Automate your life.',
                1000, // Wait 1 second before typing next
                'No code required.',
                1000,
              ]}
              speed={50}  // Adjust typing speed
              wrapper="span"  // Wraps the text in a span
              repeat={Infinity}  // Repeat the animation infinitely
            />
          </h2>
        </div>
      </div>

      {/* Features */}
      <div className="pt-16 text-xl flex flex-col items-center bg-slate-950 text-white">
        <h1 className="text-5xl font-semibold mb-6">Features of Our Workflow Automation Platform</h1>
        <ul className="space-y-4">
          {features.map((feature, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,  // Trigger the animation only once
              threshold: 0.3, // Trigger when 30% of the element is visible
            });

            return (
              <motion.li
                key={index}
                ref={ref}
                className="text-3xl px-4 py-2 bg-slate-900 rounded-lg"
                initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and moved down
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }} // Fade in and move to the original position
                transition={{ duration: 0.5, delay: index * 0.1 }} // Add delay for each item
              >
                {feature}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Home;
