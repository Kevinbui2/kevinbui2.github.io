let prompts = []; // Array to store prompts

// Fetch prompts from JSON file
fetch('prompts.json')
    .then(response => response.json())
    .then(data => {
        prompts = data;
        showRandomPrompt(); // Show the first random prompt
    })
    .catch(error => {
        console.error('Error loading prompts:', error);
        document.getElementById('prompt1').innerText = "Error loading prompts.";
        document.getElementById('prompt2').innerText = "Error loading prompts.";
    });

// Function to display random prompts
function showRandomPrompt() {
    if (prompts.length > 0) {
        const randomIndex = Math.floor(Math.random() * prompts.length);
        document.getElementById('prompt1').innerText = prompts[randomIndex].prompt1;
        document.getElementById('prompt2').innerText = prompts[randomIndex].prompt2;
    } else {
        document.getElementById('prompt1').innerText = "No prompts available.";
        document.getElementById('prompt2').innerText = "No prompts available.";
    }
}

// Add event listener for "Next" button
document.getElementById('nextSet').addEventListener('click', showRandomPrompt);
