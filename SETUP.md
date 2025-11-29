# DevOps Pipeline UI Design - Setup Guide

This guide covers the complete setup and deployment of the DevOps Pipeline UI Design application.

## Prerequisites ✓

All prerequisites are installed and verified:

- ✓ **Node.js** v22.19.0
- ✓ **npm** 11.6.0
- ✓ **Docker** 29.0.1
- ✓ **Kubernetes** v1.34.1
- ✓ **Helm** v3.19.2
- ✓ **Python** 3.13.7

## Quick Start

### Development Server

The development server is currently running on **http://localhost:3001/**

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t devops-pipeline-ui:latest .

# Run the container
docker run -d -p 8080:80 --name devops-ui devops-pipeline-ui:latest

# View logs
docker logs -f devops-ui

# Stop the container
docker stop devops-ui && docker rm devops-ui
```

### Using Docker Compose

```bash
# Production mode
docker-compose up -d

# Development mode (hot-reload)
docker-compose --profile dev up

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- **Production**: http://localhost:8080
- **Development**: http://localhost:3000
- **Health Check**: http://localhost:8080/health

## Kubernetes Deployment

### Create Deployment Files

```bash
# Create namespace
kubectl create namespace devops-ui

# Create deployment
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devops-pipeline-ui
  namespace: devops-ui
spec:
  replicas: 2
  selector:
    matchLabels:
      app: devops-pipeline-ui
  template:
    metadata:
      labels:
        app: devops-pipeline-ui
    spec:
      containers:
      - name: ui
        image: devops-pipeline-ui:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
EOF

# Create service
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: devops-pipeline-ui
  namespace: devops-ui
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: devops-pipeline-ui
EOF

# Check status
kubectl get all -n devops-ui
```

## Project Structure

```
devops-pipeline-ui/
├── src/                    # Source code
│   ├── app/               # Application pages
│   ├── components/        # React components
│   │   ├── agents/       # Agent-related components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── epics/        # Epic management
│   │   ├── modals/       # Modal dialogs
│   │   ├── tools/        # Tool builder
│   │   ├── ui/           # UI primitives (Radix)
│   │   ├── views/        # View components
│   │   └── wizards/      # Wizard workflows
│   ├── lib/              # Utilities and hooks
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom hooks
│   │   └── queries/      # Data queries
│   ├── styles/           # Global styles
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global CSS
├── public/               # Static assets
├── .claude/              # Claude Code configuration
├── Dockerfile            # Production Docker build
├── docker-compose.yml    # Docker Compose config
├── nginx.conf            # Nginx configuration
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
└── README.md             # Project documentation
```

## Technology Stack

### Core
- **React 18.3.1** - UI library
- **Vite 6.3.5** - Build tool with SWC
- **TypeScript** - Type safety

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first styling
- **class-variance-authority** - Component variants

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **@hookform/resolvers** - Form validation integration

### State & Data
- **Zustand** - State management
- **React Query** (implied) - Server state
- **Recharts** - Data visualization

### Interactions
- **React DnD** - Drag and drop
- **Sonner** - Toast notifications
- **Embla Carousel** - Carousel component

### Production
- **Nginx Alpine** - Web server
- **Docker** - Containerization
- **Kubernetes** - Orchestration

## Environment Variables

Create a `.env` file for environment-specific configuration:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Environment
VITE_ENV=development
```

## Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Troubleshooting

### Port Already in Use

If port 3000 is in use, Vite will automatically try port 3001, 3002, etc.

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <PID> /F
```

### Docker Build Issues

```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker build --no-cache -t devops-pipeline-ui:latest .
```

### Module Resolution Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Explore the UI**: Open http://localhost:3001 in your browser
2. **Customize Components**: Modify components in `src/components/`
3. **Add Features**: Extend wizards, agents, or tools
4. **Deploy to Production**: Use Docker or Kubernetes
5. **Connect to Backend**: Configure API endpoints in `.env`

## Resources

- **Figma Design**: https://www.figma.com/design/F4bjLgYllxrlBcnh3CIlvU/DevOps-Pipeline-UI-Design
- **Radix UI Docs**: https://www.radix-ui.com/primitives
- **Vite Docs**: https://vite.dev/
- **React Docs**: https://react.dev/

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Figma design for UI specifications
3. Consult the technology stack documentation

---

**Status**: ✅ Initialized and Ready for Development
**Server**: 🟢 Running on http://localhost:3001
**Docker**: ✅ Configuration Ready
**Kubernetes**: ✅ Deployment Scripts Included
