// const { initializePusher } = require("./pusherNotifications.js");
document.addEventListener("DOMContentLoaded", async function () {
    const breedOptionsContainer = document.getElementById("breeds-options");
    const saveEntriesButton = document.getElementById("save-shows");
    const categorySelect = document.getElementById("category-select"); // Added for category
    const showSelect = document.getElementById("show-select"); // Added for show

    document.addEventListener("DOMContentLoaded", async function () {
        // Initialize Pusher for notifications
        const pusherInstance = await initializePusher();
        if (!pusherInstance) {
            console.error("Failed to initialize Pusher. Notifications will not work.");
        }
    });

    fetch("https://livestock-lineup.onrender.com/api/breeds")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        if (!data.shows || !Array.isArray(data.shows)) {
            console.error("Error: 'shows' is missing or is not an array in the fetched data.");
            return;
        }

        // Ensure the breed-options container exists in the DOM
        if (!breedOptionsContainer) {
            console.error("Error: 'breed-options' container not found in the DOM.");
            return;
        }

        // Iterate over the breed shows to dynamically create buttons
        data.shows.forEach((entry) => {
            const breedButton = document.createElement("button");
            breedButton.className = "breed-button";
            breedButton.textContent = entry.breed;

            // Add a click event listener to toggle the selected class
            breedButton.addEventListener("click", function (event) {
                event.preventDefault();
                breedButton.classList.toggle("selected");
                console.log(`Button clicked for breed: ${entry.breed}`);
            });

            // Append the dynamically created button to the breed-options container
            breedOptionsContainer.appendChild(breedButton);
        });

        console.log("Breed options successfully fetched and rendered.");
    })
    .catch((error) => {
        console.error("Error fetching or processing breed data:", error);
    });

    // Save shows when the button is clicked
    saveEntriesButton.addEventListener("click", async function () {
        // Get selected category and show
        const selectedCategory = categorySelect.value;
        const selectedShow = showSelect.value;
    
        // Check that both category and show are selected
        if (!selectedCategory || !selectedShow) {
            alert("Please select both a category and a show.");
            return;
        }
    
        // Collect selected breed
        const selectedBreeds = [];
        const selectedButtons = breedOptionsContainer.querySelectorAll(".breed-button.selected");
    
        selectedButtons.forEach((button) => {
            selectedBreeds.push(button.textContent);
        });
    
        if (selectedBreeds.length === 0) {
            alert("Please select at least one breed to start the application.");
            return;
        }
    
        // Create the entry object to send to the backend
        const shows = {
            category: selectedCategory,
            show: selectedShow,
            breeds: selectedBreeds,
        };
    
        try {
            const response = await fetch("https://livestock-lineup.onrender.com/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(shows),
            });
    
            if (response.ok) {
                alert("Your shows have been saved. You will be notified when your breed is called.");
            } else {
                console.error("Failed to save shows:", await response.text());
                alert("Failed to save shows. Please try again.");
            }
        } catch (error) {
            console.error("Error saving shows:", error);
            alert("An error occurred while saving your shows.");
        }
    });    

    async function checkForNotifications() {
        try {
            const exhibitorResponse = await fetch("https://livestock-lineup.onrender.com/api/exhibitors/all-exhibitors");
            if (!exhibitorResponse.ok) {
                throw new Error("Failed to fetch exhibitor data.");
            }
    
            const submissions = await exhibitorResponse.json();
            console.log("Exhibitor shows fetched for validation:", submissions);
    
            // Notification examples (you can fetch these dynamically if required)
            const notifications = [
                { brees: "Holland Lop", category: "Youth", show: "A" },
                { breed: "Netherland Dwarf", category: "Youth", show: "A" },
            ];
    
            // Check if any exhibitor matches the notifications
            notifications.forEach((notification) => {
                const { breed, category, show } = notification;
    
                const isMatchFound = exhibitors.submissions.some((exhibitor) =>
                    exhibitor.submissions.some((submission) =>
                        submission.category === category &&
                        submission.show === show &&
                        submission.breed.includes(breed)
                    )
                );

                if (typeof notifyUser === "function") {
                    notifyUser(breed, category, show);
                } else {
                    alert(`Notification for Category: ${category}, Show: ${show}, Breed: ${breed}`);
                    const notificationSound = new Audio("/sounds/alert.mp3");
                    notificationSound.play();
                }                          
            });
        } catch (error) {
            console.error("Error fetching or processing notifications:", error);
        }
    }    

    setInterval(checkForNotifications, 5000);
});
