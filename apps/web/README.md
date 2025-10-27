# Web Application - Shreehari Mart

This is the customer-facing web application for Shreehari Mart, built with Next.js and a comprehensive custom design system based on Mantine UI.

## 🎨 Design System

**33 Production-Ready Components** organized in 3 phases:

- ✅ **Phase 1**: Core UI Elements (14 components)
- ✅ **Phase 2**: Form Components (12 components)
- ✅ **Phase 3**: Navigation Components (7 components)

### Quick Links

- 📋 [Component Inventory](./COMPONENT_INVENTORY.md) - All 33 components
- 📖 [Documentation Index](./DOCUMENTATION_INDEX.md) - Complete documentation guide
- ⚡ [Quick Reference](./COMPONENT_QUICK_REFERENCE.md) - Common patterns
- 🎨 [Theme Guide](./THEME_DOCUMENTATION.md) - Custom theme system

### View Live Demo

```bash
npm run dev
# Navigate to http://localhost:4200/theme
```

## Project Structure

```
src/
  app/                 # Next.js App Router pages
    layout.tsx         # Root layout with Mantine provider
    page.tsx           # Homepage
    theme/page.tsx     # Design system showcase
    global.css         # Global styles
  components/
    ui/                # 33 Design System components
      Text.tsx         # Typography
      Button.tsx       # Buttons
      Input.tsx        # Form inputs
      Breadcrumb.tsx   # Navigation
      index.ts         # All exports
  theme/               # Custom theme configuration
    colors.ts          # Brand colors
    typography.ts      # Font settings
    spacing.ts         # Spacing tokens
    mantine-theme.ts   # Mantine config
  features/            # Feature-specific modules
  hooks/               # Custom React hooks
  utils/               # Utility functions
```

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: Mantine 8.3 + Custom Components
- **Icons**: Tabler Icons
- **Language**: TypeScript
- **Styling**: Custom Theme System

## Design System Components (33)

### Typography (3)

- **Text** - Basic text with color variants
- **Heading** - Semantic headings H1-H6
- **Paragraph** - Text with relaxed line height

### Buttons (4)

- **Button** - Standard button with variants
- **IconButton** - Icon-only button
- **LinkButton** - Styled anchor link
- **LoadingButton** - Button with loading state

### Icons (2)

- **Icon** - Icon wrapper with size control
- **IconWrapper** - Icon with background

### Avatars (2)

- **Avatar** - User avatar with initials
- **AvatarGroup** - Multiple avatars with overflow

### Badges (2)

- **Badge** - Status badges
- **Chip** - Light badges, removable

### Layout (1)

- **Divider** - Horizontal/vertical separator

### Forms (12)

- **Input** - Text input field
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Checkbox** - Boolean input
- **RadioGroup** - Exclusive option selection
- **Switch** - Toggle on/off
- **Slider** - Range input
- **DatePicker** - Date selection
- **FileUpload** - File input with preview
- **SearchInput** - Search input field
- **FormField** - Label, hint, error wrapper
- **Form** - Form container with submit

### Navigation (7)

- **Breadcrumb** - Navigation path display
- **Tabs** - View switching
- **Pagination** - Page navigation
- **DropdownMenu** - Click-triggered menu
- **SidebarMenu** - Nested sidebar navigation
- **Stepper** - Multi-step process
- **NavLink** - Styled active link

## Layout Components

### LayoutWrapper

Main layout component that wraps all pages with:

- Responsive header with navigation
- Mobile menu support
- Footer with company information
- AppShell from Mantine for consistent layout

### Header

- Logo and branding
- Navigation menu (Products, About, Contact)
- Shopping cart indicator
- User account menu

### Footer

- Company information
- Quick links
- Customer service links
- Social media icons
- Contact information

## Development

To run the web application:

```bash
# From the workspace root
nx serve web

# Or using yarn
yarn nx serve web
```

The application will be available at `http://localhost:4200`

## Features

- ✅ Responsive design
- ✅ Modern, clean UI with Mantine components
- ✅ Header/Footer layout
- ✅ Homepage with hero section
- ✅ Feature highlights
- ✅ Product showcase
- ✅ Mobile-friendly navigation

## Next Steps

1. Add product catalog pages
2. Implement shopping cart functionality
3. Create product detail pages
4. Add user authentication
5. Integrate with the API backend
