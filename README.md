## 📌 Overview

This repository contains our Capstone Project, developed as part of our academic or professional coursework. The project focuses on [briefly describe the main goal, e.g., "a web application for X using modern full-stack technologies"].

🔗 GitHub Repository: https://github.com/OXWiz666/capstone

## 🚀 Features

Modern UI: Built with React JS, Tailwind CSS, and Bootstrap CSS for a responsive and clean design.
Full-Stack Integration: Uses Laravel (PHP) for backend logic and Inertia JS for seamless frontend-backend communication.

🛠️ Technologies Used

Frontend
React JS (Component-based UI)
Tailwind CSS (Utility-first CSS framework)
Bootstrap CSS (Additional styling components)

Backend
Laravel (PHP framework for backend logic)
Inertia JS (Bridges React & Laravel for SPAs)

Other Tools
Git (Version control)
Composer (PHP dependency management)
Vite (Frontend build tool)

## PROJECT STRUCTURE
📦 capstone  
├── 📂 app/            # Laravel backend (Models, Controllers)  
├── 📂 resources/  
│   ├── 📂 js/         # React components (Inertia JS)  
│   └── 📂 views/      # Blade templates (if used)  
├── 📂 public/         # Compiled assets  
├── 📂 routes/         # Laravel routes (web.php, api.php)  
├── 📂 config/         # Laravel configurations  
├── 📂 database/       # Migrations & Seeders  
├── 📂 node_modules/   # Frontend dependencies  
├── 📜 vite.config.js  # Vite configuration  
├── 📜 package.json    # Frontend dependencies  
├── 📜 composer.json   # PHP dependencies  
├── 📜 README.md       # Project overview  
└── 📜 LICENSE         # License file  


## 🚀 Getting Started

Prerequisites

PHP 8.1+ (For Laravel)
Node.js 16+ (For React & Vite)
Composer (PHP package manager)
MySQL XAMPP (Database)

## Installation

Clone the repository:
```bash
git clone https://github.com/OXWiz666/capstone.git
cd capstone
```

Install PHP dependencies:
```bash
composer install
```

Install JavaScript dependencies:
```bash
npm install
```

Set up environment file:
Copy .env.example to .env
Configure database settings in .env

```bash
php artisan key:generate
```

Run migrations & seed data (if needed):

```bash
php artisan migrate --seed
```

Start the development server:
```bash
npm run dev  # For frontend (Vite + React)
php artisan serve  # For Laravel backend
```

📄 Documentation
[Laravel Documentation](https://laravel.com/docs/12.x)
[Inertia JS Docs](https://inertiajs.com/)
[Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)
[React](https://react.dev/learn)

🙏 Acknowledgments
Special thanks to our mentors & advisors.
Built with Laravel, Inertia JS, and React for a modern full-stack experience.
