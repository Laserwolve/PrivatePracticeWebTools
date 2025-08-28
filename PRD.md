# TherapyToolkit - SEO Tools Hub for Therapist Websites

A comprehensive web application providing therapists with practical, easy-to-use SEO tools to improve their practice's online visibility and attract more clients.

**Experience Qualities**:
1. **Professional** - Clean, trustworthy interface that reflects the serious nature of mental health practice
2. **Accessible** - Intuitive tools that work for therapists with varying technical backgrounds
3. **Actionable** - Provides clear, specific guidance rather than overwhelming technical jargon

**Complexity Level**: Light Application (multiple features with basic state)
The app provides several interconnected SEO tools with saved results and progress tracking, but doesn't require user accounts or complex backend systems.

## Essential Features

### SEO Keyword Planner
- **Functionality**: Generate relevant keywords for therapy practices based on specialization, location, and target demographics
- **Purpose**: Help therapists discover search terms their potential clients use
- **Trigger**: User selects therapy specialization and enters location
- **Progression**: Select specialization → Enter location → Choose demographics → Generate keywords → Save favorites
- **Success criteria**: Produces 20+ relevant, location-specific therapy keywords with search volume indicators

### Meta Description Generator
- **Functionality**: Create compelling meta descriptions for therapy practice pages
- **Purpose**: Improve click-through rates from search results
- **Trigger**: User inputs page type and practice details
- **Progression**: Select page type → Input practice info → Generate descriptions → Preview in search result mockup → Copy to clipboard
- **Success criteria**: Generates 3-5 unique meta descriptions under 160 characters with compelling copy

### Local SEO Checker
- **Functionality**: Analyze and score local SEO factors for therapy practices
- **Purpose**: Identify specific improvements for local search visibility
- **Trigger**: User enters practice name and location
- **Progression**: Enter practice details → Scan local factors → Show score breakdown → Provide improvement recommendations → Track progress
- **Success criteria**: Provides actionable local SEO score with specific next steps

### Content Topic Generator
- **Functionality**: Suggest blog post topics and therapy-related content ideas
- **Purpose**: Help therapists create valuable content that attracts and helps potential clients
- **Trigger**: User selects therapy specialization and content goals
- **Progression**: Choose specialization → Set content goals → Generate topics → View topic details → Save to content calendar
- **Success criteria**: Produces 15+ relevant, SEO-friendly content topics with brief outlines

### Page Title Optimizer
- **Functionality**: Create and test optimized page titles for therapy websites
- **Purpose**: Improve search rankings and click-through rates
- **Trigger**: User enters current page title and target keywords
- **Progression**: Input current title → Enter target keywords → Generate optimized versions → Preview search appearance → A/B test suggestions
- **Success criteria**: Generates multiple title variations with character count and SEO scoring

## Edge Case Handling

- **No Location Provided**: Default to general therapy keywords with option to add location later
- **Unclear Specialization**: Provide general therapy options and allow multiple selections
- **Generated Content Too Generic**: Include customization options and manual editing capabilities
- **Saved Data Loss**: Implement auto-save with clear indicators of saved vs. unsaved state
- **Tool Results Empty**: Show helpful error messages with alternative suggestions

## Design Direction

The design should feel professional and calming, reflecting the therapeutic environment while maintaining a modern, tech-forward appearance that builds confidence in the tools' effectiveness.

## Color Selection

Triadic color scheme using calming blues, warm earth tones, and fresh accents to create a balanced, professional therapeutic atmosphere.

- **Primary Color**: Deep Teal (oklch(0.45 0.12 200)) - Professional trust and expertise
- **Secondary Colors**: Warm Sage (oklch(0.75 0.08 130)) for supportive elements, Cream (oklch(0.95 0.02 80)) for backgrounds
- **Accent Color**: Coral (oklch(0.7 0.15 35)) for calls-to-action and important highlights
- **Foreground/Background Pairings**: 
  - Background (Cream #F8F7F4): Dark Teal text (oklch(0.25 0.12 200)) - Ratio 7.2:1 ✓
  - Primary (Deep Teal): White text (oklch(1 0 0)) - Ratio 8.1:1 ✓
  - Secondary (Warm Sage): Dark text (oklch(0.2 0.02 200)) - Ratio 9.5:1 ✓
  - Accent (Coral): White text (oklch(1 0 0)) - Ratio 5.8:1 ✓

## Font Selection

Typography should convey professionalism and approachability, using clean sans-serif fonts that enhance readability and trust.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold/32px/tight letter spacing
  - H2 (Tool Titles): Inter Semibold/24px/normal spacing
  - H3 (Section Headers): Inter Medium/18px/normal spacing
  - Body Text: Inter Regular/16px/relaxed line height
  - Tool Labels: Inter Medium/14px/normal spacing
  - Helper Text: Inter Regular/14px/muted color

## Animations

Subtle, purposeful animations that guide users through tool workflows while maintaining the calm, professional atmosphere appropriate for therapy-related services.

- **Purposeful Meaning**: Gentle transitions that reduce anxiety and create smooth, guided experiences
- **Hierarchy of Movement**: Tool result reveals and form progression animations take priority over decorative effects

## Component Selection

- **Components**: Cards for tool sections, Tabs for multi-step tools, Forms for input collection, Badges for keyword tags, Progress bars for SEO scores, Tooltips for explanations
- **Customizations**: Custom result preview components for meta descriptions and page titles, specialized scoring visualizations
- **States**: Form inputs with validation states, buttons with loading states for generation processes, saved/unsaved indicators
- **Icon Selection**: Search, target, chart-bar for analytics, bookmark for saved items, copy for clipboard actions
- **Spacing**: Generous padding (6-8) for tools, consistent margins (4-6) between sections
- **Mobile**: Single-column layout with collapsible tool sections, bottom-sticky action buttons for mobile completion