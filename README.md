# Private Practice Web Tools

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Laserwolve/PrivatePracticeWebTools.git
cd PrivatePracticeWebTools
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Build Tool**: Vite
- **State Management**: React hooks with localStorage persistence
- **Form Handling**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── components/
│   ├── SchemaGenerator.tsx      # Structured data markup tool
│   ├── LegalPageGenerator.tsx   # Legal document generator
│   ├── ImageOptimizer.tsx       # Image optimization tool
│   ├── ThemeToggle.tsx         # Dark/light mode toggle
│   └── ui/                     # Reusable UI components
├── hooks/
│   ├── use-theme.tsx           # Theme management
│   └── use-mobile.ts           # Mobile detection
├── lib/
│   └── utils.ts                # Utility functions
└── App.tsx                     # Main application component
```

## 🎨 Design Philosophy

The application follows a calming, professional design approach suitable for mental health professionals:
- **Clean Interface** - Minimalist design that doesn't overwhelm
- **Accessibility First** - WCAG compliant with proper contrast ratios
- **Mobile Responsive** - Fully functional on all device sizes
- **Professional Aesthetics** - Color scheme and typography that builds trust

## 💾 Data Persistence

All form data is automatically saved to browser localStorage, ensuring:
- No data loss when switching between tools
- Persistent settings across browser sessions
- No server-side data storage for privacy

## 🤝 Contributing

We welcome contributions from the mental health and web development communities! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get involved.

## 📋 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## 🆘 Support

If you need help using these tools or have questions about implementation, please check our [Support Guide](SUPPORT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏥 Disclaimer

This tool generates templates and suggestions. Always consult with legal professionals and ensure compliance with local regulations, HIPAA requirements, and professional licensing boards before implementing any generated content on your practice website.hensive web application providing mental health professionals with practical, easy-to-use tools to improve their practice's online presence and legal compliance.Private Practice Web Tools
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

## 🎯 Purpose

This toolkit is specifically designed for therapists, counselors, and mental health practitioners who need to:
- Enhance their website's search engine optimization (SEO)
- Generate legally compliant pages for their practice
- Optimize their web presence for better client discovery

## ✨ Features

### Schema Generator
Generate structured data markup for your therapy practice to improve search engine visibility:
- **Local Business Schema** - Help search engines understand your practice location and services
- **Organization Schema** - Establish your practice as a recognized entity
- **Specialty Page Schema** - Optimize individual service pages (anxiety therapy, couples counseling, etc.)
- **FAQ Schema** - Structure frequently asked questions for better search results

### Legal Page Generator
Create legally compliant pages required for therapy practices:
- **Terms of Service** - Comprehensive terms tailored for mental health services
- **Privacy Policy** - HIPAA-aware privacy policies for therapy practices
- **Good Faith Estimate** - Required documentation for transparent pricing

### Image Optimizer *(Coming Soon)*
Optimize images for better website performance and faster loading times.
