const strategies = {
    "Negative Split": "<b>Negative Split</b><br><br>Running the second half of the race faster than the first half.<br><br><b>How?</b><br>Start conservatively, maintain an even pace in the middle, and finish with a faster, strong pace.<br><br><b>Why it works</b><br>- Conserves glycogen early.<br>- Helps avoid “hitting the wall.”<br>- Builds confidence and allows for a strong finish.",
    
    "Even Pace": "<b>Even Pace</b><br><br>Maintaining a constant, goal pace throughout the race.<br><br><b>How?</b><br>Train to hit your target pace, avoiding early surges or slowdowns.<br><br><b>Why it works</b><br>- Physiologically efficient, as your body maintains a steady rhythm.<br>- Avoids accumulating too much lactate early.",
    
    "Fast Start": "<b>Fast Start</b><br><br>Running the first segment slightly faster than goal pace, then settling into a slower pace.<br><br><b>How?</b><br>Push slightly harder for the first few kilometers while you’re fresh, then transition to goal pace.<br><br><b>Why it works</b><br>- Provides a cushion for time lost in fatigue later in the race.<br>- Works best for shorter races.",
    
    "Progressive Pace": "<b>Progressive Pace</b><br><br>Gradually increasing pace throughout the race.<br><br><b>How?</b><br>Start conservatively, maintain a steady pace in the middle, and finish with a strong push.<br><br><b>Why it works</b><br>- Combines the benefits of even pacing and negative splits.<br>- Minimizes mental and physical fatigue early on.",
    
    "Reverse Split": "<b>Reverse Split</b><br><br>Running the first half of the race faster than the second half.<br><br><b>How?</b><br>Start aggressively, aiming for a strong early lead, then slow down to conserve energy.<br><br><b>Why it works</b><br>- May suit shorter races or runners relying on mental toughness.<br>- Not recommended for longer distances due to fatigue risks.",
    
    "Run-Walk": "<b>Run-Walk</b><br><br>Alternating between running and walking intervals to conserve energy.<br><br><b>How?</b><br>Run for a set time (e.g., 5 minutes), then walk briskly for 1 minute.<br><br><b>Why it works</b><br>- Reduces physical strain, making it ideal for beginners or ultra-distances.",
    
    "Heart Rate-Based": "<b>Heart Rate-Based</b><br><br>Controlling effort level based on heart rate zones instead of pace.<br><br><b>How?</b><br>Maintain aerobic threshold (Zone 3–4) early and push to anaerobic zones (Zone 5) in the final stages.<br><br><b>Why it works</b><br>- Keeps effort consistent, adapts to terrain and conditions."
};

function toggleCustomDistance() {
    const distanceSelect = document.getElementById("distance");
    const customDistanceContainer = document.getElementById("customDistanceContainer");

    if (distanceSelect.value === "custom") {
        customDistanceContainer.style.display = "block";
    } else {
        customDistanceContainer.style.display = "none";
        document.getElementById("customDistance").value = ""; // Clear custom distance
    }
    toggleCalculateButton();
}

function toggleCalculateButton() {
    const distance = document.getElementById("distance").value;
    const customDistance = parseFloat(document.getElementById("customDistance").value);
    const strategy = document.getElementById("strategy").value;
    const avgTime = document.getElementById("avgTime").value;
    const endTime = document.getElementById("endTime").value;

    const calculateButton = document.getElementById("calculateButton");

    const isCustomDistanceValid = distance === "custom" && !isNaN(customDistance) && customDistance > 0;
    const isStandardDistanceValid = distance !== "" && distance !== "custom";

    if ((isStandardDistanceValid || isCustomDistanceValid) && strategy && (avgTime || endTime) && !(avgTime && endTime)) {
        calculateButton.disabled = false;
    } else {
        calculateButton.disabled = true;
    }
}

function clearFields() {
    document.getElementById("distance").value = "";
    document.getElementById("customDistance").value = "";
    document.getElementById("strategy").value = "";
    document.getElementById("avgTime").value = "";
    document.getElementById("endTime").value = "";

    document.getElementById("customDistanceContainer").style.display = "none";
    document.getElementById("calculateButton").disabled = true;
    document.getElementById("result").innerText = "";
    document.getElementById("racePlan").innerText = "";
}

