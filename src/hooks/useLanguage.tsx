import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'km' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tLang: (key: string, lang: Language) => string;
}

const translations = {
  km: {
    // Navigation
    'hi': 'សួស្តី',
    'search_lessons': 'ស្វែងរកមេរៀន...',
    'sign_in': 'ចូលប្រើប្រាស់',
    'sign_out': 'ចាកចេញ',
    'dashboard': 'ផ្ទាំងគ្រប់គ្រង Agent',
    'academy': 'រៀនជាមួយ Agent',
    'roadmap': 'ផែនទីសិក្សា Agent',
    'library': 'បណ្ណាល័យ Agent',
    'coach': 'គ្រូបង្វឹក Agent',
    'solver': 'ដោះស្រាយបញ្ហា Agent',
    'admin': 'គ្រប់គ្រង',
    'language': 'ភាសា',
    'khmer': 'ខ្មែរ',
    'english': 'អង់គ្លេស',

    // Dashboard
    'welcome_back': 'ស្វាគមន៍ការត្រលប់មកវិញ!',
    'ready_to_learn': 'តើអ្នកត្រៀមខ្លួនសម្រាប់មេរៀនថ្មីហើយឬនៅ?',
    'continue_learning': 'បន្តការសិក្សា',
    'recommended_for_you': 'មេរៀនណែនាំសម្រាប់អ្នក',
    'recent_prompts': 'Prompt ដែលអ្នកទើបប្រើ',
    'view_all': 'មើលទាំងអស់',
    'solver_question': 'តើអ្នកចង់ឱ្យ DG Agent ជួយ ដោះស្រាយបញ្ហា អ្វីនៅថ្ងៃនេះ?',
    'solver_desc': 'បញ្ចូលបញ្ហារបស់អ្នកជាភាសាខ្មែរ ហើយ Agent នឹងរៀបចំផែនការសកម្មភាព ៧ថ្ងៃជូនអ្នក។',
    'solve_with_agent': 'ដោះស្រាយជាមួយ Agent',
    'current_roadmap': 'ផែនទីសិក្សាបច្ចុប្បន្ន',
    'progress': 'វឌ្ឍនភាព',
    'daily_task': 'ភារកិច្ចប្រចាំថ្ងៃ',
    'start_now': 'ចាប់ផ្តើមឥឡូវ',
    'recommended_lessons': 'មេរៀនដែលបានណែនាំ',
    'discover_new_skills': 'ស្វែងរកជំនាញថ្មីៗសម្រាប់អភិវឌ្ឍខ្លួន',
    'no_lessons': 'មិនទាន់មានមេរៀននៅឡើយទេ',
    'seed_desc': 'ចុចប៊ូតុងខាងក្រោមដើម្បីទាញយកមេរៀនគំរូ និង Prompt ផ្សេងៗសរុបជាង ៣០ មេរៀន។',
    'learn_more': 'មើលបន្ថែម',
    'lessons_count': 'មេរៀន',
    'automation_task': 'សិក្សាផ្នែក \'Automation\' ឱ្យបាន ៣០ នាទី',
    'agent_coach': 'គ្រូបង្វឹក Agent',
    'skill_library': 'បណ្ណាល័យ Skill',
    'learning_roadmap': 'ផែនទីសិក្សា',
    'all_courses': 'វគ្គសិក្សាទាំងអស់',
    'course_desc': 'ស្វែងរកជំនាញដែលអ្នកចង់រៀនដើម្បីអភិវឌ្ឍខ្លួន',
    'no_courses_found': 'រកមិនឃើញមេរៀនដែលអ្នកស្វែងរកទេ',
    'roadmap_title': 'ផែនទីសិក្សាឆ្ពោះទៅរកភាពជោគជ័យ',
    'roadmap_desc': 'ជ្រើសរើសផ្លូវរបស់អ្នក ហើយដើរតាមជំហានដែលយើងបានរៀបចំទុក ដើម្បីក្លាយជាអ្នកជំនាញក្នុងយុគសម័យ AI។',
    'steps': 'ជំហាន',
    'completed': 'បញ្ចប់',
    'explore': 'ចូលមើល',
    'learning_paths': 'ផ្លូវសិក្សា',
    'coach_active': 'សកម្មភាព Agent',
    'agent_thinking': 'Agent កំពុងគិត...',
    'ask_question_placeholder': 'សួរសំណួរមេរៀននៅទីនេះ...',
    'agent_disclaimer': 'Agent អាចនឹងមានកំហុស។ សូមពិនិត្យព័ត៌មានសំខាន់ៗឡើងវិញ។',
    'initial_greeting': 'សួស្តី! ខ្ញុំគឺជា DG Agent របស់អ្នក។ តើខ្ញុំអាចជួយអ្វីអ្នកបានខ្លះនៅថ្ងៃនេះ? ខ្ញុំអាចពន្យល់មេរៀន ជួយរៀបចំគម្រោងសិក្សា ឬជួយដោះស្រាយបញ្ហាផ្សេងៗជូនអ្នក។',
    'solver_title': 'ដោះស្រាយបញ្ហានាៗ ជាមួយ Agent',
    'solver_subtitle': 'បំពេញបញ្ហាដែលអ្នកកំពុងជួបប្រទះ។ DG Agent នឹងជួយវិភាគ និងរៀបចំផែនការសកម្មភាពជាក់លាក់ជូនអ្នក។',
    'your_problem': 'បញ្ហារបស់អ្នក',
    'problem_placeholder': 'ឧទាហរណ៍៖ ខ្ញុំចង់បង្កើនប្រសិទ្ធភាពការងារ ប៉ុន្តែខ្ញុំមានអារម្មណ៍ថាគ្មានពេលវេលាគ្រប់គ្រាន់...',
    'solve_now_btn': 'ដោះស្រាយបញ្ហាឥឡូវ',
    'no_results_yet': 'មិនទាន់មានលទ្ធផលនៅឡើយទេ។',
    'fill_problem_left': 'សូមបំពេញបញ្ហារបស់អ្នកនៅខាងឆ្វេង។',
    'analyzing': 'Agent កំពុងវិភាគ...',
    'finding_best_solution': 'យើងកំពុងស្វែងរកដំណោះស្រាយល្អបំផុតជូនអ្នក',
    'analysis_result': 'ការវិភាគបញ្ហា',
    'skills_to_learn': 'ជំនាញដែលត្រូវរៀន',
    'recommended_prompts_title': 'Agent Prompts ណែនាំ',
    'action_plan_7': 'ផែនការសកម្មភាព ៧ ថ្ងៃ (Quick Action)',
    'action_plan_30': 'ផែនការសកម្មភាព ៣០ ថ្ងៃ (Long-term Growth)',
    'solve_another': 'ដោះស្រាយបញ្ហាផ្សេងទៀត',
    'agent_logic': 'ការគិតរបស់ Agent',
    'problem_summary': 'សង្ខេបបញ្ហា',
    'root_cause': 'មូលហេតុចម្បង',
    'back': 'ត្រឡប់ក្រោយ',
    'course_lessons': 'មេរៀននៅក្នុងវគ្គសិក្សា',
    'lesson_order': 'មេរៀនទី',
    'previous_lesson': 'មេរៀនមុន',
    'finish_lesson': 'បញ្ចប់មេរៀន',
    'curriculum': 'កម្មវិធីសិក្សា',
    'start': 'ចាប់ផ្តើម',
    'course_price': 'តម្លៃវគ្គសិក្សា',
    'free': 'ឥតគិតថ្លៃ',
    'start_learning_now': 'ចាប់ផ្តើមរៀនឥឡូវនេះ',
    'auto_save_desc': 'ការសិក្សារបស់អ្នកត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិ',
    'course_not_found': 'រកមិនឃើញវគ្គសិក្សា',
    'lessons': 'មេរៀន',

    'all_categories': 'គ្រប់ប្រភេទ',
    'student': 'សិស្សានុសិស្ស',
    'teacher': 'គ្រូបង្រៀន',
    'business': 'អាជីវកម្ម',
    'marketing': 'ទីផ្សារ',
    'sales': 'ការលក់',
    'accounting': 'គណនេយ្យ',
    'coding': 'សរសេរកូដ',
    'design': 'ឌីហ្សាញ',
    'job': 'ការងារ',
    'automation': 'ស្វ័យប្រវត្តិកម្ម',
    'role': 'តួនាទី',
    'admin_role': 'អ្នកគ្រប់គ្រង',
    'user_role': 'សមាជិក',
    'level_all': 'គ្រប់កម្រិត',
    'level_beginner': 'កម្រិតដំបូង',
    'level_intermediate': 'កម្រិតមធ្យម',
    'level_advanced': 'កម្រិតខ្ពស់',
    'hours': 'ម៉ោង',
    'minutes': 'នាទី',
    'search_prompts': 'ស្វែងរក Prompt...',
    'no_prompts_found': 'រកមិនឃើញ Prompt ទេ',
    'seed_platform': 'ធ្វើបច្ចុប្បន្នភាពទិន្នន័យ',
    'sync_content': 'ធ្វើបច្ចុប្បន្នភាពទិន្នន័យ',
    'academy_sync': 'ធ្វើបច្ចុប្បន្នភាពបណ្ណាល័យ',

    // Library
    'library_title': 'បណ្ណាល័យ PROMPT ល្អបំផុតសម្រាប់អ្នក',
    'library_subtitle': 'ចម្លងយក Prompt ដែលត្រូវបានរៀបចំទុកជាស្រេច ដើម្បីទទួលបានលទ្ធផលល្អបំផុតពី AI Agent ក្នុងកិច្ចការងារប្រចាំថ្ងៃរបស់អ្នក។',
    'copy_prompt': 'ចម្លង PROMPT',
    'copied': 'បានចម្លង!',
    'clear_chat': 'លុបសារទាំងអស់',
  },
  en: {
    // Navigation
    'hi': 'Hi',
    'search_lessons': 'Search lessons...',
    'sign_in': 'Sign In',
    'sign_out': 'Sign Out',
    'dashboard': 'Dashboard',
    'academy': 'Academy',
    'roadmap': 'Roadmap',
    'library': 'Library',
    'coach': 'Coach',
    'solver': 'Solver',
    'admin': 'Admin',
    'language': 'Language',
    'khmer': 'Khmer',
    'english': 'English',

    // Dashboard
    'welcome_back': 'Welcome Back!',
    'ready_to_learn': 'Are you ready for your next session?',
    'continue_learning': 'Continue Learning',
    'recommended_for_you': 'Recommended for You',
    'recent_prompts': 'Your Recent Prompts',
    'view_all': 'View All',
    'solver_question': 'What problem do you want DG Agent to solve today?',
    'solver_desc': 'Enter your problem in Khmer, and the Agent will prepare a 7-day action plan for you.',
    'solve_with_agent': 'Solve with Agent',
    'current_roadmap': 'Current Roadmap',
    'progress': 'Progress',
    'daily_task': 'Daily Task',
    'start_now': 'Start Now',
    'recommended_lessons': 'Recommended Lessons',
    'discover_new_skills': 'Discover new skills for self-development',
    'no_lessons': 'No lessons yet',
    'seed_desc': 'Click the button below to download sample lessons and various prompts, totaling over 30 lessons.',
    'learn_more': 'Learn More',
    'lessons_count': 'Lessons',
    'automation_task': 'Study \'Automation\' for 30 minutes',
    'agent_coach': 'Agent Coach',
    'skill_library': 'Skill Library',
    'learning_roadmap': 'Learning Roadmap',
    'all_courses': 'All Courses',
    'course_desc': 'Discover new skills for self-development',
    'no_courses_found': 'No courses found',
    'roadmap_title': 'Learning Roadmap for Success',
    'roadmap_desc': 'Choose your path and follow the pre-designed steps to become an expert in the AI era.',
    'steps': 'Steps',
    'completed': 'Completed',
    'explore': 'Explore',
    'learning_paths': 'Learning Paths',
    'coach_active': 'Agent Active',
    'agent_thinking': 'Agent is thinking...',
    'ask_question_placeholder': 'Ask your question here...',
    'agent_disclaimer': 'Agent may make mistakes. Please verify important information.',
    'initial_greeting': 'Hi! I am your DG Agent. How can I help you today? I can explain lessons, help plan your studies, or solve problems for you.',
    'solver_title': 'Solve Problems with Agent',
    'solver_subtitle': 'Fill in the problem you are facing. DG Agent will analyze and prepare a specific action plan for you.',
    'your_problem': 'Your Problem',
    'problem_placeholder': 'Example: I want to increase work efficiency, but I feel I don\'t have enough time...',
    'solve_now_btn': 'Solve Problem Now',
    'no_results_yet': 'No results yet.',
    'fill_problem_left': 'Please fill in your problem on the left.',
    'analyzing': 'Agent is analyzing...',
    'finding_best_solution': 'We are looking for the best solution for you',
    'analysis_result': 'Problem Analysis',
    'skills_to_learn': 'Skills to Learn',
    'recommended_prompts_title': 'Recommended Agent Prompts',
    'action_plan_7': '7-Day Action Plan (Quick Action)',
    'action_plan_30': '30-Day Action Plan (Long-term Growth)',
    'solve_another': 'Solve Another Problem',
    'agent_logic': 'Agent-Powered Logic',
    'problem_summary': 'Problem Summary',
    'root_cause': 'Root Cause',
    'back': 'Back',
    'course_lessons': 'Course Lessons',
    'lesson_order': 'Lesson',
    'previous_lesson': 'Previous Lesson',
    'finish_lesson': 'Finish Lesson',
    'curriculum': 'Curriculum',
    'start': 'Start',
    'course_price': 'Course Price',
    'free': 'Free',
    'start_learning_now': 'Start Learning Now',
    'auto_save_desc': 'Your progress is automatically saved',
    'course_not_found': 'Course not found',
    'lessons': 'Lessons',

    'all_categories': 'All Categories',
    'student': 'Student',
    'teacher': 'Teacher',
    'business': 'Business',
    'marketing': 'Marketing',
    'sales': 'Sales',
    'accounting': 'Accounting',
    'coding': 'Coding',
    'design': 'Design',
    'job': 'CV / Job',
    'automation': 'Automation',
    'role': 'Role',
    'admin_role': 'Admin',
    'user_role': 'Member',
    'level_all': 'All Levels',
    'level_beginner': 'Beginner',
    'level_intermediate': 'Intermediate',
    'level_advanced': 'Advanced',
    'hours': 'Hours',
    'minutes': 'Minutes',
    'search_prompts': 'Search Prompts...',
    'no_prompts_found': 'No Prompts Found',
    'seed_platform': 'Update Platform Data',
    'sync_content': 'Sync Content',
    'academy_sync': 'Sync Library',

    // Library
    'library_title': 'Best PROMPT Library For You',
    'library_subtitle': 'Copy pre-designed prompts to get the best results from your AI Agent in your daily tasks.',
    'copy_prompt': 'COPY PROMPT',
    'copied': 'Copied!',
    'clear_chat': 'Clear Chat',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'km') ? saved as Language : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  const tLang = (key: string, lang: Language): string => {
    return (translations[lang] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
