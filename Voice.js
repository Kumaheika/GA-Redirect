document.addEventListener('DOMContentLoaded', () => {
    const rateInput = document.getElementById('rate');
    const pitchInput = document.getElementById('pitch');
    const customControls = document.getElementById('custom-controls');
    const buttons = document.querySelectorAll('.preset-button');
    const generateBtn = document.getElementById('generate-btn');
    const downloadLink = document.getElementById('download-link');

    // Handle button clicks
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active button styling
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update rate and pitch inputs
            const rate = button.dataset.rate;
            const pitch = button.dataset.pitch;
            rateInput.value = rate;
            pitchInput.value = pitch;

            // Show or hide custom controls
            if (button.textContent === '專家操作') {
                customControls.style.display = 'block';
            } else {
                customControls.style.display = 'none';
            }
        });
    });

    // Generate speech
    generateBtn.addEventListener('click', async () => {
        const text = document.getElementById('text-input').value.trim();
        const voiceModel = document.getElementById('voice-model').value;
        const rate = `${rateInput.value}`;
        const pitch = `${pitchInput.value}`;

        if (!text) {
            alert('請輸入文字');
            return;
        }

        const ssml = `
          <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">
            <voice name="${voiceModel}">
              <prosody rate="${rate}" pitch="${pitch}">${text}</prosody>
            </voice>
          </speak>
        `;

        try {
            const response = await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1', {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': '10dfa1cba6834633896008d56229bc46',
                    'Content-Type': 'application/ssml+xml',
                    'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
                },
                body: ssml,
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`語音生成失敗: ${errorDetails}`);
            }

            const blob = await response.blob();
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.style.display = 'block';
            downloadLink.textContent = '下載語音';

            alert('語音已生成，請下載！');
        } catch (error) {
            alert(`生成過程出現錯誤：${error.message}`);
        }
    });
});
