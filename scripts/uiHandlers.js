import { fetchAndRenderBreeds } from "./fetchBreeds.js";
import { saveLineup } from "./lineupActions.js";

document.addEventListener("DOMContentLoaded", function () {
    const rabbitList = document.getElementById("rabbit-list");
    const saveLineupButton = document.getElementById("save-lineup");
    const apiBase = "https://livestock-lineup.onrender.com/api"; // Base URL for API endpoints

    // Fetch and Render Rabbit Breeds from /api/breeds
    fetchAndRenderBreeds(`${apiBase}/breeds`, rabbitList);

    // Save Lineup Action
    if (saveLineupButton) {
        saveLineupButton.addEventListener("click", async () => {
            const categoryEl = document.getElementById("category");
            const showEl = document.getElementById("show");
            const category = categoryEl ? categoryEl.value : "";
            const show = showEl ? showEl.value : "";

            const selectedBreeds = Array.from(document.querySelectorAll(".breed-button.active")).map(
                (btn) => btn.dataset.breed
            );

            // Using the /api/lineups route to save lineups
            await saveLineup(category, show, selectedBreeds, `${apiBase}/lineups`, "Organizer123");
        });
    }
});
