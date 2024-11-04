document.getElementById("memeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const typeSelect = document.getElementById("type");
    const urlInput = document.getElementById("url");
    const titleInput = document.getElementById("title");
    const commentInput = document.getElementById("comment");
    const messageElement = document.getElementById("message");

    const title = titleInput.value.trim();
    const comment = commentInput.value.trim();
    const url = urlInput.value.trim();
    const selectedType = typeSelect.value;

    if (title.length < 3 || title.length > 50) {
        messageElement.textContent = "O título deve ter entre 3 e 50 caracteres.";
        messageElement.style.color = "red";
        return;
    }

    if (comment.length > 50) {
        messageElement.textContent = "O comentário não pode ter mais de 50 caracteres.";
        messageElement.style.color = "red";
        return;
    }

    if (!isValidUrl(url)) {
        messageElement.textContent = "Por favor, insira uma URL válida.";
        messageElement.style.color = "red";
        return;
    }

    const file = fileInput.files[0];
    if (file) {
        const fileType = file.type;
        if (selectedType === "image" && !fileType.startsWith("image/")) {
            messageElement.textContent = "O arquivo deve ser uma imagem.";
            messageElement.style.color = "red";
            return;
        } else if (selectedType === "video" && !fileType.startsWith("video/")) {
            messageElement.textContent = "O arquivo deve ser um vídeo.";
            messageElement.style.color = "red";
            return;
        }
    }

    messageElement.textContent = "Meme cadastrado com sucesso!";
    messageElement.style.color = "green";

    document.getElementById("memeForm").reset();
});

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}
