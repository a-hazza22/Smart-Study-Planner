#  Smart Study Planner (AI-Driven Autonomous Scheduling System)

An AI-powered backend system designed to enhance university students' academic performance by autonomously generating personalized weekly study schedules from raw schedule images.

##  The Engineering Journey & Problem Solving

This project was developed through an iterative engineering process, transitioning from a basic prototype to a robust, modular architecture:

* **Iteration 1 (The Challenge):** The initial prototype relied on a procedural, single-file codebase and early-stage LLM APIs. This approach led to "Spaghetti Code," API rate limits (Error 400), and severe logical conflicts—such as the AI scheduling study sessions at 09:00 AM while the student was attending university lectures.
* **Iteration 2 (The Solution):** The entire system was completely refactored using **NestJS** to establish a clean, Object-Oriented, and modular architecture. We migrated to the **Groq LPU** for ultra-fast inference and implemented strict, hard-coded constraints to ensure the AI's output respected human biology and social schedules.

## Key Features & Algorithmic Constraints

Instead of random AI generation, the system utilizes a hybrid approach (AI Semantic Analysis + Deterministic TypeScript Algorithms):

* **Image-to-Plan (OCR):** Uses **Llama-3.2 Vision** to extract course names and difficulty levels directly from uploaded schedule images (PNG/JPEG/PDF).
* **The 50+10 Rule:** Automatically divides the user's requested total study time into highly efficient blocks of 50 minutes of study followed by a mandatory 10-minute break.
* **Sleep Guard:** Hard-coded constraints prevent the system from scheduling any study sessions between 23:00 and 08:00.
* **School Hours Awareness:** The algorithm differentiates between weekdays (starting study sessions at 18:00, post-university) and weekends (starting at 10:00).

##  Tech Stack

* **Framework:** NestJS (Node.js)
* **Language:** TypeScript (Ensuring Type Safety and strict JSON validation)
* **AI / LLM:** Groq API (Llama-3.2 Vision & Llama-3 70B Versatile)
* **Data Processing:** Multer (In-memory Buffer processing for zero I/O latency)
* **Development Tools:** VS Code, ESLint, Prettier

##  Installation & Setup

Follow these instructions to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
   cd YOUR_REPOSITORY_NAME