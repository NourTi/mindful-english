import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import { useNavigate } from "react-router-dom";

interface LearningEnvironment extends CardStackItem {
  personality: string;
  learningStyle: string;
  moodColor: string;
}

const learningEnvironments: LearningEnvironment[] = [
  // NEW: Structured Scenario-based environments (from database)
  {
    id: "corporate-boardroom",
    title: "The Corporate Boardroom",
    description: "Navigate high-stakes business presentations with confidence. Practice professional communication with executives and stakeholders.",
    imageSrc: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
    href: "/structured-scenario?env=corporate-boardroom",
    tag: "Business • Professional",
    ctaLabel: "Enter Meeting",
    personality: "professional",
    learningStyle: "reading",
    moodColor: "hsl(220, 50%, 35%)",
  },
  {
    id: "international-airport",
    title: "The International Airport",
    description: "Handle travel emergencies and rebooking with calm efficiency. Learn to communicate under time pressure.",
    imageSrc: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop",
    href: "/structured-scenario?env=international-airport",
    tag: "Travel • Logistics",
    ctaLabel: "Board Flight",
    personality: "resourceful",
    learningStyle: "auditory",
    moodColor: "hsl(200, 70%, 45%)",
  },
  {
    id: "university-campus",
    title: "The University Campus",
    description: "Collaborate on group projects and navigate academic discussions. Build confidence in educational settings.",
    imageSrc: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop",
    href: "/structured-scenario?env=university-campus",
    tag: "Academic • Social",
    ctaLabel: "Join Study Group",
    personality: "collaborative",
    learningStyle: "reading",
    moodColor: "hsl(160, 50%, 40%)",
  },
  {
    id: "local-coffee-shop",
    title: "The Local Coffee Shop",
    description: "Strike up conversations with friendly strangers. Master the art of casual social English in relaxed settings.",
    imageSrc: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop",
    href: "/structured-scenario?env=local-coffee-shop",
    tag: "Casual • Social",
    ctaLabel: "Grab Coffee",
    personality: "friendly",
    learningStyle: "auditory",
    moodColor: "hsl(30, 70%, 45%)",
  },
  {
    id: "medical-clinic",
    title: "The Medical Clinic",
    description: "Describe symptoms clearly and understand health advice. Essential vocabulary for medical situations.",
    imageSrc: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop",
    href: "/structured-scenario?env=medical-clinic",
    tag: "Health • Emergency",
    ctaLabel: "See Doctor",
    personality: "practical",
    learningStyle: "kinesthetic",
    moodColor: "hsl(175, 60%, 40%)",
  },
  // EXISTING: AI Chat-based immersive environments
  {
    id: "gothic-depths",
    title: "Gothic Sanctuary",
    description: "Deep contemplative learning in mysterious, atmospheric spaces. AI-guided conversations for introverts.",
    imageSrc: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop",
    href: "/immersive?env=gothic",
    tag: "AI Chat • Introvert",
    ctaLabel: "Enter Sanctuary",
    personality: "introvert",
    learningStyle: "reading",
    moodColor: "hsl(270, 50%, 20%)",
  },
  {
    id: "cyber-matrix",
    title: "Cyber Matrix",
    description: "High-tech neural networks and digital streams. AI-powered conversations for analytical minds.",
    imageSrc: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
    href: "/immersive?env=cyber",
    tag: "AI Chat • Analytical",
    ctaLabel: "Jack In",
    personality: "analytical",
    learningStyle: "visual",
    moodColor: "hsl(180, 100%, 40%)",
  },
  {
    id: "urban-pulse",
    title: "Urban Pulse",
    description: "Vibrant city environments for social learners. AI roleplay in bustling cafés and street scenes.",
    imageSrc: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop",
    href: "/immersive?env=urban",
    tag: "AI Chat • Extrovert",
    ctaLabel: "Join the Crowd",
    personality: "extrovert",
    learningStyle: "auditory",
    moodColor: "hsl(30, 90%, 50%)",
  },
];

interface LearningEnvironmentsProps {
  className?: string;
  onSelectEnvironment?: (env: LearningEnvironment) => void;
}

export function LearningEnvironments({ className, onSelectEnvironment }: LearningEnvironmentsProps) {
  const navigate = useNavigate();

  const handleEnvironmentChange = (index: number, item: LearningEnvironment) => {
    onSelectEnvironment?.(item);
  };

  return (
    <div className={className}>
      <CardStack<LearningEnvironment>
        items={learningEnvironments}
        initialIndex={1}
        maxVisible={5}
        cardWidth={480}
        cardHeight={300}
        overlap={0.45}
        spreadDeg={42}
        autoAdvance={true}
        intervalMs={4000}
        pauseOnHover={true}
        activeScale={1.05}
        inactiveScale={0.9}
        onChangeIndex={handleEnvironmentChange}
        renderCard={(item, { active }) => (
          <div className="relative h-full w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={item.imageSrc}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700"
                style={{ transform: active ? 'scale(1.05)' : 'scale(1)' }}
                loading="lazy"
              />
            </div>

            {/* Mood Overlay */}
            <div 
              className="absolute inset-0 mix-blend-overlay opacity-40"
              style={{ backgroundColor: item.moodColor }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Animated Border Glow for Active */}
            {active && (
              <div className="absolute inset-0 rounded-2xl animate-pulse opacity-30"
                style={{ 
                  boxShadow: `inset 0 0 30px ${item.moodColor}, 0 0 40px ${item.moodColor}` 
                }}
              />
            )}

            {/* Tag */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-background/80 backdrop-blur-sm text-foreground border border-border/50">
                {item.tag}
              </span>
            </div>

            {/* Learning Style Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded bg-primary/80 text-primary-foreground">
                {item.learningStyle}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className={`font-display font-bold text-white transition-all duration-300 ${active ? 'text-2xl' : 'text-xl'}`}>
                {item.title}
              </h3>
              <p className={`mt-2 text-sm text-white/80 line-clamp-2 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70'}`}>
                {item.description}
              </p>
              
              {/* CTA for active card */}
              {active && (
                <button
                  onClick={() => navigate(item.href || '/scenario')}
                  className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-all hover:scale-105"
                >
                  {item.ctaLabel}
                </button>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default LearningEnvironments;
