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
    
        document.getElementById('file').value = ''; 
        document.getElementById('type').value = memeToEdit.type;
        document.getElementById('url').value = memeToEdit.url;
        document.getElementById('title').value = memeToEdit.title;
        document.getElementById('comment').value = memeToEdit.comment || '';
    
        memes.splice(index, 1);
        localStorage.setItem('memes', JSON.stringify(memes));
        loadMemes(); 
    };
});
