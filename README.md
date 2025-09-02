# Intelligent Email Assistant

An AI-powered email management system that analyzes Microsoft 365 emails using LLM providers (OpenAI/DeepSeek), automatically responds to routine emails, and sends WhatsApp notifications for emails requiring personal attention.

## 🚀 Features

- **AI Email Analysis**: Uses OpenAI GPT or DeepSeek to analyze email content and determine if personal attention is required
- **Automated Responses**: Generates and sends contextually appropriate responses for routine emails
- **WhatsApp Notifications**: Sends alerts via WhatsApp when emails need your personal attention
- **Microsoft 365 Integration**: Seamlessly connects with your Outlook inbox via Microsoft Graph API
- **Multi-LLM Support**: Supports both OpenAI and DeepSeek with fallback mechanisms
- **User Preferences**: Customizable settings for response style, keywords, trusted senders, etc.
- **React Frontend**: Modern web interface for monitoring and configuration
- **Supabase Backend**: PostgreSQL database with real-time capabilities

## 🏗️ Architecture

### Backend (Spring Boot)
- **Email Processing**: Scheduled tasks to check inbox and process new emails
- **LLM Integration**: Abstract layer supporting multiple AI providers
- **Microsoft Graph API**: OAuth2-based email access and management
- **WhatsApp Integration**: Twilio-based WhatsApp messaging
- **Database**: JPA/Hibernate with PostgreSQL (Supabase)

### Frontend (React + TypeScript)
- **Dashboard**: Real-time statistics and email processing overview
- **Email Management**: View, filter, and manage processed emails
- **Settings**: Configure AI behavior, notifications, and preferences
- **Material-UI**: Modern, responsive interface

## 📋 Prerequisites

