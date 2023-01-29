import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Response from "./pages/Response";
import Recommendations from "./pages/Recommendations";
import SearchIcon from "./components/SearchIcon";
import { animateScroll as scroll } from "react-scroll";

function App() {
  const [prompt, setPrompt] = useState(null);
  const [data, setData] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [lazySuggestions, setLazySuggestions] = useState(null);

  const scrollTo = (pageId) => {
    let page = document.getElementById(pageId);

    scroll.scrollTo(page.offsetTop);
  };

  const fetchData = (prompt) => {
    setData(null);
    setSuggestions(null);

    // Gets the lazy loading message tip
    fetch("http://127.0.0.1:5000/loading", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("LOADING CALL");
        console.log(data);
        console.log(data.tip);
        setLazySuggestions(data.tip);
      });

    // Get Response for prompt
    fetch("http://127.0.0.1:5000/response", {
      method: "POST", // 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("FIRST CALL");
        console.log(data);
        console.log(data.response[0]);
        setData(data.response);

        scrollTo("Response"); //Scroll to the suggestion
      });

    // Getting more suggestions
    fetch("http://127.0.0.1:5000/suggestions", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("SECOND CALL");

        console.log(data);
        console.log(data.suggestions);
        setSuggestions(data.suggestions);
      });
  };

  const recommendedPrompt = (title, description) => {
    setData(description);
    setPrompt(title);
  };
  return (
    <div className="App bg-[#F1F1F1] min-h-screen">
      <Home
        prompt={prompt}
        setPrompt={setPrompt}
        scrollTo={scrollTo}
        fetchData={fetchData}
        suggestions={suggestions}
        data={data}
        lazySuggestions={lazySuggestions}
      />
      <Response prompt={prompt} scrollTo={scrollTo} data={data} />
      <Recommendations
        suggestions={suggestions}
        scrollTo={scrollTo}
        data={data}
        recommendedPrompt={recommendedPrompt}
      />
      <SearchIcon scrollTo={scrollTo} />
    </div>
  );
}

export default App;
