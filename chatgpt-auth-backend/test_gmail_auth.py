import smtplib
import os

def test_gmail_auth():
    print("Testing Gmail SMTP authentication...")
    
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "sveira.flavio@gmail.com"
    smtp_password = "qvav dnnh tuvv hqga"
    
    print(f"SMTP Server: {smtp_server}")
    print(f"SMTP Port: {smtp_port}")
    print(f"SMTP Username: {smtp_username}")
    print(f"SMTP Password: {'*' * len(smtp_password)}")
    
    try:
        print("Connecting to Gmail SMTP...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        
        print("Starting TLS...")
        server.starttls()
        
        print("Attempting login...")
        server.login(smtp_username, smtp_password)
        
        print("SUCCESS: Gmail authentication successful!")
        server.quit()
        return True
        
    except Exception as e:
        print(f"FAILED: Gmail authentication failed: {e}")
        return False

if __name__ == "__main__":
    test_gmail_auth()
