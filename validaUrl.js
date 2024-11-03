document.getElementById('memeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const urlInput = document.getElementById('url').value;
    const type = document.getElementById('type').value;
    const message = document.getElementById('message');

    if (isValidMediaURL(urlInput, type)) {
        message.textContent = "Meme cadastrado com sucesso!";
        message.style.color = "green";
    } else {
        message.textContent = "URL inválida para o tipo selecionado.";
        message.style.color = "red";
    }
});

function isValidMediaURL(url, type) {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    const videoRegex = /\.(mp4|webm|ogg|mov|avi)$/i;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+$/;

    if (type === 'image') {
        return imageRegex.test(url) || /wp-content|media|images/.test(url);
    } else if (type === 'video') {
        return videoRegex.test(url) || youtubeRegex.test(url) || vimeoRegex.test(url);
    }
    return false;
}
