# Contributing to Private Practice Web Tools

Thank you for your interest in contributing to Private Practice Web Tools! This project aims to help mental health professionals improve their online presence through practical web development tools.

## 🎯 Project Vision

We're building tools that make web development accessible to mental health professionals while maintaining high standards for code quality, accessibility, and user experience.

## 🚀 Ways to Contribute

### Code Contributions
- **Bug fixes**: Help identify and fix issues in existing tools
- **Feature enhancements**: Improve existing functionality
- **New tools**: Add new tools that benefit mental health practices
- **Performance improvements**: Optimize loading times and user experience
- **Accessibility improvements**: Ensure tools work for all users

### Non-Code Contributions
- **Documentation**: Improve setup guides, usage examples, and technical documentation
- **Testing**: Test tools with real-world scenarios and report issues
- **Design feedback**: Suggest UI/UX improvements
- **Content review**: Help ensure generated legal content meets professional standards

## 📋 Before You Start

1. **Check existing issues**: Look through [open issues](../../issues) to see if your idea is already being discussed
2. **Create an issue**: For significant changes, create an issue to discuss your approach before coding
3. **Review the codebase**: Familiarize yourself with the project structure and coding patterns

## 🛠️ Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Local Development

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/your-username/PrivatePracticeWebTools.git
   cd PrivatePracticeWebTools
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Coding Standards

### Code Style
- **TypeScript**: Use TypeScript for all new files
- **ESLint**: Follow the existing ESLint configuration
- **Components**: Use functional components with hooks
- **Imports**: Use absolute imports with `@/` prefix for `src/` directory

### Component Guidelines
```typescript
// ✅ Good: Functional component with proper typing
interface ComponentProps {
  title: string;
  optional?: boolean;
}

export function Component({ title, optional = false }: ComponentProps) {
  // Component logic here
}

// ✅ Good: Use semantic HTML and proper accessibility
<button 
  type="button"
  aria-label="Close dialog"
  onClick={handleClose}
>
  Close
</button>
```

### Accessibility Requirements
- **WCAG 2.1 AA compliance**: All new features must meet accessibility standards
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
- **Screen reader support**: Use proper ARIA labels and semantic HTML
- **Color contrast**: Maintain minimum 4.5:1 contrast ratio for text

### Testing
- Test components manually in both light and dark themes
- Verify mobile responsiveness on different screen sizes
- Test keyboard navigation and screen reader compatibility
- Ensure localStorage persistence works correctly

## 🎨 Design Guidelines

### UI/UX Principles
- **Professional appearance**: Maintain calm, trustworthy design suitable for mental health context
- **Simplicity**: Keep interfaces clean and uncluttered
- **Progressive disclosure**: Show advanced options only when needed
- **Immediate feedback**: Provide clear success/error states

### Component Usage
- Use existing UI components from `src/components/ui/`
- Follow established patterns for forms, buttons, and layouts
- Maintain consistent spacing using Tailwind CSS classes

## 📚 Pull Request Process

### Before Submitting
1. **Test thoroughly**: Verify your changes work in different browsers and screen sizes
2. **Check accessibility**: Test with keyboard navigation and screen readers if possible
3. **Update documentation**: Add or update relevant documentation
4. **Self-review**: Review your own code for clarity and potential issues

### Pull Request Guidelines
1. **Clear title**: Use descriptive titles like "Add schema validation for FAQ pages"
2. **Detailed description**: Explain what changes you made and why
3. **Link issues**: Reference any related issues with "Fixes #123" or "Relates to #456"
4. **Screenshots**: Include screenshots for UI changes
5. **Testing notes**: Describe how you tested the changes

### Review Process
- Maintainers will review your PR within a few days
- Address any feedback promptly
- Be open to suggestions and alternative approaches
- Once approved, maintainers will merge your changes

## 🐛 Reporting Bugs

### Bug Report Template
When reporting bugs, please include:

```markdown
## Bug Description
Brief description of what's wrong

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- Browser: Chrome 120.0
- OS: Windows 11
- Screen size: 1920x1080
```

## 💡 Suggesting Features

### Feature Request Template
```markdown
## Feature Summary
Brief description of the proposed feature

## Problem it Solves
What user need does this address?

## Proposed Solution
How should this feature work?

## Alternative Solutions
Any alternative approaches considered?

## Additional Context
Any mockups, examples, or additional details
```

## 🔒 Security Considerations

- **Client-side only**: This project runs entirely in the browser
- **No sensitive data**: Avoid storing sensitive information in localStorage
- **Legal compliance**: Ensure generated content meets professional standards
- **Privacy first**: No data should be transmitted to external servers

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions and community support
- **Documentation**: Check the README and inline code comments

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation acknowledgments

Thank you for helping make web development more accessible to mental health professionals!
