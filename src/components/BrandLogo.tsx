import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'horizontal' | 'icon-only' | 'badge';
  showTagline?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inverted?: boolean;
}

/**
 * PrimiPassi Education Advisors Vector Logo
 * Features the 3 ascending stepping figures (Green, Orange, Red)
 * and the official tagline: "Your Dreams. Our Guidance. Your Future."
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'compact',
  showTagline = false,
  className = '',
  size = 'md',
  inverted = false
}) => {
  // Dimension scales
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  const subSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[11px] sm:text-xs tracking-[0.18em]',
    lg: 'text-xs sm:text-sm tracking-[0.22em]',
    xl: 'text-sm sm:text-base tracking-[0.25em]'
  };

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
    xl: 'text-base sm:text-lg'
  };

  // Pure Vector SVG of the 3 ascending figures and stepped platform
  const LogoIcon = (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-contain shrink-0"
      aria-label="PrimiPassi Stepping Figures Logo"
    >
      {/* --- Step 1 (Green) Bottom Left --- */}
      {/* Ground / Step Curve 1 */}
      <path
        d="M6 78 C14 74, 28 71, 38 67 C40 68, 38 72, 36 75 C26 78, 14 82, 6 86 Z"
        fill="#0D783B"
      />
      {/* Walking Figure 1 (Green) */}
      {/* Head */}
      <circle cx="23" cy="35" r="4.5" fill="#0D783B" />
      {/* Torso & Striding Limbs */}
      <path
        d="M23 41 C21 41, 19 44, 18 47 L15 57 C14.5 58.5, 16.5 59.5, 17.5 58 L20 50 L20.5 56 L16 71 C15.5 73, 18 74, 19 72 L23 60 L27 70 C27.5 72, 30.5 71, 30 69 L26 55 L26 48 L30 54 C31 55.5, 33 54, 32 52.5 L27 45 C26 43, 24.5 41, 23 41 Z"
        fill="#0D783B"
      />

      {/* --- Step 2 (Orange) Middle Elevated --- */}
      {/* Ground / Step Curve 2 */}
      <path
        d="M42 66 C52 63, 66 60, 76 56 C77.5 58, 76 61, 74 64 C64 67, 51 70, 41 73 Z"
        fill="#EA580C"
      />
      {/* Walking Figure 2 (Orange) */}
      {/* Head */}
      <circle cx="58" cy="27" r="4.8" fill="#EA580C" />
      {/* Torso & Striding Limbs */}
      <path
        d="M58 33 C56 33, 54 36, 53 39 L50 49 C49.5 50.5, 51.5 51.5, 52.5 50 L55 42 L55.5 48 L51 63 C50.5 65, 53 66, 54 64 L58 52 L62 62 C62.5 64, 65.5 63, 65 61 L61 47 L61 40 L65 46 C66 47.5, 68 46, 67 44.5 L62 37 C61 35, 59.5 33, 58 33 Z"
        fill="#EA580C"
      />

      {/* --- Step 3 (Red / Crimson) Top Right --- */}
      {/* Ground / Step Curve 3 */}
      <path
        d="M80 55 C90 52, 104 49, 114 45 C115.5 47, 114 50, 112 53 C102 56, 89 59, 79 62 Z"
        fill="#DC2626"
      />
      {/* Walking Figure 3 (Red) */}
      {/* Head */}
      <circle cx="95" cy="22" r="5" fill="#DC2626" />
      {/* Torso & Striding Limbs */}
      <path
        d="M95 28 C93 28, 91 31, 90 34 L87 44 C86.5 45.5, 88.5 46.5, 89.5 45 L92 37 L92.5 43 L88 58 C87.5 60, 90 61, 91 59 L95 47 L99 57 C99.5 59, 102.5 58, 102 56 L98 42 L98 35 L102 41 C103 42.5, 105 41, 104 39.5 L99 32 C98 30, 96.5 28, 95 28 Z"
        fill="#DC2626"
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return (
      <div className={`relative ${iconSizes[size]} ${className}`} title="PrimiPassi Education Advisors">
        {LogoIcon}
      </div>
    );
  }

  const primaryTextColor = inverted ? 'text-white' : 'text-[#0F2557]';
  const taglineTextColor = inverted ? 'text-slate-200' : 'text-[#0F2557]';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-3">
        {/* Step Icon */}
        <div className={`${iconSizes[size]} shrink-0 transition-transform duration-200`}>
          {LogoIcon}
        </div>

        {/* Text Block */}
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-serif font-extrabold tracking-tight ${titleSizes[size]} ${primaryTextColor}`}
              style={{ fontFamily: "'Playfair Display', 'Merriweather', 'Georgia', serif" }}
            >
              Primi<span className="text-[#0F2557]">Passi</span>
            </span>
          </div>

          <span
            className={`font-sans font-bold uppercase text-[#EA580C] ${subSizes[size]} mt-0.5`}
            style={{ letterSpacing: '0.22em' }}
          >
            Education Advisors
          </span>
        </div>
      </div>

      {/* Official Tagline */}
      {(showTagline || variant === 'full') && (
        <div className="mt-1.5 pt-1 border-t border-slate-200/60">
          <p
            className={`font-sans font-medium tracking-wide ${taglineSizes[size]} ${taglineTextColor}`}
          >
            Your Dreams. Our Guidance. Your Future.
          </p>
        </div>
      )}
    </div>
  );
};
