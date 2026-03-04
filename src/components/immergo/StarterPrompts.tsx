import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StarterPromptsProps {
  missionTitle: string;
  missionDesc: string;
  targetRole: string;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

interface PromptOption {
  arabic: string;
  english: string;
  emoji: string;
}

/**
 * Context-aware Arabic starter prompts for novice learners.
 * Shows 3-4 helpful questions the user can tap to send.
 */
function getStarterPrompts(title: string, targetRole: string): PromptOption[] {
  const role = targetRole.toLowerCase();

  // Coffee / Barista
  if (role.includes('barista') || title.toLowerCase().includes('coffee')) {
    return [
      { arabic: 'ممكن قهوة من فضلك؟', english: 'Can I have a coffee please?', emoji: '☕' },
      { arabic: 'كم سعر القهوة؟', english: 'How much is the coffee?', emoji: '💰' },
      { arabic: 'عندكم حليب شوفان؟', english: 'Do you have oat milk?', emoji: '🥛' },
    ];
  }

  // Restaurant / food
  if (role.includes('waiter') || role.includes('chef') || title.toLowerCase().includes('dinner') || title.toLowerCase().includes('restaurant')) {
    return [
      { arabic: 'شو بتنصحني؟', english: 'What do you recommend?', emoji: '🍽️' },
      { arabic: 'ممكن أشوف المنيو؟', english: 'Can I see the menu?', emoji: '📋' },
      { arabic: 'عندكم أكل نباتي؟', english: 'Do you have vegetarian food?', emoji: '🥗' },
    ];
  }

  // Doctor / medical
  if (role.includes('doctor') || role.includes('nurse') || role.includes('pharmacist')) {
    return [
      { arabic: 'عندي موعد مع الدكتور', english: 'I have an appointment with the doctor', emoji: '📅' },
      { arabic: 'رأسي يؤلمني', english: 'I have a headache', emoji: '🤕' },
      { arabic: 'ممكن تساعدني؟', english: 'Can you help me?', emoji: '🙏' },
    ];
  }

  // Hotel
  if (role.includes('concierge') || role.includes('receptionist') || title.toLowerCase().includes('hotel')) {
    return [
      { arabic: 'عندي حجز باسمي', english: 'I have a reservation under my name', emoji: '🔑' },
      { arabic: 'وين المصعد؟', english: 'Where is the elevator?', emoji: '🛗' },
      { arabic: 'الواي فاي شو كلمة السر؟', english: "What's the WiFi password?", emoji: '📶' },
    ];
  }

  // Transport / bus / taxi
  if (role.includes('driver') || role.includes('commuter') || title.toLowerCase().includes('bus') || title.toLowerCase().includes('taxi') || title.toLowerCase().includes('train')) {
    return [
      { arabic: 'وين أقرب محطة؟', english: 'Where is the nearest station?', emoji: '🚏' },
      { arabic: 'كم تكلفة التذكرة؟', english: 'How much is the ticket?', emoji: '🎫' },
      { arabic: 'هل هذا الباص يروح للمركز؟', english: 'Does this bus go to the center?', emoji: '🚌' },
    ];
  }

  // Bank / financial
  if (role.includes('bank') || role.includes('teller')) {
    return [
      { arabic: 'بدي أفتح حساب جديد', english: 'I want to open a new account', emoji: '🏦' },
      { arabic: 'وين أقرب صراف آلي؟', english: 'Where is the nearest ATM?', emoji: '💳' },
      { arabic: 'ممكن تساعدني؟', english: 'Can you help me?', emoji: '🙏' },
    ];
  }

  // Shop / return
  if (role.includes('shop') || role.includes('vendor') || title.toLowerCase().includes('return') || title.toLowerCase().includes('market')) {
    return [
      { arabic: 'بدي أرجع هالقطعة', english: 'I want to return this item', emoji: '🔄' },
      { arabic: 'كم سعر هذا؟', english: 'How much is this?', emoji: '💰' },
      { arabic: 'عندكم مقاس أكبر؟', english: 'Do you have a bigger size?', emoji: '📏' },
    ];
  }

  // Default / general
  return [
    { arabic: 'مرحبا، كيف حالك؟', english: 'Hello, how are you?', emoji: '👋' },
    { arabic: 'ممكن تساعدني من فضلك؟', english: 'Can you help me please?', emoji: '🙏' },
    { arabic: 'أنا جديد هنا', english: "I'm new here", emoji: '🆕' },
  ];
}

export const StarterPrompts = ({ missionTitle, missionDesc, targetRole, onSelect, disabled }: StarterPromptsProps) => {
  const prompts = getStarterPrompts(missionTitle, targetRole);

  return (
    <div className="space-y-2">
      <div className="text-center text-xs text-muted-foreground">
        🇸🇦 Need help starting? Tap a phrase:
      </div>
      <div className="flex flex-wrap gap-2 justify-center max-w-sm mx-auto">
        {prompts.map((prompt, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(prompt.english)}
            disabled={disabled}
            className={cn(
              "group flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl",
              "bg-muted/50 border border-border/60 hover:border-primary/40 hover:bg-primary/5",
              "transition-all text-left min-w-[90px]",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            <span className="text-base">{prompt.emoji}</span>
            <span className="text-xs font-semibold text-foreground" dir="rtl">
              {prompt.arabic}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {prompt.english}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
