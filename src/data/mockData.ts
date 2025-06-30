import { BlogPost, Comment, CategoryInfo } from '@/types/blog';

export interface AuthorProfile {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  email?: string;
  social?: string;
}

export const authors: AuthorProfile[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    bio: 'Sarah is a passionate artist and storyteller, sharing the hidden stories behind urban art.',
    avatarUrl: '',
    email: 'sarah@example.com',
    social: 'https://twitter.com/sarahchen'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    bio: 'Marcus writes about books, literature, and the power of reading in the digital age.',
    avatarUrl: '',
    email: 'marcus@example.com',
    social: 'https://twitter.com/marcusjohnson'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    bio: 'Elena explores culture, travel, and the vibrant spirit of traditional markets.',
    avatarUrl: '',
    email: 'elena@example.com',
    social: 'https://twitter.com/elenarodriguez'
  },
  {
    id: '4',
    name: 'Dr. Maya Patel',
    bio: 'Dr. Patel shares insights on health, nutrition, and mindful living.',
    avatarUrl: '',
    email: 'maya@example.com',
    social: 'https://twitter.com/drmayapatel'
  },
  {
    id: '5',
    name: 'David Kim',
    bio: 'David analyzes community-led innovation and social change.',
    avatarUrl: '',
    email: 'david@example.com',
    social: 'https://twitter.com/davidkim'
  }
];

