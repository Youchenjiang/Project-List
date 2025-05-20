# Project-List

<!-- markdownlint-disable MD013 MD033 -->

<div style="text-align: center;">

[English](README.md) | [中文](README_zh.md)

</div>
A collection of small, interactive projects designed to help you learn and explore various frontend features and techniques.

## Table of Contents

- [Project-List](#project-list)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Installation and Usage](#installation-and-usage)
    - [System Requirements](#system-requirements)
    - [Quick Start](#quick-start)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
    - [Full-Stack Development](#full-stack-development)
    - [Adding New Features](#adding-new-features)
  - [CI/CD Setup](#cicd-setup)
  - [Projects and Features](#projects-and-features)
    - [Frontend Application](#frontend-application)
    - [Backend Service](#backend-service)
    - [Standalone Projects](#standalone-projects)
  - [Development Guidelines](#development-guidelines)
    - [Code Style](#code-style)
    - [Commit Guidelines](#commit-guidelines)
  - [Contribution](#contribution)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Purpose

This repository serves as a learning resource and inspiration for developers who want to experiment with frontend development concepts. Each project is self-contained and demonstrates a specific feature or effect. The key design principle is that every small project can run independently, even when separated from the main framework.

## Tech Stack

- Frontend Framework: React.js
- Build Tool: Create React App
- Styling: CSS Modules / SCSS
- Project Management: Git

## Project Structure

```text
Project-List/
├── frontend/              # Frontend React application
│   ├── node_modules/      # Dependencies
│   ├── public/            # Static files and assets
│   │   ├── assets/        # Static assets
│   │   │   ├── images/    # Images
│   │   │   └── icons/     # Icons
│   │   ├── projects/      # Project examples (each can run independently)
│   │   │   ├── Effect-Download/
│   │   │   │   ├── index.html   # Standalone HTML file
│   │   │   │   └── styles.css  # Project-specific styles
│   │   │   ├── Effect-Ripple/
│   │   │   │   ├── index.html   # Standalone HTML file
│   │   │   │   └── styles.css  # Project-specific styles
│   │   │   └── Visual Map/
│   │   │       ├── index.html   # Standalone HTML file
│   │   │       ├── taiwan-map.js # Main map visualization code
│   │   │       ├── styles.css  # Project-specific styles
│   │   │       ├── taiwan-geo-data1.json # Taiwan map geographic data 1
│   │   │       ├── taiwan-geo-data2.json # Taiwan map geographic data 2
│   │   │       ├── population-data.json # Population distribution data
│   │   │       ├── user-distribution.json # User distribution data
│   │   │       ├── echarts.min.js # ECharts library
│   │   │       └── data-sources.txt # Data sources documentation
│   │   ├── index.html     # Main HTML file
│   │   ├── manifest.json  # PWA configuration
│   │   └── robots.txt     # Search engine configuration
│   ├── src/               # Source code
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Layout.js  # Layout component
│   │   │   ├── Sidebar.js # Sidebar component
│   │   │   ├── ContentArea.js # Content area component
│   │   │   └── TeddyBelleInteraction.js # Teddy Bear and Belle interaction component
│   │   ├── context/       # React context for state management
│   │   │   └── ProjectContext.js # Project context provider
│   │   ├── styles/        # CSS styles organized by component
│   │   │   ├── layout.css # Layout styles
│   │   │   ├── sidebar.css # Sidebar styles
│   │   │   ├── content.css # Content area styles
│   │   │   ├── characterAnimations.css # Character animation styles
│   │   │   ├── characterSvg.css # Character SVG styles
│   │   │   ├── teddyBelle.css # Teddy and Belle interaction styles
│   │   │   └── index.css  # Imported styles index
│   │   ├── data/          # Data files
│   │   │   └── projects.js # Projects data
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Main styles
│   │   ├── index.js       # Entry point
│   │   ├── index.css      # Global styles
│   │   └── reportWebVitals.js  # Performance monitoring
│   ├── package.json       # Project dependencies
│   └── package-lock.json  # Dependency lock file
├── backend/               # Backend service
│   ├── go.mod             # Go module dependencies
│   └── main.go            # Main Go server file
└── .vscode/               # VS Code settings
```

## Installation and Usage

Follow these steps to set up and use the project:

### System Requirements

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Go (v1.21 or higher) - for backend development

### Quick Start

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Youchenjiang/Project-List.git
   cd Project-List
   ```

2. **Install Dependencies and Start the Application**

   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Explore Features**
   - The application will be available at `http://localhost:3000`
   - Features are organized in the navigation menu
   - Click on the feature you want to explore

4. **View Source Code**
   - All features are implemented in React components
   - Source code is located in the `frontend/src` directory
   - You can view and modify the code directly

5. **Run Individual Projects Independently**
   - Each project in `frontend/public/projects/` can run independently
   - Simply open any project's `index.html` file directly in a browser
   - No need for the React framework or backend to run individual projects

### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Available Scripts**

   - Start development server:

     ```bash
     npm start
     ```

   - Build for production:

     ```bash
     npm run build
     ```

   - Deploy to GitHub Pages:

     ```bash
     npm run deploy
     ```

   - Run tests:

     ```bash
     npm test
     ```

4. **Development Environment**

   The frontend is built with React and uses the following key dependencies:
   - React v18.2.0
   - React Router v6.14.1
   - Testing libraries for unit and integration tests

### Backend Setup

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Install Go dependencies**

   ```bash
   go mod download
   ```

   Required dependencies:
   - golang.org/x/net - Core networking functionality
   - github.com/gorilla/mux - HTTP router and dispatcher

3. **Run the backend server**

   ```bash
   go run main.go
   ```

4. **Backend API**

   The backend server will start on `http://localhost:8080` by default and provides the following endpoints:
   - `/` - Main application endpoint
   - `/{project-name}/` - Individual project endpoints

5. **Important Note About Backend**

   While the backend provides a convenient way to browse all projects, **it is not required to run individual projects**. Each project in the `frontend/public/projects/` directory is designed to run independently by simply opening its HTML file in a browser.

### Full-Stack Development

1. **Start both servers**

   You'll need to run both the frontend and backend servers for full functionality:

   Terminal 1:

   ```bash
   cd frontend
   npm start
   ```

   Terminal 2:

   ```bash
   cd backend
   go run main.go
   ```

2. **Development Workflow**

   - Frontend changes will automatically reload in the browser
   - Backend changes require server restart
   - Use Git for version control following the commit guidelines

### Adding New Features

1. **Creating a new effect or component**

   - Create a new directory in `frontend/public/projects/` for static assets
   - Create a new component in `frontend/src/components/`
   - Add corresponding styles in `frontend/src/styles/` directory
     - Follow the naming convention: `componentName.css`
     - Import your styles in `styles/index.css` if needed
   - If needed, update the context in `frontend/src/context/ProjectContext.js`
     - Use the `useProject` hook to access project data in your components
   - Update the main App.js to include your new component or update the Layout component

2. **Testing your changes**

   - Write tests for your components in the same directory with a `.test.js` suffix
   - Run tests with `npm test`
   - Ensure all existing tests pass before submitting changes

3. **Documentation**

   - Update this README.md with information about your new feature
   - Include code comments explaining complex logic
   - Consider adding a demo or screenshot if applicable

## CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment. The workflow configurations can be found in the `.github/workflows` directory.

### Frontend Build Workflow

The frontend build workflow (`frontend-build.yml`) automatically runs when changes are pushed to the frontend code. It performs the following steps:

1. Sets up a Node.js environment
2. Installs dependencies
3. Runs linting checks
4. Executes tests
5. Builds the frontend application
6. Archives build artifacts

### Pull Request Process

When creating a pull request:

1. The CI workflow will automatically run
2. All checks must pass before merging
3. At least one approving review is required
4. Reviews must be from someone other than the last pusher

### Manual Deployment

The project can be manually deployed to GitHub Pages using:

```bash
cd frontend
npm run deploy
```

## Projects and Features

This repository contains the following projects and features:

### Frontend Application

A React-based application that demonstrates modern frontend development practices with these features:

- Interactive user interface
- Modern React development workflow
- Clean code organization
- Performance optimization

### Backend Service

A Go-based backend service that complements the frontend application with these features:

- RESTful API endpoints
- Efficient data processing
- Secure authentication
- Scalable architecture

### Standalone Projects

Each project in the `frontend/public/projects/` directory is designed to be completely standalone:

- **Independent HTML/CSS/JS**: Each project contains all necessary files to run independently
- **No External Dependencies**: Projects don't rely on the React framework or backend
- **Direct Execution**: Simply open any project's `index.html` file in a browser to see it in action
- **Self-Contained Code**: All code needed for the effect or feature is contained within the project folder
- **Easy to Extract**: Projects can be copied to any location and will still function correctly

## Development Guidelines

### Code Style

1. Use functional components with hooks
2. Follow React best practices
3. Use CSS Modules for styling
4. Implement proper error handling
5. Write clean and maintainable code

### Commit Guidelines

1. Use conventional commits format
2. Keep commit messages clear and concise
3. Group related changes together
4. Test changes before committing

## Contribution

We welcome contributions! To contribute:

1. Fork this repository
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit:

   ```bash
   git commit -m "feat: your descriptive commit message"
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request

## License

This repository is licensed under the MIT License. Feel free to use and modify the code as you like.

## Acknowledgements

I would like to thank the following tools and platforms for their contributions to this project:

- **[Trae AI](https://trae.ai) & [Windsurf](https://windsurf.com/)**: For providing intelligent coding assistance and development support
- **[VS Code Insiders](https://code.visualstudio.com/insiders/)**: For its excellent GitHub Copilot integration and convenient rapid editing capabilities
- **[GitHub Copilot](https://github.com/features/copilot)**: For enhancing productivity with AI-powered code suggestions
- **[Rider](https://www.jetbrains.com/rider/)**: For facilitating efficient GitHub branch submissions and version control
- **[FreeConvert](https://www.freeconvert.com/jpg-to-svg)**: For providing JPG to SVG conversion services
- **[Medium - GitHub Pages Tutorial](https://lawrencechuang760223.medium.com/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-github-pages-%E4%BE%86%E6%9E%B6%E8%A8%AD%E7%B6%B2%E9%A0%81-662a089f4e4)**: For the helpful tutorial on setting up websites with GitHub Pages
- **[GitHub Pages React Tutorial](https://rexhung0302.github.io/2021/09/28/20210928/)**: For the comprehensive guide on deploying React applications to GitHub Pages
