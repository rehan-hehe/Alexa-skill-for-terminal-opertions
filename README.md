# Alexa-Based Laptop Operator

A project that transforms an Amazon Echo device into a powerful, voice-controlled shell for your laptop. Using a custom Alexa skill and a Node.js backend, you can execute **any shell command** directly on your machine just by speaking.

---

## Architecture & How It Works

The system operates on a simple but powerful principle: Alexa captures your voice command as raw text and sends it to your local server, which executes it.

`[Echo Device]` ➡️ `[Alexa Cloud]` ➡️ `[HTTPS Tunnel (ngrok)]` ➡️ `[Local Node.js Server]` ➡️ `[Laptop Shell]`

1.  The user speaks a command like, *"Alexa, ask laptop operator to run ls -l"*.
2.  The Alexa Skill uses a built-in `AMAZON.SearchQuery` slot to capture the entire command (`ls -l`) as free-form text.
3.  Alexa sends a JSON payload to the public URL provided by `ngrok`.
4.  `ngrok` securely forwards this request to the Node.js Express server running on your laptop.
5.  The server's `child_process.exec()` function runs the command string.
6.  The server captures the command's output (`stdout`) and sends it back to Alexa as a spoken response.

---

## Tech Stack
-   **Voice Interface:** Amazon Alexa Custom Skill (manual configuration)
-   **Backend Server:** Node.js + Express
-   **HTTPS Tunnel:** ngrok
-   **Local Command Execution:** Node’s `child_process.exec()`

---

## Full Setup Guide

Follow these three parts carefully to get your system running.

### Part 1: Run the Backend Server

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/rehan-hehe/Alexa-skill-for-terminal-opertions.git
    cd Alexa-skill-for-terminal-opertions/server
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Server:**
    ```bash
    npm start
    ```
    Keep this terminal window open. You should see `Server running on http://localhost:3000`.

### Part 2: Expose Server with Ngrok

Alexa needs a public HTTPS URL to reach your local server.

1.  **Install `ngrok`:** [Follow the instructions here](https://ngrok.com/download).

2.  **Start the Tunnel:** Open a **new terminal window** and run:
    ```bash
    ngrok http 3000
    ```

3.  **Copy the URL:** `ngrok` will provide a public `https` URL. **Copy this URL** for the next part. It will look like `https://xxxx-xx-xxx-xx-xx.ngrok-free.app`.

### Part 3: Configure the Alexa Skill

Configure the skill in the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) with the following settings.

1.  **Skill Setup**
    -   **Skill Type:** Create a new **Custom** skill.
    -   **Backend:** Select **Provision your own**.

2.  **Interaction Model**
    -   Create a single custom intent with these properties:
        -   **Intent Name:** `RunCommandIntent`
        -   **Intent Slots:** Create one slot named `app`.
        -   **Slot Type:** `AMAZON.SearchQuery`
        -   **Sample Utterances:** Add phrases like `run {app}`, `execute {app}`, and `run command {app}`.
    -   Once configured, **Save** and **Build Model**.

3.  **Endpoint Configuration**
    -   **Service Endpoint Type:** `HTTPS`
    -   **Default Region URL:** Your `ngrok` URL, appended with `/run-command` (e.g., `https://xxxx.ngrok-free.app/run-command`).
    -   **SSL Certificate:** Select `My development endpoint is a sub-domain...`

4.  **Testing**
    -   Enable the skill in the **Test** tab.
    -   Use your invocation name to send a command, e.g., *"ask laptop operator to run ls"*.

---

### How to Use

Invoke the skill by saying **"Alexa, ask laptop operator to..."** followed by your command.

#### Example Voice Commands:
-   **List files:** *"Alexa, ask laptop operator to run **ls -l**"*
-   **Check current user:** *"Alexa, ask laptop operator to execute **whoami**"*
-   **Ping a website:** *"Alexa, ask laptop operator to run **ping google.com**"*

The skill will respond with the standard output (`stdout`) of the command or an error message if it fails.
