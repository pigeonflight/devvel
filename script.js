document.addEventListener('DOMContentLoaded', () => {

    // Inputs
    const complexityInput = document.getElementById('complexity');
    const uncertaintyInput = document.getElementById('uncertainty');
    const skillsInput = document.getElementById('skills');
    const baseEffortInput = document.getElementById('base-effort');

    // Display Values
    const complexityValDisplay = document.getElementById('complexity-val');
    const uncertaintyValDisplay = document.getElementById('uncertainty-val');

    // Results
    const finalHoursDisplay = document.getElementById('final-hours');
    const confidenceScoreDisplay = document.getElementById('confidence-score');

    function calculate() {
        const complexity = parseInt(complexityInput.value);
        const uncertainty = parseInt(uncertaintyInput.value);
        const skillFactor = parseFloat(skillsInput.value);
        const baseEffort = parseFloat(baseEffortInput.value);

        // Update UI displays for sliders
        complexityValDisplay.textContent = complexity;
        uncertaintyValDisplay.textContent = uncertainty;

        if (isNaN(baseEffort) || baseEffort <= 0) {
            finalHoursDisplay.textContent = "--";
            confidenceScoreDisplay.textContent = "--%";
            return;
        }

        // Framework Formula
        // 1. Complexity Multiplier: 1 + (Complexity * 0.1) -> 1.1 to 2.0x
        const complexityMultiplier = 1 + (complexity * 0.1);

        // 2. Uncertainty Multiplier: 1 + (Uncertainty * 0.15) -> 1.15 to 2.5x  (Higher weight)
        const uncertaintyMultiplier = 1 + (uncertainty * 0.15);

        // 3. Raw Estimation
        let estimatedHours = baseEffort * complexityMultiplier * uncertaintyMultiplier;

        // 4. Apply Skill Factor (Divisor: higher skill = less time)
        // Adjust skill factor to inverse: 0.5 (Junior) should increase time, 2.0 (Expert) should decrease.
        // If skill is "Competent" (1.0), no change.
        // If skill is "Junior" (0.5), time doubles (1/0.5 = 2).
        estimatedHours = estimatedHours / skillFactor;

        // 5. Confidence Score (Inverse of uncertainty)
        // 10 uncertainty = 10% confidence, 1 uncertainty = 90% confidence
        const confidence = 100 - (uncertainty * 8);

        finalHoursDisplay.textContent = Math.round(estimatedHours);
        confidenceScoreDisplay.textContent = `${Math.max(10, confidence)}%`;
    }

    // Event Listeners
    [complexityInput, uncertaintyInput, skillsInput, baseEffortInput].forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Initial Calc
    calculate();
});

function copyPrompt(elementId, btnElement) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnElement.textContent;
        btnElement.textContent = "Copied!";
        btnElement.classList.add('btn-success');

        // Show preview
        document.getElementById('preview-area').innerText = text.substring(0, 500) + "\n\n... (Full prompt copied to clipboard)";

        setTimeout(() => {
            btnElement.textContent = originalText;
            btnElement.classList.remove('btn-success');
        }, 2000);
    });
}
