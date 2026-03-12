'use client';

import { motion } from 'framer-motion';
import ImageGallery from '@/components/ImageGallery';

export default function History() {
  const timeline = [
    {
      period: 'Ancient Period (6th Century BCE - 6th Century CE)',
      color: 'from-red-600 to-orange-600',
      events: [
        {
          year: '6th Century BCE',
          title: 'Rise of Magadha Empire',
          description: 'Bihar emerged as the center of political power in ancient India with the rise of Magadha kingdom. The Haryanka dynasty established the first major empire.'
        },
        {
          year: '563 BCE',
          title: 'Birth of Lord Buddha',
          description: 'Siddhartha Gautama, who would become the Buddha, was born in Lumbini and attained enlightenment in Bodh Gaya, Bihar, changing the spiritual landscape of Asia.'
        },
        {
          year: '490 BCE',
          title: 'Ajatashatru\'s Reign',
          description: 'King Ajatashatru strengthened Magadha\'s power, built the fort of Pataligrama (later Pataliputra), and became a patron of Buddhism.'
        },
        {
          year: '325 BCE',
          title: 'Nanda Empire',
          description: 'The Nanda Dynasty created one of the largest empires in ancient India, known for their vast wealth and powerful army.'
        }
      ]
    },
    {
      period: 'Mauryan Empire (321 BCE - 185 BCE)',
      color: 'from-blue-600 to-purple-600',
      events: [
        {
          year: '321 BCE',
          title: 'Chandragupta Maurya Establishes Empire',
          description: 'Chandragupta Maurya, guided by Chanakya, founded the Mauryan Empire with Pataliputra (modern Patna) as its capital. This became one of the largest empires in Indian history.'
        },
        {
          year: '268-232 BCE',
          title: 'Reign of Ashoka the Great',
          description: 'Emperor Ashoka ruled most of the Indian subcontinent. After the Kalinga War, he embraced Buddhism and spread its teachings across Asia. Built numerous stupas and pillars throughout Bihar.'
        },
        {
          year: '3rd Century BCE',
          title: 'Construction of Great Stupa at Sanchi',
          description: 'Ashoka commissioned the construction of Buddhist monuments across his empire, with significant structures built in Bihar.'
        }
      ]
    },
    {
      period: 'Gupta Empire (320 CE - 550 CE)',
      color: 'from-green-600 to-teal-600',
      events: [
        {
          year: '320 CE',
          title: 'Chandragupta I Establishes Gupta Empire',
          description: 'The Gupta Empire, often called the "Golden Age of India," began with Chandragupta I. This period saw unprecedented achievements in science, mathematics, astronomy, and arts.'
        },
        {
          year: '5th Century CE',
          title: 'Establishment of Nalanda University',
          description: 'Kumaragupta I founded Nalanda University, which became the world\'s first residential university and a premier center of learning attracting scholars from China, Korea, and Central Asia.'
        },
        {
          year: '4th-5th Century CE',
          title: 'Cultural Renaissance',
          description: 'The Gupta period witnessed remarkable developments in literature, drama, poetry, sculpture, and painting. Kalidasa, the great Sanskrit poet, lived during this period.'
        }
      ]
    },
    {
      period: 'Medieval Period (6th Century - 16th Century)',
      color: 'from-yellow-600 to-red-600',
      events: [
        {
          year: '7th Century',
          title: 'Harsha\'s Empire',
          description: 'King Harshavardhana unified much of northern India with his capital at Kannauj. He was a patron of Buddhism and supported the famous Chinese traveler Hiuen Tsang.'
        },
        {
          year: '8th Century',
          title: 'Pala Empire',
          description: 'The Pala dynasty ruled Bengal and Bihar for four centuries. They were great patrons of Buddhism and established Vikramshila University, another renowned center of learning.'
        },
        {
          year: '1193 CE',
          title: 'Turkish Conquest',
          description: 'Bakhtiyar Khilji conquered Bihar, marking the beginning of Muslim rule. This period saw the decline of Buddhism and the destruction of Nalanda and Vikramshila universities.'
        },
        {
          year: '1540-1545',
          title: 'Sher Shah Suri\'s Rule',
          description: 'Sher Shah Suri, an Afghan ruler from Bihar, defeated Humayun and established the Sur Empire. He built the Grand Trunk Road and introduced administrative reforms later adopted by the Mughals.'
        }
      ]
    },
    {
      period: 'Mughal Period (1526 CE - 1764 CE)',
      color: 'from-purple-600 to-pink-600',
      events: [
        {
          year: '1529 CE',
          title: 'Battle of Ghagra',
          description: 'Babur defeated the Afghan forces, bringing Bihar under Mughal control. It became an important province of the Mughal Empire.'
        },
        {
          year: '1574-1576',
          title: 'Akbar Consolidates Power',
          description: 'Emperor Akbar firmly established Mughal authority over Bihar. He reorganized the administration and divided Bihar into Sarkars (districts).'
        },
        {
          year: '17th Century',
          title: 'Patna as Trading Center',
          description: 'Patna became a major trading center, especially for saltpeter (used in gunpowder). European trading companies established factories in Patna.'
        }
      ]
    },
    {
      period: 'British Colonial Period (1764 CE - 1947 CE)',
      color: 'from-gray-700 to-gray-900',
      events: [
        {
          year: '1764 CE',
          title: 'Battle of Buxar',
          description: 'The British East India Company defeated the combined forces of Mir Qasim, Shuja-ud-Daulah, and Shah Alam II. This victory gave the British the Diwani rights (right to collect revenue) of Bengal, Bihar, and Odisha.'
        },
        {
          year: '1772 CE',
          title: 'Permanent Settlement',
          description: 'The British introduced the Permanent Settlement system, creating a new class of landlords (zamindars) and fundamentally changing Bihar\'s agrarian structure.'
        },
        {
          year: '1857 CE',
          title: 'Revolt of 1857',
          description: 'Bihar played a significant role in the First War of Independence. Kunwar Singh, a zamindar from Jagdishpur, led the rebellion in Bihar at the age of 80.'
        },
        {
          year: '1916-1917',
          title: 'Champaran Satyagraha',
          description: 'Mahatma Gandhi launched his first satyagraha in Champaran, Bihar, supporting indigo farmers against oppressive British plantation systems. This marked a turning point in India\'s freedom struggle.'
        },
        {
          year: '1942 CE',
          title: 'Quit India Movement',
          description: 'Bihar was at the forefront of the Quit India Movement. Jayaprakash Narayan emerged as a prominent leader. The movement paralyzed British administration across the state.'
        }
      ]
    },
    {
      period: 'Post-Independence (1947 CE - Present)',
      color: 'from-orange-500 to-green-500',
      events: [
        {
          year: '1947 CE',
          title: 'Indian Independence',
          description: 'With India\'s independence, Bihar became a state of the Indian Union. Dr. Sri Krishna Sinha became the first Chief Minister.'
        },
        {
          year: '1952 CE',
          title: 'First General Elections',
          description: 'Bihar participated in India\'s first general elections, establishing democratic governance in the state.'
        },
        {
          year: '2000 CE',
          title: 'Creation of Jharkhand',
          description: 'Southern Bihar was carved out to create the new state of Jharkhand, reducing Bihar\'s geographical area but retaining its cultural and historical core.'
        },
        {
          year: '21st Century',
          title: 'Development and Progress',
          description: 'Modern Bihar focuses on education, infrastructure development, and reviving its tourism potential, especially Buddhist circuit tourism and eco-tourism.'
        }
      ]
    }
  ];

  const notableFigures = [
    {
      name: 'Lord Mahavira',
      contribution: 'Founder of Jainism',
      period: '6th Century BCE',
      description: 'Born in Vaishali, Bihar, he propagated the principles of non-violence and truth.'
    },
    {
      name: 'Chanakya (Kautilya)',
      contribution: 'Prime Minister & Philosopher',
      period: '4th Century BCE',
      description: 'Architect of the Mauryan Empire and author of Arthashastra, a treatise on statecraft.'
    },
    {
      name: 'Ashoka the Great',
      contribution: 'Mauryan Emperor',
      period: '3rd Century BCE',
      description: 'Transformed from a warrior king to a Buddhist missionary after the Kalinga War.'
    },
    {
      name: 'Dr. Rajendra Prasad',
      contribution: 'First President of India',
      period: '1884-1963',
      description: 'Born in Siwan, Bihar, he was a key figure in India\'s freedom struggle.'
    },
    {
      name: 'Jayaprakash Narayan',
      contribution: 'Freedom Fighter & Political Leader',
      period: '1902-1979',
      description: 'Known as "Lok Nayak" (People\'s Hero), led movements for democracy and social justice.'
    },
    {
      name: 'Babu Kunwar Singh',
      contribution: 'Freedom Fighter (1857 Revolt)',
      period: '1777-1858',
      description: 'Led the revolt against British East India Company at the age of 80.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-indigo-900 via-purple-900 to-red-900">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              History of Bihar
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Journey through 2500+ years of glorious heritage - from ancient empires to modern times
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              The Land of Ancient Empires
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Bihar, one of the world's oldest continuously inhabited regions, has been the cradle of 
              mighty empires, birthplace of religions, and center of learning that attracted scholars 
              from across the ancient world. From the magnificent Mauryan Empire to the Golden Age of 
              Guptas, Bihar's history is interwoven with the fabric of Indian civilization.
            </p>
          </motion.div>

          {/* Quick Facts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              { number: '2500+', label: 'Years of Recorded History' },
              { number: '4', label: 'Major Ancient Empires' },
              { number: '2', label: 'Religions Born Here' },
              { number: '∞', label: 'Legacy to Humanity' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center shadow-lg"
              >
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Historical Timeline
            </h2>
            <p className="text-xl text-gray-600">
              Explore Bihar's rich history through the ages
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
          </motion.div>

          <div className="space-y-12">
            {timeline.map((era, eraIndex) => (
              <motion.div
                key={eraIndex}
                initial={{ opacity: 0, x: eraIndex % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Era Header */}
                <div className={`bg-gradient-to-r ${era.color} rounded-2xl p-6 mb-6 shadow-xl`}>
                  <h3 className="text-3xl font-bold text-white">{era.period}</h3>
                </div>

                {/* Events */}
                <div className="ml-8 space-y-6">
                  {era.events.map((event, eventIndex) => (
                    <div key={eventIndex} className="relative pl-8 border-l-4 border-indigo-200">
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-white rounded-full border-4 border-indigo-600"></div>
                      <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-3">
                          <span className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-bold">
                            {event.year}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h4>
                        <p className="text-gray-700 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notable Figures Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Legends Who Shaped History
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visionaries, leaders, and reformers from Bihar who changed the world
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notableFigures.map((figure, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{figure.name}</h3>
                <div className="flex items-center mb-3">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {figure.contribution}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">{figure.period}</span>
                </div>
                <p className="text-gray-700">{figure.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Bihar's Enduring Legacy
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Contributions that shaped human civilization
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'World\u2019s First University',
                description: 'Nalanda University (5th century CE) was the world\u2019s first residential university, offering courses in philosophy, logic, grammar, medicine, and astronomy. It attracted students from China, Korea, Japan, and Central Asia.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )
              },
              {
                title: 'Birthplace of Buddhism & Jainism',
                description: 'Lord Buddha attained enlightenment in Bodh Gaya and delivered his last sermon in Vaishali. Lord Mahavira, the 24th Tirthankara of Jainism, was born in Vaishali. These religions spread across Asia from Bihar.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                )
              },
              {
                title: 'Administrative Innovations',
                description: 'Chanakya\u2019s Arthashastra, written in Bihar, is one of the world\u2019s earliest treatises on political science, economics, and military strategy. Sher Shah Suri\u2019s administrative reforms became the model for Mughal governance.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                title: 'Mathematical & Astronomical Advances',
                description: 'Aryabhata, born in Bihar, proposed the heliocentric theory, calculated pi (\u03c0), and introduced the concept of zero. The decimal system and place-value notation were developed here.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: 'Art & Architecture',
                description: 'The Mauryan pillars with their lion capitals (now India\u2019s national emblem), Buddhist stupas, and intricate sculptures represent some of the finest examples of ancient Indian art.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: 'Role in Freedom Struggle',
                description: 'From Champaran Satyagraha to Quit India Movement, Bihar played a pivotal role in India\u2019s independence. Leaders like Rajendra Prasad, Jayaprakash Narayan, and countless freedom fighters sacrificed for the nation.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                )
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
              >
                <div className="text-yellow-400 mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/90 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <ImageGallery 
            title="Historical Sites of Bihar"
            images={[
              "https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80",
              "https://images.unsplash.com/photo-1547970810-dcdde07fb819?w=800&q=80",
              "https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80",
              "https://images.unsplash.com/photo-1547970810-dcdde07fb819?w=800&q=80",
              "https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=800&q=80",
              "https://images.unsplash.com/photo-1547970810-dcdde07fb819?w=800&q=80",
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Walk Through History
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-white/90"
          >
            Visit the ancient sites where history was made - from Bodh Gaya where Buddha found enlightenment 
            to Nalanda where scholars gathered from across the world
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <a
              href="/destinations"
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Historical Destinations →
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
