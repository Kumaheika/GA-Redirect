document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate-btn').addEventListener('click', async () => {
        const text = document.getElementById('text-input').value.trim();
        const voiceModel = document.getElementById('voice-model').value;
        const rate = document.getElementById('rate').value || "0%";
        const pitch = document.getElementById('pitch').value || "0%";

        if (!text) {
            alert('請輸入文字');
            return;
        }

        // 構建 SSML
        const ssml = `
          <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
            <voice name="${voiceModel}">
              <prosody rate="${rate}" pitch="${pitch}">${text}</prosody>
            </voice>
          </speak>
        `;

        console.log('Generated SSML:', ssml); // 確認 SSML 輸出是否正確

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
                console.error('Azure API Response:', errorDetails); // 打印 Azure 返回錯誤訊息
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
