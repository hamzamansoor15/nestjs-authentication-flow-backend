# NestJS Authentication API

## Features
- User Registration (Signup) with validation
  - Name validation (minimum 2 characters)
  - Email validation (unique emails only)
  - Password validation (minimum 8 characters, requires letter, number, and special character)
- User Authentication (Login)
  - JWT-based authentication
  - Secure password hashing using bcrypt
  - Token-based session management
- Environment Configuration
  - Configurable JWT secret and expiration
  - MongoDB connection string
  - Port configuration

## Prerequisites

### 1. Node.js and npm (using NVM)
NVM (Node Version Manager) is recommended for installing and managing Node.js versions.

#### Install NVM

```bash
# For Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# OR using wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Add these lines to your ~/.bashrc, ~/.zshrc, or ~/.profile:
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

#### Verify NVM Installation
```bash
# Restart your terminal and run
nvm --version
```

#### Install Node.js using NVM
```bash
# Install the LTS version of Node.js
nvm install --lts

# OR install a specific version
nvm install 18.17.0

# Set default Node.js version
nvm alias default 18.17.0

# Verify installation
node --version
npm --version
```

#### Switch Node.js Versions (when needed)
```bash
# List installed versions
nvm ls

# List available versions
nvm ls-remote

# Use a specific version
nvm use 18.17.0
```

### 2. MongoDB
Install MongoDB Community Edition:
```bash
# For Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# For macOS using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify installation
mongod --version
```

### 3. Development Tools
```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Verify installation
nest --version
```

## Environment Setup
1. Create a `.env` file in the root directory:
```bash
touch .env
```

2. Add the following configuration to `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

## Installation
1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
```

## Development
Start the development server with hot-reload:
```bash
npm run start:dev
```
The API will be available at `http://localhost:3000`

## Production Build
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start:prod
```

## API Documentation

The complete API documentation is available as a Postman collection. The collection includes:

### Available Endpoints
- Authentication
  - POST /auth/signup
  - POST /auth/login
  - POST /auth/logout
  - GET /auth/blacklisted-tokens
- Users
  - GET /users/profile

### Using the Postman Collection

1. Import Collection and Environment:
   - Download files:
     - [NestJS-Auth-API.postman_collection.json](./postman/NestJS-Auth-API.postman_collection.json)
     - [NestJS-Auth-API.postman_environment.json](./postman/NestJS-Auth-API.postman_environment.json)
   - Open Postman
   - Click "Import" button
   - Select both downloaded files

2. Set up environment:
   - Select "NestJS Auth API - Local" environment from the dropdown
   - Environment variables included:
     - `baseUrl`: API base URL (default: http://localhost:8000)
     - `authToken`: JWT token (automatically managed)

3. Testing Flow:
   - Use "Sign Up" to create a user
   - Use "Login" to get a token (automatically saved)
   - Access protected routes using the saved token
   - Use "Logout" to invalidate token

### Environment Variables

#### Local Development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-super-secret-key
NODE_ENV=development

### Input Validation Rules

#### Password Requirements
- Minimum 8 characters
- At least 1 letter
- At least 1 number
- At least 1 special character (@$!%*#?&)

#### Email Requirements
- Must be a valid email format
- Must be unique in the system

#### Name Requirements
- Minimum 2 characters
- Cannot be empty

For detailed request/response examples and testing, please refer to the Postman collection.

## Testing
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## Project Structure
```
src/
├── auth/                  # Authentication module
│   ├── guards/           # JWT guards
│   ├── interfaces/       # TypeScript interfaces
│   └── strategies/       # Passport strategies
├── users/                # Users module
│   ├── dto/             # Data Transfer Objects
│   └── schemas/         # MongoDB schemas
├── config/              # Configuration
└── types/               # TypeScript types
```

## Error Handling
The API handles various error scenarios:
- 400: Bad Request (Invalid input)
- 401: Unauthorized (Invalid credentials)
- 409: Conflict (Email already exists)
- 500: Internal Server Error

## Security Features
- Password hashing using bcrypt
- JWT token authentication
- Email uniqueness validation
- Input validation using class-validator
- Environment variable configuration
- MongoDB injection protection

## Troubleshooting

### Common Issues
1. MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

2. Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
