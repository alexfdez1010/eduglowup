# EduGlowUp

EduGlowUp is an educational platform designed to transform learning into a gamified experience. The platform helps users learn anything they need quickly and in a fun way by leveraging AI-powered tools, personalized exercises, and gamification elements.

## About EduGlowUp

EduGlowUp was created to solve a common problem: traditional studying methods often don't yield effective results despite hours of effort. The platform combines active recall, spaced repetition, and AI-powered content generation to make learning more efficient and enjoyable.

Key features include:

- Content organization (compatible with videos, PDFs, PowerPoint, and Word)
- Personalized exercises
- Gamification and rewards
- Automatic summaries
- Performance tracking and statistics
- Clear and concise feedback

This repository contains the codebase for the EduGlowUp web application, which was originally developed by a team composed by [Alejandro Fernández Camello](https://github.com/alexfdez1010) and [Óscar Baños Campos](https://github.com/Oscar-Banos-Campos).

## Why We Open-Sourced

We've decided to open-source this project as we are no longer pursuing it commercially. We believe the technology and approach we developed could benefit the educational technology community and serve as a learning resource for developers interested in building educational platforms with modern web technologies.

## Tech Stack

EduGlowUp is built with the following technologies:

- [Next.js](https://nextjs.org/) for server-side rendering
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prisma](https://www.prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [NextUI](https://nextui.org/) for UI components
- [Zod](https://github.com/colinhacks/zod) for validation
- [Vitest](https://vitest.dev/) for unit and integration testing
- [Cypress](https://www.cypress.io/) for end-to-end testing

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v22 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for the database

### Environment Setup

1. Clone the repository

```bash
git clone https://github.com/alexfdez1010/eduglowup.git
cd eduglowup
```

2. Install dependencies

```bash
npm install
```

Also, you will need to have installed `ffmpeg` in order to work the video part.

3. Create a `.env` file based on the `.env.example` file

```bash
cp .env.example .env
```

4. Configure your environment variables in the `.env` file (see Environment Variables section below)

### Running the Application

#### Development Mode

To run the application in development mode:

```bash
npm run dev
```

This command will:

1. Start the PostgreSQL database using Docker Compose
2. Start the Next.js development server
3. Shut down the database when the development server is stopped

#### Production Mode

To build and run the application in production mode:

```bash
npm run launch
```

This will build the application, set up the database, and start the server.

For testing in a production-like environment:

```bash
npm run launch:test
```

### Database Management

- Start the database: `npm run database`
- Stop the database: `npm run database:down`
- Create the database schema: `npm run database:create`
- Apply schema changes and generate migrations: `npm run database:dev`

## Environment Variables

The application requires several environment variables to function properly. Below is an explanation of each variable in the `.env.example` file:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma (format: `postgres://<username>:<password>@<host>:<port>/<database>?schema=<schema>`) |
| `AUTH_SECRET` | Secret key used for authentication and session management |
| `OPENAI_API_KEY` | API key for OpenAI services (used for AI-powered features) |
| `DOMAIN` | The domain name where the application is hosted (for development set to `localhost`) |
| `GOOGLE_CLIENT_ID` | Client ID for Google OAuth authentication |
| `GOOGLE_CLIENT_SECRET` | Client secret for Google OAuth authentication |
| `DEEP_INFRA_API_KEY` | API key for DeepInfra services |
| `WEB_DOMAIN` | The web domain for the application where it is deployed on production |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID for tracking |
| `GOOGLE_REDIRECT_URI` | Redirect URI for Google OAuth authentication |
| `PRIVATE_TOKEN` | Private key to secure server-only API calls (prevents unauthorized access to sensitive endpoints) |
| `TZ` | Timezone setting for the application |
| `AWS_ACCESS_KEY_ID` | AWS access key ID for S3 storage |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key for S3 storage |
| `AWS_REGION` | AWS region for S3 storage |
| `AWS_S3_BUCKET` | AWS S3 bucket name for file storage |
| `RESEND_API_KEY` | API key for Resend email service |
| `GOOGLE_API_KEY` | Google API key for Gemini |

## Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:llm           # LLM-related tests
npm run test:e2e           # End-to-end tests
```

## Code Quality

- Format code: `npm run format`
- Lint code: `npm run lint`

## Project Structure

The codebase follows the standard Next.js App Router structure:

- `app/`: Contains all pages and API routes
- `components/`: React components
- `lib/`: Backend logic and utilities
- `prisma/`: Prisma schema and migrations
- `public/`: Static assets
- `__tests__/`: Test files organized by type

## Web Application Routes

- `/`: Landing page with information about EduGlowUp
- `/[locale]/sign-up`: User registration page
- `/[locale]/sign-in`: User login page
- `/[locale]/dashboard`: Main application dashboard for admin users
- `/[locale]/courses`: Available courses and learning materials
- `/[locale]/profile`: User profile
- `/[locale]/about`: Information about the EduGlowUp team and mission
- `/[locale]/app/`: Application routes for authenticated users and where the personalized content is displayed
- `/api/*`: Backend API endpoints for data operations

Note: The application supports internationalization with the `[locale]` parameter in routes.

## Contributing

We welcome contributions to improve EduGlowUp! Please feel free to submit issues and pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Special thanks to all who supported the development of EduGlowUp, including our early users and testers.