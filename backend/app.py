from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS
import logging

# Enable logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/alert', methods=['POST'])
def alert():
    try:
        # Decode the alert message received in 'text/plain' content type
        alert_message = request.data.decode('utf-8')  # Decode the plain text message
        logging.debug(f"Received alert message: {alert_message}")

        # Split the message by '&' and handle each part
        parts = alert_message.split('&')
        data = {}
        for part in parts:
            # Split each part by '=' and check if it has both key and value
            if '=' in part:
                key, value = part.split('=', 1)  # Ensure only 1 split if there are extra '='
            else:
                logging.warning(f"Skipping malformed part: {part}")
                continue
            data[key] = value.strip('\"')  # Remove any extra quotes around the value

        # Log parsed data for debugging purposes
        logging.debug(f"Parsed data: {data}")

        # Determine the section based on scrip_code and Buy/Sell
        is_ce = 'C' in data.get('scrip_code', '')
        is_pe = 'P' in data.get('scrip_code', '')
        is_buy = 'Buy' in alert_message
        is_sell = 'Sell' in alert_message

        if is_ce:
            if is_buy:
                section = 'CE Bullish'
            elif is_sell:
                section = 'CE Bearish'
        elif is_pe:
            if is_buy:
                section = 'PE Bullish'
            elif is_sell:
                section = 'PE Bearish'
        else:
            section = 'Unknown Section'  # Fallback if neither CE nor PE is found

        # Emit the parsed message to the frontend
        socketio.emit('update', {
            'section': section,
            'message': data.get('Message', '')  # Default to empty string if no 'Message'
        })

        return 'Alert received', 200

    except Exception as e:
        logging.error(f"Error processing the alert: {str(e)}")
        return 'Error processing the alert', 500

if __name__ == '__main__':
    socketio.run(app, port=5000)
