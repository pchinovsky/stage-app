export function checkIsDark(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const width = img.width;
            const height = Math.floor(img.height / 2);

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const pixels = imageData.data;

            let totalLuminance = 0;
            let pixelCount = 0;

            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                totalLuminance += luminance;
                pixelCount++;
            }

            const avgLuminance = totalLuminance / pixelCount;
            const isDark = avgLuminance < 100;

            resolve(isDark);
        };

        img.onerror = () => {
            console.warn("Image failed to load for brightness check.");
            resolve(false);
        };
    });
}
