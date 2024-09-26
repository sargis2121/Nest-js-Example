#!/bin/bash

# Define variables
NEST_IMAGE="nest-js-example-nest-app"
NGINX_IMAGE="nest-js-example-nginx"
TAG="latest"
K8S_YAML="k8s-setup.yaml" # The Kubernetes YAML configuration file

# Function to exit on error
function exit_on_error {
    echo "Error occurred in the script. Exiting."
    exit 1
}

# Step 1: Build Docker images for NestJS and NGINX
echo "Building Docker images..."
docker build -t $NEST_IMAGE:$TAG . || exit_on_error
docker build -t $NGINX_IMAGE:$TAG -f Dockerfile.nginx . || exit_on_error

# Step 2: Start services with Docker Compose (optional for local environment)
echo "Starting services with Docker Compose..."
docker-compose up -d || exit_on_error

# Step 3: Check if Docker Compose services are running
echo "Checking services status..."
docker-compose ps

# Step 4: Start Minikube for Kubernetes (optional for Kubernetes)
echo "Starting Minikube..."
minikube start || exit_on_error

# Step 5: Use Minikube context for Kubernetes
echo "Switching to Minikube context..."
kubectl config use-context minikube || exit_on_error

# Step 6: Apply Kubernetes deployment from k8s-setup.yaml
echo "Deploying application to Kubernetes from $K8S_YAML..."
kubectl apply -f $K8S_YAML || exit_on_error

# Step 7: Check the status of Kubernetes pods
echo "Waiting for Pods to be ready..."
kubectl wait --for=condition=ready pod -l app=nest-app --timeout=60s || exit_on_error
kubectl wait --for=condition=ready pod -l app=nginx --timeout=60s || exit_on_error

# Step 8: Check logs of the services
echo "Fetching logs from NestJS and NGINX containers..."
echo "NestJS logs:"
kubectl logs -l app=nest-app || exit_on_error
echo "NGINX logs:"
kubectl logs -l app=nginx || exit_on_error

# Final message
echo "Application is running! You can access it now."
