# Content Hub Management Platform

A comprehensive content management platform for marketing teams, built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Content overview and management
- **Content Generation**: AI-powered content creation
- **Content Editor**: Rich text editing capabilities
- **Proof Points**: Evidence and testimonial management
- **Planner**: Task and project management
- **Leads & Prospects**: Customer relationship management
- **Event Hub**: Event planning and management
- **Assets Management**: Digital asset organization
- **Analytics**: Performance tracking and insights
- **Authentication**: Secure user login system

## Getting Started

### Prerequisites

- Node.js (v18.16.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Linting**: ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   └── common/         # Common components (sidebar, header)
├── pages/              # Page components
├── data/               # Mock data and constants
├── utils/              # Utility functions and helpers
├── assets/             # Static assets (images, icons)
└── App.tsx            # Main application component
```

## Authentication

The application includes a login system with role-based access. Default credentials can be found in the LoginPage component.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
