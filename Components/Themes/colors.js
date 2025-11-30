
// Fresh green theme perfectly matching #F8F9FA body & #1A1A1A header/footer
const freshMint = {
  bodybackground: "#F8F9FA",      
  cardsbackground: "#FFFFFF",
  primary: "#00C96D",            
  accent: "#009E5A",    
  secondary: "#E0E0E0",
  text: "#1A1A1A",                 
  mutedText: "#6C757D",
  border: "#D1D1D1",
  error: "#FF3B30",
  headerbg: "#1A1A1A",
  formbg: "#0d0d0d",
  white:"#FFFFFF",
  gradients: {
    ocean: ["#009E5A", "#00C96D"],                
    mintGlow: ["#00E39F", "#00C96D"],         
    aquaPulse: ["#00FFCC", "#00C884"],            
    deepTech: ["#F8F9FA", "#E4E6EB"],  
    dark:  ["#232526", "#414345"],  
    // dark:  ["#0f0c29", "#302b63", "#24243e"],          
  },
};

// Keep previously created themes (optional)
const darkOcean = { /* your old theme */ };
const lightBreeze = { /* your old theme */ };
const blueNeon = { /* your old theme */ };

// Register themes
const themes = { freshMint, darkOcean, lightBreeze, blueNeon };

// Set active theme
const activeTheme = "freshMint";  // 👉 your new improved theme

export const colors = themes[activeTheme];
