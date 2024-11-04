let editingIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    const memeList = document.getElementById("memeList");
    const memes = JSON.parse(localStorage.getItem("memes")) || [];

    memeList.innerHTML = memes.map((meme) => `
        <tr>
            <td><img src="${meme.url}" alt="Meme Image"></td>
            <td>${meme.title}</td>
            <td>${meme.comment ? meme.comment : "Sem comentário"}</td>
        </tr>
    `).join("");
});



document.addEventListener('DOMContentLoaded', function() {
    const memeList = document.getElementById('memeList');
    loadMemes();

    function loadMemes() {
        const memes = JSON.parse(localStorage.getItem('memes')) || [];
        memeList.innerHTML = '';

        memes.forEach((meme, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${meme.url}" alt="${meme.title}" width="100"></td>
                <td>${meme.title}</td>
                <td>${meme.comment || '-'}</td>
                <td>
                    <button onclick="editMeme(${index})">Editar</button>
                    <button onclick="deleteMeme(${index})">Excluir</button>
                </td>
            `;
            memeList.appendChild(row);
        });
    }

    window.deleteMeme = function(index) {
        const memes = JSON.parse(localStorage.getItem('memes')) || [];
        memes.splice(index, 1);
        localStorage.setItem('memes', JSON.stringify(memes));
        loadMemes();
    };

    window.editMeme = function(index) {
        const memes = JSON.parse(localStorage.getItem('memes')) || [];
        const memeToEdit = memes[index];
    
        document.getElementById('title').value = memeToEdit.title;
        document.getElementById('comment').value = memeToEdit.comment || '';
        document.getElementById('url').value = memeToEdit.url; 
        document.getElementById('type').value = memeToEdit.type; 
        editingIndex = index; 
    
        setEditable(true);
    };
    
    function setEditable(editable) {
        document.getElementById("title").disabled = !editable;
        document.getElementById("comment").disabled = !editable;
        document.getElementById("url").disabled = !editable; 
        document.getElementById("type").disabled = !editable; 
        document.getElementById("file").disabled = !editable; 
    
        const submitButton = document.getElementById("submitMeme");
        submitButton.style.display = editable ? 'inline' : 'none'; 
    }
    
    document.getElementById("memeForm").addEventListener("submit", (e) => {
        e.preventDefault();
    
        const title = document.getElementById("title").value;
        const comment = document.getElementById("comment").value;
        const url = document.getElementById("url").value;
        const type = document.getElementById("type").value;
    
        const memes = JSON.parse(localStorage.getItem("memes")) || [];
    
        if (editingIndex !== null) {
            memes[editingIndex].title = title; 
            memes[editingIndex].comment = comment; 
            memes[editingIndex].url = url; 
            memes[editingIndex].type = type; 
            document.getElementById("message").textContent = "Meme editado com sucesso!";
            editingIndex = null; 
        }
    
        localStorage.setItem("memes", JSON.stringify(memes));
        loadMemes();
        setEditable(false); 
    });
    
});
