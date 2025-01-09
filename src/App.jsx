 
import { useState } from 'react'
import Lottie from 'react-lottie';
import loaderAnimation from './assets/loading.json'
 import './App.css'
 import Markdown from 'react-markdown'

function App() {
  
  const [inputValue,setInputValue] = useState('') 
  const [chatHistory,setChatHistory] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  const apiEndpoint ='https://hitt-social.onrender.com/api/chat'
  //console.log("apiendpoint===",apiEndpoint)
  //const bearerToken = import.meta.env.VITE_BEARER_TOKEN
  //console.log("BearerToken===",bearerToken)

  //const apii=`https://api.langflow.astra.datastax.com/${apiEndpoint}`
  //console.log(apii)
 
  const loaderOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
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
    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: inputValue },
    ]);
    setInputValue("");
    try {
 
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${bearerToken}`,
 
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("failed to fetch response from backend");
      }

      const data = await response.json();
      let ans = data.outputs[0].outputs[0].artifacts.message;
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: ans || "No response received" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: "Error occurred while fetching response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="app-container">
      <h2 className="title">HITT Social</h2>
      <div className="chatbox">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`message ${
              chat.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <strong>{chat.sender === "user" ? "You: " : "Bot: "}</strong>
            <span><Markdown>{chat.message}</Markdown></span>
          </div>
        ))}
        {isLoading && (
          <div className="loader-container">
            <Lottie options={loaderOptions} height={50} width={50} />
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyDown}
          className="input-field"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`send-button ${isLoading ? "disabled" : ""}`}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
