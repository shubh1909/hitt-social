import { useState } from 'react'

import './App.css'

function App() {
  
  const [inputValue,setInputValue] = useState('') 
  const [chatHistory,setChatHistory] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  const apiEndpoint =import.meta.env.VITE_API_ENDPOINT
  //console.log("apiendpoint===",apiEndpoint)
  const bearerToken = import.meta.env.VITE_BEARER_TOKEN
  //console.log("BearerToken===",bearerToken)

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const body = {
      input_value: inputValue,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "TextInput-wEeAr": {},
        "ChatInput-WoewN": {},
        "Prompt-PB5gi": {},
        "OpenAIModel-Ev5mo": {},
        "ChatOutput-LFwhO": {},
        "AstraDB-vSody": {},
        "OpenAIEmbeddings-95Xqi": {},
        "File-phdM7": {},
        "SplitText-Yiwsm": {},
        "ParseData-Driwb": {},
      },
    };

    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(body)
        
      });

      const data = await response.json();

      setChatHistory((prev) => [
        ...prev,
        { sender: "user", message: inputValue },
        { sender: "bot", message: data.response || "No response received" },
      ]);
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "user", message: inputValue },
        { sender: "bot", message: "Error occurred while fetching response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Chatbot</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              textAlign: chat.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <strong>{chat.sender === "user" ? "You: " : "Bot: "}</strong>
            <span>{chat.message}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="give me best performing user"
          style={{ flex: 1, padding: "10px", marginRight: "10px" }}
        />
        <button onClick={handleSend} disabled={isLoading} style={{ padding: "10px 20px" }}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
    </>
  )
}

export default App
