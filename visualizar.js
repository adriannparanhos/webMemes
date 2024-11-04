let editingIndex = null;
let currentMemeIndex = null;
let editingCommentIndex = null;

const memesPerPage = 8;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    setupPaginationControls();
    loadMemes();
});

function setupPaginationControls() {
    const paginationControls = document.createElement('div');
    paginationControls.classList.add('pagination-controls');
    paginationControls.innerHTML = `
        <button id="prevPage" disabled>Anterior</button>
        <span id="pageIndicator">Página 1</span>
        <button id="nextPage">Próximo</button>
    `;
    document.body.appendChild(paginationControls);

    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
}

function loadMemes() {
    const memes = JSON.parse(localStorage.getItem('memes')) || [];
    const totalPages = Math.ceil(memes.length / memesPerPage);

    const startIndex = (currentPage - 1) * memesPerPage;
    const endIndex = startIndex + memesPerPage;
    const memesToShow = memes.slice(startIndex, endIndex);

    displayMemes(memesToShow);
    updatePagination(totalPages);
}

function displayMemes(memesToShow) {
    const memeList = document.getElementById("memeList");
    memeList.innerHTML = memesToShow.map((meme, index) => {
        let mediaContent;
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(.+)$/;
        const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/(\d+)$/;

        if (meme.type === "video") {
            if (youtubeRegex.test(meme.url)) {
                const videoId = meme.url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/)[1];
                const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                mediaContent = `<iframe src="${embedUrl}" width="100" height="100" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            } else if (vimeoRegex.test(meme.url)) {
                const videoId = meme.url.match(vimeoRegex)[3];
                const embedUrl = `https://player.vimeo.com/video/${videoId}`;
                mediaContent = `<iframe src="${embedUrl}" width="100" height="100" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            } else {
                mediaContent = `<video width="100" controls><source src="${meme.url}" type="video/mp4">Seu navegador não suporta o elemento de vídeo.</video>`;
            }
        } else {
            mediaContent = `<img src="${meme.url}" alt="${meme.title}" width="100">`;
        }

        return `
            <tr>
                <td>${mediaContent}</td>
                <td>${meme.title}</td>
                <td>${meme.comment || '-'}</td>
                <td><button onclick="viewComments(${(currentPage - 1) * memesPerPage + index})">Ver Comentários</button></td>
                <td>
                    <button onclick="editMeme(${(currentPage - 1) * memesPerPage + index})">Editar</button>
                    <button onclick="deleteMeme(${(currentPage - 1) * memesPerPage + index})">Excluir</button>
                </td>
            </tr>
        `;
    }).join('');
}


function updatePagination(totalPages) {
    document.getElementById('pageIndicator').textContent = `Página ${currentPage}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function changePage(direction) {
    currentPage += direction;
    loadMemes();
}

function updateCommentButtonState(comments) {
    const submitCommentButton = document.querySelector('#commentForm button[type="submit"]');
    if (editingCommentIndex !== null || comments.length < 10) {
        submitCommentButton.disabled = false;
    } else {
        submitCommentButton.disabled = true;
    }
}

window.viewComments = function(index) {
    const memes = JSON.parse(localStorage.getItem('memes')) || [];
    currentMemeIndex = index; 
    const meme = memes[index];

    loadComments(meme.comments || []);
    document.getElementById('commentsPopup').style.display = 'block';
    updateCommentButtonState(meme.comments || []); 
};

function loadComments(comments) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    comments.forEach((comment, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comment}</td>
            <td>
                <button onclick="editComment(${index})">Editar</button>
                <button onclick="deleteComment(${index})">Excluir</button>
            </td>
        `;
        commentsList.appendChild(row);
    });
}

window.editComment = function(index) {
    const memes = JSON.parse(localStorage.getItem('memes')) || [];
    const commentToEdit = memes[currentMemeIndex].comments[index];
    
    document.getElementById('newComment').value = commentToEdit;
    editingCommentIndex = index; 

    document.querySelector('#commentForm button[type="submit"]').textContent = 'Salvar Comentário Editado';
    updateCommentButtonState(memes[currentMemeIndex].comments); 
};

document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newComment = document.getElementById('newComment').value;
    const memes = JSON.parse(localStorage.getItem('memes')) || [];
    
    if (!newComment) return; 

    if (editingCommentIndex !== null) {
        memes[currentMemeIndex].comments[editingCommentIndex] = newComment;
        editingCommentIndex = null; 
        document.querySelector('#commentForm button[type="submit"]').textContent = 'Adicionar Comentário'; 
    } else {
        if (!memes[currentMemeIndex].comments) {
            memes[currentMemeIndex].comments = [];
        }

        if (memes[currentMemeIndex].comments.length < 10) { 
            memes[currentMemeIndex].comments.push(newComment);
        } else {
            alert("Você já atingiu o limite máximo de 10 comentários para este meme."); 
            return; 
        }
    }

    localStorage.setItem('memes', JSON.stringify(memes));
    loadComments(memes[currentMemeIndex].comments);
    document.getElementById('newComment').value = ''; 
    updateCommentButtonState(memes[currentMemeIndex].comments); 
});

window.deleteComment = function(index) {
    const memes = JSON.parse(localStorage.getItem('memes')) || [];
    memes[currentMemeIndex].comments.splice(index, 1);
    localStorage.setItem('memes', JSON.stringify(memes));
    loadComments(memes[currentMemeIndex].comments);
    updateCommentButtonState(memes[currentMemeIndex].comments); 
};

window.closeCommentsPopup = function() {
    document.getElementById('commentsPopup').style.display = 'none';
};

window.editMeme = function(index) {
    const memes = JSON.parse(localStorage.getItem('memes')) || [];
    const memeToEdit = memes[index];
    
    document.getElementById('title').value = memeToEdit.title;
    document.getElementById('comment').value = memeToEdit.comment || '';
    document.getElementById('url').value = memeToEdit.url;
    
    document.getElementById('url').disabled = false;
    document.getElementById('title').disabled = false;
    document.getElementById('comment').disabled = false;

    document.getElementById('submitMeme').style.display = 'block'; 

    editingIndex = index; 
};

document.getElementById('memeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const memes = JSON.parse(localStorage.getItem('memes')) || [];

    if (editingIndex !== null) {
        memes[editingIndex].title = document.getElementById('title').value;
        memes[editingIndex].comment = document.getElementById('comment').value;
        memes[editingIndex].url = document.getElementById('url').value;

        editingIndex = null; 
        alert("Meme editado com sucesso!");
    }

    localStorage.setItem('memes', JSON.stringify(memes));

    document.getElementById('title').value = '';
    document.getElementById('comment').value = '';
    document.getElementById('url').value = '';

    document.getElementById('url').disabled = true;
    document.getElementById('title').disabled = true;
    document.getElementById('comment').disabled = true;

    loadMemes(); 
});

window.deleteMeme = function(index) {
    const memes = JSON.parse(localStorage.getItem('memes')) || [];
    memes.splice(index, 1);
    localStorage.setItem('memes', JSON.stringify(memes));
    if ((currentPage - 1) * memesPerPage >= memes.length) {
        currentPage--; 
    }
    loadMemes();
};