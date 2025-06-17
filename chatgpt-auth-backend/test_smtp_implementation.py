import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def test_smtp_email_sending():
    print('Testing new smtplib implementation...')
    
    smtp_server = os.getenv('SMTP_SERVER')
    smtp_port = int(os.getenv('SMTP_PORT'))
    smtp_username = os.getenv('SMTP_USERNAME')
    smtp_password = os.getenv('SMTP_PASSWORD')
    
    print(f'SMTP Server: {smtp_server}')
    print(f'SMTP Port: {smtp_port}')
    print(f'SMTP Username: {smtp_username}')
    print(f'SMTP Password configured: {bool(smtp_password)}')
    
    test_token = "TEST-TOKEN-123456789"
    test_email = "smtp.test@teddydigital.io"
    
    try:
        print(f'Creating email message for {test_email}...')
        
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = test_email
        msg['Subject'] = "Token de Login - ChatGPT (TESTE)"
        
        html_body = f"""
        <h2>Seu token de acesso ao ChatGPT</h2>
        <p>Use este token para fazer login:</p>
        <h3 style="background: #f0f0f0; padding: 10px; font-family: monospace;">{test_token}</h3>
        <p>Este token expira em 24 horas.</p>
        <p>Se você não solicitou este token, ignore este email.</p>
        <p><strong>ESTE É UM EMAIL DE TESTE</strong></p>
        """
        msg.attach(MIMEText(html_body, 'html'))
        
        print('Connecting to SMTP server...')
        server = smtplib.SMTP(smtp_server, smtp_port)
        
        print('Starting TLS...')
        server.starttls()
        
        print('Logging in...')
        server.login(smtp_username, smtp_password)
        
        print('Sending email...')
        text = msg.as_string()
        server.sendmail(smtp_username, test_email, text)
        
        print('Closing connection...')
        server.quit()
        
        print(f'SUCCESS: Email sent successfully via smtplib to {test_email}')
        return True
        
    except Exception as e:
        print(f'FAILED: Email sending failed: {e}')
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_smtp_email_sending()
