# Overview

This is a mobile-first service marketplace application called "عدن لايف" (Aden Live), designed specifically for residents of Aden, Yemen. The application provides practical access to essential local services including water delivery, electricity solutions, healthcare, education, food delivery, transportation, communications, government services, and entertainment. The platform features a minimalist design optimized for low-bandwidth networks and Arabic language support with RTL layout.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for fast development builds and hot module replacement
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components using the "new-york" style
- **State Management**: TanStack React Query for server state management, caching, and synchronization
- **Routing**: Wouter for lightweight client-side routing with minimal bundle size impact
- **Internationalization**: Full Arabic language support with RTL layout and cultural context for Yemeni users
- **Performance**: Ultra-minimal design with zero image dependencies, system fonts only, and optimized for 2G networks
- **Design System**: Service grid with exact 3x3 layout, color-coded service categories, and mobile-first responsive design

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework using TypeScript and ES modules
- **API Design**: RESTful API structure with centralized route handling and error middleware
- **Development Setup**: Custom Vite integration for development with hot module replacement and middleware mode
- **Error Handling**: Structured JSON error responses with appropriate HTTP status codes and request logging
- **Build Process**: ESBuild for production bundling with external package handling

## Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Database**: PostgreSQL configured with Neon serverless driver for cloud scalability
- **Schema Design**: Basic user management system with ID, username, and password fields
- **Migrations**: Drizzle Kit for database schema versioning and deployment to "./migrations" directory
- **Type Safety**: Drizzle-Zod integration for runtime schema validation

## Development Environment
- **Build Tool**: Vite with React plugin and custom configuration for client-side development
- **Code Quality**: TypeScript with strict mode, ESNext modules, and comprehensive path aliases
- **Asset Management**: Path resolution for client assets, shared modules, and attached assets
- **Development Plugins**: Replit-specific plugins for error overlay and cartographer integration
- **Hot Reload**: Full development server with filesystem restrictions and build optimization

## File Structure
- **Monorepo Layout**: Separated client, server, and shared directories for clear separation of concerns
- **Client Directory**: React application with components, pages, hooks, and utilities
- **Server Directory**: Express backend with routing, storage abstraction, and Vite integration
- **Shared Directory**: Common schemas and types shared between client and server
- **Path Aliases**: Configured for easy imports (`@/` for client, `@shared/` for shared modules)

## External Dependencies

- **UI Components**: Radix UI primitives for accessible component foundation
- **Styling**: Tailwind CSS with PostCSS for utility-first styling approach
- **Database**: Neon PostgreSQL serverless with connection pooling
- **State Management**: TanStack React Query for server state synchronization
- **Form Handling**: React Hook Form with Hookform resolvers for validation
- **Development Tools**: Replit-specific plugins for enhanced development experience
- **Fonts**: Google Fonts (Noto Sans Arabic) for proper Arabic text rendering
- **Build Tools**: ESBuild for production builds and TSX for development execution