export const categories: CategoryInfo[] = [
  {
    name: 'Art',
    description: 'Exploring creativity, expression, and the human spirit through visual arts',
    color: 'bg-blue-100 text-blue-800',
    slug: 'art'
  },
  {
    name: 'Books',
    description: 'Literary journeys, book reviews, and the power of storytelling',
    color: 'bg-green-100 text-green-800',
    slug: 'books'
  },
  {
    name: 'Culture and Tourism',
    description: 'Discovering diverse cultures, traditions, and travel experiences',
    color: 'bg-purple-100 text-purple-800',
    slug: 'culture-and-tourism'
  },
  {
    name: 'Health and Nutrition',
    description: 'Wellness, nutrition, and living a balanced life',
    color: 'bg-orange-100 text-orange-800',
    slug: 'health-and-nutrition'
  },
  {
    name: 'Analysis',
    description: 'Deep dives into current events, trends, and thoughtful perspectives',
    color: 'bg-red-100 text-red-800',
    slug: 'analysis'
  },
  {
    name: 'Sustainability and Environment',
    description: 'Insights, stories, and solutions for a greener, more sustainable world',
    color: 'bg-emerald-100 text-emerald-800',
    slug: 'sustainability-and-environment'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Hidden Stories Behind Street Art',
    excerpt: 'How anonymous artists are transforming urban landscapes and telling untold stories through their work.',
    content: `Street art has long been considered a form of rebellion, but what if we looked at it as a form of storytelling? In cities around the world, anonymous artists are using walls as their canvas to share stories that might otherwise go unheard.

From political statements to personal narratives, street art has become a powerful medium for expression. These artists, often working under the cover of darkness, create pieces that speak to the heart of their communities.

The beauty of street art lies in its accessibility. Unlike traditional galleries that can feel intimidating or exclusive, street art is available to everyone who walks by. It democratizes art and makes powerful statements accessible to all.

In this piece, we explore the stories behind some of the most compelling street art pieces and the artists who create them. We'll look at how these works reflect the social and political climate of their time, and how they serve as a voice for the voiceless.

The next time you walk through your city, take a moment to look at the walls around you. You might just find a story waiting to be discovered.`,
    author: 'Sarah Chen',
    category: 'Art',
    publishedAt: '2024-01-15',
    imageUrl: '/images/street-art.jpg',
    readTime: 5,
    tags: ['street art', 'urban culture', 'social commentary']
  },
  {
    id: '2',
    title: 'The Power of Reading in the Digital Age',
    excerpt: 'Why physical books still matter in our increasingly digital world and how they shape our thinking.',
    content: `In an era where information is available at the swipe of a finger, the act of reading a physical book has become something of a luxury. But it's a luxury worth preserving.

There's something inherently different about reading a physical book versus scrolling through text on a screen. The tactile experience of turning pages, the smell of paper and ink, the weight of the book in your hands – all of these elements contribute to a more immersive reading experience.

Studies have shown that reading physical books leads to better comprehension and retention compared to reading on screens. The physical act of turning pages helps our brains process information more effectively, and the lack of digital distractions allows us to focus more deeply on the content.

But beyond the cognitive benefits, there's something deeply human about the experience of reading a physical book. It connects us to centuries of human knowledge and storytelling, reminding us that we're part of a larger conversation that spans generations.

In this digital age, let's not forget the simple pleasure of curling up with a good book. It might just be the most revolutionary act of all.`,
    author: 'Marcus Johnson',
    category: 'Books',
    publishedAt: '2024-01-12',
    imageUrl: '/images/books.jpg',
    readTime: 4,
    tags: ['reading', 'digital age', 'literature', 'mindfulness']
  },
  {
    id: '3',
    title: 'A Journey Through Traditional Markets',
    excerpt: 'Exploring the vibrant culture and community spirit found in traditional markets around the world.',
    content: `Traditional markets are more than just places to buy goods – they're living museums of culture, community, and human connection. From the bustling souks of Marrakech to the colorful markets of Bangkok, these spaces tell the story of their communities.

In traditional markets, you'll find more than just products. You'll find stories, traditions, and a sense of belonging that's increasingly rare in our modern, digital world. Vendors who have been selling in the same spot for generations, customers who have been coming to the same stalls for years, and the rich tapestry of human interaction that makes these places so special.

The sights, sounds, and smells of traditional markets create an immersive experience that can't be replicated online. The haggling, the sampling, the personal connections – all of these elements contribute to a shopping experience that's about more than just consumption.

In this piece, we'll take you on a journey through some of the world's most fascinating traditional markets, exploring their history, their culture, and the people who make them come alive.`,
    author: 'Elena Rodriguez',
    category: 'Culture and Tourism',
    publishedAt: '2024-01-10',
    imageUrl: '/images/markets.jpg',
    readTime: 6,
    tags: ['travel', 'culture', 'markets', 'community']
  },
  {
    id: '4',
    title: 'The Science of Mindful Eating',
    excerpt: 'How paying attention to what and how we eat can transform our relationship with food and improve our health.',
    content: `In our fast-paced world, eating has become something we do on autopilot. We eat while working, watching TV, or scrolling through our phones, barely registering what we're putting in our mouths.

But what if we approached eating with the same mindfulness we bring to meditation or yoga? Mindful eating is about bringing awareness to the entire eating experience – from the moment we decide what to eat to the moment we finish our meal.

The benefits of mindful eating are numerous. It can help us make better food choices, eat less, and enjoy our food more. It can also help us develop a healthier relationship with food and our bodies.

Mindful eating isn't about dieting or restriction. It's about paying attention, being present, and honoring the food we eat and the bodies we nourish. It's about slowing down and savoring each bite.

In this article, we'll explore the science behind mindful eating and provide practical tips for incorporating this practice into your daily life.`,
    author: 'Dr. Maya Patel',
    category: 'Health and Nutrition',
    publishedAt: '2024-01-08',
    imageUrl: '/images/mindful-eating.jpg',
    readTime: 7,
    tags: ['nutrition', 'mindfulness', 'health', 'wellness']
  },
  {
    id: '5',
    title: 'The Rise of Community-Led Innovation',
    excerpt: 'How grassroots movements are driving change and innovation in ways that top-down approaches often miss.',
    content: `Innovation doesn't always come from Silicon Valley or corporate boardrooms. Some of the most impactful innovations are happening in communities, driven by people who understand their local needs and challenges.

Community-led innovation is about solving problems from the ground up. It's about people coming together to address the issues that affect them directly, using their local knowledge and resources to create solutions that work for their specific context.

From community gardens that address food insecurity to local renewable energy projects that reduce dependence on fossil fuels, community-led initiatives are showing us what's possible when people work together.

These projects often start small but can have ripple effects that extend far beyond their immediate impact. They demonstrate the power of collective action and the importance of local knowledge in solving complex problems.

In this analysis, we'll look at several examples of community-led innovation and explore what makes these initiatives successful. We'll also discuss how these grassroots movements can inspire larger-scale change.`,
    author: 'David Kim',
    category: 'Analysis',
    publishedAt: '2024-01-05',
    imageUrl: '/images/community-innovation.jpg',
    readTime: 8,
    tags: ['innovation', 'community', 'social change', 'sustainability']
  }
];

export const comments: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: 'Alex Thompson',
    content: 'This article really opened my eyes to the stories behind street art. I never realized how much thought and meaning goes into these pieces.',
    createdAt: '2024-01-16',
    email: 'alex@example.com',
    status: 'approved'
  },
  {
    id: '2',
    postId: '1',
    author: 'Maria Garcia',
    content: 'I love how street art can tell stories that might otherwise go unheard. It\'s such a powerful form of expression.',
    createdAt: '2024-01-17',
    email: 'maria@example.com',
    status: 'approved'
  },
  {
    id: '3',
    postId: '2',
    author: 'James Wilson',
    content: 'I completely agree about the power of physical books. There\'s something magical about holding a book in your hands.',
    createdAt: '2024-01-13',
    email: 'james@example.com',
    status: 'pending'
  },
  {
    id: '4',
    postId: '3',
    author: 'Lisa Chen',
    content: 'Traditional markets are truly amazing places. I love the sense of community and culture you find there.',
    createdAt: '2024-01-11',
    email: 'lisa@example.com',
    status: 'approved'
  },
  {
    id: '5',
    postId: '4',
    author: 'Robert Davis',
    content: 'Mindful eating has completely changed my relationship with food. Great article!',
    createdAt: '2024-01-09',
    email: 'robert@example.com',
    status: 'rejected'
  }
]; 