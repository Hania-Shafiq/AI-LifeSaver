import { PhoneCall, Hospital, Droplet } from "lucide-react";
import { motion } from "framer-motion";
import texts from "../data/texts.json";

export default function ContactPage({ language }) {
  const bloodbank = new URL("../assets/blood-bank.png", import.meta.url).href;
  const emergencycall = new URL("../assets/call.png", import.meta.url).href;
  const hospital1 = new URL("../assets/helpline.png", import.meta.url).href;

  const services = [
    {
      title: texts[language].contactEmergencyTitle,
      desc: texts[language].contactEmergencyDesc,
      icon: <PhoneCall className="w-6 h-6 text-[#E53935]" />,
      image: hospital1,
      numbers: [
        { name: "Rescue 1122", tel: "1122" },
        { name: "Edhi Foundation", tel: "115" },
        { name: "Al Khidmat Foundation", tel: "1023" },
        { name: "Chhipa Welfare", tel: "1020" },
      ],
    },
    {
      title: texts[language].contactHospitalsTitle,
      desc: texts[language].contactHospitalsDesc,
      icon: <Hospital className="w-6 h-6 text-[#1E88E5]" />,
      image: emergencycall,
      href: "https://maps.google.com/?q=hospitals+near+me",
      cta: texts[language].contactHospitalsCTA,
    },
    {
      title: texts[language].contactBloodTitle,
      desc: texts[language].contactBloodDesc,
      icon: <Droplet className="w-6 h-6 text-[#EC407A]" />,
      image: bloodbank,
      href: "https://maps.google.com/?q=blood+banks+near+me",
      cta: texts[language].contactBloodCTA,
    },
  ];

  return (
    <section className="min-h-screen bg-[#f0f7ff] py-20 px-6 font-inter">
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-20 mt-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug"
        >
          {texts[language].contactHeading}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-700 text-base md:text-lg mt-4 leading-relaxed"
        >
          {texts[language].contactSubheading}
        </motion.p>
      </div>

      {/* Horizontal Panels */}
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {services.map((service, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex flex-col md:flex-row items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Image */}
            <div className="w-full md:w-1/3 h-48 md:h-56 flex-shrink-0 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover rounded-l-xl md:rounded-l-xl"
                loading="lazy"
                draggable={false}
              />
            </div>

            {/* Text Content */}
            <div className="w-full md:w-2/3 p-6 flex flex-col items-start md:items-start text-left">
              <div className="flex items-center gap-3 mb-3">
                {service.icon}
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{service.desc}</p>

              {/* Numbers in subtle boxes or CTA */}
              {service.numbers ? (
                <div className="flex flex-wrap gap-3 mt-3">
                  {service.numbers.map((num, index) => (
                    <div
                      key={index}
                      className="bg-red-500/10 text-red-600 rounded-md px-3 py-2 flex flex-col items-center min-w-[120px]"
                    >
                      <span className="text-xs">{num.name}</span>
                      <p className="text-sm font-semibold">{num.tel}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <a
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#1E88E5] to-[#E53935] py-2 px-4 rounded-md text-white font-medium transition hover:opacity-90"
                >
                  {service.cta}
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
