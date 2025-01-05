
# Trading Dashboard

  

A real-time trading alert dashboard that displays buy and sell signals based on TradingView alerts. The dashboard dynamically updates the appropriate sections for CE and PE scrips, along with Bullish and Bearish checks.

  

## Table of Contents

- [Technologies Used](#technologies-used)

- [Project Setup](#project-setup)

- [Frontend Setup](#frontend-setup)

- [Backend Setup](#backend-setup)

- [Running the Application](#running-the-application)

- [Contributing](#contributing)

  

## Technologies Used

  

-  **Frontend**: React.js, Socket.io

-  **Backend**: Python, Flask, Flask-SocketIO, Flask-CORS

-  **Real-time Communication**: Socket.io

-  **Database**: None (In-memory updates)

  

## Project Setup

  

To set up the project, follow the steps below.

  

### Frontend Setup (React)

  

1. Navigate to the `dashboard` folder (or whichever folder contains the React project).

```bash
cd dashboard
```
2. Install the required npm packages for the React frontend.

```bash
npm install
```
3. Start the React development server:
```bash
npm start
```

This will start the React app on http://localhost:3000. The frontend should now be running and communicating with the Flask backend.

  
### Backend Setup (Flask)

1. Navigate to the backend folder where your app.py is located.

```bash
cd backend
```
2. Create a virtual environment (if not already created):

```bash
python -m venv venv
```
3. Activate the virtual environment:

- On Windows:
```bash
venv\Scripts\activate
```
- On Linux/macOS:

```bash
source venv/bin/activate
```
4. Install the required Python packages:
```bash
pip install -r requirements.txt
```
If you don't have a requirements.txt, create it using:

```bash
pip freeze > requirements.txt
```
You need these dependencies:

- Flask
- Flask-SocketIO
- Flask-CORS

5. Run the Flask server:
```bash
python app.py
```
This will start the Flask backend on http://localhost:5000.

### Steps to Integrate Telegram Notification:

1.  **Create a Telegram Bot**:
    
    -   Open Telegram and search for the "BotFather".
    -   Start a chat with BotFather and use the `/newbot` command to create a new bot.
    -   Follow the prompts to set a bot name and username. Once created, BotFather will provide you with a **Telegram Bot Token**.
2.  **Get Your Channel Chat ID**:
    
    -   Add the bot to your Telegram channel as an admin.
    -   Use the bot's API to get the chat ID of your channel. You can use the following URL in your browser, replacing `YOUR_BOT_TOKEN` with your actual bot token:
        
        `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates` 
        
    -  Telegram channel chat IDs start with `-100`. Ensure you include this prefix. Send a message in your channel and then check the above URL to find the `chat_id` in the JSON response. This `chat_id` is used to send messages to your channel.

## Running the Application

1. Run the backend (Flask server):
- Run the Flask server as mentioned above using ```python app.py```.
2. Run the frontend (React app):
- Use ``npm start`` from the ``dashboard`` directory to launch the React frontend.

3. The application should now be running. The frontend will receive alerts from the backend and display them dynamically in the appropriate sections.

## Contributing

If you'd like to contribute to the development of this project, feel free to fork the repository and submit a pull request. Please ensure to follow proper coding conventions and provide clear commit messages.

 
For any issues or feature requests, feel free to open an issue or contact the project maintainers.


  

### Notes:

1.  **React app**: Ensure that the frontend (`npm start`) communicates properly with the backend via Socket.io. This setup assumes the React app listens for real-time alerts from the backend.

2.  **Backend setup**: Make sure the Flask app is running on `http://localhost:5000` as indicated. It listens for POST requests on the `/alert` route and emits updates via Socket.io.
