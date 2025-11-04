document.addEventListener("DOMContentLoaded", () => {
  const jokeDisplay = document.getElementById("joke-display");
  const allButtons = document.querySelectorAll(".btn");
  const randomJokeForm = document.getElementById("random-joke-form");
  const customJokeForm = document.getElementById("custom-joke-form");

  //  Loading State 
  function setLoading(isLoading) {
    if (isLoading) {
      jokeDisplay.value = "Fetching joke...";
      allButtons.forEach((btn) => (btn.disabled = true));
    } else {
      allButtons.forEach((btn) => (btn.disabled = false));
    }
  }


  //  Format and Display 
  function formatAndDisplayJoke(jokeData) {
    if (jokeData.error) {
      jokeDisplay.value = `Error: ${jokeData.message}`;
    } else if (jokeData.type === "single") {
      jokeDisplay.value = jokeData.joke;
    } else if (jokeData.type === "twopart") {
      jokeDisplay.value = `${jokeData.setup}\n\n${jokeData.delivery}`;
    } else {
      jokeDisplay.value = "Sorry, an unexpected error occurred.";
    }
  }


  //  Fetch Joke from API 
  async function fetchJoke(apiUrl) {
  setLoading(true);
  try {
    const response = await fetch(apiUrl);
    const data = await response.json(); // read body immediately

    // ✅ Handle "no jokes found" or other API-level errors
    if (data.error) {
      jokeDisplay.value = "No jokes found for this selection. Try a different type or category!";
      return;
    }

    // ✅ Handle network problems (non-200)
    if (!response.ok) {
      throw new Error(`Network response was not ok (Status: ${response.status})`);
    }

    // ✅ Normal joke display
    formatAndDisplayJoke(data);

  } catch (error) {
    console.error("Fetch Error:", error);
    jokeDisplay.value = "Oops! Could not fetch a joke. Please try again.";
  } finally {
    setLoading(false);
  }
}




  randomJokeForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent form reload
    const randomApiUrl = "https://v2.jokeapi.dev/joke/Any?safe-mode";
    fetchJoke(randomApiUrl);
  });


 
  customJokeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get selected genre (radio)
    const selectedGenre = document.querySelector(
      'input[name="genre"]:checked'
    )?.value;

    // Get selected types (checkboxes)
    const singleType = document.getElementById("type-single").checked;
    const twoPartType = document.getElementById("type-twopart").checked;

    const types = [];
    if (singleType) types.push("single");
    if (twoPartType) types.push("twopart");

    // Validation
    if (types.length === 0) {
      jokeDisplay.value =
        "Please select at least one joke type (Single or Two Part).";
      return;
    }

    
    // Build API URL
    const baseUrl = `https://v2.jokeapi.dev/joke/${selectedGenre}`;
    const params = [];
    if (types.length === 1) {
      params.push(`type=${types[0]}`);
    }

    const customApiUrl = `${baseUrl}?${params.join("&")}`;

    // Fetch the joke
    fetchJoke(customApiUrl);
  });
});
