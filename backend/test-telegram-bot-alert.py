import requests

BOT_TOKEN = 'TELEGRAM_BOT_TOKEN'
CHAT_ID = 'TELEGRAM_CHAT_ID'
MESSAGE = 'Test message from bot'

url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
payload = {
    'chat_id': CHAT_ID,
    'text': MESSAGE
}

response = requests.post(url, json=payload)
print(response.json())  # Check for response status and errors
