let editingIndex = null; 

document.getElementById("memeForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const url = document.getElementById("url").value;
    const title = document.getElementById("title").value;
    const comment = document.getElementById("comment").value;
    const messageElement = document.getElementById("message");

    messageElement.style.color = "red";

    if (!type) {
        messageElement.textContent = "Selecione o tipo de meme.";
        return;
    }

    if (!url || !/^https?:\/\//.test(url)) {
        document.getElementById("message").textContent = "Insira uma URL válida que comece com http:// ou https://.";
        return;
    }

    if (!isValidMediaURL(url, type)) {
        messageElement.textContent = "A URL não corresponde ao tipo selecionado (imagem ou vídeo).";
        return;
    }

    if (!title || title.length < 3 || title.length > 50) {
        messageElement.textContent = "O título deve ter entre 3 e 50 caracteres.";
        return;
    }

    if (comment.length > 200) {
        messageElement.textContent = "O comentário não pode ter mais de 200 caracteres.";
        return;
    }

    const memes = JSON.parse(localStorage.getItem("memes")) || [];

    if (editingIndex !== null) {
        memes[editingIndex] = { type, url, title, comment }; 
        editingIndex = null; 
        document.getElementById("message").textContent = "Meme editado com sucesso!";
    } else {
        memes.push({ type, url, title, comment });
        document.getElementById("message").textContent = "Meme cadastrado com sucesso!";
    }

    messageElement.style.color = "green";
    localStorage.setItem("memes", JSON.stringify(memes));
    loadMemes();
    document.getElementById("memeForm").reset();
});

function isValidMediaURL(url, type) {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    const videoRegex = /\.(mp4|webm|ogg|mov|avi)$/i;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+$/;

    if (type === 'image') {
        return imageRegex.test(url);
    } else if (type === 'video') {
        return videoRegex.test(url) || youtubeRegex.test(url) || vimeoRegex.test(url);
    }
    return false;
}

document.addEventListener("DOMContentLoaded", loadMemes);

function loadMemes() {
    const memeList = document.getElementById("memeList");
    const memes = JSON.parse(localStorage.getItem("memes")) || [];

    memeList.innerHTML = memes.map((meme, index) => `
        <tr>
            <td><img src="${meme.url}" alt="${meme.title}" width="100"></td>
            <td>${meme.title}</td>
            <td>${meme.comment || "Sem comentário"}</td>
            <td>
                <button onclick="editMeme(${index})">Editar</button>
                <button onclick="deleteMeme(${index})">Excluir</button>
            </td>
        </tr>
    `).join("");
}

window.deleteMeme = function(index) {
    const memes = JSON.parse(localStorage.getItem("memes")) || [];
    memes.splice(index, 1);
    localStorage.setItem("memes", JSON.stringify(memes));
    loadMemes(); 
};

window.editMeme = function(index) {
    const memes = JSON.parse(localStorage.getItem("memes")) || [];
    const memeToEdit = memes[index];

    document.getElementById("type").value = memeToEdit.type;
    document.getElementById("url").value = memeToEdit.url;
    document.getElementById("title").value = memeToEdit.title;
    document.getElementById("comment").value = memeToEdit.comment || '';

    editingIndex = index; 
};
