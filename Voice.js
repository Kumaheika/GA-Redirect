generateBtn.addEventListener('click', async () => {
    const text = document.getElementById('text-input').value.trim();
    const voiceModel = document.getElementById('voice-model').value;
    const rate = `${parseFloat(rateInput.value) * 100}%`;
    const pitch = `${parseFloat(pitchInput.value) * 10}%`;

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

    console.log('Generated SSML:', ssml);

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
            console.error('Azure API Response:', errorDetails);
            throw new Error(`語音生成失敗，錯誤信息: ${errorDetails}`);
        }

        const blob = await response.blob();
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.style.display = 'block';
        downloadLink.textContent = '下載語音';

        alert('語音已生成！請點擊下載鏈接下載語音。');
    } catch (error) {
        console.error(error);
        alert('語音生成過程中出現錯誤：' + error.message);
    }
});
