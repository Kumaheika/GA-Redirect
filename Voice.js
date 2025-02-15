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
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const rate = button.dataset.rate;
            const pitch = button.dataset.pitch;
            rateInput.value = rate;
            pitchInput.value = pitch;

            console.log("選擇速率: "+ rateInput.value, "選擇音高: "+ pitchInput.value);

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
        console.log("來源速率: "+ rateInput.value, "來源音高: "+ pitchInput.value);
        const rate = `${parseFloat(rateInput.value)*1}%`;
        const pitch = `${parseFloat(pitchInput.value)*1}%`;
        

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
                    'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
                },
                body: ssml,
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Azure API Response:', errorDetails);
                throw new Error(`語音生成失敗: ${errorDetails}`);
            }

            const blob = await response.blob();
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.style.display = 'block';
            downloadLink.textContent = '點按下載語音';

            alert('語音已生成，請下載！');
            console.log("生成速率: "+ rate, "生成音高: "+ pitch);
        } catch (error) {
            console.error(error);
            alert(`生成過程出現錯誤：${error.message}`);
        }
    });
});
