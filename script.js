/**
 * ============================================================================
 * CAREER COMPASS - SCRIPT.JS (PHASE 1 & PHASE 2)
 * ============================================================================
 * 
 * Includes:
 * 1. Single-Page Application (SPA) view router (Dashboard, Modules 1-3).
 * 2. Mobile navigation drawer toggle with full ARIA accessibility.
 * 3. Module 1: Imposter Shield - Rule-based heuristic email parser,
 *    predefined workplace examples, empty-input validation, 15-minute micro-tasks,
 *    and customizable reply drafts with clipboard copy.
 * 
 * Designed for beginners: Extensively commented vanilla JavaScript only.
 * No external libraries, build tools, or frameworks required.
 * ============================================================================
 */

// Wait until the HTML document is fully loaded before executing our scripts
document.addEventListener("DOMContentLoaded", () => {
    console.log("Career Compass: Initializing Dashboard & Imposter Shield...");

    // ========================================================================
    // PART 1: GLOBAL NAVIGATION & VIEW ROUTING
    // ========================================================================

    const navToggle = document.getElementById("nav-toggle");
    const primaryNav = document.getElementById("primary-nav");
    const allViews = document.querySelectorAll(".view-section");
    const allNavLinks = document.querySelectorAll(".nav-link");
    const brandLink = document.querySelector(".brand-link");

    /**
     * Shows the specified view (e.g. 'dashboard-view', 'imposter-shield-view')
     * and hides all other views.
     */
    function navigateToView(targetViewId) {
        if (!targetViewId) {
            console.warn("navigateToView called without a targetViewId.");
            return;
        }

        const targetView = document.getElementById(targetViewId);
        if (!targetView) {
            console.error(`View with ID "${targetViewId}" was not found in the HTML.`);
            return;
        }

        // A. Hide all view sections
        allViews.forEach((view) => {
            view.classList.remove("active-view");
            view.classList.add("hidden-view");
        });

        // B. Reveal the target view section
        targetView.classList.remove("hidden-view");
        targetView.classList.add("active-view");

        // C. Update active state on navigation links for visual feedback & accessibility
        allNavLinks.forEach((link) => {
            const linkTarget = link.getAttribute("data-target");
            if (linkTarget === targetViewId) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            }
        });

        // D. Close the mobile navigation menu if open
        closeMobileNav();

        // E. Smoothly scroll to the top of the main content area
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        console.log(`Navigated to view: ${targetViewId}`);
    }

    /**
     * Opens or closes the dropdown menu on mobile screens and updates ARIA tags.
     */
    function toggleMobileNav() {
        if (!primaryNav || !navToggle) return;
        const isCurrentlyOpen = primaryNav.classList.contains("is-open");
        const nextState = !isCurrentlyOpen;
        primaryNav.classList.toggle("is-open", nextState);
        navToggle.setAttribute("aria-expanded", String(nextState));
    }

    function closeMobileNav() {
        if (!primaryNav || !navToggle) return;
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    }

    // Attach Header & Global Click Listeners
    if (navToggle) {
        navToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleMobileNav();
        });
    }

    allNavLinks.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const targetViewId = button.getAttribute("data-target");
            navigateToView(targetViewId);
        });
    });

    if (brandLink) {
        brandLink.addEventListener("click", (event) => {
            event.preventDefault();
            navigateToView("dashboard-view");
        });
    }

    // Event delegation: Catches clicks on all elements with 'data-target'
    document.addEventListener("click", (event) => {
        const targetElement = event.target.closest("[data-target]");
        if (targetElement && !targetElement.classList.contains("nav-link") && !targetElement.classList.contains("brand-link")) {
            event.preventDefault();
            const targetViewId = targetElement.getAttribute("data-target");
            if (targetViewId) {
                navigateToView(targetViewId);
            }
        }
    });

    // Close mobile nav when clicking outside
    document.addEventListener("click", (event) => {
        if (primaryNav && primaryNav.classList.contains("is-open")) {
            const isClickInsideNav = primaryNav.contains(event.target);
            const isClickOnToggle = navToggle && navToggle.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggle) {
                closeMobileNav();
            }
        }
    });

    // Close mobile nav on Escape key press
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && primaryNav && primaryNav.classList.contains("is-open")) {
            closeMobileNav();
            navToggle.focus();
        }
    });


    // ========================================================================
    // PART 2: IMPOSTER SHIELD MODULE CONTROLLER (PHASE 2)
    // ========================================================================

    /**
     * Predefined Workplace Examples Bank
     * At least 6 realistic, nuanced scenarios representing common workplace stressors.
     */
    const IMPOSTER_SHIELD_EXAMPLES = [
        {
            id: "per-previous-email",
            title: "Per My Previous Email (Urgent Report)",
            tag: "urgent",
            sender: "colleague",
            tone: "Urgent",
            snippet: "Hi, Per my previous email, we still haven't received the Q3 analytics report...",
            text: "Hi, Per my previous email, we still haven't received the Q3 analytics report. Please see the attached thread. Need this ASAP for the leadership deck.",
            analysis: {
                detectedTone: "Urgent & Direct",
                urgency: "High (Immediate Response Needed)",
                taskType: "Deliverable Follow-up",
                framework: "De-escalation & Asset Delivery",
                meaning: `<p><strong>What it actually means:</strong> The sender is facing external pressure from executive leadership and feels anxious because they cannot find the report. While <em>"per my previous email"</em> can trigger imposter panic, it is rarely a personal attack—it is corporate shorthand meaning: <em>"I am in a rush and need to confirm this so I don't get blamed by my boss."</em></p>
                          <p><strong>De-panic perspective:</strong> You did not ruin anyone's career. Take a slow breath. This is routine office coordination.</p>`,
                expectations: [
                    "An immediate acknowledgment so they know you have seen this ping.",
                    "Either the completed report attached directly, or an honest, concrete ETA (e.g. 'Delivering by 2:00 PM').",
                    "A link or file attached right in this thread so they don't have to search their inbox."
                ],
                actionPlan: [
                    "Check your sent folder or drafts to see if the report was already sent or if it is currently in progress.",
                    "If already sent: Re-attach it with a cheerful, polite note (no passive-aggression).",
                    "If still in progress: Reply immediately with a specific completion time (e.g., 'Draft is 85% done, delivering by 2:30 PM today')."
                ],
                starterTask: "Set a timer for 15 minutes. Open the document or draft, verify its current percentage of completion, and send an immediate 2-sentence acknowledgment confirming your delivery ETA.",
                suggestedReply: `Hi [Name],

Thanks for following up! 

Re-attaching the Q3 analytics report directly here for your convenience. 

[Alternative if still in progress: "I am finalizing the last section right now and will send the complete file over by [e.g. 2:30 PM] today in time for the leadership deck."]

Please let me know if you need any specific data points highlighted!

Best regards,
[Your Name]`
            }
        },
        {
            id: "vague-thoughts",
            title: "Vague 'Thoughts?' on Customer Feedback",
            tag: "vague",
            sender: "executive",
            tone: "Vague",
            snippet: "Hey - thoughts on the attached customer feedback summary? Let me know...",
            text: "Hey - thoughts on the attached customer feedback summary? Let me know where you stand.",
            analysis: {
                detectedTone: "Vague & Exploratory",
                urgency: "Medium (Respond within 24 hours)",
                taskType: "High-Level Synthesis",
                framework: "Executive Summary & Point of View",
                meaning: `<p><strong>What it actually means:</strong> The sender has a calendar packed with meetings and does not have time to read through a dense document. They are not asking you to write an exhaustive 10-page thesis; they are asking for your <strong>curated, 3-bullet perspective</strong> on what matters most.</p>
                          <p><strong>De-panic perspective:</strong> They trust you to spot key trends. There is no single "secret correct answer" they are hiding from you.</p>`,
                expectations: [
                    "A quick synthesis of the top 2–3 salient themes or surprises in the data.",
                    "A clear recommendation or stance (e.g., 'Theme A looks like our biggest growth opportunity').",
                    "Brevity: Bullet points are preferred over long paragraphs."
                ],
                actionPlan: [
                    "Skim the document's executive summary, charts, or top feedback quotes.",
                    "Isolate: 1 major positive finding, 1 notable friction/risk point, and 1 proposed next step.",
                    "Format your response as 3 concise bullet points with a clear takeaway."
                ],
                starterTask: "Set a timer for 15 minutes. Skim only the first 2 pages or conclusion of the attachment and write down exactly 3 bullet points: 1 strength, 1 weakness, and 1 recommendation.",
                suggestedReply: `Hi [Name],

I reviewed the feedback summary. Three key takeaways that stand out from my perspective:

1. [Key Strength]: Customers are very positive about [e.g., the speed of the updated onboarding].
2. [Key Friction]: The most frequent complaint is [e.g., confusion around subscription tier limits].
3. [Actionable Next Step]: I recommend we prioritize [e.g., clarifying the tier comparison table next sprint].

I would recommend focusing on #2 first. Happy to share a quick 1-pager if you'd like to explore this further.

Best,
[Your Name]`
            }
        },
        {
            id: "friday-scope-creep",
            title: "Friday 5 PM Scope Creep Request",
            tag: "urgent",
            sender: "client",
            tone: "Urgent",
            snippet: "Can you quickly update all 42 client slides with the new branding guidelines...",
            text: "Can you quickly update all 42 client slides with the new branding guidelines before you log off today? Shouldn't take more than a few minutes. Thanks!",
            analysis: {
                detectedTone: "High-Pressure & Unrealistic",
                urgency: "High Pressure (Boundary Required)",
                taskType: "Scope Management",
                framework: "Diplomatic Boundary & Realistic Delivery",
                meaning: `<p><strong>What it actually means:</strong> The sender is attempting to clear their own to-do list before logging off for the weekend. They genuinely underestimate the manual effort required for 42 slides, assuming it is a one-click automated process. They are not maliciously trying to ruin your evening.</p>
                          <p><strong>De-panic perspective:</strong> Saying <em>"yes"</em> and then doing rushed, poor work until midnight will hurt you more than setting a polite, professional timeline boundary right now.</p>`,
                expectations: [
                    "A fast acknowledgment before end-of-day so they know the status.",
                    "A reality check on turnaround time without sounding complaining or overwhelmed.",
                    "A workable compromise (e.g., priority slides today, remainder on Monday morning)."
                ],
                actionPlan: [
                    "Do NOT panic or stay silent until midnight.",
                    "Estimate the true effort: 42 slides with formatting checks is realistically 2 to 3 hours of focused work.",
                    "Offer an immediate, helpful compromise: format the top 5 priority slides today, and schedule the full deck for Monday morning completion."
                ],
                starterTask: "Set a timer for 15 minutes. Open the deck, format just the title slide and first 2 slides to test the new guidelines, then use that estimate to send the boundary template below.",
                suggestedReply: `Hi [Name],

Thanks for sharing the updated branding guidelines!

To ensure high visual quality and consistency across all 42 slides, this update will take approximately [e.g., 2 to 3 hours] of focused formatting. Since I am scheduled to log off at [e.g., 5:30 PM] today, I can offer two options:

1. Priority Approach: I can format the first 5 key intro slides before I sign off today, and deliver the remaining 37 slides first thing Monday morning by [e.g., 11:00 AM].
2. Full Delivery: I can complete the entire deck first thing Monday morning so you have the polished version in one clean package.

Please let me know which option works best for your schedule!

Best regards,
[Your Name]`
            }
        },
        {
            id: "chat-this-afternoon",
            title: "Do You Have 5 Mins to Chat? (Check-in)",
            tag: "critical",
            sender: "manager",
            tone: "Critical",
            snippet: "Hey, do you have 5 minutes this afternoon? Want to touch base on your deliverables...",
            text: "Hey, do you have 5 minutes this afternoon? Want to touch base on your recent deliverables and talk through some realignment.",
            analysis: {
                detectedTone: "Ambiguous & Direct",
                urgency: "Medium-High (Schedule Today)",
                taskType: "One-on-One Alignment",
                framework: "Receptive Growth & Constructive Listening",
                meaning: `<p><strong>What it actually means:</strong> This sentence is famous for creating intense imposter anxiety (<em>"Am I getting fired?"</em>). In reality, <em>"realignment"</em> almost always means project priorities shifted higher up, or a specific deliverable needs a different angle. Managers prefer quick 5-minute verbal check-ins over back-and-forth emails to avoid misunderstandings.</p>
                          <p><strong>De-panic perspective:</strong> Redirection and course corrections are a normal weekly occurrence in every company. It is an opportunity for clarity, not an ending.</p>`,
                expectations: [
                    "Promptly confirming your availability for a short sync today.",
                    "Showing up with an open, receptive, solution-oriented mindset.",
                    "Having your recent work open on your screen so you can take notes and reference specifics."
                ],
                actionPlan: [
                    "Take a deep breath and reply promptly with 2 specific time windows you are free this afternoon.",
                    "Pull up your latest deliverables and jot down any questions or uncertainties you had while making them.",
                    "During the call, listen actively, take notes, and repeat back what you hear: <em>'Just to confirm I understand, the main priority is X rather than Y?'</em>"
                ],
                starterTask: "Set a timer for 15 minutes. Open your current project folder, review the goals of your last task, and write down 2 questions to ask your manager on how you can best support the new priorities.",
                suggestedReply: `Hi [Name],

Yes, absolutely. I am available this afternoon between [e.g., 2:00 PM – 2:30 PM] and after [e.g., 4:15 PM]. 

I have my notes and recent deliverables open and ready to reference. Looking forward to connecting and making sure we are aligned on next steps!

Best,
[Your Name]`
            }
        },
        {
            id: "circle-back-brief",
            title: "Let's Circle Back (Pushback on Draft)",
            tag: "critical",
            sender: "colleague",
            tone: "Critical",
            snippet: "Thanks for sending over this draft. It seems a bit different from what we discussed...",
            text: "Thanks for sending over this draft. It seems a bit different from what we discussed during our sync. Let's circle back once you've had a chance to align with the core brief.",
            analysis: {
                detectedTone: "Constructive Pushback",
                urgency: "Medium (Review within 24 hours)",
                taskType: "Revision & Spec Alignment",
                framework: "Non-Defensive Comparison & Revision",
                meaning: `<p><strong>What it actually means:</strong> Your coworker or collaborator feels the output diverged from an agreed-upon plan. Rather than an insult, they are stepping in to help prevent misaligned work from reaching clients or senior stakeholders. They want to make sure everyone is executing against the same specification.</p>
                          <p><strong>De-panic perspective:</strong> First drafts exist to be revised. Having a draft redirected is proof you are collaborating, not proof you aren't qualified.</p>`,
                expectations: [
                    "A side-by-side comparison between your draft and the project brief or meeting notes.",
                    "A non-defensive acknowledgment thanking them for catching the divergence.",
                    "A brief summary of where you will adjust the direction."
                ],
                actionPlan: [
                    "Locate the original meeting notes or project specification brief.",
                    "Note the 1 or 2 specific sections where your draft departed from the original scope.",
                    "Reply confirming you see the difference, outlining your planned revision, and giving a delivery ETA."
                ],
                starterTask: "Set a timer for 15 minutes. Open your draft on the left half of your screen and the original project brief on the right. Note down the top 2 discrepancies in bullet points.",
                suggestedReply: `Hi [Name],

Thanks for the candid feedback and for catching this!

I re-read the core brief alongside the draft, and I see where the direction diverged—especially around [mention specific element, e.g., the target audience section].

I am revising [Section A and Section B] to closely match the brief's guidelines and will share an updated version by [e.g., tomorrow at 1:00 PM].

Please let me know if there are any other specific nuances you'd like me to keep in mind!

Best,
[Your Name]`
            }
        },
        {
            id: "please-advise-client",
            title: "Please Advise on Next Steps (Client Uncertainty)",
            tag: "professional",
            sender: "client",
            tone: "Professional",
            snippet: "We reviewed the proposal. It's not clear who owns QA sign-off or turnaround...",
            text: "We reviewed the proposal. It's not clear who owns the QA sign-off or what the turnaround timeline is. Please advise on next steps.",
            analysis: {
                detectedTone: "Professional & Clarification-Seeking",
                urgency: "Medium-High (Clear Roadmap Needed)",
                taskType: "Process Clarification",
                framework: "Structured Guidance & Clear Ownership",
                meaning: `<p><strong>What it actually means:</strong> <em>'Please advise'</em> sounds formal and stiff, but it simply means: <em>'We want to move forward, but we are confused about responsibilities and timeline, and we need you to guide us.'</em> They are looking for clear guidance and structure, not arguing with you.</p>
                          <p><strong>De-panic perspective:</strong> This is a great opportunity to demonstrate professional leadership by providing a clear, numbered process.</p>`,
                expectations: [
                    "A definitive, unambiguous statement of who owns QA sign-off.",
                    "A clear milestone timeline with realistic turnaround estimates.",
                    "A single, low-friction call to action to initiate the next phase."
                ],
                actionPlan: [
                    "Verify internal ownership for QA sign-off (ask your manager or lead if unsure).",
                    "Outline a simple 3-step sequence: Review -> QA Sign-off -> Final Launch.",
                    "Send a crisp, structured response outlining the workflow and asking for their approval to proceed."
                ],
                starterTask: "Set a timer for 15 minutes. Write a draft 3-bullet process clarifying (1) QA Owner, (2) Turnaround Days, and (3) Approval trigger. Review it with a peer or lead before sending.",
                suggestedReply: `Hi [Name],

Thank you for reviewing the proposal and for highlighting this!

To provide complete clarity on the process:

1. QA Sign-Off Ownership: [e.g., Our engineering team completes internal QA, with final sign-off approval provided by your lead, Name].
2. Turnaround Timeline: [e.g., Standard turnaround is 3 business days following submission of deliverables].
3. Immediate Next Step: [e.g., If this timeline works for you, please reply with your approval and we will kick off Phase 1 on Tuesday morning].

Please let me know if you would like any adjustments to this cadence!

Best regards,
[Your Name]`
            }
        }
    ];

    // Imposter Shield DOM References
    const shieldExamplesGrid = document.getElementById("shield-examples-grid");
    const shieldInputText = document.getElementById("shield-input-text");
    const shieldCharCount = document.getElementById("shield-char-count");
    const shieldToneSelect = document.getElementById("shield-tone-select");
    const shieldSenderRole = document.getElementById("shield-sender-role");
    const shieldAnalyzeBtn = document.getElementById("shield-analyze-btn");
    const shieldClearBtn = document.getElementById("shield-clear-btn");
    const shieldValidationAlert = document.getElementById("shield-validation-alert");
    const shieldValidationText = document.getElementById("shield-validation-text");
    const shieldResultsContainer = document.getElementById("shield-results-container");
    const shieldSummaryStrip = document.getElementById("shield-summary-strip");
    const shieldResultMeaning = document.getElementById("shield-result-meaning");
    const shieldResultExpectations = document.getElementById("shield-result-expectations");
    const shieldResultActionPlan = document.getElementById("shield-result-action-plan");
    const shieldResultStarterTask = document.getElementById("shield-result-starter-task");
    const shieldSuggestedReply = document.getElementById("shield-suggested-reply");
    const shieldCopyReplyBtn = document.getElementById("shield-copy-reply-btn");
    const copyBtnText = document.getElementById("copy-btn-text");
    const shieldResetScrollBtn = document.getElementById("shield-reset-scroll-btn");

    /**
     * Initializes the Imposter Shield interactive elements
     */
    function initImposterShield() {
        if (!shieldExamplesGrid) return;

        // 1. Render the 6 Predefined Example Chips
        shieldExamplesGrid.innerHTML = "";
        IMPOSTER_SHIELD_EXAMPLES.forEach((example) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "example-chip";
            chip.setAttribute("data-example-id", example.id);
            chip.innerHTML = `
                <div class="chip-top">
                    <span class="chip-title">${example.title}</span>
                    <span class="chip-tag tag-${example.tag}">${example.tag}</span>
                </div>
                <span class="chip-snippet">${example.snippet}</span>
            `;

            chip.addEventListener("click", () => {
                loadExampleMessage(example);
            });

            shieldExamplesGrid.appendChild(chip);
        });

        // 2. Character counter & live typing cleanup
        if (shieldInputText) {
            shieldInputText.addEventListener("input", () => {
                updateCharCount();
                clearValidationAlert();
            });
        }

        // 3. Analyze button listener
        if (shieldAnalyzeBtn) {
            shieldAnalyzeBtn.addEventListener("click", () => {
                handleShieldAnalysis();
            });
        }

        // 4. Clear button listener
        if (shieldClearBtn) {
            shieldClearBtn.addEventListener("click", () => {
                clearShieldForm();
            });
        }

        // 5. Copy Suggested Reply button
        if (shieldCopyReplyBtn && shieldSuggestedReply) {
            shieldCopyReplyBtn.addEventListener("click", () => {
                copySuggestedReply();
            });
        }

        // 6. Reset / Scroll up button
        if (shieldResetScrollBtn) {
            shieldResetScrollBtn.addEventListener("click", () => {
                shieldInputText.focus();
                shieldInputText.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }

        console.log("Career Compass: Imposter Shield initialized with 6 scenarios.");
    }

    /**
     * Updates character counter display
     */
    function updateCharCount() {
        if (!shieldInputText || !shieldCharCount) return;
        const currentLength = shieldInputText.value.length;
        shieldCharCount.textContent = `${currentLength.toLocaleString()} / 2,500 characters`;
    }

    /**
     * Loads a predefined example into the form and runs analysis
     */
    function loadExampleMessage(example) {
        if (!shieldInputText) return;

        // Update form values
        shieldInputText.value = example.text;
        if (shieldToneSelect) shieldToneSelect.value = example.tone;
        if (shieldSenderRole) shieldSenderRole.value = example.sender;

        updateCharCount();
        clearValidationAlert();

        // Highlight active chip
        document.querySelectorAll(".example-chip").forEach((btn) => {
            btn.classList.toggle("active-chip", btn.getAttribute("data-example-id") === example.id);
        });

        // Run analysis on the example
        renderShieldResults(example.analysis);
    }

    /**
     * Clears validation alert
     */
    function clearValidationAlert() {
        if (shieldValidationAlert) shieldValidationAlert.style.display = "none";
        if (shieldInputText) shieldInputText.classList.remove("has-error");
    }

    /**
     * Shows accessible validation error
     */
    function showValidationError(message) {
        if (!shieldValidationAlert || !shieldValidationText) return;
        shieldValidationText.textContent = message;
        shieldValidationAlert.style.display = "flex";
        if (shieldInputText) {
            shieldInputText.classList.add("has-error");
            shieldInputText.focus();
        }
    }

    /**
     * Clears all inputs and resets state
     */
    function clearShieldForm() {
        if (shieldInputText) shieldInputText.value = "";
        if (shieldToneSelect) shieldToneSelect.value = "auto";
        if (shieldSenderRole) shieldSenderRole.value = "colleague";
        updateCharCount();
        clearValidationAlert();

        // Remove active state from chips
        document.querySelectorAll(".example-chip").forEach((btn) => {
            btn.classList.remove("active-chip");
        });

        // Hide results
        if (shieldResultsContainer) {
            shieldResultsContainer.style.display = "none";
        }

        if (shieldInputText) shieldInputText.focus();
    }

    /**
     * Analyzes current form contents
     */
    function handleShieldAnalysis() {
        if (!shieldInputText) return;
        const rawText = shieldInputText.value.trim();

        // 1. Validation: check for empty input
        if (!rawText) {
            showValidationError("Please paste a workplace message or select one of the 6 examples above to explain.");
            return;
        }

        clearValidationAlert();

        const userTone = shieldToneSelect ? shieldToneSelect.value : "auto";
        const userSender = shieldSenderRole ? shieldSenderRole.value : "colleague";

        // 2. Check if the text matches one of our predefined examples
        // If the user kept the default tone & sender of the example, use the handcrafted rich breakdown.
        const matchedExample = IMPOSTER_SHIELD_EXAMPLES.find(
            (item) => item.text.trim().toLowerCase() === rawText.toLowerCase()
        );

        if (matchedExample && (userTone === "auto" || userTone === matchedExample.tone) && (userSender === matchedExample.sender)) {
            renderShieldResults(matchedExample.analysis);
            return;
        }

        // 3. If custom text or if the user explicitly customized tone/sender on an example,
        // evaluate dynamically with the rule-based heuristic engine
        const dynamicAnalysis = evaluateCustomMessage(rawText, userTone, userSender);
        renderShieldResults(dynamicAnalysis);
    }

    /**
     * Rule-Based Heuristic Evaluation Engine for custom user messages.
     * Evaluates vocabulary, structural indicators, and tone without external AI.
     */
    function evaluateCustomMessage(text, selectedTone, senderRole) {
        const lower = text.toLowerCase();

        // Pattern matching groups
        const hasUrgency = /asap|urgent|eod|end of day|cob|immediately|right away|by today|before you log off|deadline|critical|time-sensitive/.test(lower);
        const hasPreviousEmail = /per my (previous|last) email|as (mentioned|stated) earlier|re-attaching|as discussed/.test(lower);
        const hasVagueRequest = /thoughts\??|thoughts on|what do you think|where you stand|take a look|let me know your take/.test(lower);
        const hasScopeCreep = /quick favor|shouldn't take (long|more)|few minutes|quickly update|small tweak/.test(lower);
        const hasPushback = /different from|circle back|realign|re-do|discrepancy|not aligned|touch base on your/.test(lower);
        const hasAdvise = /please advise|advise on|clarify|confirm who owns|how should we proceed/.test(lower);
        const hasQuestion = /\?/.test(lower);

        // Resolve tone: If user explicitly picked a tone, respect their selection; otherwise auto-detect
        let effectiveTone = selectedTone;
        if (selectedTone === "auto") {
            if (hasUrgency || hasPreviousEmail) effectiveTone = "Urgent";
            else if (hasPushback) effectiveTone = "Critical";
            else if (hasVagueRequest || text.length < 80) effectiveTone = "Vague";
            else effectiveTone = "Professional";
        }

        // Resolve sender framing
        const senderLabels = {
            manager: "Manager / Team Lead",
            colleague: "Colleague / Peer",
            client: "Client / External Stakeholder",
            executive: "Senior Executive / Director"
        };
        const senderLabel = senderLabels[senderRole] || "Colleague";

        // Generate tailored heuristic sections based on effective tone
        let meaningHtml = "";
        let expectationsList = [];
        let actionPlanList = [];
        let starterTaskText = "";
        let replyTemplate = "";
        let urgencyLabel = "Medium (Standard Turnaround)";
        let taskCategory = "Workplace Clarification";

        if (effectiveTone === "Urgent" || (effectiveTone === "auto" && hasUrgency)) {
            urgencyLabel = "High (Respond or acknowledge promptly)";
            taskCategory = "Urgent Deliverable or Boundary";
            meaningHtml = `<p><strong>What it appears to mean:</strong> The sender is operating under tight deadline pressure and is trying to secure deliverables quickly. Messages labeled 'urgent' frequently reflect their own scheduled meetings or commitments to higher-ups, rather than a failure on your part.</p>
                           <p><strong>De-panic perspective:</strong> You don't have to panic or immediately drop everything in chaos. An immediate acknowledgment with a realistic ETA is 10x more professional than frantic silence.</p>`;
            expectationsList = [
                "A swift acknowledgment confirming you have seen the message.",
                "A clear deliverable or a realistic time estimate of when it will be ready.",
                "Prompt escalation if you are blocked by missing access or dependencies."
            ];
            actionPlanList = [
                "Determine the true status of the item: Is it completed, in-progress, or not started?",
                "If it can be done within 30 minutes, complete and send it.",
                "If it requires several hours or exceeds your available bandwidth today, send a calm timeline boundary offering a realistic delivery schedule."
            ];
            starterTaskText = "Set a 15-minute timer. Open the requested file or task right now, assess exactly what remains to be completed, and send an immediate 2-line acknowledgment with your delivery ETA.";
            replyTemplate = `Hi [Name],

Received! I am looking into this right now.

[If you can finish today: "I am finalizing the deliverable and will have it over to you by [e.g., 3:00 PM] today."]
[If you need more time: "Completing this thoroughly will take approximately [e.g., 2 hours]. Since I am currently wrapping up [Task X], I can have this to you by [e.g., tomorrow at 11:00 AM]. Please let me know if that works for your schedule."]

Best,
[Your Name]`;
        } else if (effectiveTone === "Vague" || (effectiveTone === "auto" && hasVagueRequest)) {
            urgencyLabel = "Medium (Respond within 24 hours)";
            taskCategory = "Synthesis & Opinion";
            meaningHtml = `<p><strong>What it appears to mean:</strong> The sender wants a high-level executive summary or your perspective without having to read through dense details themselves. Vague messages like 'Thoughts?' or 'Take a look' mean they value your synthesis, not that they expect you to guess a hidden secret answer.</p>
                           <p><strong>De-panic perspective:</strong> Short questions reflect the sender's busy day. Keep your answer crisp and structured.</p>`;
            expectationsList = [
                "A concise summary of 2 to 3 main points or takeaways.",
                "A recommended next step or decision from your perspective.",
                "Clean bullet points rather than long paragraphs."
            ];
            actionPlanList = [
                "Skim the referenced material focusing on summary sections or conclusions.",
                "Identify: 1 positive finding, 1 concern or risk, and 1 suggested next action.",
                "Send back a 3-bullet response with an offer to discuss briefly if needed."
            ];
            starterTaskText = "Set a 15-minute timer. Skim the document and write down 3 bullet points: (1) Main observation, (2) Potential risk, and (3) Suggested next step.";
            replyTemplate = `Hi [Name],

I took a look through this. Three key takeaways from my side:

1. [Key Positive / Opportunity]: [e.g., The core proposal looks solid and addresses our main objective].
2. [Potential Risk / Question]: [e.g., Timeline seems tight for the QA phase].
3. [Recommendation]: [e.g., I suggest we proceed with Phase 1 while clarifying QA ownership].

Let me know if you would like me to draft a quick plan around this!

Best,
[Your Name]`;
        } else if (effectiveTone === "Critical" || (effectiveTone === "auto" && hasPushback)) {
            urgencyLabel = "Medium-High (Address constructively today)";
            taskCategory = "Alignment & Revision";
            meaningHtml = `<p><strong>What it appears to mean:</strong> The sender feels the current output or direction differs from their expectations or project goals. Rather than viewing this as failure, recognize that constructive realignment is a standard part of early-career pairing.</p>
                           <p><strong>De-panic perspective:</strong> Criticism of a document or output is not a criticism of your intelligence or potential. Focus entirely on the work, not on defending your ego.</p>`;
            expectationsList = [
                "A receptive, non-defensive response acknowledging their observations.",
                "A review of original requirements or notes to identify gaps.",
                "A proposed correction or a short alignment touchpoint."
            ];
            actionPlanList = [
                "Re-read the original project requirements or meeting notes alongside the current draft.",
                "List the specific items that need adjustment.",
                "Reply with a calm, structured note outlining what you will update and when you will share the revised version."
            ];
            starterTaskText = "Set a 15-minute timer. Compare your draft to the project notes. Write down 2 concrete updates you can make to resolve their concerns.";
            replyTemplate = `Hi [Name],

Thank you for this feedback! 

I reviewed your notes against the current version. I see where we can better align, particularly around [mention specific section or topic].

I will incorporate these adjustments and share an updated draft by [e.g., tomorrow at 12:00 PM]. Please let me know if there are any other specific points you'd like me to prioritize!

Best regards,
[Your Name]`;
        } else {
            // Professional & Standard Cadence
            urgencyLabel = "Normal (Respond within standard business hours)";
            taskCategory = "Operational Coordination";
            meaningHtml = `<p><strong>What it appears to mean:</strong> This is a standard workplace coordination message. The sender is requesting information, confirmation, or next steps to keep a project moving along smoothly.</p>
                           <p><strong>De-panic perspective:</strong> No aggressive or high-anxiety idioms were detected. Respond in your standard, polite professional cadence.</p>`;
            expectationsList = [
                "A clear answer to any direct questions asked in the message.",
                "Confirmation of next steps or ownership.",
                "An open invitation to clarify anything ambiguous."
            ];
            actionPlanList = [
                "Review the message and note any specific questions or deliverables.",
                "Gather the necessary facts or status.",
                "Draft and send a concise reply confirming next steps."
            ];
            starterTaskText = "Set a 15-minute timer. Draft a concise 3-sentence reply answering their main point and confirm what happens next.";
            replyTemplate = `Hi [Name],

Thanks for reaching out!

Regarding your message: [Provide direct answer or status update here].

Next steps on my side: [State your immediate deliverable and date/time].

Please let me know if you need any additional details!

Best regards,
        }

        return {
            detectedTone: effectiveTone,
            urgency: urgencyLabel,
            taskType: taskCategory,
            framework: `Pattern Match (${senderLabel} Context)`,
            meaning: meaningHtml,
            expectations: expectationsList,
            actionPlan: actionPlanList,
            starterTask: starterTaskText,
            suggestedReply: replyTemplate
        };
    }

    /**
     * Renders analysis results into the 5 structured UI sections
     */
    function renderShieldResults(analysis) {
        if (!shieldResultsContainer) return;

        // 1. Populate summary metrics strip
        if (shieldSummaryStrip) {
            shieldSummaryStrip.innerHTML = `
                <div class="summary-metric">
                    <span class="metric-label">Detected Tone</span>
                    <span class="metric-value">${analysis.detectedTone}</span>
                </div>
                <div class="summary-metric">
                    <span class="metric-label">Urgency Level</span>
                    <span class="metric-value">${analysis.urgency}</span>
                </div>
                <div class="summary-metric">
                    <span class="metric-label">Task Category</span>
                    <span class="metric-value">${analysis.taskType}</span>
                </div>
                <div class="summary-metric">
                    <span class="metric-label">Analysis Framework</span>
                    <span class="metric-value">${analysis.framework}</span>
                </div>
            `;
        }

        // 2. Section 1: Plain-English Meaning
        if (shieldResultMeaning) {
            shieldResultMeaning.innerHTML = analysis.meaning;
        }

        // 3. Section 2: What They Expect
        if (shieldResultExpectations) {
            let expHtml = "<ul>";
            analysis.expectations.forEach((item) => {
                expHtml += `<li>${item}</li>`;
            });
            expHtml += "</ul>";
            shieldResultExpectations.innerHTML = expHtml;
        }

        // 4. Section 3: Action Plan
        if (shieldResultActionPlan) {
            let actHtml = "<ol>";
            analysis.actionPlan.forEach((step) => {
                actHtml += `<li>${step}</li>`;
            });
            actHtml += "</ol>";
            shieldResultActionPlan.innerHTML = actHtml;
        }

        // 5. Section 4: 15-Minute Starter Task
        if (shieldResultStarterTask) {
            shieldResultStarterTask.innerHTML = `
                <p>To break imposter anxiety, do not attempt to solve everything right now. Focus only on this single 15-minute quick-start:</p>
                <div class="starter-task-highlight">
                    <span class="task-icon" aria-hidden="true">⏱️</span>
                    <div>
                        <strong>Your 15-Minute Micro-Task:</strong>
                        <p style="margin-top: 0.25rem; font-weight: normal;">${analysis.starterTask}</p>
                    </div>
                </div>
            `;
        }

        // 6. Section 5: Suggested Reply
        if (shieldSuggestedReply) {
            shieldSuggestedReply.value = analysis.suggestedReply;
        }

        // Show the results container
        shieldResultsContainer.style.display = "block";

        // Scroll results into view smoothly
        shieldResultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    /**
     * Copies suggested reply to clipboard with visual feedback
     */
    function copySuggestedReply() {
        if (!shieldSuggestedReply) return;
        const textToCopy = shieldSuggestedReply.value;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                triggerCopySuccess();
            }).catch(() => {
                fallbackCopy(textToCopy);
            });
        } else {
            fallbackCopy(textToCopy);
        }
    }

    function fallbackCopy(text) {
        shieldSuggestedReply.select();
        document.execCommand("copy");
        triggerCopySuccess();
    }

    function triggerCopySuccess() {
        if (!shieldCopyReplyBtn || !copyBtnText) return;
        const originalText = copyBtnText.textContent;
        shieldCopyReplyBtn.classList.add("copied");
        copyBtnText.textContent = "✓ Copied!";

        setTimeout(() => {
            shieldCopyReplyBtn.classList.remove("copied");
            copyBtnText.textContent = originalText;
        }, 2000);
    }

    // Initialize Imposter Shield on DOM load
    initImposterShield();
});
