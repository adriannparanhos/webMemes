let editingIndex = null; 

document.getElementById("memeForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const file = document.getElementById("file").value; 
    const type = document.getElementById("type").value;
    const url = document.getElementById("url").value;
    const title = document.getElementById("title").value;
    const comment = document.getElementById("comment").value;

    if (!file) {
        document.getElementById("message").textContent = "Por favor, selecione um arquivo.";
        return;
    }

    if (!url || !/^https?:\/\//.test(url)) {
        document.getElementById("message").textContent = "Insira uma URL válida que comece com http:// ou https://.";
        return;
    }

    if (!title) {
        document.getElementById("message").textContent = "Por favor, digite um título.";
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

    localStorage.setItem("memes", JSON.stringify(memes));
    loadMemes(); 
    document.getElementById("memeForm").reset(); 
});

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
