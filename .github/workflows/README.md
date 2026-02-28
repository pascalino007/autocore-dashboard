# GitHub Actions CI/CD Setup

This repository includes automated deployment to your VPS using GitHub Actions.

## Required Secrets

You need to add the following secrets to your GitHub repository settings:

1. **HOST**: `168.231.101.119`
2. **USERNAME**: `root`
3. **PASSWORD**: `Android@2026`
4. **NEXT_PUBLIC_API_URL**: Your API endpoint URL (if applicable)

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Click on **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Add each secret listed above

## Workflow Triggers

The workflow runs on:
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

## Deployment Process

1. **Code Checkout**: Downloads your code
2. **Node.js Setup**: Sets up Node.js 18 environment
3. **Dependencies**: Installs npm packages
4. **Linting**: Runs code quality checks
5. **Build**: Creates production build of Next.js app
6. **VPS Deployment**: 
   - Creates deployment directory
   - Backs up existing deployment
   - Copies built files to VPS
   - Installs production dependencies
   - Starts application with PM2
   - Configures nginx reverse proxy

## VPS Requirements

Your VPS should have:
- Node.js 18+ installed
- nginx installed
- PM2 (will be installed automatically)
- Port 3000 available for the application
- Port 80 available for nginx

## Access Your Application

After deployment, your application will be available at:
`https://api.aakodessewa.com/`

## Monitoring

- Check PM2 status: `pm2 status`
- View logs: `pm2 logs autocore-dashboard`
- Restart app: `pm2 restart autocore-dashboard`
