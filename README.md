# 🎙️ AI-Powered Transcription & Translation for Voice Messages

## 👥 Mentor(s)

**Dhurv Jain**, **Abhinav Kumar**

## 📢 Communication Channel

Join the discussion on [Rocket.Chat](https://open.rocket.chat/channel/idea-AI-Transcription-and-Translation-for-Voice-Messages-App)

## 💬 Project Description

Rocket.Chat already supports sending voice messages. This app enhances that feature by introducing **on-demand** and **real-time** transcription and translation of voice messages using Generative AI and external APIs.

Users can transcribe voice messages to their preferred language, improving accessibility and multilingual communication within teams.

---

## ✨ Key Features

-   📝 **Transcribe & Translate**: Instantly transcribe and translate voice messages using `/tr`.
-   🌍 **Auto Mode**: Enable automatic transcription/translation using `/tr auto <on/off>`.
-   🎛️ **Kebab Menu Option**: Transcribe any voice message via the **Transcribe** option in the kebab (⋮) menu.
-   📖 **Help at Your Fingertips**: Get instructions anytime with `/tr help`.

---

## 📜 Getting Started

### 🔧 Prerequisites

-   A running Rocket.Chat instance.
-   Rocket.Chat Apps CLI. Install it with:

    ```sh
    npm install -g @rocket.chat/apps-cli
    ```

-   Transcription and Translation Server

For more details about the transcription and translation server, visit the [Transcription and Translation Server Repository](https://github.com/sezallagwal/Apps.Transcribe.Server).

---

### ⚙️ Installation

1. Clone this repository:

    ```sh
    git clone https://github.com/sezallagwal/Apps.AI.Transcribe
    ```

2. Navigate into the app folder:

    ```sh
    cd Apps.AI.Transcribe
    ```

3. Install dependencies:

    ```sh
    npm install
    ```

4. Deploy the app to your Rocket.Chat server:

    ```sh
    rc-apps deploy --url <server_url> --username <your_username> --password <your_password>
    ```

---

## 🚀 Usage

You can interact with the app through commands or the kebab menu:

### Commands

-   `/tr` – Transcribe and translate the latest voice message.
-   `/tr auto on` – Enable auto mode for all voice messages.
-   `/tr auto off` – Disable auto mode.
-   `/tr help` – View help and command instructions.

### Example

-   `/tr` – Instantly transcribes the latest voice message in the thread.
-   `/tr auto on` – Automatically transcribes and translates all incoming voice messages.
-   Use **Transcribe** from the kebab menu on any voice message to initiate manual transcription.

---

## 🧠 Under the Hood

-   🔊 **Speech-to-Text Integration**: Uses **Whisper AI** (OpenAI) for high-accuracy transcription of voice messages.
-   🌐 **Translation Model**: Powered by the **M2M100_418M** model from Facebook AI for multilingual translation, supporting over 100 languages.
-   ⚡ **Optimized for Performance**: Processes audio quickly and reliably with minimal latency.
-   🔒 **Open Source & Secure**: All components are based on open-source models and handle user data securely.
