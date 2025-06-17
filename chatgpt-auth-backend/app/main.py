from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from pydantic_settings import BaseSettings
from jose import JWTError, jwt
from passlib.context import CryptContext
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import uuid
import re
from datetime import datetime, timedelta
from typing import Optional, List, Dict
from openai import OpenAI

class Settings(BaseSettings):
    secret_key: str = "your-secret-key-here-change-in-production"
    openai_api_key: str
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
openai_client = OpenAI(api_key=settings.openai_api_key)

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

users_db: Dict[str, dict] = {}
tokens_db: Dict[str, dict] = {}
conversations_db: Dict[str, dict] = {}

class UserRegister(BaseModel):
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    token: str

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def validate_teddydigital_email(email: str) -> bool:
    return email.endswith("@teddydigital.io")

def generate_login_token() -> str:
    return secrets.token_urlsafe(32)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
    return encoded_jwt

def format_response_content(content: str) -> str:
    """
    Format the AI response content with proper markdown formatting and code highlighting
    """
    import html
    
    content = re.sub(
        r'```(\w+)?\s*(.*?)\s*```',
        lambda m: f'<pre><code class="language-{m.group(1) or "text"}">{html.escape(m.group(2).strip())}</code></pre>',
        content,
        flags=re.DOTALL
    )
    
    content = re.sub(r'`([^`]+)`', lambda m: f'<code>{html.escape(m.group(1))}</code>', content)
    
    content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
    content = re.sub(r'\*(.*?)\*', r'<em>\1</em>', content)
    
    content = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', content, flags=re.MULTILINE)
    content = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', content, flags=re.MULTILINE)
    content = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', content, flags=re.MULTILINE)
    
    lines = content.split('\n')
    in_ul = False
    processed_lines = []
    
    for line in lines:
        if re.match(r'^- ', line):
            if not in_ul:
                processed_lines.append('<ul>')
                in_ul = True
            processed_lines.append(f'<li>{line[2:]}</li>')
        else:
            if in_ul:
                processed_lines.append('</ul>')
                in_ul = False
            processed_lines.append(line)
    
    if in_ul:
        processed_lines.append('</ul>')
    
    content = '\n'.join(processed_lines)
    
    lines = content.split('\n')
    in_ol = False
    processed_lines = []
    
    for line in lines:
        if re.match(r'^\d+\. ', line):
            if not in_ol:
                processed_lines.append('<ol>')
                in_ol = True
            pattern = r"^\d+\. "
            processed_lines.append(f'<li>{re.sub(pattern, "", line)}</li>')
        else:
            if in_ol:
                processed_lines.append('</ol>')
                in_ol = False
            processed_lines.append(line)
    
    if in_ol:
        processed_lines.append('</ol>')
    
    content = '\n'.join(processed_lines)
    
    content = re.sub(r'\n\n', '<br><br>', content)
    content = re.sub(r'\n', '<br>', content)
    
    return content