### Required Accounts & Setup
1. **Microsoft 365 Developer Account**
   - Register at [Microsoft Developer Portal](https://developer.microsoft.com/)
   - Create an app registration in Azure AD
   - Configure Microsoft Graph API permissions

2. **LLM Provider Account** (choose one or both)
   - **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/)
   - **DeepSeek**: Get API key from [DeepSeek Platform](https://platform.deepseek.com/)

3. **Supabase Account**
   - Sign up at [Supabase](https://supabase.com/)
   - Create a new project
   - Get connection details

4. **Twilio Account** (for WhatsApp)
   - Register at [Twilio](https://twilio.com/)
   - Set up WhatsApp Business API sandbox

### Development Environment
- Java 21+
- Node.js 18+
- Maven 3.6+
- PostgreSQL (via Supabase)

## ⚙️ Configuration

### 1. Backend Configuration

Create `src/main/resources/application-local.yml`:

```yaml
# Microsoft Graph API Configuration
app:
  microsoft:
    tenant-id: ${MICROSOFT_TENANT_ID}
    client-id: ${MICROSOFT_CLIENT_ID}
    client-secret: ${MICROSOFT_CLIENT_SECRET}
    redirect-uri: http://localhost:8080/auth/callback
    
  # LLM Providers
  llm:
    openai:
      api-key: ${OPENAI_API_KEY}
      base-url: https://api.openai.com/v1
      model: gpt-4
      
    deepseek:
      api-key: ${DEEPSEEK_API_KEY}
      base-url: https://api.deepseek.com/v1
      model: deepseek-chat
      
    default-provider: openai
    
  # WhatsApp Configuration
  whatsapp:
    twilio:
      account-sid: ${TWILIO_ACCOUNT_SID}
      auth-token: ${TWILIO_AUTH_TOKEN}
      from-number: ${TWILIO_WHATSAPP_FROM}
      to-number: ${WHATSAPP_TO_NUMBER}
      
  # Supabase Database
  supabase:
    url: ${SUPABASE_URL}
    anon-key: ${SUPABASE_ANON_KEY}

# Database Configuration
spring:
  datasource:
    url: jdbc:postgresql://${SUPABASE_HOST}:${SUPABASE_PORT}/${SUPABASE_DB}
    username: ${SUPABASE_USER}
    password: ${SUPABASE_PASSWORD}
```

### 2. Environment Variables

Create `.env` file in the root directory:

```bash
# Microsoft Graph API
MICROSOFT_TENANT_ID=your_tenant_id
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# DeepSeek
DEEPSEEK_API_KEY=your_deepseek_api_key

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_TO_NUMBER=whatsapp:+1234567890

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_HOST=your_supabase_host
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=your_db_user
SUPABASE_PASSWORD=your_db_password
```

### 3. Microsoft App Registration

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "App registrations"
3. Create a new registration:
   - Name: "Intelligent Email Assistant"
   - Supported account types: "Accounts in any organizational directory"
   - Redirect URI: `http://localhost:8080/auth/callback`
4. Configure API permissions:
   - Microsoft Graph → Application permissions:
     - `Mail.Read`
     - `Mail.Send`
     - `User.Read`
5. Grant admin consent for the permissions
6. Create a client secret in "Certificates & secrets"

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd intelligent-email-assistant
```

### 2. Backend Setup

```bash
# Install dependencies and build
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

### 4. Database Setup

The application will automatically create the necessary tables on startup. The schema includes:
- `emails` - Processed email records
- `user_preferences` - User configuration settings

## 📖 Usage

### 1. Initial Setup
1. Open the frontend at `http://localhost:3000`
2. Go to Settings to configure your preferences:
   - Set response style (professional, casual, etc.)
   - Add keywords that require attention
   - Configure WhatsApp number for notifications
   - Set confidence threshold for AI decisions

### 2. Email Processing
The system automatically:
- Checks your inbox every 5 minutes (configurable)
- Analyzes new emails with AI
- Sends WhatsApp notifications for important emails
- Auto-responds to routine emails after a delay

### 3. Manual Operations
- **Dashboard**: View statistics and trigger manual processing
- **Email Management**: Review processed emails, preview responses
- **Settings**: Adjust AI behavior and notification preferences

## 🔧 API Endpoints

### Email Management
- `GET /api/emails/user/{userId}` - Get user emails
- `GET /api/emails/user/{userId}/stats` - Get email statistics
- `POST /api/emails/trigger-processing` - Manually trigger email processing
- `POST /api/emails/{emailId}/preview-response` - Preview auto-response
- `POST /api/emails/{emailId}/send-response` - Send auto-response

### LLM Management
- `GET /api/llm/providers` - Get available LLM providers
- `GET /api/llm/status` - Get provider status

## 🛠️ Development

### Running Tests

```bash
# Backend tests
mvn test

# Frontend tests
cd frontend
npm test
```

### Code Structure

```
├── src/main/java/com/intelligentassistant/emailassistant/
│   ├── controller/          # REST controllers
│   ├── service/             # Business logic
│   ├── model/               # Data models and entities
│   ├── repository/          # Database repositories
│   ├── llm/                 # LLM provider implementations
│   └── config/              # Configuration classes
├── frontend/src/
│   ├── components/          # React components
│   ├── services/            # API services
│   └── types/               # TypeScript definitions
└── README.md
```

## 🔐 Security Considerations

1. **API Keys**: Store all API keys as environment variables, never in code
2. **OAuth2**: Use proper OAuth2 flow for Microsoft Graph access
3. **Database**: Use connection pooling and prepared statements
4. **HTTPS**: Use HTTPS in production
5. **Rate Limiting**: Implement rate limiting for API endpoints

## 🚀 Production Deployment

### Docker Setup
```dockerfile
# Dockerfile for backend
FROM openjdk:21-jre-slim
COPY target/intelligent-email-assistant-*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### Environment Configuration
- Use production database (not localhost)
- Configure proper CORS settings
- Set up proper logging levels
- Use production API endpoints

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
1. Check the documentation above
2. Review the code comments
3. Create an issue in the repository

## 🔄 Roadmap

- [ ] Support for additional LLM providers
- [ ] Advanced email filtering and rules
- [ ] Integration with other messaging platforms
- [ ] Mobile app
- [ ] Advanced analytics and reporting
- [ ] Multi-user support
- [ ] Kubernetes deployment configurations
