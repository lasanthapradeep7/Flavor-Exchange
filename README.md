# Flavor Exchange

A recipe-sharing platform built with Angular 15+ that allows users to discover, create, and share their favorite recipes.

## Features

- 🔐 Authentication (Mock)
  - Login & Signup using Angular Reactive Forms
  - Local storage-based user management
  - Protected routes with AuthGuard

- 🍲 Recipe Management
  - Browse recipe feed
  - View recipe details
  - Create and edit recipes
  - Search and filter recipes

- ❤️ Favorites
  - Save favorite recipes
  - View saved recipes
  - Remove from favorites

- 🎨 Modern UI
  - Responsive design
  - Tailwind CSS styling
  - Angular Material components

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v15 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flavor-exchange.git
cd flavor-exchange
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── auth/           # Authentication module
│   ├── core/           # Core services and guards
│   ├── favorites/      # Favorites module
│   ├── recipes/        # Recipes module
│   └── shared/         # Shared components
├── assets/             # Static assets
└── styles/             # Global styles
```

## Development

- Run `ng serve` for a dev server
- Run `ng build` to build the project
- Run `ng test` to execute unit tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
