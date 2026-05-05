import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, setDoc, doc } from 'firebase/firestore';

export async function seedDatabase() {
  console.log('Seeding database...');

  const categories = [
    { name: "AI Mastery", desc: "រៀនពីរបៀបប្រើប្រាស់ AI ក្នុងជីវភាពរស់នៅ និងការងារប្រចាំថ្ងៃ។", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" },
    { name: "Digital Marketing", desc: "យុទ្ធសាស្ត្រទីផ្សារឌីជីថលបែបទំនើប សម្រាប់បង្កើនការលក់។", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" },
    { name: "Automation Pro", desc: "កាត់បន្ថយការងារដដែលៗតាមរយៈការប្រើប្រាស់ Automation Tools។", img: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=800" },
    { name: "Data Science", desc: "ការវិភាគទិន្នន័យដើម្បីធ្វើការសម្រេចចិត្តក្នុងអាជីវកម្ម។", img: "https://images.unsplash.com/photo-1551288049-bbda3efb102c?auto=format&fit=crop&q=80&w=800" },
    { name: "Soft Skills", desc: "ជំនាញទំនាក់ទំនង ការដឹកនាំ និងការដោះស្រាយបញ្ហា។", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800" },
    { name: "Fullstack Dev", desc: "ក្លាយជាអ្នកបង្កើត Website អាជីពជាមួយ React និង Node.js។", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800" }
  ];

  for (const cat of categories) {
    const course = await addDoc(collection(db, 'courses'), {
      title: `${cat.name} Mastery`,
      description: cat.desc,
      category: cat.name,
      thumbnail: cat.img,
      level: 'All Levels',
      duration: '15 Hours',
      isPublished: true,
      createdAt: serverTimestamp()
    });

    // 2. Create 30 Lessons
    for (let i = 1; i <= 30; i++) {
      await addDoc(collection(db, 'lessons'), {
        courseId: course.id,
        title: `មេរៀនទី ${i}: មូលដ្ឋានគ្រឹះ និងការអនុវត្ត ${cat.name}`,
        content: `### មេរៀនទី ${i}: ការសិក្សាស៊ីជម្រៅលើ ${cat.name}

ស្វាគមន៍មកកាន់ជំហានទី ${i} នៃកម្មវិធីសិក្សារបស់យើង។ នៅក្នុងមេរៀននេះ យើងនឹងផ្តោតទៅលើចំណុចសំខាន់ៗដូចជា៖
1. ការយល់ដឹងពីទ្រឹស្តីបទ ${cat.name} ក្នុងកម្រិតទី ${i}
2. របៀបអនុវត្តជាក់ស្តែងក្នុងអាជីវកម្ម និងការងារ
3. កំហុសឆ្គងដែលគួរចៀសវាង

### សំណួរបញ្ចប់មេរៀន (Lesson Quiz)
តើអ្នកយល់យ៉ាងណាដែរចំពោះការអនុវត្ត ${cat.name} ក្នុងជំហានទី ${i} នេះ? តើវាអាចជួយបង្កើនប្រសិទ្ធភាពការងាររបស់អ្នកយ៉ាងដូចម្តេច?`,
        videoUrl: '', 
        order: i,
        type: 'text',
        duration: '30m',
        createdAt: serverTimestamp()
      });
    }
  }
}

export async function seed20MoreCourses() {
  const extraCourses = [
    { title: "Graphic Design with AI", cat: "Design", desc: "រៀនឌីហ្សាញជាមួយឧបករណ៍ AI ជំនាន់ថ្មី។" },
    { title: "Python for Data Analysis", cat: "Coding", desc: "មូលដ្ឋានគ្រឹះ Python សម្រាប់ការវិភាគទិន្នន័យ។" },
    { title: "E-commerce Management", cat: "Business", desc: "គ្រប់គ្រងហាងលក់ទំនិញអនឡាញឱ្យមានប្រសិទ្ធភាព។" },
    { title: "Cybersecurity Basics", cat: "Technical", desc: "ការពារទិន្នន័យ និងព័ត៌មានផ្ទាល់ខ្លួនលើអ៊ីនធឺណិត។" },
    { title: "Project Management", cat: "Business", desc: "រៀនគ្រប់គ្រងគម្រោងឱ្យទាន់ពេល និងមានគុណភាព។" },
    { title: "Copywriting for Business", cat: "Marketing", desc: "សរសេរអត្ថបទលក់ដែលទាក់ទាញចិត្តអតិថិជន។" },
    { title: "Video Editing Mastery", cat: "Design", desc: "កាត់តវីដេអូអាជីពសម្រាប់ Social Media។" },
    { title: "UI/UX Fundamentals", cat: "Design", desc: "រចនាបទពិសោធន៍អ្នកប្រើប្រាស់សម្រាប់ App និង Web។" },
    { title: "Cloud Computing", cat: "Technical", desc: "ស្វែងយល់ពីបច្ចេកវិទ្យា Cloud និងការប្រើប្រាស់។" },
    { title: "Financial Literacy", cat: "Accounting", desc: "គ្រប់គ្រងហិរញ្ញវត្ថុផ្ទាល់ខ្លួន និងអាជីវកម្ម។" },
    { title: "Public Speaking", cat: "Soft Skills", desc: "បង្កើនទំនុកចិត្តក្នុងការនិយាយជាសាធារណៈ។" },
    { title: "Social Media Marketing", cat: "Marketing", desc: "យុទ្ធសាស្ត្របង្កើន Follower និងការលក់។" },
    { title: "SEO Strategies", cat: "Marketing", desc: "ធ្វើឱ្យ Website របស់អ្នកជាប់ចំណាត់ថ្នាក់លើ Google។" },
    { title: "HR Management", cat: "Business", desc: "ការគ្រប់គ្រងធនធានមនុស្សក្នុងយុគសម័យថ្មី។" },
    { title: "Creative Writing", cat: "Soft Skills", desc: "បញ្ចេញសមត្ថភាពសរសេររឿង និងអត្ថបទច្នៃប្រឌិត។" },
    { title: "App Development", cat: "Coding", desc: "បង្កើត Mobile Application ដំបូងរបស់អ្នក។" },
    { title: "Blockchain Basics", cat: "Technical", desc: "ស្វែងយល់ពីបច្ចេកវិទ្យា Blockchain និង Crypto។" },
    { title: "Photography Essentials", cat: "Design", desc: "បច្ចេកទេសថតរូប និងការកែសម្រួលមូលដ្ឋាន។" },
    { title: "Personal Branding", cat: "Marketing", desc: "កសាងម៉ាកយីហោផ្ទាល់ខ្លួនលើបណ្តាញសង្គម។" },
    { title: "Customer Service Excellence", cat: "Sales", desc: "ផ្តល់សេវាកម្មកម្រិតពិភពលោកដល់អតិថិជន។" }
  ];

  const existingSnapshot = await getDocs(collection(db, 'courses'));
  const existingTitles = new Set(existingSnapshot.docs.map(doc => doc.data().title));

  for (const c of extraCourses) {
    if (!existingTitles.has(c.title)) {
      const course = await addDoc(collection(db, 'courses'), {
        title: c.title,
        description: c.desc,
        category: c.cat,
        thumbnail: `https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}`,
        level: 'Beginner',
        duration: '10 Hours',
        isPublished: true,
        createdAt: serverTimestamp()
      });

      // Add 5 lessons for each
      for (let i = 1; i <= 5; i++) {
        await addDoc(collection(db, 'lessons'), {
          courseId: course.id,
          title: `មេរៀនទី ${i}: ${c.title} Introduction`,
          content: `ខ្លឹមសារមេរៀនទី ${i} អំពី ${c.title}...`,
          order: i,
          type: 'text',
          createdAt: serverTimestamp()
        });
      }
    }
  }
}

async function seedPrompts() {
  const promptsData = [
    // STUDENT
    { title: "រៀបចំកាលវិភាគសិក្សា (Study Planner)", category: "Student", content: "តើអ្នកអាចជួយរៀបចំកាលវិភាគសិក្សាសម្រាប់សប្ដាហ៍នេះបានទេ? ខ្ញុំមានមុខវិជ្ជា [មុខវិជ្ជា១, ២, ៣] ហើយខ្ញុំមានពេលទំនេរនៅចន្លោះម៉ោង [ម៉ោង]។ សូមជួយបែងចែកពេលវេលាឱ្យមានតុល្យភាព និងផ្តល់បច្ចេកទេសសិក្សា Pomodoro ផង។", tags: ["student", "planning", "productivity"] },
    { title: "សង្ខេបមេរៀន (Text Summarizer)", category: "Student", content: "សូមជួយសង្ខេបអត្ថបទខាងក្រោមឱ្យខ្លី ខ្លឹម ហើយងាយយល់បំផុត ជាពិសេសចំណុចឃ្លឹះសំខាន់ៗចំនួន ៥៖\n\n[បញ្ចូលអត្ថបទនៅទីនេះ]", tags: ["student", "summary", "learning"] },
    { title: "ជំនួយការស្រាវជ្រាវ (Research Assistant)", category: "Student", content: "ខ្ញុំកំពុងធ្វើសារណាអំពី [ប្រធានបទ]។ តើអ្នកអាចផ្តល់បញ្ជីនៃប្រភពឯកសារយោងសំខាន់ៗ និងគ្រោងឆ្អឹង (Outline) សម្រាប់ការសរសេរបានទេ?", tags: ["student", "research", "writing"] },
    
    // TEACHER
    { title: "រៀបចំកិច្ចតែងការបង្រៀន (Lesson Plan Maker)", category: "Teacher", content: "សូមជួយរៀបចំកិច្ចតែងការបង្រៀនសម្រាប់សិស្សថ្នាក់ទី [ថ្នាក់] លើមេរៀន [ប្រធានបទ]។ កិច្ចតែងការគួររួមបញ្ចូល៖ វត្ថុបំណង, សកម្មភាពសិក្សា, និងសំណួរបំផុសគំនិត។", tags: ["teacher", "lesson-plan", "education"] },
    { title: "បង្កើតកម្រងសំណួរ (Quiz Generator)", category: "Teacher", content: "សូមបង្កើតសំណួរជ្រើសរើសចម្លើយ (Multiple Choice) ចំនួន ១០ សំណួរអំពី [ប្រធានបទ] សម្រាប់កម្រិត [កម្រិត] រួមជាមួយចម្លើយត្រឹមត្រូវ និងការពន្យល់។", tags: ["teacher", "quiz", "assessment"] },
    
    // BUSINESS
    { title: "យុទ្ធសាស្ត្រអាជីវកម្ម (Business Strategy)", category: "Business", content: "ខ្ញុំចង់ចាប់ផ្តើមអាជីវកម្ម [ប្រភេទអាជីវកម្ម]។ សូមជួយវិភាគ SWOT (Strengths, Weaknesses, Opportunities, Threats) និងផ្តល់យុទ្ធសាស្ត្រទីផ្សារដំបូងសម្រាប់រយៈពេល ៣ ខែ។", tags: ["business", "strategy", "startup"] },
    { title: "សរសេរអ៊ីមែលទាក់ទងដៃគូ (Partnership Outreach)", category: "Business", content: "សូមជួយសរសេរអ៊ីមែលដែលមានលក្ខណៈអាជីព និងទាក់ទាញ ដើម្បីស្នើសុំកិច្ចសហការជាមួយក្រុមហ៊ុន [ឈ្មោះក្រុមហ៊ុន] លើគម្រោង [ឈ្មោះគម្រោង]។", tags: ["business", "email", "communication"] },
    
    // MARKETING
    { title: "បង្កើត Content Plan (Social Media)", category: "Marketing", content: "សូមជួយបង្កើតផែនការផុស Content លើ Facebook និង TikTok សម្រាប់រយៈពេល ១ សប្តាហ៍ សម្រាប់ផលិតផល [ឈ្មោះផលិតផល]។ សូមរួមបញ្ចូល Headline និង Caption ដែលទាក់ទាញ។", tags: ["marketing", "social-media", "content"] },
    { title: "សរសេរការផ្សាយពាណិជ្ជកម្ម (Ad Copywriting)", category: "Marketing", content: "សូមសរសេរ Facebook Ad Copy សម្រាប់ [ផលិតផល] ដែលផ្តោតលើការដោះស្រាយបញ្ហា [បញ្ហារបស់អតិថិជន] និងមាន Call to Action ច្បាស់លាស់។", tags: ["marketing", "ads", "copywriting"] },

    // SALES
    { title: "ការឆ្លើយតបបដិសេធ (Objection Handling)", category: "Sales", content: "អតិថិជននិយាយថា 'តម្លៃថ្លៃពេក'។ តើខ្ញុំគួរឆ្លើយតបយ៉ាងដូចម្តេចដើម្បីបង្ហាញពីគុណតម្លៃរបស់ផលិតផល និងបិទការលក់បានជោគជ័យ?", tags: ["sales", "negotiation", "deals"] },
    { title: "សរសេរ Pitch Deck Script", category: "Sales", content: "សូមជួយរៀបចំ Script សម្រាប់ Pitch ផលិតផល [ឈ្មោះ] រយៈពេល ៣ នាទី ដែលមានចំណុចចាប់ផ្តើមទាក់ទាញ (Hook) និងគុណសម្បត្តិប្រកួតប្រជែង។", tags: ["sales", "pitch", "script"] },

    // ACCOUNTING
    { title: "ការវិភាគរបាយការណ៍ហិរញ្ញវត្ថុ", category: "Accounting", content: "តើអ្នកអាចជួយពន្យល់ពីរបៀបអានតុល្យការ (Balance Sheet) និងរបាយការណ៍ចំណេញខាត (Income Statement) សម្រាប់អ្នកមិនមែនជំនាញគណនេយ្យបានទេ?", tags: ["accounting", "finance", "explain"] },
    { title: "រូបមន្ត Excel សម្រាប់គណនេយ្យ", category: "Accounting", content: "តើរូបមន្ត Excel អ្វីខ្លះដែលសំខាន់បំផុតសម្រាប់ត្រួតពិនិត្យការចំណាយប្រចាំខែ និងការធ្វើ Reconciliation? សូមផ្តល់ឧទាហរណ៍រូបមន្តជាក់ស្តែង។", tags: ["accounting", "excel", "tools"] },

    // CODING
    { title: "Debug កូដ React", category: "Coding", content: "ខ្ញុំមានកំហុស error: [កូដ error] នៅក្នុងកូដ React ខាងក្រោម។ តើអ្នកអាចជួយរកមូលហេតុ និងវិធីកែតម្រូវបានទេ?\n\n[បញ្ចូលកូដ]", tags: ["coding", "react", "debug"] },
    { title: "ជំនួយការសរសេរ API (Node.js)", category: "Coding", content: "សូមជួយសរសេរ REST API សម្រាប់ប្រព័ន្ធគ្រប់គ្រងសមាជិក ដោយប្រើ Node.js, Express និង MongoDB (រួមមាន CRUD operation)។", tags: ["coding", "api", "backend"] },

    // DESIGN
    { title: "UI/UX Feedback", category: "Design", content: "សូមជួយផ្តល់ Feedback លើការឌីហ្សាញ Website Landing Page សម្រាប់ [ប្រភេទអាជីវកម្ម]។ តើចំណុចណាខ្លះដែលគួរកែលម្អដើម្បីឱ្យអ្នកប្រើប្រាស់ងាយស្រួលយល់ និងមាន Visual ស្អាត?", tags: ["design", "uiux", "feedback"] },
    { title: "Color Palette Generator", category: "Design", content: "សូមផ្តល់យោបល់លើពណ៌ (Color Palette) សម្រាប់ Application បែប [Technical/Playful/Modern] ដែលផ្តោតលើ [គោលបំណង]។", tags: ["design", "color", "branding"] },

    // CV / JOB
    { title: "សរសេរ Cover Letter (តាមការងារជាក់ស្តែង)", category: "CV / Job", content: "សូមជួយសរសេរ Cover Letter សម្រាប់តំណែង [ឈ្មោះតំណែង] នៅក្រុមហ៊ុន [ឈ្មោះក្រុមហ៊ុន]។ ខ្ញុំមានជំនាញ [ជំនាញ១, ២] និងបទពិសោធន៍ [បទពិសោធន៍]។", tags: ["job", "writing", "career"] },
    { title: "ត្រៀមសម្ភាសន៍ការងារ (Interview Prep)", category: "CV / Job", content: "ខ្ញុំមានសម្ភាសន៍ការងារជា [តំណែង] នៅថ្ងៃស្អែក។ តើសំណួរពិបាកៗអ្វីខ្លះដែលខ្ញុំអាចនឹងជួបប្រទះ? ហើយតើខ្ញុំគួរឆ្លើយយ៉ាងណាឱ្យមានទំនុកចិត្ត?", tags: ["job", "interview", "prep"] },

    // AUTOMATION
    { title: "ស្វ័យប្រវត្តិកម្មការងារ (Workflow Automation)", category: "Automation", content: "តើខ្ញុំអាចប្រើ Zapier ឬ Make ដើម្បីភ្ជាប់ Google Sheets ជាមួយ Gmail យ៉ាងដូចម្តេច ដើម្បីឱ្យវានាំផ្ញើអ៊ីមែលអបអរសាទរដោយស្វ័យប្រវត្តិពេលមានអតិថិជនថ្មីចូលមក?", tags: ["automation", "no-code", "workflow"] },
    { title: "សរសេរ Python Script សាមញ្ញ", category: "Automation", content: "សូមជួយសរសេរ Python script សម្រាប់ទាញយកទិន្នន័យ (Scraping) ពីវេបសាយដែលមានតារាង [ឈ្មោះតារាង] ហើយរក្សាទុកជា CSV។", tags: ["automation", "python", "script"] },
    
    // ADDITIONAL PROMPTS
    { title: "បង្កើត AI Image Prompt (Midjourney/DALL-E)", category: "Design", content: "សូមជួយបង្កើត Prompt សម្រាប់បង្កើតរូបភាព AI បែប [ពន្យល់ពីស្ទីល ឧទាហរណ៍៖ Cyberpunk, Minimalist] ដែលបង្ហាញពី [ប្រធានបទរូបភាព]។ សូមផ្តល់ចំណុចលម្អិតអំពីពន្លឺ ពណ៌ និងមុំកាមេរ៉ា។", tags: ["design", "ai-art", "prompt-engineering"] },
    { title: "គ្រប់គ្រងគម្រោងជាមួយ Notion", category: "Business", content: "តើខ្ញុំអាចរៀបចំ Dashboard ក្នុង Notion ដើម្បីគ្រប់គ្រងគម្រោងដែលមានសមាជិក ៥ នាក់យ៉ាងដូចម្តេច? ខ្ញុំចង់មាន Task tracking, Deadline, និង Meeting notes។", tags: ["business", "productivity", "notion"] },
    { title: "យុទ្ធសាស្ត្របង្កើន Follower (TikTok)", category: "Marketing", content: "ខ្ញុំចង់បង្កើន Follower លើ TikTok ក្នុងវិស័យ [វិស័យរបស់អ្នក]។ តើ AI អាចជួយរក Topic ដែលកំពុង Trending និងរៀបចំ Hook សម្រាប់វីដេអូបានដោយរបៀបណា?", tags: ["marketing", "social-media", "growth"] },
    { title: "រៀបចំផែនការរៀនភាសាអង់គ្លេស (IELTS)", category: "Student", content: "សូមជួយរៀបចំកាលវិភាគសិក្សាសម្រាប់ការត្រៀមប្រឡង IELTS ក្នុងរយៈពេល ៣ ខែ។ ខ្ញុំមានកម្រិតបច្ចុប្បន្ន [កម្រិត] ហើយចង់បានប៊ិន ៧.០។", tags: ["student", "language", "ielts"] },
    { title: "វិភាគលទ្ធភាពជោគជ័យ (Idea Validator)", category: "Business", content: "ខ្ញុំមានគំនិតចង់ធ្វើ [ពន្យល់ពីគំនិតអាជីវកម្ម]។ សូមដើរតួជាវិនិយោគិន ហើយជួយផ្តល់មតិរិះគន់លើចំណុចខ្សោយ និងសក្តានុពលនៃគំនិតនេះ។", tags: ["business", "startup", "validation"] },
    { title: "ស្វែងយល់ពី Algorithms (សម្រាប់ Beginner)", category: "Coding", content: "សូមជួយពន្យល់ពីរបៀបដែល [ឈ្មោះ Algorithm ឧទាហរណ៍៖ Binary Search] ដំណើរការ ដោយប្រៀបធៀបទៅនឹងស្ថានភាពក្នុងជីវិតពិត ដើម្បីឱ្យអ្នកមិនចេះកូដងាយយល់។", tags: ["coding", "learning", "logic"] },
    { title: "SEO Strategy សម្រាប់ Local Business", category: "Marketing", content: "តើខ្ញុំគួររៀបចំ Google Maps និងវេបសាយរបស់ខ្ញុំយ៉ាងដូចម្តេច ដើម្បីឱ្យអតិថិជនងាយស្រួលរកឃើញអាជីវកម្ម [ឈ្មោះមហាង] របស់ខ្ញុំក្នុងតំបន់ [ទីតាំង]?", tags: ["marketing", "seo", "local-business"] },
    { title: "ដោះស្រាយវិវាទក្នុងក្រុម (Conflict Resolution)", category: "Business", content: "ប្រសិនបើមានសមាជិកពីរនាក់ក្នុងក្រុមមានមតិខុសគ្នាខ្លាំងលើគម្រោងមួយ តើក្នុងនាមជាអ្នកដឹកនាំ ខ្ញុំគួរប្រើបច្ចេកទេសអ្វីខ្លះដើម្បីសម្រុះសម្រួលឱ្យមានប្រសិទ្ធភាព?", tags: ["business", "leadership", "management"] },
    { title: "ស្វ័យប្រវត្តិកិច្ចការគណនេយ្យ (Excel/VBA)", category: "Accounting", content: "សូមជួយសរសេរ Logic ឬ Macro សម្រាប់បែងចែកចំណាយដោយស្វ័យប្រវត្តិពីរបាយការណ៍ធនាគារ ទៅតាមប្រភេទចំណាយនីមួយៗ (Rent, Salary, Utilities)។", tags: ["accounting", "automation", "excel"] },
    { title: "តុល្យភាពជីវិត និងការងារ (Mental Health)", category: "Business", content: "ខ្ញុំមានអារម្មណ៍ថា Burnout ជាមួយការងារ។ តើមានបច្ចេកទេសចិត្តសាស្ត្រ ឬទម្លាប់ប្រចាំថ្ងៃអ្វីខ្លះដែល AI ណែនាំដើម្បីជួយឱ្យខ្ញុំមានផលិតភាពផង និងមានសុខភាពផ្លូវចិត្តល្អផង?", tags: ["business", "productivity", "wellness"] },
    
    // EVEN MORE PROMPTS
    { title: "សរសេរអត្ថបទ Blog (SEO Friendly)", category: "Marketing", content: "សូមជួយសរសេរអត្ថបទ Blog អំពី [ប្រធានបទ] ដែលមានប្រវែងប្រហែល ៨០០ ពាក្យ។ សូមរៀបចំរចនាសម្ព័ន្ធឱ្យមាន H1, H2, H3 និងបញ្ចូលពាក្យគន្លឹះ (Keywords) [បញ្ចូលពាក្យគន្លឹះ] ដើម្បីឱ្យងាយស្រួលជាប់ចំណាត់ថ្នាក់លើ Google។", tags: ["marketing", "seo", "blogging"] },
    { title: "រៀបចំផែនការហិរញ្ញវត្ថុផ្ទាល់ខ្លួន", category: "Accounting", content: "ខ្ញុំមានប្រាក់ចំណូលប្រចាំខែ [ចំនួន] ហើយមានចំណាយថេរ [ចំនួន]។ តើខ្ញុំគួរប្រើវិធាន 50/30/20 យ៉ាងដូចម្តេចដើម្បីសន្សំប្រាក់ទិញ [របស់ដែលចង់ទិញ] ក្នុងរយៈពេល ១ ឆ្នាំ?", tags: ["accounting", "finance", "savings"] },
    { title: "ជំនួយការបកប្រែ (Contextual Translation)", category: "CV / Job", content: "សូមជួយបកប្រែឃ្លាខាងក្រោមពីភាសាខ្មែរ ទៅភាសាអង់គ្លេស ប៉ុន្តែសូមរក្សាអត្ថន័យឱ្យស្របតាមបរិបទ [ការងារអាជីព/ការជួបជុំមិត្តភក្តិ]៖\n\n'[បញ្ចូលអត្ថបទ]'", tags: ["job", "translation", "language"] },
    { title: "រៀបចំកម្មវិធីសិក្ខាសាលា (Workshop Organizer)", category: "Business", content: "ខ្ញុំចង់រៀបចំសិក្ខាសាលារយៈពេល ១ ថ្ងៃអំពី [ប្រធានបទ] សម្រាប់អ្នកចូលរួម ៥០ នាក់។ សូមជួយរៀបចំ Agenda ចាប់ពីម៉ោង ៨ ព្រឹក ដល់ម៉ោង ៥ ល្ងាច រួមទាំងសកម្មភាព Ice breaking ផង។", tags: ["business", "event", "workshop"] },
    { title: "បង្កើតមាតិកា LinkedIn (Personal Branding)", category: "Marketing", content: "សូមជួយសរសេរអត្ថបទសម្រាប់ផុសលើ LinkedIn ដែលបង្ហាញពីបទពិសោធន៍របស់ខ្ញុំក្នុងការដោះស្រាយបញ្ហា [បញ្ហា]។ អត្ថបទនេះគួរតែផ្តល់តម្លៃដល់អ្នកអាន និងបង្កើនភាពជឿជាក់លើវិជ្ជាជីវៈរបស់ខ្ញុំ។", tags: ["marketing", "linkedin", "branding"] },
    { title: "រៀបចំផែនការដើរកម្សាន្ត (Travel Itinerary)", category: "Automation", content: "សូមជួយរៀបចំកាលវិភាគដើរកម្សាន្តនៅ [ខេត្ត/ក្រុង] រយៈពេល ៣ ថ្ងៃ ២ យប់។ ខ្ញុំចង់ទៅកន្លែងណាដែលមានទេសភាពស្អាត អាហារឆ្ងាញ់ និងមិនសូវអ៊ូអរពេក។", tags: ["travel", "planning", "cambodia"] },
    { title: "ជំនួយការសរសេរកូដ SQL (Database)", category: "Coding", content: "សូមជួយសរសេរ SQL query ដើម្បីទាញយកទិន្នន័យអតិថិជនដែលបានទិញទំនិញលើសពី $500 ក្នុងរយៈពេល ៦ ខែចុងក្រោយ និងបង្ហាញពីចំនួនទឹកប្រាក់សរុបដែលពួកគេបានចំណាយ។", tags: ["coding", "sql", "database"] },
    { title: "រៀបចំបញ្ជីម្ហូបអាហារសុខភាព (Meal Prep)", category: "Student", content: "សូមជួយរៀបចំបញ្ជីម្ហូបអាហារសម្រាប់សប្តាហ៍នេះដែលផ្តោតលើសុខភាព (High Protein, Low Carb) និងមានតម្លៃសមរម្យសម្រាប់សិស្សនិស្សិត។", tags: ["student", "health", "food"] },
    { title: "បង្កើត Script វីដេអូខ្លី (Shorts/Reels)", category: "Marketing", content: "សូមជួយសរសេរ Script វីដេអូខ្លីរយៈពេល ៦០ វិនាទី អំពី 'គន្លឹះ ៣ យ៉ាងដើម្បី [ប្រធានបទ]'។ Script ត្រូវមានការចាប់ផ្តើមទាក់ទាញខ្លាំង និងបញ្ចប់ដោយការដាស់តឿនឱ្យ Follow។", tags: ["marketing", "video", "content"] },
    { title: "រៀបចំរចនាសម្ព័ន្ធក្រុមហ៊ុន Startup", category: "Business", content: "ប្រសិនបើខ្ញុំចង់បង្កើតក្រុមការងារសម្រាប់ Startup ផ្នែកបច្ចេកវិទ្យា តើមុខតំណែងសំខាន់ៗ ៥ ដំបូងដែលខ្ញុំត្រូវមានគឺជាអ្វីខ្លះ? ហើយតួនាទីនីមួយៗត្រូវទទួលខុសត្រូវលើអ្វីខ្លះ?", tags: ["business", "startup", "team"] }
  ];

  const existingSnapshot = await getDocs(collection(db, 'prompts'));
  const existingTitles = new Set(existingSnapshot.docs.map(doc => doc.data().title));

  let added = 0;
  for (const prompt of promptsData) {
    if (!existingTitles.has(prompt.title)) {
      await addDoc(collection(db, 'prompts'), {
        ...prompt,
        createdAt: serverTimestamp()
      });
      added++;
    }
  }
  console.log(`Added ${added} new prompts.`);
}

async function seedRoadmaps() {
  const roadmaps = [
    { title: "AI Skill Mastery Roadmap", description: "ផ្លូវឆ្ពោះទៅរកការក្លាយជាអ្នកជំនាញ AI ពីកម្រិតដំបូងរហូតដល់កម្រិតខ្ពស់។" },
    { title: "Digital Business Roadmap", description: "រៀបចំអាជីវកម្មបែបឌីជីថលឱ្យជោគជ័យជាមួយបច្ចេកវិទ្យាទំនើប។" }
  ];

  const existingSnapshot = await getDocs(collection(db, 'roadmaps'));
  const existingTitles = new Set(existingSnapshot.docs.map(doc => doc.data().title));

  for (const rm of roadmaps) {
    if (!existingTitles.has(rm.title)) {
      const roadmapDoc = await addDoc(collection(db, 'roadmaps'), {
        ...rm,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        createdAt: serverTimestamp()
      });

      for (let i = 1; i <= 5; i++) {
        await addDoc(collection(db, 'roadmap_steps'), {
          roadmapId: roadmapDoc.id,
          title: `ដំណាក់កាលទី ${i}`,
          description: `ការសិក្សា និងការអនុវត្តជំហានសំខាន់ៗទី ${i}។`,
          order: i,
          relatedCourseIds: []
        });
      }
    }
  }
}

export async function runFullSeed() {
  console.log('Starting full platform sync...');
  
  // 1. Courses & Lessons
  const coursesSnapshot = await getDocs(collection(db, 'courses'));
  if (coursesSnapshot.empty) {
    console.log('Seeding initial courses...');
    await seedDatabase();
  } else {
    // Also try to seed extra courses if some already exist
    console.log('Checking for extra courses...');
    await seed20MoreCourses();
  }

  // 2. Prompts (Smart Update)
  console.log('Syncing Library Prompts...');
  await seedPrompts();

  // 3. Roadmaps (Smart Update)
  console.log('Syncing Roadmaps...');
  await seedRoadmaps();

  console.log('Full platform sync complete!');
  alert('SYNC រួចរាល់! ប្រព័ន្ធបានត្រួតពិនិត្យ និងបន្ថែមទិន្នន័យថ្មីៗជូនលោកអ្នករួចរាល់ហើយ។');
}
