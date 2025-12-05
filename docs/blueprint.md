# **App Name**: Reena Chat

## Core Features:

- Chat Interface: Responsive chat interface with message display, input area, and toolbar for settings.
- Message Persistence: Save and load conversations from local storage, with clear history and export/import options.
- API Key Input: Modal for inputting API Key with memory-only option and security warnings about local storage.
- AI-Powered Chatbot: Integrate with OpenAI-compatible endpoints with example fetch code for streaming, supports configuration options in the code itself for things such as `API_URL`, `MODEL_NAME = "Reena"`, `USE_STREAMING`, `USE_MOCK_MODE`.
- Typing Indicator: Display an animated typing indicator when the chatbot is generating a response.
- Accessibility: Implementation of ARIA labels and keyboard navigation for improved accessibility. Automatically scroll to the bottom.
- Streaming Text Generation: LLM Tool: Gradual reveal of assistant's text as it is being generated via the API, using an LLM that determines what text should be streamed at what time.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) for a professional yet engaging feel.
- Background color: Light gray (#F0F0F5), almost white, to ensure readability.
- Accent color: Soft purple (#9575CD) for highlights and interactive elements, creating contrast.
- Body and headline font: 'Inter' (sans-serif) for a modern, readable, and neutral appearance.
- Use simple, clear icons for settings, clear history, and dark/light mode toggles.
- Mobile-first, responsive layout with a clean, modern UI. System prompt editable area above chat or in settings.
- Subtle animations for message entry (slide + fade), smooth scrolling, and typing indicator.