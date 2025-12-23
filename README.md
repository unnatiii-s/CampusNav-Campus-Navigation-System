# CampusNav-Campus-Navigation-System
CampusNav is a computer vision–based smart campus navigation system designed to assist users in navigating large campus environments efficiently. The system supports both live camera–based navigation and image-based location detection, making it useful for first-time visitors, students, faculty members, and other campus users.

🔑 Key Features
Live camera–based location detection
Image upload–based location identification
Real-time navigation guidance
Dynamic route updates on campus map
User-friendly and interactive interface

# Project Structure
campus_nav/
├── app/
│   ├── identify/page.tsx        # Object identification page
│   ├── navigate/normal/page.tsx # Navigation logic
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── AROverlay.tsx            # Augmented Reality overlay
│   ├── CameraView.tsx           # Camera feed handling
│   └── MapView.tsx              # Interactive map component
├── hooks/
│   ├── useLocation.ts           # Geolocation hook
│   ├── useObstacleDetection.ts  # Object detection logic
│   └── useSpeech.ts             # Text-to-speech hook
├── lib/
│   ├── locationClassifier.ts    # Location classification logic
│   ├── navigationGraph.ts       # Graph data structure
│   ├── pathfinding.ts           # Dijkstra / A* algorithms
│   └── vision.ts                # Computer vision utilities
├── public/
│   ├── custom_model/            # TensorFlow.js model files
│   └── ...                      # Icons and static assets
├── scripts/
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json


👩‍💻 Developed By
Unnati Sutradhar
Tarun Nagar
