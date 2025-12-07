// AdenLive App - Local Configuration
export const config = {
  NODE_ENV: 'development',
  PORT: 8010,
  
  // Cache and temporary directories
  VITE_CACHE_DIR: 'D:\\Projects\\AdenLiveApp-Complete\\Data\\cache',
  VITE_TEMP_DIR: 'D:\\Projects\\AdenLiveApp-Complete\\Data\\temp',
  VITE_LOGS_DIR: 'D:\\Projects\\AdenLiveApp-Complete\\Data\\logs',
  
  // Database configuration
  DATABASE_URL: 'file:./data/database/adenlive.db',
  
  // Development settings
  VITE_APP_ENV: 'development',
  
  // API Configuration
  VITE_API_BASE_URL: 'http://localhost:8010',
  VITE_API_TIMEOUT: 30000,
  
  // Cache settings
  VITE_CACHE_ENABLED: true,
  VITE_CACHE_TTL: 3600000,
  
  // Logging
  VITE_LOG_LEVEL: 'debug',
  VITE_LOG_TO_FILE: true
};

// Set environment variables
Object.keys(config).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = config[key];
  }
});