def send_login_email(email: str, token: str):
    print(f"DEBUG - SMTP Settings: username={bool(settings.smtp_username)}, password={bool(settings.smtp_password)}")
    print(f"DEBUG - SMTP Username: {settings.smtp_username[:10]}..." if settings.smtp_username else "DEBUG - SMTP Username: None")
    
    if not settings.smtp_username or not settings.smtp_password:
        print(f"EMAIL SIMULATION - Token for {email}: {token}")
        return True
    
    try:
        print(f"DEBUG - Attempting to send email to {email}")
        
        msg = MIMEMultipart()
        msg['From'] = settings.smtp_username
        msg['To'] = email
        msg['Subject'] = "Token de Login - ChatGPT"
        
        html_body = f"""
        <h2>Seu token de acesso ao ChatGPT</h2>
        <p>Use este token para fazer login:</p>
        <h3 style="background: #f0f0f0; padding: 10px; font-family: monospace;">{token}</h3>
        <p>Este token expira em 24 horas.</p>
        <p>Se você não solicitou este token, ignore este email.</p>
        """
        msg.attach(MIMEText(html_body, 'html'))
        
        with smtplib.SMTP(settings.smtp_server, settings.smtp_port, timeout=30) as server:
            server.starttls()
            server.login(settings.smtp_username, settings.smtp_password)
            
            text = msg.as_string()
            server.sendmail(settings.smtp_username, email, text)
            
            print(f"DEBUG - Email sent successfully via smtplib to {email}")
            return True
            
    except smtplib.SMTPAuthenticationError as auth_e:
        print(f"DEBUG - SMTP authentication failed: {auth_e}")
        print(f"EMAIL SIMULATION - Token for {email}: {token}")
        return False
    except smtplib.SMTPException as smtp_e:
        print(f"DEBUG - SMTP error: {smtp_e}")
        print(f"EMAIL SIMULATION - Token for {email}: {token}")
        return False
    except Exception as e:
        print(f"DEBUG - General email sending failed: {e}")
        print(f"EMAIL SIMULATION - Token for {email}: {token}")
        return False

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, settings.secret_key, algorithms=["HS256"])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/register")
async def register(user: UserRegister):
    if not validate_teddydigital_email(user.email):
        raise HTTPException(status_code=400, detail="Only teddydigital.io emails are allowed")
    
    login_token = generate_login_token()
    token_expires = datetime.utcnow() + timedelta(hours=24)  # Extended for development to handle backend restarts
    
    users_db[user.email] = {
        "email": user.email,
        "created_at": datetime.utcnow()
    }
    
    tokens_db[login_token] = {
        "email": user.email,
        "expires_at": token_expires,
        "used": False
    }
    
    try:
        send_login_email(user.email, login_token)
        return {"message": "Token enviado por email"}
    except Exception as e:
        print(f"Email error: {e}")
        return {"message": "Token gerado (verifique os logs do servidor)", "debug_token": login_token}

@app.post("/login")
async def login(user_login: UserLogin):
    token_data = tokens_db.get(user_login.token)
    if not token_data or token_data["used"] or token_data["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")
    
    if token_data["email"] != user_login.email:
        raise HTTPException(status_code=400, detail="Token não corresponde ao email")
    
    tokens_db[user_login.token]["used"] = True
    
    access_token = create_access_token(data={"sub": user_login.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"email": user_login.email}
    }

@app.post("/chat")
async def chat(chat_message: ChatMessage, current_user: str = Depends(get_current_user)):
    try:
        conversation_id = chat_message.conversation_id or str(uuid.uuid4())
        
        if conversation_id not in conversations_db:
            conversations_db[conversation_id] = {
                "id": conversation_id,
                "user_email": current_user,
                "messages": [],
                "created_at": datetime.utcnow()
            }
        
        conversation = conversations_db[conversation_id]
        
        user_message = {
            "role": "user",
            "content": chat_message.message,
            "timestamp": datetime.utcnow().isoformat()
        }
        conversation["messages"].append(user_message)
        
        print(f"DEBUG - Making OpenAI API call with model: gpt-4")
        print(f"DEBUG - Message count: {len(conversation['messages'][-10:])}")
        
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": msg["role"], "content": msg["content"]} 
                     for msg in conversation["messages"][-10:]]
        )
        
        print(f"DEBUG - OpenAI response model: {response.model}")
        print(f"DEBUG - OpenAI response content length: {len(response.choices[0].message.content)}")
        
        formatted_content = format_response_content(response.choices[0].message.content)
        
        ai_message = {
            "role": "assistant",
            "content": formatted_content,
            "timestamp": datetime.utcnow().isoformat()
        }
        conversation["messages"].append(ai_message)
        
        return {
            "conversation_id": conversation_id,
            "message": ai_message["content"],
            "timestamp": ai_message["timestamp"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations")
async def get_conversations(current_user: str = Depends(get_current_user)):
    user_conversations = [
        {
            "id": conv["id"],
            "created_at": conv["created_at"].isoformat() if isinstance(conv["created_at"], datetime) else conv["created_at"],
            "last_message": conv["messages"][-1]["content"][:50] + "..." if conv["messages"] else "Nova conversa"
        }
        for conv in conversations_db.values()
        if conv["user_email"] == current_user
    ]
    return sorted(user_conversations, key=lambda x: x["created_at"], reverse=True)

@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, current_user: str = Depends(get_current_user)):
    conversation = conversations_db.get(conversation_id)
    if not conversation or conversation["user_email"] != current_user:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    return conversation

@app.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, current_user: str = Depends(get_current_user)):
    conversation = conversations_db.get(conversation_id)
    if not conversation or conversation["user_email"] != current_user:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    
    del conversations_db[conversation_id]
    return {"message": "Conversa deletada"}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
