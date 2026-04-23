'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const eras = [
  'All',
  'Ancient Era',
  'Medieval & Pre-Independence',
  'Post-Independence (20th Century)',
  'Modern Day'
];

const personalities = [
  { name: 'Gautama Buddha', era: 'Ancient Era', description: 'Founder of Buddhism, attained enlightenment in Bodh Gaya, Bihar.', image: '/personalities/buddha.jpg' },
  { name: 'Lord Mahavira', era: 'Ancient Era', description: 'The 24th Tirthankara of Jainism, born in Vaishali and attained Nirvana in Pawapuri.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Lord%20Mahavira%20Jainism%20ancient%20India%20cinematic?width=800&height=800&nologo=true' },
  { name: 'Chanakya (Kautilya)', era: 'Ancient Era', description: 'Ancient Indian polymath, royal advisor, and author of the Arthashastra.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Chanakya%20Kautilya%20ancient%20Indian%20scholar%20cinematic?width=800&height=800&nologo=true' },
  { name: 'Chandragupta Maurya', era: 'Ancient Era', description: 'Founder of the Maurya Empire, which was based in Magadha (modern-day Bihar).', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Chandragupta%20Maurya%20ancient%20Indian%20Emperor%20cinematic?width=800&height=800&nologo=true' },
  { name: 'Emperor Ashoka', era: 'Ancient Era', description: 'One of India\'s greatest emperors, who spread Buddhism across Asia.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Emperor%20Ashoka%20ancient%20India%20regal%20cinematic?width=800&height=800&nologo=true' },
  { name: 'Aryabhata', era: 'Ancient Era', description: 'First of the major mathematician-astronomers from the classical age of Indian mathematics.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Aryabhata%20ancient%20Indian%20mathematician%20astronomer?width=800&height=800&nologo=true' },
  { name: 'Vatsyayana', era: 'Ancient Era', description: 'Ancient Indian philosopher, known for authoring the Kama Sutra.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Vatsyayana%20ancient%20Indian%20philosopher?width=800&height=800&nologo=true' },

  { name: 'Sher Shah Suri', era: 'Medieval & Pre-Independence', description: 'Founder of the Suri Empire in India, known for his administrative and military skills.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Sher%20Shah%20Suri%20medieval%20Indian%20emperor?width=800&height=800&nologo=true' },
  { name: 'Guru Gobind Singh', era: 'Medieval & Pre-Independence', description: 'The tenth Sikh Guru, a spiritual master, warrior, and philosopher born in Patna.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Guru%20Gobind%20Singh%20Sikh%20Guru%20cinematic?width=800&height=800&nologo=true' },
  { name: 'Veer Kunwar Singh', era: 'Medieval & Pre-Independence', description: 'A notable leader during the Indian Rebellion of 1857, hailing from Jagdispur.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Veer%20Kunwar%20Singh%20Indian%20Rebellion%201857?width=800&height=800&nologo=true' },
  { name: 'Dr. Rajendra Prasad', era: 'Medieval & Pre-Independence', description: 'The first President of India, a scholar and prominent leader of the Indian independence movement.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Dr%20Rajendra%20Prasad%20first%20President%20of%20India?width=800&height=800&nologo=true' },
  { name: 'Anugrah Narayan Sinha', era: 'Medieval & Pre-Independence', description: 'Known as Bihar Vibhuti, an eminent nationalist and the first Deputy Chief Minister of Bihar.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Anugrah%20Narayan%20Sinha%20Indian%20nationalist?width=800&height=800&nologo=true' },

  { name: "Ramdhari Singh 'Dinkar'", era: 'Post-Independence (20th Century)', description: 'An Indian Hindi poet, essayist, and academic, considered one of the most important modern Hindi poets.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Ramdhari%20Singh%20Dinkar%20Hindi%20poet?width=800&height=800&nologo=true' },
  { name: 'Jayaprakash Narayan (JP)', era: 'Post-Independence (20th Century)', description: 'Independence activist, theorist, socialist and political leader, known as the "Hero of Quit India Movement".', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Jayaprakash%20Narayan%20Indian%20activist?width=800&height=800&nologo=true' },
  { name: 'Ustad Bismillah Khan', era: 'Post-Independence (20th Century)', description: 'Indian musician credited with popularizing the shehnai, born in Dumraon, Bihar.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Ustad%20Bismillah%20Khan%20playing%20shehnai?width=800&height=800&nologo=true' },
  { name: 'Jagjivan Ram', era: 'Post-Independence (20th Century)', description: 'Known as Babuji, an independence activist and politician from Bihar who served as Deputy Prime Minister.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Jagjivan%20Ram%20Indian%20politician?width=800&height=800&nologo=true' },
  { name: 'Karpoori Thakur', era: 'Post-Independence (20th Century)', description: 'Known as Jan Nayak, a politician who served as the Chief Minister of Bihar and championed social justice.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Karpoori%20Thakur%20Indian%20politician?width=800&height=800&nologo=true' },
  { name: "Phanishwar Nath 'Renu'", era: 'Post-Independence (20th Century)', description: 'One of the most successful and influential writers of modern Hindi literature.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Phanishwar%20Nath%20Renu%20Hindi%20writer?width=800&height=800&nologo=true' },
  { name: 'Bismil Azimabadi', era: 'Post-Independence (20th Century)', description: 'Urdu poet from Patna, famous for writing the patriotic poem "Sarfaroshi ki Tamanna".', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Bismil%20Azimabadi%20Urdu%20poet?width=800&height=800&nologo=true' },

  { name: 'Bindeshwar Pathak', era: 'Modern Day', description: 'Sociologist and social entrepreneur, founder of Sulabh International.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20historical%20portrait%20of%20Bindeshwar%20Pathak%20Indian%20sociologist?width=800&height=800&nologo=true' },
  { name: 'Lalu Prasad Yadav', era: 'Modern Day', description: 'Prominent Indian politician and former Chief Minister of Bihar and Union Railway Minister.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Lalu%20Prasad%20Yadav%20Indian%20politician?width=800&height=800&nologo=true' },
  { name: 'Nitish Kumar', era: 'Modern Day', description: 'Current Chief Minister of Bihar, known for governance and development initiatives.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Nitish%20Kumar%20Chief%20Minister%20of%20Bihar?width=800&height=800&nologo=true' },
  { name: 'Sushil Kumar Modi', era: 'Modern Day', description: 'Senior politician who served as the Deputy Chief Minister and Finance Minister of Bihar.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Sushil%20Kumar%20Modi%20Indian%20politician?width=800&height=800&nologo=true' },
  { name: 'Anand Kumar', era: 'Modern Day', description: 'Indian mathematics educator best known for his Super 30 program.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Anand%20Kumar%20Indian%20mathematician%20educator?width=800&height=800&nologo=true' },
  { name: 'Manoj Bajpayee', era: 'Modern Day', description: 'Highly acclaimed Indian actor, recipient of three National Film Awards.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Manoj%20Bajpayee%20Indian%20actor?width=800&height=800&nologo=true' },
  { name: 'Pankaj Tripathi', era: 'Modern Day', description: 'Renowned Indian actor known for his versatile and natural acting in Hindi cinema.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Pankaj%20Tripathi%20Indian%20actor?width=800&height=800&nologo=true' },
  { name: 'Sanjay Mishra', era: 'Modern Day', description: 'Indian actor known for his works predominantly in Hindi cinema and television.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Sanjay%20Mishra%20Indian%20actor?width=800&height=800&nologo=true' },
  { name: 'Sharda Sinha', era: 'Modern Day', description: 'Indian Maithili folk singer, known for her contributions to regional music.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Sharda%20Sinha%20Indian%20folk%20singer?width=800&height=800&nologo=true' },
  { name: 'Ravish Kumar', era: 'Modern Day', description: 'Indian journalist, author, and media personality, former Senior Executive Editor at NDTV India.', image: 'https://image.pollinations.ai/prompt/Highly%20realistic%20portrait%20of%20Ravish%20Kumar%20Indian%20journalist?width=800&height=800&nologo=true' },
];

export default function FamousPersonalities() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredPersonalities = activeFilter === 'All'
    ? personalities
    : personalities.filter(p => p.era === activeFilter);

  return (
    <section className="py-24 px-4 bg-[#FFF8EC] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#546B41]/5"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
            FAMOUS <span className="text-[#546B41]">PERSONALITIES</span>
          </h2>
          <div className="w-32 h-1.5 bg-[#DCCCAC] mx-auto mt-4 mb-8 rounded-full shadow-lg"></div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {eras.map((era) => (
              <button
                key={era}
                onClick={() => setActiveFilter(era)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border-2 ${activeFilter === era
                    ? 'bg-[#546B41] text-[#FFF8EC] border-[#546B41] shadow-lg scale-105'
                    : 'bg-white text-black border-transparent hover:border-[#546B41]/30 hover:shadow-md'
                  }`}
              >
                {era}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPersonalities.map((person) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={person.name}
                className="group relative h-72 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-[#546B41] cursor-pointer"
              >
                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=546B41&color=FFF8EC&size=256`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Default Text State */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-left transition-all duration-500 group-hover:opacity-0 z-10">
                  <p className="text-xs font-bold text-[#DCCCAC] uppercase tracking-wider mb-1">{person.era}</p>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{person.name}</h3>
                </div>

                {/* Hover Details State */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-[#546B41]/95 backdrop-blur-sm text-[#FFF8EC] z-20">
                  <h3 className="text-xl font-black mb-4">{person.name}</h3>
                  <div className="w-12 h-1 bg-[#DCCCAC] rounded-full mb-4"></div>
                  <p className="text-sm font-medium leading-relaxed text-[#DCCCAC]">
                    {person.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
