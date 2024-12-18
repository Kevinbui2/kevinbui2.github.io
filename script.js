let prompts = [];           // Array to store prompts
let remainingPrompts = [];  // Array to keep track of remaining prompts
let punishments = [];       // Array to store punishments
let clickCounter = 0;       // Variable to track how many times the button has been clicked

// Fetch prompts and punishments from JSON files
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

fetch('punishments.json')
    .then(response => response.json())
    .then(data => {
        punishments = data; // Store punishments when the JSON is loaded
    })
    .catch(error => {
        console.error('Error loading punishments:', error);
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

    // Increment and display the click counter
    clickCounter++;
    document.getElementById('clickCount').innerText = `${clickCounter}`;
}

// Event listener for "Next" button
document.getElementById('nextSet').addEventListener('click', () => {
    showRandomPrompt(); // Only show a new prompt when the "Next" button is clicked
});

// Event listener for "Start" button
document.getElementById('startGame').addEventListener('click', () => {
    document.getElementById('intro').style.display = 'none'; // Hide the intro screen
    document.getElementById('transition').style.display = 'block'; // Show the transition screen
    clickCounter = 0; // Reset the click counter when the game starts
    document.getElementById('clickCount').innerText = `${clickCounter}`; // Reset the click count display
    
    // Select a random punishment when the game starts
    if (punishments.length > 0) {
        const randomPunishment = punishments[Math.floor(Math.random() * punishments.length)];
        document.getElementById('punishment').innerText = `${randomPunishment}`;
    } else {
        document.getElementById('punishment').innerText = "No punishments available!";
    }
});

// Event listener for "Continue" button (transition screen)
document.getElementById('continueToGame').addEventListener('click', () => {
    document.getElementById('transition').style.display = 'none'; // Hide the transition screen
    document.getElementById('game').style.display = 'block'; // Show the game screen
    showRandomPrompt(); // Display the first random prompt
});
