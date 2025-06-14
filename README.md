# Stephen King Universe Explorer

## Project Overview

This is a Next.js application dedicated to exploring the works of Stephen King. It allows users to browse through comprehensive lists of his books, short stories, and the memorable villains from his universe. The data is fetched from an external source and presented in a user-friendly interface.

## Features

*   **Browse Collections:** Easily navigate through dedicated sections for Stephen King's books, short stories, and villains.
*   **Search Functionality:** Quickly find specific items within categories (e.g., search for books by title).
*   **Sort Data:** Organize lists alphabetically for easier browsing (e.g., sort books by title).
*   **Detailed Information:** View details for each entry, such as publication year, publisher, ISBN, page count, and associated villains for books.

## Tech Stack

*   **Next.js:** React framework for server-side rendering and static site generation.
*   **React:** JavaScript library for building user interfaces.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.

## Getting Started

To get a local copy up and running, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```
    *Replace `https://github.com/your-username/your-repository-name.git` with the actual URL of this repository.*

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows a standard Next.js application structure:

```
.
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── components/     # Reusable React components (e.g., Header, Request)
│   │   ├── pages/          # Main page routes
│   │   │   ├── books/      # Pages related to books (listing, search)
│   │   │   ├── shorts/     # Pages related to short stories
│   │   │   └── villains/   # Pages related to villains
│   │   ├── layout.js       # Main app layout
│   │   └── page.js         # Homepage content (src/app/page.js)
│   ├── globals.css         # Global styles
├── .eslintrc.json          # ESLint configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

Key directories and files:

*   `src/app/page.js`: The entry point for the homepage.
*   `src/app/layout.js`: Defines the root layout for the application.
*   `src/app/components/`: Contains reusable UI components like `Header.js` and the data fetching component `request.js`.
*   `src/app/pages/`: This directory holds the different sections of the application:
    *   `books/`: Logic and UI for displaying and searching books.
    *   `shorts/`: Logic and UI for displaying and searching short stories.
    *   `villains/`: Logic and UI for displaying and searching villains.
