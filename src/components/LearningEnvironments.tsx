import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import { useNavigate } from "react-router-dom";

interface LearningEnvironment extends CardStackItem {
  personality: string;
  learningStyle: string;
  moodColor: string;
}

const learningEnvironments: LearningEnvironment[] = [
  {
    id: "gothic-depths",
    title: "Gothic Sanctuary",
    description: "Deep contemplative learning in mysterious, atmospheric spaces. Perfect for introverts who find peace in shadowy beauty and profound meanings.",
    imageSrc: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop",
    href: "/scenario?env=gothic",
    tag: "Introvert • Deep Thinker",
    ctaLabel: "Enter Sanctuary",
    personality: "introvert",
    learningStyle: "reading",
    moodColor: "hsl(270, 50%, 20%)",
  },
  {
    id: "cyber-matrix",
    title: "Cyber Matrix",
    description: "High-tech neural networks and digital streams. For analytical minds who thrive in structured, data-driven environments.",
    imageSrc: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
    href: "/scenario?env=cyber",
    tag: "Analytical • Visual",
    ctaLabel: "Jack In",
    personality: "analytical",
    learningStyle: "visual",
    moodColor: "hsl(180, 100%, 40%)",
  },
  {
    id: "cosmic-voyage",
    title: "Cosmic Voyage",
    description: "Explore the vastness of space while mastering new concepts. For dreamers and big-picture thinkers who need expansive horizons.",
    imageSrc: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop",
    href: "/scenario?env=cosmic",
    tag: "Dreamer • Explorer",
    ctaLabel: "Launch",
    personality: "creative",
    learningStyle: "visual",
    moodColor: "hsl(250, 80%, 30%)",
  },
  {
    id: "zen-garden",
    title: "Zen Garden",
    description: "Peaceful minimalist spaces for focused, mindful learning. Perfect for those who need calm to absorb and reflect.",
    imageSrc: "https://images.unsplash.com/photo-1503149779833-1de50ced91f4?w=800&auto=format&fit=crop",
    href: "/scenario?env=zen",
    tag: "Calm • Mindful",
    ctaLabel: "Find Peace",
    personality: "peaceful",
    learningStyle: "kinesthetic",
    moodColor: "hsl(120, 30%, 40%)",
  },
  {
    id: "urban-pulse",
    title: "Urban Pulse",
    description: "Vibrant city environments for social learners. Practice real-world conversations in bustling cafés and street scenes.",
    imageSrc: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop",
    href: "/scenario?env=urban",
    tag: "Extrovert • Social",
    ctaLabel: "Join the Crowd",
    personality: "extrovert",
    learningStyle: "auditory",
    moodColor: "hsl(30, 90%, 50%)",
  },
  {
    id: "forest-wisdom",
    title: "Forest of Wisdom",
    description: "Ancient woods where knowledge grows organically. For naturalists who learn best surrounded by life and organic patterns.",
    imageSrc: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop",
    href: "/scenario?env=forest",
    tag: "Naturalist • Organic",
    ctaLabel: "Wander In",
    personality: "naturalist",
    learningStyle: "kinesthetic",
    moodColor: "hsl(140, 40%, 30%)",
  },
  {
    id: "neon-arcade",
    title: "Neon Arcade",
    description: "Gamified learning in retro-futuristic spaces. For competitive spirits who love challenges, scores, and achievements.",
    imageSrc: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&auto=format&fit=crop",
    href: "/scenario?env=arcade",
    tag: "Competitive • Gamifier",
    ctaLabel: "Start Game",
    personality: "competitive",
    learningStyle: "kinesthetic",
    moodColor: "hsl(320, 100%, 50%)",
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
