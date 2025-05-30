# SocialBFS – A BFS-Based Social Network Simulator

## 👤 Student Details
- **Name:** Tanish Arora  
- **USN:** 4NI23CI116  
- **Course:** Discrete Mathematical Structures (DMS)  
- **Project Title:** SocialBFS – Graph-Based Friend Recommendation System  
- **Guide:** Savitha Sridharamurthy  
- **Institution:** NIE, Mysuru  

---

## 📘 Project Description

**SocialBFS** is an educational web application that demonstrates how the Breadth-First Search (BFS) algorithm is used in real-world social networking platforms for friend recommendation and network exploration.

The project is built around core concepts of **Discrete Mathematical Structures (DMS)** including:
- Graph Theory
- Relations and Functions
- Set Theory and Combinatorics

Users can:
- Visualize a social network as a graph
- Explore Level 1, 2, and 3+ connections
- Receive friend suggestions based on mutual friends and interaction weights
- Customize parameters like Alpha, Beta, and BFS depth
- Understand algorithmic thinking through real-time traversal animations

---

## ⚙️ Tech Stack

- **Frontend:** React 18 + TypeScript  
- **Styling:** Tailwind CSS + shadcn/ui  
- **Graph Visualization:** D3.js  
- **Data Fetching & Caching:** TanStack React Query  
- **Build Tool:** Vite  
- **Data Format:** Static JSON (mock data)

---

## 🚀 How to Run the Project

> **Note:** Make sure you have **Node.js** and **npm** or **yarn** installed.

### 1. Clone the Repository

bash
git clone https://github.com/tanish4542/friend-finder-graph
cd SocialBFS

npm install
# or
yarn install

npm run dev
# or
yarn dev

#📂 Project Structure
SocialBFS/
│
├── public/                # Static assets
├── src/
│   ├── components/        # UI Components
│   ├── data/              # Mock JSON data
│   ├── pages/             # Main pages
│   ├── utils/             # BFS & scoring logic
│   └── App.tsx            # Main entry point
├── index.html
├── package.json
└── README.md
