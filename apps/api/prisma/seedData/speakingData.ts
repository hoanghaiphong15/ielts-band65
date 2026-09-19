export interface SeedSpeakingPrompt {
  part: 1 | 2 | 3;
  topic: string;
  topicVi: string;
  question: string;
  questionVi: string;
  cues?: string[];
  followUps?: string[];
  usefulPhrases: string[];
  modelAnswer: string;
}

export const SPEAKING_SEED_DATA: SeedSpeakingPrompt[] = [
  // --- PART 1: 30 Questions across 10 Topics ---
  // Topic 1: Work or Study (3 questions)
  {
    part: 1,
    topic: 'Work or Study',
    topicVi: 'Công việc hoặc Học tập',
    question: 'Are you currently studying or working?',
    questionVi: 'Hiện tại bạn đang đi học hay đi làm?',
    usefulPhrases: ['major in', 'tertiary education', 'pursuing a degree', 'academic curriculum'],
    modelAnswer: 'At present, I am an undergraduate student majoring in Information Technology at a national university. My coursework is quite demanding, involving a rigorous mix of theoretical computer science and hands-on software development projects.',
  },
  {
    part: 1,
    topic: 'Work or Study',
    topicVi: 'Công việc hoặc Học tập',
    question: 'Why did you choose that particular field of study?',
    questionVi: 'Tại sao bạn lại chọn ngành học đó?',
    usefulPhrases: ['fascinated by', 'career prospects', 'innovative industry', 'aligns with my passion'],
    modelAnswer: 'Well, ever since high school, I have been deeply fascinated by how software can automate mundane tasks and solve complex real-world problems. Moreover, the tech industry offers exceptional career prospects and abundant opportunities for continuous learning.',
  },
  {
    part: 1,
    topic: 'Work or Study',
    topicVi: 'Công việc hoặc Học tập',
    question: 'Do you prefer studying alone or in a group?',
    questionVi: 'Bạn thích học một mình hay học theo nhóm hơn?',
    usefulPhrases: ['uninterrupted focus', 'absorb abstract concepts', 'collaborative brainstorming'],
    modelAnswer: 'It really depends on the task at hand. When I need to grasp complex theoretical concepts, I strongly prefer studying in solitude because it allows for deep, uninterrupted concentration. However, when working on software design, group collaboration is far more fruitful.',
  },

  // Topic 2: Hometown (3 questions)
  {
    part: 1,
    topic: 'Hometown',
    topicVi: 'Quê hương / Nơi sinh sống',
    question: 'Where is your hometown located?',
    questionVi: 'Quê hương của bạn ở đâu?',
    usefulPhrases: ['situated in', 'bustling metropolitan hub', 'rich cultural heritage'],
    modelAnswer: 'I was born and raised in Da Nang, which is a coastal city situated in central Vietnam. It is widely renowned for its stunning sandy beaches, picturesque bridges, and vibrant local gastronomy.',
  },
  {
    part: 1,
    topic: 'Hometown',
    topicVi: 'Quê hương / Nơi sinh sống',
    question: 'What do you like most about living there?',
    questionVi: 'Bạn thích điều gì nhất khi sống ở đó?',
    usefulPhrases: ['relaxed pace of life', 'hospitable residents', 'breathtaking scenery', 'culinary delights'],
    modelAnswer: 'What appeals to me most is the harmonious balance between modern infrastructure and natural serenity. Unlike larger capitals with relentless traffic, my city offers a relaxed pace of life, friendly residents, and easy access to mountains and the sea.',
  },
  {
    part: 1,
    topic: 'Hometown',
    topicVi: 'Quê hương / Nơi sinh sống',
    question: 'Has your hometown changed significantly in recent years?',
    questionVi: 'Quê hương của bạn có thay đổi nhiều trong những năm gần đây không?',
    usefulPhrases: ['undergone a transformation', 'skyline dominated by', 'economic development', 'rapid modernization'],
    modelAnswer: 'Absolutely, it has undergone a dramatic transformation over the past decade. Numerous high-rise hotels and shopping complexes have sprouted up along the coastline, transforming it into a major international tourist destination.',
  },

  // Topic 3: Free Time & Hobbies (3 questions)
  {
    part: 1,
    topic: 'Free Time & Hobbies',
    topicVi: 'Thời gian rảnh & Sở thích',
    question: 'What do you usually do in your spare time?',
    questionVi: 'Bạn thường làm gì vào thời gian rảnh?',
    usefulPhrases: ['unwind after', 'engrossed in', 'recreational activities', 'recharge my batteries'],
    modelAnswer: 'In my spare time, I typically immerse myself in reading non-fiction books, particularly psychology and economics. Occasionally, I also enjoy cycling around the local park in the late afternoon to unwind and recharge my batteries.',
  },
  {
    part: 1,
    topic: 'Free Time & Hobbies',
    topicVi: 'Thời gian rảnh & Sở thích',
    question: 'Did you have different hobbies when you were a child?',
    questionVi: 'Khi còn nhỏ bạn có sở thích khác không?',
    usefulPhrases: ['fond of', 'outdoor pursuits', 'digital pastimes', 'playful activities'],
    modelAnswer: 'Yes, definitely. As a child, I was predominantly engaged in outdoor games like hide-and-seek and playing football in the neighborhood with friends. Nowadays, my hobbies are more solitary and centered around reading and digital pursuits.',
  },
  {
    part: 1,
    topic: 'Free Time & Hobbies',
    topicVi: 'Thời gian rảnh & Sở thích',
    question: 'Do you think hobbies are important for young adults?',
    questionVi: 'Bạn có nghĩ sở thích là quan trọng đối với người trẻ tuổi không?',
    usefulPhrases: ['relieve stress', 'healthy outlet', 'counterbalance', 'prevent burnout'],
    modelAnswer: 'Undoubtedly. In today\'s competitive academic and workplace environment, having a creative hobby acts as a healthy psychological outlet. It provides an indispensable counterbalance to daily stress and prevents emotional burnout.',
  },

  // Topic 4: Technology & Social Media (3 questions)
  {
    part: 1,
    topic: 'Technology & Social Media',
    topicVi: 'Công nghệ & Mạng xã hội',
    question: 'How much time do you spend on your smartphone each day?',
    questionVi: 'Bạn dành bao nhiêu thời gian cho điện thoại thông minh mỗi ngày?',
    usefulPhrases: ['screen time', 'indispensable gadget', 'moderate usage', 'digital dependency'],
    modelAnswer: 'To be honest, I probably spend around four to five hours daily on my phone. While a significant portion is dedicated to academic communication and reading news, I do occasionally get sidetracked by social media algorithms.',
  },
  {
    part: 1,
    topic: 'Technology & Social Media',
    topicVi: 'Công nghệ & Mạng xã hội',
    question: 'Which social media platform do you find most useful?',
    questionVi: 'Nền tảng mạng xã hội nào bạn thấy hữu ích nhất?',
    usefulPhrases: ['keep abreast of', 'networking tool', 'educational channels', 'curated content'],
    modelAnswer: 'I would say LinkedIn is the most beneficial for me right now. Unlike entertainment-focused apps, it allows me to connect with industry professionals, follow tech discussions, and discover internship opportunities.',
  },
  {
    part: 1,
    topic: 'Technology & Social Media',
    topicVi: 'Công nghệ & Mạng xã hội',
    question: 'Do you ever take a break from digital devices?',
    questionVi: 'Bạn có bao giờ tạm ngừng sử dụng các thiết bị số không?',
    usefulPhrases: ['digital detox', 'unplug completely', 'mental clarity', 'reconnect with nature'],
    modelAnswer: 'Yes, on weekends, I deliberately practice a mini digital detox. I turn off notifications for an entire afternoon and go for a long walk without headphones to cultivate mental clarity and reconnect with the real world.',
  },

  // Topic 5: Music (3 questions)
  {
    part: 1,
    topic: 'Music',
    topicVi: 'Âm nhạc',
    question: 'What genre of music do you enjoy listening to?',
    questionVi: 'Bạn thích nghe thể loại nhạc nào?',
    usefulPhrases: ['eclectic taste', 'soothing melodies', 'instrumental soundtracks', 'uplifting beats'],
    modelAnswer: 'I have quite an eclectic taste in music, but I mostly lean toward acoustic indie and instrumental piano. When studying, I find lo-fi and classical melodies particularly soothing because they don\'t have distracting lyrics.',
  },
  {
    part: 1,
    topic: 'Music',
    topicVi: 'Âm nhạc',
    question: 'Can you play any musical instruments?',
    questionVi: 'Bạn có biết chơi nhạc cụ nào không?',
    usefulPhrases: ['tried my hand at', 'acoustic guitar', 'musical proficiency', 'play basic chords'],
    modelAnswer: 'I tried my hand at the acoustic guitar during high school. Although I haven\'t achieved advanced proficiency, I can still strum basic chords to accompany my favorite ballads when hanging out with close friends.',
  },
  {
    part: 1,
    topic: 'Music',
    topicVi: 'Âm nhạc',
    question: 'Do you prefer live concerts or listening to recorded music at home?',
    questionVi: 'Bạn thích xem hòa nhạc trực tiếp hay nghe nhạc thu âm ở nhà hơn?',
    usefulPhrases: ['electrifying atmosphere', 'intimate experience', 'sound fidelity', 'unmatched energy'],
    modelAnswer: 'Both have distinct appeals, but nothing quite compares to the electrifying atmosphere of a live concert. The collective energy of thousands of fans singing along creates unforgettable, goosebump-inducing memories.',
  },

  // Topic 6: Reading & Books (3 questions)
  {
    part: 1,
    topic: 'Reading & Books',
    topicVi: 'Đọc sách & Văn hóa đọc',
    question: 'Do you prefer reading physical printed books or e-books?',
    questionVi: 'Bạn thích đọc sách giấy hay sách điện tử hơn?',
    usefulPhrases: ['tactile sensation', 'portability and convenience', 'e-ink display', 'stored in one device'],
    modelAnswer: 'While I appreciate the nostalgic tactile sensation and smell of physical paper, I predominantly read on an e-reader nowadays due to its sheer portability. Being able to carry an entire library in a lightweight device is unbeatable.',
  },
  {
    part: 1,
    topic: 'Reading & Books',
    topicVi: 'Đọc sách & Văn hóa đọc',
    question: 'What was your favorite book when you were growing up?',
    questionVi: 'Cuốn sách yêu thích của bạn khi lớn lên là gì?',
    usefulPhrases: ['captivated my imagination', 'literary masterpiece', 'childhood favorite', 'sparked my love for'],
    modelAnswer: 'Growing up, I was thoroughly captivated by the Harry Potter series. The intricate world-building and themes of friendship and courage sparked my enduring love for reading in English.',
  },
  {
    part: 1,
    topic: 'Reading & Books',
    topicVi: 'Đọc sách & Văn hóa đọc',
    question: 'Do you think young people read enough books nowadays?',
    questionVi: 'Bạn có nghĩ giới trẻ ngày nay đọc đủ sách không?',
    usefulPhrases: ['fragmented attention spans', 'short-form video content', 'deep reading habit', 'cognitive decline'],
    modelAnswer: 'Unfortunately, I feel that traditional deep reading has declined among youth. The ubiquity of short-form videos like TikTok has fragmented attention spans, making it challenging for many young people to sit through a lengthy book.',
  },

  // Topic 7: Weather & Seasons (3 questions)
  {
    part: 1,
    topic: 'Weather & Seasons',
    topicVi: 'Thời tiết & Các mùa',
    question: 'What is your favorite type of weather?',
    questionVi: 'Thời tiết yêu thích của bạn là gì?',
    usefulPhrases: ['crisp autumn breeze', 'mild and temperate', 'overcast skies', 'pleasantly cool'],
    modelAnswer: 'My favorite weather is a crisp, cool autumn morning when the sky is slightly overcast and there is a gentle breeze. It creates a serene ambiance that is ideal for either outdoor walks or cozy indoor study sessions.',
  },
  {
    part: 1,
    topic: 'Weather & Seasons',
    topicVi: 'Thời tiết & Các mùa',
    question: 'Does the weather affect your mood or productivity?',
    questionVi: 'Thời tiết có ảnh hưởng đến tâm trạng hoặc năng suất của bạn không?',
    usefulPhrases: ['gloomy and overcast', 'lethargic and sluggish', 'sunny disposition', 'boosts my energy levels'],
    modelAnswer: 'Certainly. When it is persistently gloomy and rainy for consecutive days, I tend to feel somewhat lethargic. On the contrary, bright sunshine immediately elevates my mood and gives me a noticeable boost in productivity.',
  },
  {
    part: 1,
    topic: 'Weather & Seasons',
    topicVi: 'Thời tiết & Các mùa',
    question: 'Do you check the weather forecast regularly?',
    questionVi: 'Bạn có thường xuyên xem dự báo thời tiết không?',
    usefulPhrases: ['indispensable habit', 'unpredictable showers', 'plan my commute', 'meteorological updates'],
    modelAnswer: 'Yes, checking the meteorological forecast on my phone every morning has become second nature. Because tropical rain showers can be sudden and intense, knowing whether to pack a raincoat is essential.',
  },

  // Topic 8: Food & Cooking (3 questions)
  {
    part: 1,
    topic: 'Food & Cooking',
    topicVi: 'Ẩm thực & Nấu ăn',
    question: 'Can you cook, and how often do you cook your own meals?',
    questionVi: 'Bạn có biết nấu ăn không và bạn tự nấu thường xuyên như thế nào?',
    usefulPhrases: ['culinary skills', 'prepare home-cooked meals', 'therapeutic activity', 'wholesome ingredients'],
    modelAnswer: 'Yes, I cook on a daily basis. Preparing home-cooked meals is not only significantly more economical and healthier, but I also find the process of chopping vegetables and seasoning dishes remarkably therapeutic.',
  },
  {
    part: 1,
    topic: 'Food & Cooking',
    topicVi: 'Ẩm thực & Nấu ăn',
    question: 'What is a popular traditional dish in your country?',
    questionVi: 'Một món ăn truyền thống nổi tiếng ở đất nước bạn là gì?',
    usefulPhrases: ['quintessential delicacy', 'aromatic broth', 'culinary heritage', 'garnished with fresh herbs'],
    modelAnswer: 'The quintessential Vietnamese delicacy is undoubtedly Pho—a fragrant beef noodle soup simmered with star anise, cinnamon, and ginger, served with tender beef slices and garnished with fresh cilantro and lime.',
  },
  {
    part: 1,
    topic: 'Food & Cooking',
    topicVi: 'Ẩm thực & Nấu ăn',
    question: 'Do you prefer dining at home or eating out at restaurants?',
    questionVi: 'Bạn thích ăn ở nhà hay ăn ở nhà hàng hơn?',
    usefulPhrases: ['intimate and cozy', 'special occasions', 'sample exotic cuisines', 'nutritional value'],
    modelAnswer: 'For routine daily sustenance, I prefer eating at home because I can monitor the nutritional quality. However, for weekend celebrations with friends, dining out allows us to sample diverse international cuisines without the hassle of washing up.',
  },

  // Topic 9: Sport & Physical Exercise (3 questions)
  {
    part: 1,
    topic: 'Sport & Physical Exercise',
    topicVi: 'Thể thao & Hoạt động thể chất',
    question: 'What kind of sports or physical activities do you participate in?',
    questionVi: 'Bạn tham gia môn thể thao hoặc hoạt động thể chất nào?',
    usefulPhrases: ['cardiovascular fitness', 'swimming laps', 'badminton court', 'maintain physical stamina'],
    modelAnswer: 'I regularly play badminton twice a week with university classmates. It is an exhilarating, fast-paced sport that sharpens reflexes and offers a fantastic cardiovascular workout.',
  },
  {
    part: 1,
    topic: 'Sport & Physical Exercise',
    topicVi: 'Thể thao & Hoạt động thể chất',
    question: 'Do you prefer individual sports or team sports?',
    questionVi: 'Bạn thích các môn thể thao cá nhân hay thể thao đồng đội hơn?',
    usefulPhrases: ['camaraderie and teamwork', 'personal milestone', 'collective victory', 'shared enthusiasm'],
    modelAnswer: 'I lean toward team sports because of the camaraderie and collective spirit. Working together toward a shared victory and supporting each other through defeats strengthens interpersonal bonds in a unique way.',
  },
  {
    part: 1,
    topic: 'Sport & Physical Exercise',
    topicVi: 'Thể thao & Hoạt động thể chất',
    question: 'Did you participate in sports when you were at school?',
    questionVi: 'Bạn có tham gia thể thao khi còn đi học không?',
    usefulPhrases: ['compulsory physical education', 'track and field events', 'sports festival', 'spirited matches'],
    modelAnswer: 'Yes, sports were an integral part of my secondary school routine. Beyond compulsory physical education classes, I frequently represented my class in annual sprint and football tournaments during sports day festivals.',
  },

  // Topic 10: Travel & Holidays (3 questions)
  {
    part: 1,
    topic: 'Travel & Holidays',
    topicVi: 'Du lịch & Các kỳ nghỉ',
    question: 'Do you enjoy traveling, and where have you traveled recently?',
    questionVi: 'Bạn có thích đi du lịch không và gần đây bạn đã đi đâu?',
    usefulPhrases: ['broaden my horizon', 'breathtaking landscapes', 'cultural immersion', 'escaped the bustle'],
    modelAnswer: 'I am an enthusiastic traveler. Last summer, I took a solo backpacking trip to the northern mountains of Sapa, where I trekked through picturesque terraced rice paddies and experienced rich ethnic cultural traditions.',
  },
  {
    part: 1,
    topic: 'Travel & Holidays',
    topicVi: 'Du lịch & Các kỳ nghỉ',
    question: 'Do you prefer traveling alone or with friends/family?',
    questionVi: 'Bạn thích đi du lịch một mình hay với bạn bè/gia đình hơn?',
    usefulPhrases: ['unfettered spontaneity', 'cherished memories', 'shared laughter', 'compromise on itinerary'],
    modelAnswer: 'Traveling with companions is wonderful for creating cherished memories, but solo travel offers unfettered spontaneity. You can alter your itinerary on a whim without having to negotiate every single decision.',
  },
  {
    part: 1,
    topic: 'Travel & Holidays',
    topicVi: 'Du lịch & Các kỳ nghỉ',
    question: 'What is your dream holiday destination for the future?',
    questionVi: 'Điểm đến kỳ nghỉ mơ ước trong tương lai của bạn là gì?',
    usefulPhrases: ['on my bucket list', 'majestic fjords', 'witness the aurora borealis', 'unspoiled wilderness'],
    modelAnswer: 'Top of my bucket list is Norway. I have always dreamed of witnessing the majestic aurora borealis dancing across the Arctic winter sky and cruising through its deep, pristine fjords.',
  },

  // --- PART 2: 20 CUE CARDS ---
  {
    part: 2,
    topic: 'An Influential Person',
    topicVi: 'Một người có ảnh hưởng lớn',
    question: 'Describe a person who has had a significant positive influence on your life.\nYou should say:\n- Who this person is\n- How you first met or know them\n- What special qualities they possess\n- And explain why they have had such an impact on you.',
    questionVi: 'Mô tả một người có ảnh hưởng tích cực lớn đến cuộc sống của bạn.\nBạn nên nói:\n- Người này là ai\n- Bạn quen họ như thế nào\n- Họ có những phẩm chất đặc biệt gì\n- Và giải thích tại sao họ lại có tác động lớn đến bạn.',
    cues: [
      'Who this person is',
      'How you first met or know them',
      'What special qualities they possess',
      'Explain why they have had such an impact on you',
    ],
    usefulPhrases: [
      'exemplary role model',
      'unwavering perseverance',
      'instilled in me a passion for',
      'resilience in the face of adversity',
      'profoundly shaped my worldview',
    ],
    modelAnswer: 'I would like to talk about my high school physics teacher, Mr. Nam, who has had an indelible influence on my intellectual and personal development.\n\nI first met him when I entered tenth grade. Back then, physics was an intimidating subject for me, filled with abstract mathematical formulas that seemed completely disconnected from daily life. However, Mr. Nam completely transformed my perspective. What set him apart was his innovative pedagogy; he never relied on dry lectures or rote memorization. Instead, he constantly designed fascinating laboratory demonstrations, turning complex electromagnetic concepts into interactive problem-solving games.\n\nBeyond his academic expertise, Mr. Nam possessed remarkable patience and empathy. He noticed whenever a student was struggling and would dedicate his lunch breaks to clarifying tricky problems without judgment. Most importantly, he taught us resilience in the face of failure, often reminding us that every failed experiment is simply an empirical step toward deeper discovery.\n\nHis mentorship profoundly impacted me because it sparked my passion for scientific inquiry and taught me how to approach problems with a rigorous, analytical mindset. To this day, whenever I encounter daunting obstacles in my university studies, I draw inspiration from his unwavering perseverance.',
  },
  {
    part: 2,
    topic: 'An Environmental Problem',
    topicVi: 'Một vấn đề môi trường',
    question: 'Describe an environmental issue in your country that concerns you.\nYou should say:\n- What the issue is\n- What causes it\n- How it affects people\'s daily lives\n- And explain what measures should be taken to solve it.',
    questionVi: 'Mô tả một vấn đề môi trường ở nước bạn khiến bạn lo ngại.\nBạn nên nói:\n- Vấn đề đó là gì\n- Nguyên nhân do đâu\n- Nó ảnh hưởng thế nào đến đời sống người dân\n- Và giải thích những biện pháp nào cần được áp dụng để giải quyết.',
    cues: [
      'What the issue is',
      'What causes it',
      'How it affects people\'s daily lives',
      'Explain what measures should be taken to solve it',
    ],
    usefulPhrases: [
      'airborne particulate matter',
      'exhaust fumes from motorbikes',
      'respiratory ailments',
      'stringent emission standards',
      'electrify public transit',
    ],
    modelAnswer: 'An environmental issue that causes me immense concern in Vietnam is severe air pollution, particularly in major urban centers like Hanoi and Ho Chi Minh City.\n\nThis crisis is largely attributable to the overwhelming volume of motorized vehicles, predominantly millions of gasoline motorbikes and diesel trucks emitting untreated exhaust fumes daily. Rapid construction booms with inadequate dust containment and coal-fired industrial factories surrounding the urban perimeter further exacerbate airborne particulate matter, specifically PM2.5.\n\nThis pollution directly degrades the daily lives of citizens. On high-smog days, a dense brownish haze blankets the cityscape, reducing visibility and forcing people to stay indoors. More alarmingly, prolonged exposure has led to an alarming surge in chronic respiratory ailments, asthma, and cardiovascular complications, particularly among children and the elderly.\n\nTo tackle this dilemma, authorities must implement decisive measures. First, we need to expedite the electrification of public transportation by deploying electric bus fleets and completing metro lines. Second, the government should enforce strict vehicular emission inspections and mandate dust-control barriers on all construction sites. Finally, investing in urban tree canopies and green parks would help naturally absorb pollutants and revitalize urban air quality.',
  },
  {
    part: 2,
    topic: 'A Difficult Decision',
    topicVi: 'Một quyết định khó khăn',
    question: 'Describe a difficult decision that you had to make in your life.\nYou should say:\n- What the decision was\n- When and why you had to make it\n- What options you considered\n- And explain how you felt after making the decision.',
    questionVi: 'Mô tả một quyết định khó khăn mà bạn đã phải đưa ra.\nBạn nên nói:\n- Quyết định đó là gì\n- Khi nào và tại sao bạn phải đưa ra\n- Những lựa chọn bạn đã cân nhắc\n- Và giải thích cảm xúc sau khi quyết định.',
    cues: [
      'What the decision was',
      'When and why you had to make it',
      'What options you considered',
      'Explain how you felt after making the decision',
    ],
    usefulPhrases: [
      'crossroads in my life',
      'weighed the pros and cons',
      'leap of faith',
      'steep learning curve',
      'retrospectively rewarding',
    ],
    modelAnswer: 'A pivotal and difficult decision I had to make was choosing my university major after graduating from high school two years ago.\n\nAt that time, I found myself standing at a crucial crossroads. On one hand, my parents strongly urged me to study international business or accounting, as those were considered secure, traditional career paths with stable corporate employment in Vietnam. On the other hand, my genuine passion lay in software engineering and data science—a rapidly evolving field that is notoriously demanding and competitive.\n\nFor weeks, I wrestled with these contrasting paths, meticulously weighing the pros and cons. I sought counsel from industry professionals and current university students to evaluate long-term market trends. Ultimately, I decided to take a leap of faith and follow my own intuition by enrolling in the computer science program, even though it meant stepping out of my comfort zone and tackling rigorous mathematics.\n\nImmediately after making the decision, I felt a tremendous sense of relief coupled with nervous excitement. Although the curriculum has indeed presented a steep learning curve, I have never regretted my choice. Retrospectively, taking ownership of my future taught me independence and confidence in my own judgment.',
  },

  // --- PART 3: 20 IN-DEPTH DISCUSSION QUESTIONS ---
  {
    part: 3,
    topic: 'Education and Mentorship',
    topicVi: 'Giáo dục và Người hướng dẫn',
    question: 'How do you think teaching methodologies have changed over the past few decades?',
    questionVi: 'Bạn nghĩ các phương pháp giảng dạy đã thay đổi như thế nào trong vài thập kỷ qua?',
    usefulPhrases: ['rote memorization', 'student-centered learning', 'collaborative inquiry', 'integrate multimedia'],
    modelAnswer: 'Teaching methodologies have undergone a paradigm shift from teacher-centric rote memorization toward student-centered, inquiry-based learning. Decades ago, students were passive recipients of textbook knowledge. Today, modern pedagogy emphasizes collaborative projects, digital simulations, and critical thinking, encouraging learners to question assumptions rather than simply absorb facts.',
  },
  {
    part: 3,
    topic: 'Urban Planning and Sustainability',
    topicVi: 'Quy hoạch đô thị và Tính bền vững',
    question: 'What are the main challenges cities face when attempting to transition to sustainable infrastructure?',
    questionVi: 'Những thách thức chính mà các thành phố gặp phải khi cố gắng chuyển đổi sang cơ sở hạ tầng bền vững là gì?',
    usefulPhrases: ['capital expenditure', 'retrofitting legacy systems', 'public resistance', 'intermodal integration'],
    modelAnswer: 'The primary hurdle is the colossal capital expenditure required to retrofit legacy urban systems. Replacing underground utilities, laying light rail tracks, and installing renewable microgrids involve enormous municipal debts and commercial disruption. Furthermore, urban planners often encounter public resistance when implementing policies like congestion charges or eliminating street parking in favor of bike lanes.',
  },
  {
    part: 3,
    topic: 'Technology and Employment',
    topicVi: 'Công nghệ và Việc làm',
    question: 'Do you believe automation and AI will result in net job losses, or will they create new employment opportunities?',
    questionVi: 'Bạn có tin rằng tự động hóa và AI sẽ dẫn đến mất việc làm ròng, hay chúng sẽ tạo ra những cơ hội việc làm mới?',
    usefulPhrases: ['creative destruction', 'displace routine labor', 'upskill the workforce', 'emerging industries'],
    modelAnswer: 'I subscribe to the economic concept of creative destruction. While automated algorithms and robotics will inevitably displace routine manual and administrative roles, historical technological revolutions show that new sectors simultaneously emerge. However, the critical challenge lies in the transitional friction: governments must aggressively upskill displaced workers so they can participate in the emerging data-driven economy.',
  },
];
