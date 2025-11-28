
export const theme = {
  colors: {
    // Backgrounds with glassmorphism support
    bg: {
      primary: 'hsl(0 0% 6%)',
      secondary: 'hsl(0 0% 10%)',
      tertiary: 'hsl(0 0% 14%)',
      elevated: 'hsl(0 0% 12%)',
      glass: 'hsla(0 0% 12% / 0.8)',
      glassHover: 'hsla(0 0% 16% / 0.9)',
    },
    // Status colors with semantic meaning
    status: {
      open: { bg: 'hsl(215 20% 20%)', text: 'hsl(215 20% 65%)', border: 'hsl(215 20% 35%)' },
      planning: { bg: 'hsl(270 50% 20%)', text: 'hsl(270 50% 70%)', border: 'hsl(270 50% 40%)' },
      review: { bg: 'hsl(38 90% 20%)', text: 'hsl(38 90% 60%)', border: 'hsl(38 90% 40%)' },
      executing: { bg: 'hsl(217 90% 20%)', text: 'hsl(217 90% 65%)', border: 'hsl(217 90% 45%)' },
      done: { bg: 'hsl(142 70% 15%)', text: 'hsl(142 70% 55%)', border: 'hsl(142 70% 35%)' },
      failed: { bg: 'hsl(0 70% 20%)', text: 'hsl(0 70% 60%)', border: 'hsl(0 70% 40%)' },
    },
    // Agent type colors
    agent: {
      orchestrator: 'hsl(270 60% 60%)',
      backend: 'hsl(217 90% 60%)',
      frontend: 'hsl(187 90% 50%)',
      testing: 'hsl(142 70% 50%)',
      documentation: 'hsl(38 90% 55%)',
      security: 'hsl(0 70% 55%)',
      devops: 'hsl(330 70% 60%)',
    },
    // Accent colors
    accent: {
      primary: 'hsl(217 90% 60%)',
      secondary: 'hsl(270 60% 60%)',
      success: 'hsl(142 70% 50%)',
      warning: 'hsl(38 90% 55%)',
      error: 'hsl(0 70% 55%)',
    },
    text: {
      primary: 'hsl(0 0% 98%)',
      secondary: 'hsl(0 0% 63%)',
      tertiary: 'hsl(0 0% 44%)',
      inverse: 'hsl(0 0% 6%)',
    },
    border: {
      default: 'hsl(0 0% 18%)',
      subtle: 'hsl(0 0% 14%)',
      focus: 'hsl(217 90% 60%)',
    }
  },
  spacing: {
    xs: '0.25rem', sm: '0.5rem', md: '0.75rem', lg: '1rem',
    xl: '1.5rem', '2xl': '2rem', '3xl': '3rem', '4xl': '4rem'
  },
  radius: {
    sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px'
  },
  shadow: {
    sm: '0 1px 2px hsla(0 0% 0% / 0.3)',
    md: '0 4px 6px hsla(0 0% 0% / 0.4)',
    lg: '0 10px 15px hsla(0 0% 0% / 0.5)',
    glow: '0 0 20px hsla(217 90% 60% / 0.3)',
    glowPurple: '0 0 20px hsla(270 60% 60% / 0.3)',
  },
  blur: { sm: '4px', md: '8px', lg: '16px', xl: '24px' },
  transition: {
    fast: '150ms ease', normal: '200ms ease', slow: '300ms ease'
  }
};

export type Theme = typeof theme;
export type StatusKey = keyof typeof theme.colors.status;
export type AgentType = keyof typeof theme.colors.agent;