function calculate() {
    const distanceSelect = document.getElementById("distance").value;
    const customDistance = parseFloat(document.getElementById("customDistance").value);
    const distance = distanceSelect === "custom" ? customDistance : parseFloat(distanceSelect);

    const strategy = document.getElementById("strategy").value;
    const avgTimeInput = document.getElementById("avgTime").value;
    const endTimeInput = document.getElementById("endTime").value;

    let avgTimeInSeconds = 0;
    if (avgTimeInput) {
        avgTimeInSeconds = avgTimeInput
            .split(":")
            .reduce((acc, time) => acc * 60 + parseFloat(time), 0);
    }

    let endTimeInSeconds = 0;
    if (endTimeInput) {
        endTimeInSeconds = endTimeInput
            .split(":")
            .reduce((acc, time) => acc * 60 + parseFloat(time), 0);
        avgTimeInSeconds = endTimeInSeconds / distance;
    }

    if (!distance || distance <= 0 || (!avgTimeInSeconds && !endTimeInSeconds)) {
        alert("Please provide valid inputs.");
        return;
    }

    const racePlanText = generateRacePlan(distance, avgTimeInSeconds, strategy);

    // Add strategy explanation under the report
    const strategyExplanation = strategies[strategy] || "No strategy description available.";
    document.getElementById("racePlan").innerHTML = racePlanText + `<br><br><b>Strategy:</b> ${strategy}<br>` + strategyExplanation;
}

function generateRacePlan(distance, avgTimePerKm, strategy) {
    const startPaceMin = avgTimePerKm * 1.05;
    const startPaceMax = avgTimePerKm * 1.1;
    const finishPaceMin = avgTimePerKm * 0.95;
    const finishPaceMax = avgTimePerKm * 0.98;

    let racePlanText = `Based on your goal of ${distance} km:\n\n` +
        `Average Pace: ${formatPace(avgTimePerKm)} per km\n\n`;

    const fullKms = Math.floor(distance);
    const partialKm = distance % 1;

    for (let i = 1; i <= fullKms; i++) {
        if (strategy === "Negative Split") {
            if (i <= Math.ceil(fullKms * 0.25)) {
                racePlanText += `km ${i}: ${formatPace(startPaceMin)} to ${formatPace(startPaceMax)} per km\n`;
            } else if (i <= Math.ceil(fullKms * 0.75)) {
                racePlanText += `km ${i}: ${formatPace(avgTimePerKm)} per km\n`;
            } else {
                racePlanText += `km ${i}: ${formatPace(finishPaceMin)} to ${formatPace(finishPaceMax)} per km\n`;
            }
        } else if (strategy === "Even Pace") {
            racePlanText += `km ${i}: ${formatPace(avgTimePerKm)} per km\n`;
        } else if (strategy === "Fast Start") {
            if (i === 1) {
                racePlanText += `km ${i}: ${formatPace(startPaceMin)} per km (push early)\n`;
            } else {
                racePlanText += `km ${i}: ${formatPace(avgTimePerKm)} per km (goal pace)\n`;
            }
        } else if (strategy === "Progressive Pace") {
            if (i <= Math.ceil(fullKms * 0.33)) {
                racePlanText += `km ${i}: ${formatPace(startPaceMax)} per km (conservative start)\n`;
            } else if (i <= Math.ceil(fullKms * 0.66)) {
                racePlanText += `km ${i}: ${formatPace(avgTimePerKm)} per km (steady pace)\n`;
            } else {
                racePlanText += `km ${i}: ${formatPace(finishPaceMin)} to ${formatPace(finishPaceMax)} per km (strong finish)\n`;
            }
        } else if (strategy === "Reverse Split") {
            if (i <= Math.ceil(fullKms * 0.5)) {
                racePlanText += `km ${i}: ${formatPace(finishPaceMin)} to ${formatPace(finishPaceMax)} per km (fast start)\n`;
            } else {
                racePlanText += `km ${i}: ${formatPace(avgTimePerKm)} per km (slower second half)\n`;
            }
        } else if (strategy === "Run-Walk") {
            if (i % 2 === 1) {
                racePlanText += `km ${i}: ${formatPace(avgTimePerKm)} per km (run)\n`;
            } else {
                racePlanText += `km ${i}: Walk briskly for 1 minute\n`;
            }
        }
    }

    if (partialKm > 0) {
        racePlanText += `km ${fullKms + 1} (${partialKm.toFixed(1)} km): ${formatPace(avgTimePerKm)} per km\n`;
    }

    return racePlanText;
}

function formatPace(secondsPerKm) {
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = Math.round(secondsPerKm % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
