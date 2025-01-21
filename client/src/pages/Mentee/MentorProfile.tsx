import { Breadcrumb } from '../../components/Common/exploreMentor/BreadCrumb';
import { ProfileHeader } from '../../components/Common/exploreMentor/ProfileHeader';
import { SkillsAndTopics } from '../../components/Common/exploreMentor/SkillsAndTopic';

import { BookOption } from '../../components/Common/exploreMentor/BookOption';
import MentorListByCategory from '../../components/Common/exploreMentor/MentorListByCategory';
import Button from '../../components/Auth/Button';

export const MentorProfile = () => {
  const breadcrumbPath = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'John Smith', href: '#' },
  ];

  const mentorData = {
    image: 'https://source.unsplash.com/400x400/?portrait',
    name: 'John Smith',
    position: 'Senior Product Manager',
    description: '15 years of PM experience in Tech',
    location: 'San Francisco, CA',
    rating: 5.0,
    reviews: 19,
    status: 'Active today',
    responseTime: 'Usually responds in a few hours',
  };

  const skills = [
    'Product Management',
    'Marketplace',
    'SaaS',
    'B2B',
    'Growth',
    'Strategy',
  ];

  const topics = [
    'Start a business',
    'Build a team',
    'Product strategy',
    'Career growth',
    'Leadership',
  ];

  const litePlan = {
    name: 'Lite Plan',
    price: 350,
    features: [
      'Up to 2 calls per month',
      'Unlimited Q&A via chat',
      'Document reviews',
      'Email support',
    ],
    spotsLeft: 3,
  };

  const standardPlan = {
    name: 'Standard Plan',
    price: 650,
    features: [
      'Up to 4 calls per month',
      'Unlimited Q&A via chat',
      'Document reviews',
      'Email support',
      'Priority scheduling',
      'Resume review',
      'LinkedIn profile optimization',
    ],
    spotsLeft: 2,
  };

  const suggestedMentors = [
    {
      id: '1',
      name: 'Sarah Johnson',
      image: 'https://source.unsplash.com/400x400/?woman,professional',
      badge: 'Product Leader',
      description: 'Mentored 200+ professionals on breaking into Product Management. Former PM at Google and Meta.',
    },
    {
      id: '2',
      name: 'Michael Chen',
      image: 'https://source.unsplash.com/400x400/?man,business',
      badge: 'Data Science',
      description: 'Lead Data Scientist at Amazon. Helping aspiring data scientists master ML and AI concepts.',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      image: 'https://source.unsplash.com/400x400/?woman,business',
      badge: 'UX Design',
      description: 'Senior UX Designer at Apple. Passionate about helping designers create impactful products.',
    },
    {
      id: '4',
      name: 'David Kim',
      image: 'https://source.unsplash.com/400x400/?asian,man',
      badge: 'Engineering',
      description: 'Tech Lead at Netflix. Guiding software engineers in system design and architecture.',
    },
    {
      id: '5',
      name: 'Lisa Patel',
      image: 'https://source.unsplash.com/400x400/?indian,woman',
      badge: 'Product Leader',
      description: 'VP of Product at Airbnb. Helping PMs develop strategic thinking and leadership skills.',
    },
  ];

  const handleApply = (plan: string) => {
    console.log('Applying for', plan, 'plan');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb path={breadcrumbPath} />
      </div>

      <ProfileHeader {...mentorData} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SkillsAndTopics skills={skills} topics={topics} />
            
            <div>
              <h2 className="text-xl font-bold mb-4">About</h2>
              <div className="prose max-w-none">
                <p>
                  👋 Hi there! I'm passionate about helping others succeed in their product management journey. 
                  With 15+ years of experience leading product teams at companies like Google, Amazon, and several 
                  successful startups, I've developed a deep understanding of what it takes to build great products 
                  and grow in your PM career. 🚀
                </p>
                <p className="mt-4">
                  🎯 My mentoring style is practical and results-oriented. I believe in learning by doing and 
                  will help you apply proven frameworks to your specific challenges. Whether you're looking to 
                  break into product management, level up in your current role, or build better products, I'm 
                  here to help!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <BookOption
              litePlan={litePlan}
              standardPlan={standardPlan}
              onApply={handleApply}
            />
            
            <Button variant="secondary" className="w-full">
              View one-off sessions
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <MentorListByCategory
            title="Similar Product Mentors"
            mentors={suggestedMentors}
            onSeeAll={() => console.log('Navigate to see all mentors')}
          />
        </div>
      </div>
    </div>
  );
};