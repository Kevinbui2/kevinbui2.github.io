let prompts = []; // Array to store prompts
let currentIndex = 0; // Track which set is being displayed

// Fetch prompts from JSON file on page load
fetch('prompts.json')
    .then(response => response.json())
    .then(data => {
        prompts = data;
        displayPrompts(); // Display the first set
    })
    .catch(error => {
        console.error('Error loading prompts:', error);
        document.getElementById('prompt1').innerText = "Error loading prompts.";
        document.getElementById('prompt2').innerText = "Error loading prompts.";
    });

// Function to display current set of prompts
function displayPrompts() {
    if (prompts.length > 0) {
        const prompt1 = document.getElementById('prompt1');
        const prompt2 = document.getElementById('prompt2');

        prompt1.innerText = prompts[currentIndex].prompt1;
        prompt2.innerText = prompts[currentIndex].prompt2;
    }
}

// Add event listener for "Next Set" button
document.getElementById('nextSet').addEventListener('click', () => {
    currentIndex++; // Move to the next set

    if (currentIndex >= prompts.length) {
        currentIndex = 0; // Loop back to the beginning
    }

    displayPrompts(); // Update the display
});
