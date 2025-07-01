import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { ArrowLeftIcon, GlobeAltIcon, HeartIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About Voices and Viewpoints
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A platform where ordinary people tell their not-so-ordinary stories, 
            amplifying voices that deserve to be heard.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Global Perspectives</h3>
              <p className="text-gray-600">
                Connecting voices from around the world to share diverse perspectives and experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Authentic Stories</h3>
              <p className="text-gray-600">
                Real stories from real people, sharing genuine experiences and insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LightBulbIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Inspiring Change</h3>
              <p className="text-gray-600">
                Stories that challenge, reflect, and inspire positive change in our world.
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Voices and Viewpoints was born from a simple yet powerful belief: everyone has a story worth telling. 
              In a world where mainstream media often amplifies the same voices, we provide a platform for 
              diverse perspectives, marginalized communities, and untold narratives.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We believe that understanding comes from listening to different viewpoints, and that empathy 
              grows when we hear stories from people whose experiences differ from our own. Our platform 
              serves as a bridge between communities, fostering dialogue and understanding across cultural, 
              social, and geographical boundaries.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Through our six core categories—Art, Books, Culture and Tourism, Health and Nutrition, 
              Analysis,Sustainability and Environment, and About Us—we explore the full spectrum of human experience, from personal 
              journeys to global challenges, from creative expression to critical thinking.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Editor */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Image
                    src="/sian.jpg"
                    alt="Sian"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover mr-6"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Sian</h3>
                    <p className="text-blue-600 font-semibold">Editor</p>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Sian is an anthropologist and university professor with a special focus on issues surrounding 
                    development and sustainability, poverty, challenges faced by marginalised minorities, and in 
                    art and culture.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    With years of academic research and fieldwork experience, Sian brings a deep understanding 
                    of human societies and the complex challenges they face. Her expertise in development 
                    studies and cultural anthropology informs our editorial direction, ensuring that we 
                    amplify voices that are often overlooked in mainstream discourse.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Areas of Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Development Studies</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Sustainability and Environment</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Cultural Anthropology</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Social Justice</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Arts & Culture</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deputy Editor */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Image
                    src="/carolyn.jpg"
                    alt="Carolyn"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover mr-6"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Carolyn</h3>
                    <p className="text-green-600 font-semibold">Deputy Editor</p>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Carolyn is a seasoned PR and Marketing Communications professional with senior 
                    leadership experience overseeing teams across Asia. Her interests include food and health, 
                    the environment, travel, as well as arts and culture.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    A biophilic at heart, Carolyn is especially keen on sustainability and social impact. 
                    Her extensive experience in communications across diverse Asian markets brings a unique 
                    perspective to our platform, ensuring that stories resonate with global audiences while 
                    maintaining cultural sensitivity and authenticity.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Areas of Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Sustainability and Environment</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Health & Wellness</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Arts & Culture</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Travel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Authenticity</h3>
                <p className="text-gray-600">
                  We believe in the power of genuine, unfiltered stories that reflect real experiences 
                  and perspectives.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Diversity</h3>
                <p className="text-gray-600">
                  We celebrate and amplify voices from all walks of life, ensuring representation 
                  across cultures, backgrounds, and experiences.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Empathy</h3>
                <p className="text-gray-600">
                  Through storytelling, we foster understanding and compassion, building bridges 
                  between different communities and perspectives.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Impact</h3>
                <p className="text-gray-600">
                  We believe stories have the power to inspire change, challenge assumptions, 
                  and create positive social impact.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Quality</h3>
                <p className="text-gray-600">
                  We maintain high editorial standards while preserving the authentic voice 
                  and perspective of each storyteller.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Community</h3>
                <p className="text-gray-600">
                  We build a supportive community where writers can share their stories 
                  and readers can engage in meaningful dialogue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a writer with a story to share or a reader seeking new perspectives, 
            we invite you to be part of our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/become-author" className="btn-primary">
              Become an Author
            </Link>
            <Link href="/authors" className="btn-secondary">
              Meet Our Authors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 