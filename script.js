let prompts = [];           // Array to store prompts
let remainingPrompts = [];  // Array to keep track of remaining prompts

// Fetch prompts from JSON file
fetch('prompts.json')
    .then(response => response.json())
    .then(data => {
        prompts = data;
        resetPrompts(); // Initialize remaining prompts
        showRandomPrompt(); // Display the first random prompt
    })
    .catch(error => {
        console.error('Error loading prompts:', error);
        document.getElementById('prompt1').innerText = "Error loading prompts.";
        document.getElementById('prompt2').innerText = "Error loading prompts.";
    });

// Function to reset the pool of remaining prompts
function resetPrompts() {
    remainingPrompts = [...prompts]; // Clone all prompts into the remaining pool
}

// Function to display a random prompt
function showRandomPrompt() {
    if (remainingPrompts.length === 0) {
        // If no prompts are left, reset the pool and inform the user
        alert("You've seen all the prompts! Restarting...");
        resetPrompts();
    }

    // Pick a random index from the remaining prompts
    const randomIndex = Math.floor(Math.random() * remainingPrompts.length);

    // Display the randomly selected prompt
    const selectedPrompt = remainingPrompts[randomIndex];
    document.getElementById('prompt1').innerText = selectedPrompt.prompt1;
    document.getElementById('prompt2').innerText = selectedPrompt.prompt2;

    // Remove the selected prompt from the remaining pool
    remainingPrompts.splice(randomIndex, 1);
}

// Event listener for "Next" button
document.getElementById('nextSet').addEventListener('click', showRandomPrompt);

let punishments = []; // Array to store punishment messages

// Fetch punishment prompts from JSON file
fetch('punishments.json')
    .then(response => response.json())
    .then(data => {
        punishments = data; // Store the prompts in the punishments array
    })
    .catch(error => {
        console.error('Error loading punishments:', error);
    });

// Event listener for "Start" button
document.getElementById('startGame').addEventListener('click', () => {
    document.getElementById('intro').style.display = 'none'; // Hide the intro screen
    document.getElementById('transition').style.display = 'block'; // Show the transitional screen

    // Pick a random punishment from the array
    if (punishments.length > 0) {
        const randomIndex = Math.floor(Math.random() * punishments.length);
        document.getElementById('punishment').innerText = punishments[randomIndex];
    } else {
        document.getElementById('punishment').innerText = "Be nice to her anyway! 😊"; // Fallback if JSON fails to load
    }
});

// Event listener for "Continue" button
document.getElementById('continueToGame').addEventListener('click', () => {
    document.getElementById('transition').style.display = 'none'; // Hide the transitional screen
    document.getElementById('game').style.display = 'block'; // Show the game screen
    showRandomPrompt(); // Display the first random prompt
});

