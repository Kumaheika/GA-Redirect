// Updated JavaScript for optimizing the TTS system

document.addEventListener('DOMContentLoaded', () => {
    const rateInput = document.getElementById('rate');
    const pitchInput = document.getElementById('pitch');
    const customControls = document.getElementById('custom-controls');
    const buttons = document.querySelectorAll('.preset-button');

    // Preset configurations for the 5 buttons
    const presets = [
        { name: '微學習', rate: 1.06, pitch: 0.2 },
        { name: '服務行銷', rate: 1.04, pitch: 0.2 },
        { name: '產品介紹', rate: 1.00, pitch: 0.2 },
        { name: '事項宣導', rate: 0.96, pitch: 0 },
        { name: '專家操作', rate: 1.0, pitch: 0, custom: true }
    ];

    let activeButton = null;

    // Function to handle button click
    function handleButtonClick(index) {
        const preset = presets[index];

        // Update rate and pitch inputs based on preset
        rateInput.value = preset.rate;
        pitchInput.value = preset.pitch;

        // Toggle custom controls visibility
        if (preset.custom) {
            customControls.style.display = 'block';
        } else {
            customControls.style.display = 'none';
        }

        // Update active button styling
        if (activeButton) {
            activeButton.classList.remove('active');
        }
        buttons[index].classList.add('active');
        activeButton = buttons[index];
    }

    // Add event listeners to all preset buttons
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => handleButtonClick(index));
    });

    // Generate speech based on current settings
    document.getElementById('generate-btn').addEventListener('click', async () => {
        const text = document.getElementById('text-input').value.trim();
        const voiceModel = document.getElementById('voice-model').value;
        const rate = `${rateInput.value || 0}`;
        const pitch = `${pitchInput.value || 0}`;

        if (!text) {
            alert('請輸入文字');
            return;
        }

        // Construct SSML
        const ssml = `
          <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
            <voice name="${voiceModel}">
              <prosody rate="${rate}" pitch="${pitch}">${text}</prosody>
            </voice>
          </speak>
        `;

        console.log('Generated SSML:', ssml);

        try {
            const response = await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1', {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': '10dfa1cba6834633896008d56229bc46', // Replace with valid API Key
                    'Content-Type': 'application/ssml+xml',
                    'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
                },
                body: ssml,
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Azure API Response:', errorDetails);
                throw new Error(`語音生成失敗，錯誤信息: ${errorDetails}`);
            }

            const blob = await response.blob();
            if (!blob || blob.size === 0) {
                throw new Error('生成的音訊文件為空，請檢查輸入或服務配置');
            }

            const link = document.getElementById('download-link');
            link.href = URL.createObjectURL(blob);
            link.style.display = 'block';
            link.textContent = '下載語音';
        } catch (error) {
            console.error(error);
            alert('語音生成過程中出現錯誤：' + error.message);
        }
    });
});
