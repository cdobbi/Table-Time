document.addEventListener("DOMContentLoaded", function () {
    const verifyButton = document.getElementById("verify-code");

    if (verifyButton) {
        verifyButton.addEventListener("click", async function () {
            const organizerCode = document.getElementById("organizer-code").value;

            try {
                const response = await fetch("https://livestock-lineup.onrender.com/verify-code", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: organizerCode }),
                });
                const result = await response.json();
                if (result.valid) {
                    window.location.href = "organizer.html";
                } else {
                    
                  alert("Invalid code. Please try again.");
                }
                
            } catch (error) {
                console.error("Error verifying code:", error);
                alert("An error occurred while verifying the code. Please try again.");
            }
        });
    } else {
        console.warn("Verify button not found in the DOM.");
    }
});