// add static list of settings keys values
const settings = {
    tavilyKey: '',
    groqKey: '',
    domains: ["www.youm7.com", "gate.ahram.org.eg", "www.bbc.com", "www.aljazeera.net", "www.cnn.com"]
};

// Auto fact check on popup open if text is selected
document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, async (response) => {
        if (response && response.text && response.text.trim()) {
            document.getElementById('errorMsg').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            document.getElementById('results').style.display = 'none';
            try {
                await factCheck(response.text.trim(), settings);
            } catch (error) {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('errorMsg').textContent = 'Error: ' + error.message;
                document.getElementById('errorMsg').style.display = 'block';
            }
        }
    });
});

// Check selected text
document.getElementById('checkBtn').addEventListener('click', async () => {
    // const settings = await chrome.storage.sync.get(['tavilyKey', 'groqKey', 'domains']);

    if (!settings.tavilyKey || !settings.groqKey) {
        document.getElementById('errorMsg').textContent = 'Please configure API keys first';
        document.getElementById('errorMsg').style.display = 'block';
        return;
    }

    // Get selected text from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' }, async (response) => {
        if (chrome.runtime.lastError) {
            document.getElementById('errorMsg').textContent = 'Could not access page. Try refreshing.';
            document.getElementById('errorMsg').style.display = 'block';
            return;
        }

        if (!response || !response.text) {
            document.getElementById('errorMsg').textContent = 'Please select some text on the page first';
            document.getElementById('errorMsg').style.display = 'block';
            return;
        }

        document.getElementById('errorMsg').style.display = 'none';
        document.getElementById('loading').style.display = 'block';
        document.getElementById('results').style.display = 'none';

        try {
            await factCheck(response.text, settings);
        } catch (error) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('errorMsg').textContent = 'Error: ' + error.message;
            document.getElementById('errorMsg').style.display = 'block';
        }
    });
});

async function factCheck(text, settings) {
    try {
        // Step 1: Search with Tavily
        const searchResults = await searchTavily(text, settings.tavilyKey, settings.domains);

        // Step 2: Analyze with Groq
        const analysis = await analyzeWithGroq(text, searchResults, settings.groqKey);

        // Step 3: Display results
        displayResults(text, analysis, searchResults);

    } catch (error) {
        throw error;
    }
}

async function searchTavily(query, apiKey, domains) {
    const domainsArray = Array.isArray(domains) ? domains : (domains ? domains.split(',').map(d => d.trim()).filter(d => d) : []);

    const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: apiKey,
            query: query,
            search_depth: 'advanced',
            include_domains: domainsArray.length > 0 ? domainsArray : undefined,
            max_results: 5
        })
    });

    if (!response.ok) {
        throw new Error('Tavily search failed: ' + response.statusText);
    }

    return await response.json();
}

async function analyzeWithGroq(claim, searchResults, apiKey) {
    const context = searchResults.results.map((r, i) =>
        `Source ${i + 1} (${r.url}):\n${r.content}`
    ).join('\n\n');

    const prompt = `You are a fact-checking AI. Analyze the following claim based on the search results provided.

CLAIM: "${claim}"

SEARCH RESULTS:
${context}

Please provide:
1. A credibility percentage (0-100%)
2. A verdict (صحيح, غير صحيح, غير موثق, or غير مؤكد)
3. A clear explanation (2-3 sentences in Arabic) justifying your verdict based on the search results.

Respond ONLY with valid JSON in this exact format:
{
  "percentage": 85,
  "verdict": "صحيح",
  "explanation": "Your explanation here"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 500
        })
    });

    if (!response.ok) {
        throw new Error('Groq analysis failed: ' + response.statusText);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
    }

    return JSON.parse(jsonMatch[0]);
}

function displayResults(text, analysis, searchResults) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    // Display selected text
    document.getElementById('selectedTextDiv').textContent = `"${text}"`;

    // Display percentage
    document.getElementById('percentage').textContent = `${analysis.percentage}%`;

    // Display verdict
    document.getElementById('verdict').textContent = `Verdict: ${analysis.verdict}`;

    // Display explanation
    document.getElementById('explanation').textContent = analysis.explanation;

    // Set verdict box color
    const verdictBox = document.getElementById('verdictBox');
    verdictBox.className = 'verdict-box';

    if (analysis.percentage >= 70) {
        verdictBox.classList.add('verdict-true');
    } else if (analysis.percentage >= 40) {
        verdictBox.classList.add('verdict-uncertain');
    } else {
        verdictBox.classList.add('verdict-false');
    }

    // Display sources
    const sourcesDiv = document.getElementById('sources');
    if (searchResults.results && searchResults.results.length > 0) {
        sourcesDiv.innerHTML = '<h3>Sources:</h3>';
        searchResults.results.forEach(result => {
            const link = document.createElement('a');
            link.href = result.url;
            link.className = 'source-link';
            link.textContent = result.title || result.url;
            link.target = '_blank';
            sourcesDiv.appendChild(link);
        });
    } else {
        sourcesDiv.innerHTML = '<h3>No sources found</h3>';
    }
}