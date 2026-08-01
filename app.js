/* -------------------------------------------------------------
   ADMIZ Lead Gen Chatbot - Conversation Engine & Dashboard (app.js)
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // State Variables
    // -------------------------------------------------------------
    const state = {
        answers: {},
        currentStep: 'intro',
        readinessScore: 15,
        targetScore: 15,
        estimatedLeads: '--',
        strategy: 'Analyzing...',
        insights: 'Complete the questionnaire on the right to receive tailored Meta Ads strategy recommendations for your niche.',
        budgetSplit: { test: 40, scale: 40, retarget: 20 }
    };

    // -------------------------------------------------------------
    // DOM Element Cache
    // -------------------------------------------------------------
    const messagesContainer = document.getElementById('chat-messages');
    const controlsContainer = document.getElementById('chat-controls-area');
    const scoreElement = document.getElementById('readiness-score');
    const leadsElement = document.getElementById('metric-leads');
    const strategyElement = document.getElementById('metric-strategy');
    const insightTextElement = document.getElementById('insight-text');
    const fillTesting = document.getElementById('fill-testing');
    const fillScaling = document.getElementById('fill-scaling');
    const fillRetargeting = document.getElementById('fill-retargeting');
    const pctTest = document.getElementById('pct-test');
    const pctScale = document.getElementById('pct-scale');
    const pctRetarget = document.getElementById('pct-retarget');
    const progressCircle = document.querySelector('.progress-ring__circle');

    // Circle Circumference setup
    const circleRadius = 50;
    const circumference = 2 * Math.PI * circleRadius;
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }

    // Premium UI Elements
    const cardLeads = document.getElementById('card-leads');
    const cardStrategy = document.getElementById('card-strategy');
    const cardBudget = document.getElementById('card-budget');
    const progressBar = document.getElementById('chat-progress-bar');
    
    const stepOrder = [
        'intro',
        'decision_maker',
        'running_ads',
        'ad_budget',
        'campaign_goal',
        'main_problem',
        'timeline',
        'service_comfort',
        'specific_issue_text',
        'contact_form',
        'success'
    ];

    function updateProgressBar() {
        if (!progressBar) return;
        const index = stepOrder.indexOf(state.currentStep);
        if (index !== -1) {
            const pct = Math.round((index / (stepOrder.length - 1)) * 100);
            progressBar.style.width = `${pct}%`;
        }
    }

    function initChat() {
        state.currentStep = 'intro';
        updateProgressBar();
        renderBotMessage(chatFlow.intro.botMessage());
        renderInputControls(chatFlow.intro);
        updateScoreGauge();
    }

    // -------------------------------------------------------------
    // Conversation Database
    // -------------------------------------------------------------
    const chatFlow = {
        intro: {
            botMessage: () => `Namaste! Welcome to **ADMIZ Agency** marketing planner. 🚀<br><br>I'm your AI strategist. Let's design a high-performing Meta Ads campaign structure for your business. First, tell me: **What type of business do you run?**`,
            inputType: 'options',
            options: [
                { label: '🛒 E-commerce', value: 'E-commerce' },
                { label: '📍 Local Business', value: 'Local Business' },
                { label: '⚙️ Service Business', value: 'Service Business' },
                { label: '🏢 Real Estate', value: 'Real Estate' },
                { label: '🎓 Education', value: 'Education' },
                { label: '✨ Other', value: 'Other' }
            ],
            process: (value) => {
                state.answers.businessType = value;
                // Base insights update
                state.insights = `Niche selected: **${value}**. Understanding your business dynamics... Let's analyze your advertising setup next.`;
                state.targetScore += 10;
                return 'decision_maker';
            }
        },
        decision_maker: {
            botMessage: () => `Got it, **${state.answers.businessType}**! To ensure we tailor this session for optimal results: **Are you the business owner or the main decision maker?**`,
            inputType: 'options',
            options: [
                { label: 'Yes, Owner / Director', value: 'Yes' },
                { label: 'Part of decision team', value: 'Part' },
                { label: 'No, looking for team', value: 'No' }
            ],
            process: (value) => {
                state.answers.decisionMaker = value;
                if (value === 'Yes') state.targetScore += 15;
                else if (value === 'Part') state.targetScore += 10;
                else state.targetScore += 5;
                return 'running_ads';
            }
        },
        running_ads: {
            botMessage: () => `Perfect. Next, **are you currently running Meta Ads (Facebook & Instagram Ads)?**`,
            inputType: 'options',
            options: [
                { label: '🔥 Yes, active now', value: 'Yes' },
                { label: '⌛ Previously ran ads', value: 'Previously' },
                { label: '❌ Never ran ads', value: 'Never' }
            ],
            process: (value) => {
                state.answers.runningAds = value;
                if (value === 'Yes') state.targetScore += 15;
                else if (value === 'Previously') state.targetScore += 10;
                else state.targetScore += 5;
                return 'ad_budget';
            }
        },
        ad_budget: {
            botMessage: () => `Important question: **What is your planned monthly ad budget for Facebook/Instagram?**`,
            inputType: 'options',
            options: [
                { label: 'Under ₹30K', value: 'Below ₹30K' },
                { label: '₹30K – ₹75K', value: '₹30K–₹75K' },
                { label: '₹75K – ₹2L', value: '₹75K–₹2L' },
                { label: '₹2L+ / Month', value: '₹2L+' }
            ],
            process: (value) => {
                state.answers.budget = value;
                if (value === 'Below ₹30K') state.targetScore += 5;
                else if (value === '₹30K–₹75K') state.targetScore += 15;
                else if (value === '₹75K–₹2L') state.targetScore += 25;
                else state.targetScore += 35;
                return 'campaign_goal';
            }
        },
        campaign_goal: {
            botMessage: () => `Awesome. Now, **what is the primary conversion goal you want to achieve from Meta Ads?**`,
            inputType: 'options',
            options: [
                { label: '📊 Qualified Leads', value: 'Qualified Leads' },
                { label: '💰 E-comm Sales / ROAS', value: 'Sales' },
                { label: '📅 Booking/Appointments', value: 'Bookings' },
                { label: '💬 WhatsApp Enquiries', value: 'WhatsApp Enquiries' },
                { label: '🔍 Brand / Other', value: 'Other' }
            ],
            process: (value) => {
                state.answers.goal = value;
                state.targetScore += 10;
                return 'main_problem';
            }
        },
        main_problem: {
            botMessage: () => `Understood. Growth requires solving bottlenecks. **What is your single biggest problem with advertising right now?**`,
            inputType: 'options',
            options: [
                { label: '⚠️ Poor Lead Quality', value: 'Poor lead quality' },
                { label: '💸 High CPL (Cost per Lead)', value: 'High CPL' },
                { label: '📉 Low Sales / Conversions', value: 'Low sales' },
                { label: '🔧 Pixels & Tracking Issues', value: 'Tracking issues' },
                { label: '📈 Don\'t know how to scale', value: 'Don\'t know how to scale' }
            ],
            process: (value) => {
                state.answers.biggestProblem = value;
                state.targetScore += 5;
                return 'timeline';
            }
        },
        timeline: {
            botMessage: () => `We completely understand, those are very common bottlenecks. Next: **How soon do you want to launch or optimize your campaigns?**`,
            inputType: 'options',
            options: [
                { label: '🚀 Immediately (1-2 days)', value: 'Immediately' },
                { label: '📅 Within 7 days', value: 'Within 7 days' },
                { label: '🗓️ Sometime this month', value: 'This month' },
                { label: '🔍 Just exploring options', value: 'Just exploring' }
            ],
            process: (value) => {
                state.answers.timeline = value;
                if (value === 'Immediately') state.targetScore += 15;
                else if (value === 'Within 7 days') state.targetScore += 10;
                else if (value === 'This month') state.targetScore += 5;
                else state.targetScore += 2;
                return 'service_comfort';
            }
        },
        service_comfort: {
            botMessage: () => `Good to know! Just so we are fully aligned before booking the strategy audit:<br><br>Our professional Meta Ads management retainer starts at **₹9,999/month** (excluding separate Facebook ad spend). **Are you comfortable with this budget structure?**`,
            inputType: 'options',
            options: [
                { label: '✅ Yes, comfortable', value: 'Yes, I\'m ready' },
                { label: '💬 Need to discuss details', value: 'Need to discuss' },
                { label: '❌ No, looking for cheaper', value: 'No' }
            ],
            process: (value) => {
                state.answers.serviceComfort = value;
                if (value === "Yes, I'm ready") state.targetScore += 15;
                else if (value === 'Need to discuss') state.targetScore += 8;
                else state.targetScore += 0;
                return 'specific_issue_text';
            }
        },
        specific_issue_text: {
            botMessage: () => `Perfect. Almost done!<br><br>Please **describe the main challenges you are facing in your campaigns** (or type 'none' if starting fresh):`,
            inputType: 'text',
            placeholder: 'Type your main challenges here...',
            process: (value) => {
                state.answers.specificIssues = value || 'None specified';
                // This updates dashboard calculation
                updateDashboardOutputs();
                return 'contact_form';
            }
        },
        contact_form: {
            botMessage: () => `Perfect! We have mapped out your strategy details.<br><br>Please enter your Name and WhatsApp number below to get your custom report on WhatsApp:`,
            inputType: 'leadForm',
            process: (formData) => {
                state.answers.fullName = formData.name;
                state.answers.phone = formData.phone;
                
                // Save lead details
                saveLead(state.answers);
                return 'success';
            }
        }
    };

    // -------------------------------------------------------------
    // Core Conversational Controller
    // -------------------------------------------------------------
    function initChat() {
        renderBotMessage(chatFlow.intro.botMessage());
        renderInputControls(chatFlow.intro);
        updateScoreGauge();
    }

    function renderBotMessage(htmlContent) {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message bot';
            
            const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            messageDiv.innerHTML = `
                <div class="message-bubble">${htmlContent}</div>
                <div class="message-time">${timeString}</div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            scrollToBottom();
        }, 1100);
    }

    function renderUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-bubble">${text}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function renderInputControls(step) {
        controlsContainer.innerHTML = ''; // Clear previous controls
        
        if (step.inputType === 'options') {
            const wrapper = document.createElement('div');
            wrapper.className = 'options-container';
            
            step.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.style.animationDelay = `${idx * 0.06}s`;
                btn.innerHTML = opt.label;
                btn.addEventListener('click', () => handleOptionSelection(opt.label, opt.value, step));
                wrapper.appendChild(btn);
            });
            controlsContainer.appendChild(wrapper);
        } 
        
        else if (step.inputType === 'text') {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-container';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'text-input';
            input.placeholder = step.placeholder || 'Type here...';
            input.id = 'chat-text-input';
            
            const sendBtn = document.createElement('button');
            sendBtn.className = 'send-btn';
            sendBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            `;
            
            const handleTextSubmit = () => {
                const textValue = input.value.trim();
                if (textValue) {
                    renderUserMessage(textValue);
                    const nextStepKey = step.process(textValue);
                    transitionToNextStep(nextStepKey);
                }
            };

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleTextSubmit();
            });
            sendBtn.addEventListener('click', handleTextSubmit);
            
            wrapper.appendChild(input);
            wrapper.appendChild(sendBtn);
            controlsContainer.appendChild(wrapper);
            input.focus();
        } 
        
        else if (step.inputType === 'calendar') {
            renderCalendarPicker();
        } 
        
        else if (step.inputType === 'leadForm') {
            renderLeadCaptureForm();
        }
    }

    function handleOptionSelection(label, value, step) {
        renderUserMessage(label);
        const nextStepKey = step.process(value);
        
        // Dynamically update dashboard updates on intermediate steps to keep UI alive
        updateDashboardMidway();
        
        transitionToNextStep(nextStepKey);
    }

    function transitionToNextStep(nextStepKey) {
        state.currentStep = nextStepKey;
        const nextStep = chatFlow[nextStepKey];
        
        updateProgressBar();

        if (nextStepKey === 'success') {
            renderSuccessState();
            return;
        }

        renderBotMessage(nextStep.botMessage());
        
        // Render inputs slightly after chatbot triggers typing indicator
        setTimeout(() => {
            renderInputControls(nextStep);
        }, 1100);
        
        updateScoreGauge();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'bot-typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const ind = document.getElementById('bot-typing-indicator');
        if (ind) ind.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // -------------------------------------------------------------
    // Live Dashboard Calculations
    // -------------------------------------------------------------
    function updateScoreGauge() {
        // Cap the score at 100
        const maxScore = Math.min(state.targetScore, 100);
        
        // Smooth score counter animation
        let current = state.readinessScore;
        const stepTime = Math.abs(Math.floor(400 / (maxScore - current || 1)));
        
        const timer = setInterval(() => {
            if (current < maxScore) {
                current++;
                scoreElement.textContent = current;
                setGaugePercent(current);
            } else if (current > maxScore) {
                current--;
                scoreElement.textContent = current;
                setGaugePercent(current);
            } else {
                clearInterval(timer);
            }
        }, Math.max(stepTime, 8));
        
        state.readinessScore = maxScore;
    }

    function setGaugePercent(percent) {
        if (!progressCircle) return;
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    function pulseCard(cardEl) {
        if (!cardEl) return;
        cardEl.classList.remove('pulse-glow-highlight');
        // trigger reflow
        void cardEl.offsetWidth;
        cardEl.classList.add('pulse-glow-highlight');
    }

    // Dashboard calculations based on collected inputs
    function updateDashboardMidway() {
        const ans = state.answers;
        
        // Budget splits and estimated clicks/leads starts calculating early
        if (ans.budget) {
            let lowLeads = 0, highLeads = 0;
            let business = ans.businessType || 'E-commerce';
            
            if (ans.budget === 'Below ₹30K') {
                lowLeads = 15; highLeads = 40;
                state.budgetSplit = { test: 50, scale: 35, retarget: 15 };
                state.strategy = 'Core Local Traffic Funnel';
            } else if (ans.budget === '₹30K–₹75K') {
                lowLeads = 50; highLeads = 120;
                state.budgetSplit = { test: 35, scale: 45, retarget: 20 };
                state.strategy = 'Advanced Audience Funnel';
            } else if (ans.budget === '₹75K–₹2L') {
                lowLeads = 150; highLeads = 400;
                state.budgetSplit = { test: 25, scale: 55, retarget: 20 };
                state.strategy = 'Omnipresent Funnel Scaling';
            } else if (ans.budget === '₹2L+') {
                lowLeads = 500; highLeads = 1200;
                state.budgetSplit = { test: 15, scale: 65, retarget: 20 };
                state.strategy = 'Omnichannel Hyper-Scale';
            }

            // Tweak metrics based on business style
            if (business === 'E-commerce') {
                leadsElement.innerHTML = `~${Math.round(lowLeads * 0.8)}-${Math.round(highLeads * 0.8)} <span style="font-size:0.75rem; color:var(--text-muted)">Sales</span>`;
            } else {
                leadsElement.innerHTML = `${lowLeads}-${highLeads} Leads`;
            }
            
            strategyElement.textContent = state.strategy;
            updateBudgetBars();

            // Trigger updates animations
            pulseCard(cardLeads);
            pulseCard(cardStrategy);
            pulseCard(cardBudget);
        }
    }

    function updateBudgetBars() {
        fillTesting.style.width = `${state.budgetSplit.test}%`;
        fillScaling.style.width = `${state.budgetSplit.scale}%`;
        fillRetargeting.style.width = `${state.budgetSplit.retarget}%`;
        
        pctTest.textContent = `${state.budgetSplit.test}%`;
        pctScale.textContent = `${state.budgetSplit.scale}%`;
        pctRetarget.textContent = `${state.budgetSplit.retarget}%`;
    }

    function updateDashboardOutputs() {
        const ans = state.answers;
        const bizType = ans.businessType || 'Service';
        const problem = ans.biggestProblem || 'Poor CPL';
        const goal = ans.goal || 'Leads';
        
        let leadUnit = bizType === 'E-commerce' ? 'Sales / Orders' : 'Qualified Leads';
        
        // 1. Live Leads calculation final review
        updateDashboardMidway();
        
        // 2. Adjust strategy text dynamically
        let selectedStrategy = 'CBO Scaling Matrix';
        if (goal === 'Sales') {
            selectedStrategy = 'Advantage+ Shopping & Catalog Stack';
        } else if (goal === 'Bookings') {
            selectedStrategy = 'Instant Form pre-qualify Funnel';
        } else if (goal === 'WhatsApp Enquiries') {
            selectedStrategy = 'Direct WhatsApp API Automation';
        }
        strategyElement.textContent = selectedStrategy;

        // 3. Formulate deep insight
        let insightMsg = '';
        if (bizType === 'E-commerce' && problem === 'High CPL') {
            insightMsg = `**E-comm Insight:** High Cost-Per-Acquisition detected. We suggest pivoting 30% budget to short-form video hooks targeting pain points, paired with Advantage+ shopping campaigns to reduce CPMs by 25%.`;
        } else if (problem === 'Poor lead quality') {
            insightMsg = `**Lead Quality Insight:** We recommend setting up custom multi-choice pre-qualification questions in Meta Native Forms, integrated with Zapier filtering. This filters junk submissions by 40% immediately.`;
        } else if (problem === 'Tracking issues') {
            insightMsg = `**Tracking Solution:** Since iOS14+, browser pixels are insufficient. We must set up **Meta Conversions API (CAPI)** server-side via Google Tag Manager. This recovers 20-30% missed attribution data.`;
        } else if (problem === 'Don\'t know how to scale') {
            insightMsg = `**Scaling Insight:** Scaling requires transitioning from ABO to CBO (Campaign Budget Optimization) using a 3-tier creative testing matrix. We will scale horizontal lookalike audiences (LAL) up to 10% ranges.`;
        } else {
            insightMsg = `**ADMIZ Specialist Tip:** For a **${bizType}** running ads for **${goal}**, allocating 25% of your ad spend directly to dynamic retargeting can double your CTR and capture high-intent buyers.`;
        }

        // Format custom markdown bold text for insights box
        insightTextElement.innerHTML = insightMsg.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Highlight Insights card
        const insightCard = document.getElementById('insights-container');
        if (insightCard) {
            insightCard.style.borderColor = 'var(--accent-copper)';
            insightCard.style.boxShadow = '0 0 15px var(--accent-copper-glow)';
            setTimeout(() => {
                insightCard.style.boxShadow = 'none';
            }, 1000);
        }
    }

    // -------------------------------------------------------------
    // Interactive Calendar Scheduler UI
    // -------------------------------------------------------------
    function renderCalendarPicker() {
        const calendarContainer = document.createElement('div');
        calendarContainer.className = 'calendar-picker';
        
        // Generate Next 7 days (excl. Sunday)
        const dateSlots = [];
        let tempDate = new Date();
        
        while (dateSlots.length < 5) {
            tempDate.setDate(tempDate.getDate() + 1); // Start from tomorrow
            if (tempDate.getDay() !== 0) { // Skip Sundays
                dateSlots.push(new Date(tempDate));
            }
        }

        // Generate Dates UI
        let datesHtml = '';
        dateSlots.forEach((d, idx) => {
            const dayNum = d.getDate();
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const monthName = d.toLocaleDateString('en-US', { month: 'short' });
            const dateStr = `${dayName}, ${dayNum} ${monthName}`;
            
            datesHtml += `
                <button class="option-btn calendar-day-btn" data-date="${dateStr}">
                    <span>${dayName}</span>
                    <strong>${dayNum} ${monthName}</strong>
                </button>
            `;
        });

        calendarContainer.innerHTML = `
            <div class="calendar-header">
                <span class="calendar-month">🗓️ Select meeting date:</span>
            </div>
            <div class="options-container" id="calendar-days-wrapper">
                ${datesHtml}
            </div>
            <div id="time-slots-container" style="display:none;">
                <div class="calendar-header" style="margin-top: 10px; margin-bottom: 8px;">
                    <span class="calendar-month">⏰ Select booking slot (IST):</span>
                </div>
                <div class="time-slots">
                    <button class="time-slot" data-time="11:30 AM">11:30 AM</button>
                    <button class="time-slot" data-time="3:00 PM">03:00 PM</button>
                    <button class="time-slot" data-time="5:30 PM">05:30 PM</button>
                    <button class="time-slot" data-time="7:00 PM">07:00 PM</button>
                </div>
            </div>
            <button class="option-btn" id="confirm-booking-btn" style="width:100%; justify-content:center; display:none; background:var(--accent-emerald); color:var(--text-dark); border:none;">
                Confirm Slot Details ➔
            </button>
        `;

        controlsContainer.appendChild(calendarContainer);

        let selectedDate = null;
        let selectedTime = null;

        // Day click handler
        const dayButtons = calendarContainer.querySelectorAll('.calendar-day-btn');
        const timeSlotsWrapper = calendarContainer.querySelector('#time-slots-container');
        const confirmBtn = calendarContainer.querySelector('#confirm-booking-btn');

        dayButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                dayButtons.forEach(b => b.style.borderColor = 'var(--border-color)');
                dayButtons.forEach(b => b.style.background = 'rgba(255, 255, 255, 0.04)');
                
                btn.style.borderColor = 'var(--accent-copper)';
                btn.style.background = 'var(--accent-copper-glow)';
                
                selectedDate = btn.getAttribute('data-date');
                timeSlotsWrapper.style.display = 'block';
                scrollToBottom();
            });
        });

        // Time slot click handler
        const timeButtons = calendarContainer.querySelectorAll('.time-slot');
        timeButtons.forEach(tBtn => {
            tBtn.addEventListener('click', () => {
                timeButtons.forEach(t => t.classList.remove('selected'));
                tBtn.classList.add('selected');
                
                selectedTime = tBtn.getAttribute('data-time');
                confirmBtn.style.display = 'flex';
                scrollToBottom();
            });
        });

        // Confirm Slot click handler
        confirmBtn.addEventListener('click', () => {
            if (selectedDate && selectedTime) {
                renderUserMessage(`Schedule meeting on ${selectedDate} at ${selectedTime}`);
                const nextStepKey = chatFlow.scheduler.process({ date: selectedDate, time: selectedTime });
                transitionToNextStep(nextStepKey);
            }
        });
    }

    // -------------------------------------------------------------
    // Lead Capture Form inside Chat Bubble Frame
    // -------------------------------------------------------------
    function renderLeadCaptureForm() {
        const formContainer = document.createElement('div');
        formContainer.className = 'lead-form-grid';
        
        formContainer.innerHTML = `
            <div class="lead-form-group">
                <label for="lead-name">Your Full Name</label>
                <input type="text" id="lead-name" class="text-input" placeholder="e.g. Rahul Sharma" required />
            </div>
            <div class="lead-form-group">
                <label for="lead-phone">WhatsApp Number</label>
                <input type="tel" id="lead-phone" class="text-input" placeholder="e.g. 9876543210" required />
                <span class="input-feedback" id="phone-error">Please enter a valid phone number.</span>
            </div>
            <button class="option-btn" id="submit-lead-btn" style="width:100%; justify-content:center; background:linear-gradient(135deg, var(--accent-copper) 0%, var(--accent-emerald) 100%); color:white; border:none; margin-top:8px;">
                Confirm Details &amp; Send on WhatsApp 💬
            </button>
        `;

        controlsContainer.appendChild(formContainer);

        const submitBtn = formContainer.querySelector('#submit-lead-btn');
        const nameInput = formContainer.querySelector('#lead-name');
        const phoneInput = formContainer.querySelector('#lead-phone');
        const phoneError = formContainer.querySelector('#phone-error');

        submitBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            
            // Basic validation
            let isValid = true;
            
            if (!name) {
                nameInput.style.borderColor = 'var(--accent-red)';
                isValid = false;
            } else {
                nameInput.style.borderColor = 'var(--border-color)';
            }

            // Simple phone length check
            if (!phone || phone.length < 9) {
                phoneInput.style.borderColor = 'var(--accent-red)';
                phoneError.style.display = 'block';
                isValid = false;
            } else {
                phoneInput.style.borderColor = 'var(--border-color)';
                phoneError.style.display = 'none';
            }

            if (isValid) {
                renderUserMessage(`Submitted: ${name} (${phone})`);
                const nextStepKey = chatFlow.contact_form.process({ name, phone });
                transitionToNextStep(nextStepKey);
            }
        });
    }

    // -------------------------------------------------------------
    // Save Leads to LocalStorage (Mocking Server Dispatch)
    // -------------------------------------------------------------
    function saveLead(leadData) {
        console.log('Lead collected successfully:', leadData);
        let currentLeads = JSON.parse(localStorage.getItem('admiz_leads') || '[]');
        currentLeads.push({
            ...leadData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('admiz_leads', JSON.stringify(currentLeads));
    }

    // -------------------------------------------------------------
    // Final Success State Screen
    // -------------------------------------------------------------
    function renderSuccessState() {
        controlsContainer.innerHTML = ''; // Clear control panel
        
        // Boost score to 100%
        state.targetScore = 100;
        updateScoreGauge();
        updateProgressBar();
        
        // Build pre-filled WhatsApp message
        const ans = state.answers;
        const waNumber = "919711657224";
        
        const messageText = `Hi ADMIZ Agency! I just completed my Meta Ads Campaign Assessment on your website. Here are my details:

• Name: ${ans.fullName || 'Not specified'}
• WhatsApp: ${ans.phone || 'Not specified'}
• Business Niche: ${ans.businessType || 'Not specified'}
• Current Setup: Running Ads? ${ans.runningAds || 'Not specified'}
• Monthly Ad Budget: ${ans.budget || 'Not specified'}
• Campaign Goal: ${ans.goal || 'Not specified'}
• Main Bottleneck: ${ans.biggestProblem || 'Not specified'}
• Start Timeline: ${ans.timeline || 'Not specified'}
• Management Budget: Comfortable? ${ans.serviceComfort || 'Not specified'}
• Specific Challenges: ${ans.specificIssues || 'Not specified'}`;

        const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`;

        // Render beautiful success card directly in message area
        const successDiv = document.createElement('div');
        successDiv.className = 'chat-message bot';
        successDiv.style.maxWidth = '100%';
        successDiv.style.alignSelf = 'center';
        
        successDiv.innerHTML = `
            <div class="message-bubble success-card">
                <div class="success-icon-wrap" style="background: rgba(16, 185, 129, 0.15); border-color: var(--accent-emerald);">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                </div>
                <h4>Assessment Completed!</h4>
                <p>Hello <strong>${ans.fullName}</strong>, we have prepared your strategy report. Please click the button below to send your details directly on WhatsApp to start your private consultation.</p>
                
                <a href="${whatsappUrl}" target="_blank" class="option-btn" id="wa-final-btn" style="background: var(--accent-emerald); color: var(--text-dark); border: none; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 14px; font-size: 0.95rem; margin-top: 10px; display: inline-flex; align-items: center; gap: 8px; justify-content: center; width: 100%; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Send Details on WhatsApp ➔
                </a>
            </div>
        `;
        
        messagesContainer.appendChild(successDiv);
        scrollToBottom();

        // Safe tracking function
        let pixelFired = false;
        function fireLeadPixel() {
            if (pixelFired) return;
            pixelFired = true;
            if (typeof fbq === 'function') {
                fbq('track', 'Lead');
            }
        }

        // Trigger on manual button click
        const waFinalBtn = successDiv.querySelector('#wa-final-btn');
        if (waFinalBtn) {
            waFinalBtn.addEventListener('click', fireLeadPixel);
        }
        
        // Auto-redirect after 1.5s
        setTimeout(() => {
            fireLeadPixel();
            window.open(whatsappUrl, '_blank');
        }, 1500);
    }

    // -------------------------------------------------------------
    // CRO Layer — Social Proof Counter Animation
    // -------------------------------------------------------------
    function animateCounters() {
        const counters = document.querySelectorAll('.proof-number');
        counters.forEach((counter) => {
            const target = parseFloat(counter.dataset.target || '0');
            const isDecimal = !Number.isInteger(target);
            const duration = 1800;
            const steps   = 55;
            const delay   = 400; // wait for page paint

            let current  = 0;
            const increment = target / steps;

            setTimeout(() => {
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = isDecimal
                        ? current.toFixed(1)
                        : Math.floor(current);
                }, duration / steps);
            }, delay);
        });
    }

    // -------------------------------------------------------------
    // CRO Layer — Scarcity / Urgency Badge (day-of-week logic)
    // -------------------------------------------------------------
    function initSlotBadge() {
        const badge    = document.getElementById('slot-badge');
        const slotText = document.getElementById('slot-text');
        if (!badge || !slotText) return;

        // Slots feel real because they follow a believable pattern
        // Mon=5, Tue=4, Wed=3, Thu=2, Fri=1, Sat/Sun resets to 5
        const slotsByDay = { 0: 5, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 5 };
        const day   = new Date().getDay();
        const slots = slotsByDay[day] ?? 3;

        slotText.textContent = `Only ${slots} free slot${slots === 1 ? '' : 's'} left`;
        
        // Fade in after a 600ms delay so it feels "loaded", not baked-in
        setTimeout(() => { badge.style.opacity = '1'; }, 600);
    }

    // -------------------------------------------------------------
    // CRO Layer — Re-engagement Nudge (28s inactivity trigger)
    // -------------------------------------------------------------
    function initReengagementNudge() {
        let interacted = false;
        let nudgeTimer = null;

        // Any click in the controls area means they engaged — cancel
        controlsContainer.addEventListener('click', () => {
            interacted = true;
            if (nudgeTimer) clearTimeout(nudgeTimer);
        }, { once: true });

        nudgeTimer = setTimeout(() => {
            if (!interacted && state.currentStep === 'intro') {
                renderBotMessage(
                    `Koi sawaal hai? 😊<br><br>Bas ek option select karo — ` +
                    `sirf <strong>2 minute</strong> mein aapke business ke liye ` +
                    `ek complete Meta Ads strategy ready ho jaayegi!`
                );
            }
        }, 28000);
    }

    // Start Chatbot + CRO layers
    initChat();
    animateCounters();
    initSlotBadge();
    initReengagementNudge();
});
