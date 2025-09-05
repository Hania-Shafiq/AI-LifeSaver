import hero from '../assets/HeroImg.png'

export default function Home() {
  return (
    <section className="bg-gradient-to-r from-white via-[#E8F1FF] to-white py-28">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 lg:px-12 gap-16">
        
        {/* Left Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-snug mb-6">
            <span className="text-[#004AAD]">AI LifeSaver</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg">
            A bilingual (Urdu & English) AI-powered first aid web app.  
            Get instant, step-by-step help in emergencies — faster than ever.
          </p>
          <div className="flex justify-center md:justify-start gap-6">
            <button className="bg-[#E72220] text-white px-8 py-4 rounded-xl shadow-md hover:bg-[#BC0201] transform hover:scale-105 transition-all duration-300">
              🚑 Get Started
            </button>
            <button className="bg-white border-2 border-[#3A8DFF] text-[#3A8DFF] px-8 py-4 rounded-xl shadow-md hover:bg-[#004AAD] hover:text-white transform hover:scale-105 transition-all duration-300">
              ℹ️ Learn More
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={hero}
            alt="AI LifeSaver First Aid"
            className="w-full max-w-2xl object-contain"
          />
        </div>
      </div>
    </section>
  )
}
