# Chain-of-Thought prompting with ChatGPT - fullstack FastAPI and Nextjs

## Overview
Harness the power of chain-of-thought (CoT) prompting with ChatGPT without having to pay for tier 5 membership, for the o1 family of models. For more info on CoT, read my blog article on medium
Below are detailed instructions on how to set up and run the project using different combinations of tools, such as `make`, Docker, and Python virtual environments.


[![Short demo](https://img.youtube.com/vi/10Yue_3vgxM/0.jpg)](https://youtu.be/10Yue_3vgxM)


## Prerequisites
- Python 3.11
- Docker (optional, for containerized deployment)
- Docker Compose (optional, for managing multiple containers)
- `pnpm` (for the frontend dependencies)
- GNU Make (for convenience commands)

## Setup Options

You have multiple options for running the project, depending on your preferences and environment.

### 1. Running Without Docker and Make

You can manually set up and run both the backend and frontend services without Docker or Make.

#### Step 1: Set Up Python Virtual Environment
```
python3 -m venv .venv
```

#### Step 2: Install Requirements
```
source .venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
```

#### Step 3: Start the Backend
```
source .venv/bin/activate
uvicorn main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

#### Step 4: Start the Frontend
```
cd frontend
pnpm install
pnpm run dev
```

### 2. Running With Make (Without Docker)

You can use `make` commands to simplify the setup and start processes without using Docker.

#### Step 1: Create Python Virtual Environment and Install Requirements
```
make install
```

#### Step 2: Start the Backend
```
make start-backend
```

#### Step 3: Start the Frontend
```
make start-frontend
```

### 3. Running With Docker (Without Make)

If you prefer to use Docker, you can set up and run the entire stack using Docker Compose.

#### Step 1: Start the Application with Docker Compose
```
docker-compose up --build
```

### 4. Running With Both Docker and Make

You can also use Make in combination with Docker for a streamlined workflow. This is useful if you want to leverage Docker Compose but also take advantage of `make` commands for convenience.

#### Step 1: Start the Application Using Make and Docker Compose
```
make start
```

## Makefile Commands

The following commands are available in the Makefile for managing the project:

- `make help`  
  Display available commands.

- `make venv`  
  Create a Python virtual environment in the \`.venv\` directory.

- `make install`  
  Create a virtual environment and install Python requirements from \`backend/requirements.txt\`.

- `make start`  
  Start the application using Docker Compose.

- `make start-backend`  
  Start the backend without Docker (requires the virtual environment to be set up).

- `make start-frontend`  
  Start the frontend without Docker (uses \`pnpm\` for dependency management).

- `make clean`  
  Remove the virtual environment and temporary files.

## Clean Up

To clean up your environment, you can run:
```
make clean
```

This command will remove the Python virtual environment and any `__pycache__` files generated during development.

## Notes

- Make sure you have `pnpm` installed before running the frontend.
- If you are using Docker, ensure Docker and Docker Compose are properly installed and running on your system.
- The backend runs on port `8000` by default, and the frontend runs on port `3000`. You may need to adjust these settings if you encounter any port conflicts.
