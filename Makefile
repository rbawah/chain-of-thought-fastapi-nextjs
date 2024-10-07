VENV_DIR := .venv
REQUIREMENTS := backend/requirements.txt
PYTHON := python3
DOCKER_COMPOSE := docker-compose.yml
BACKEND_DIR := backend
FRONTEND_DIR := frontend

.DEFAULT_GOAL := help

help:
	@echo "Makefile for managing the Python environment and Docker setup"
	@echo "Usage:"
	@echo "  make venv            Create a Python virtual environment"
	@echo "  make install         Install Python requirements"
	@echo "  make start           Start the app using docker-compose"
	@echo "  make start-backend   Start the backend without Docker"
	@echo "  make start-frontend  Start the frontend without Docker"
	@echo "  make clean           Remove the virtual environment and temporary files"

venv: $(VENV_DIR)
$(VENV_DIR):
	@echo "Creating Python virtual environment..."
	$(PYTHON) -m venv $(VENV_DIR)
	@echo "Virtual environment created in $(VENV_DIR)"

install: venv
	@echo "Activating virtual environment and installing requirements..."
	$(VENV_DIR)/bin/pip install --upgrade pip
	$(VENV_DIR)/bin/pip install -r $(REQUIREMENTS)
	@echo "Requirements installed successfully"

start:
	@echo "Starting the application with Docker Compose..."
	docker-compose up --build

start-backend:
	@echo "Starting the backend..."
	$(VENV_DIR)/bin/uvicorn main:app --app-dir $(BACKEND_DIR) --host 0.0.0.0 --port 8000 --reload

start-frontend:
	@echo "Starting the frontend..."
	cd $(FRONTEND_DIR) && pnpm install && pnpm run dev

clean:
	@echo "Removing virtual environment and cleaning temporary files..."
	rm -rf $(VENV_DIR)
	find . -type d -name "__pycache__" -exec rm -r {} +
	@echo "Environment cleaned"

.PHONY: help venv install start start-backend start-frontend clean
