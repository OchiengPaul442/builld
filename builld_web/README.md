# Next.js TypeScript Project

This repository contains a Next.js application built with TypeScript using the App Router architecture.

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.17.0 or higher)
- [pnpm](https://pnpm.io/) (v8.0.0 or higher)

## Installation

Clone the repository and install dependencies using pnpm:

```bash
# Clone the repository
git clone https://github.com/Builld-technologies/Builld-frontend.git
cd cd src/builld_web

# Install dependencies
pnpm install
```

## Development

To start the development server:

### Windows

```powershell
pnpm dev
```

### macOS / Linux

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To create a production build:

### Windows

```powershell
pnpm build
```

### macOS / Linux

```bash
pnpm build
```

## Running Production Build

To start the production server after building:

### Windows

```powershell
pnpm start
```

### macOS / Linux

```bash
pnpm start
```

## Project Structure

```
├── public/            # Static assets
├── src/               # Source code
│   ├── app/           # App Router routes
│   ├── components/    # Reusable components
│   ├── lib/           # Utility functions and libraries
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── .env.example       # Example environment variables
├── .eslintrc.json     # ESLint configuration
├── .gitignore         # Git ignore file
├── next.config.js     # Next.js configuration
├── package.json       # Project dependencies and scripts
├── pnpm-lock.yaml     # pnpm lock file
├── postcss.config.js  # PostCSS configuration
├── README.md          # Project documentation (this file)
├── tailwind.config.js # Tailwind CSS configuration (if used)
└── tsconfig.json      # TypeScript configuration
```

## Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the application for production
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint to check code quality
- `pnpm test`: Run tests (if configured)

## Environment Variables

Copy the `.env.example` file to `.env.local` and adjust the variables as needed:

```bash
cp .env.example .env.local
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/motivation)
