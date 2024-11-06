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
    fetch('http://localhost:3000/memes')
        .then(response => response.json())
        .then(memes => {
            const totalPages = Math.ceil(memes.length / memesPerPage);

            const startIndex = (currentPage - 1) * memesPerPage;
            const endIndex = startIndex + memesPerPage;
            const memesToShow = memes.slice(startIndex, endIndex);

            displayMemes(memesToShow);
            updatePagination(totalPages);
        })
        .catch(error => console.error('Erro ao carregar memes:', error));
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
                <td><button onclick="viewComments(${index})">Ver Comentários</button></td>
                <td>
                    <button onclick="editMeme(${index})">Editar</button>
                    <button onclick="deleteMeme(${meme.id})">Excluir</button>
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
    fetch(`http://localhost:3000/memes/${index + 1}/comments`)
        .then(response => response.json())
        .then(comments => {
            currentMemeIndex = index;
            loadComments(comments);
            document.getElementById('commentsPopup').style.display = 'block';
            updateCommentButtonState(comments);
        })
        .catch(error => console.error('Erro ao carregar comentários:', error));
};

function loadComments(comments) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';

    comments.forEach((comment, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comment.content}</td>
            <td>
                <button onclick="editComment(${index})">Editar</button>
                <button onclick="deleteComment(${index})">Excluir</button>
            </td>
        `;
        commentsList.appendChild(row);
    });
}

window.editComment = function(index) {
    const commentToEdit = document.getElementById('commentsList').rows[index].cells[0].textContent;
    document.getElementById('newComment').value = commentToEdit;
    editingCommentIndex = index;

    document.querySelector('#commentForm button[type="submit"]').textContent = 'Salvar Comentário Editado';
    updateCommentButtonState([commentToEdit]);
};

document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newComment = document.getElementById('newComment').value;

    if (!newComment) return;

    const memeId = currentMemeIndex + 1;
    const comment = {
        content: newComment,
        memeId: memeId
    };

    if (editingCommentIndex !== null) {
        // Edit comment
        fetch(`http://localhost:3000/memes/${memeId}/comments/${editingCommentIndex + 1}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        })
        .then(response => response.json())
        .then(() => {
            loadComments();
            document.getElementById('newComment').value = '';
        })
        .catch(error => console.error('Erro ao editar comentário:', error));
    } else {
        // Add new comment
        fetch(`http://localhost:3000/memes/${memeId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        })
        .then(response => response.json())
        .then(() => {
            loadComments();
            document.getElementById('newComment').value = '';
        })
        .catch(error => console.error('Erro ao adicionar comentário:', error));
    }
});

window.deleteComment = function(index) {
    fetch(`http://localhost:3000/memes/${currentMemeIndex + 1}/comments/${index + 1}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        loadComments();
    })
    .catch(error => console.error('Erro ao excluir comentário:', error));
};

window.closeCommentsPopup = function() {
    document.getElementById('commentsPopup').style.display = 'none';
};

window.editMeme = function(index) {
    fetch(`http://localhost:3000/memes/${index + 1}`)
        .then(response => response.json())
        .then(meme => {
            document.getElementById('title').value = meme.title;
            document.getElementById('comment').value = meme.description || '';
            document.getElementById('url').value = meme.url;

            document.getElementById('url').disabled = false;
            document.getElementById('title').disabled = false;
            document.getElementById('comment').disabled = false;

            document.getElementById('submitMeme').style.display = 'block';

            editingIndex = index;
        })
        .catch(error => console.error('Erro ao carregar meme para edição:', error));
};

document.getElementById('memeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const meme = {
        title: document.getElementById('title').value,
        description: document.getElementById('comment').value,
        url: document.getElementById('url').value
    };

    if (editingIndex !== null) {
        fetch(`http://localhost:3000/memes/${editingIndex + 1}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meme)
        })
        .then(response => response.json())
        .then(() => {
            loadMemes();
            document.getElementById('title').value = '';
            document.getElementById('comment').value = '';
            document.getElementById('url').value = '';
        })
        .catch(error => console.error('Erro ao editar meme:', error));
    } else {
        fetch('http://localhost:3000/memes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meme)
        })
        .then(response => response.json())
        .then(() => {
            loadMemes();
            document.getElementById('title').value = '';
            document.getElementById('comment').value = '';
            document.getElementById('url').value = '';
        })
        .catch(error => console.error('Erro ao adicionar meme:', error));
    }
});

window.deleteMeme = function(id) {
    fetch(`http://localhost:3000/memes/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        loadMemes();
    })
    .catch(error => console.error('Erro ao excluir meme:', error));
};
