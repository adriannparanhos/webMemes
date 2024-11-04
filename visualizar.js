let editingIndex = null;
let currentMemeIndex = null;
let editingCommentIndex = null; 

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
    memeList.innerHTML = '';
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
                    <button onclick="viewComments(${index})">Ver Comentários</button>
                </td>
                <td>
                    <button onclick="editMeme(${index})">Editar</button>
                    <button onclick="deleteMeme(${index})">Excluir</button>
                </td>
            `;
            memeList.appendChild(row);
        });
    }

    function updateCommentButtonState(comments) {
        const submitCommentButton = document.querySelector('#commentForm button[type="submit"]');
        if (comments.length >= 10) {
            submitCommentButton.disabled = true; 
            submitCommentButton.classList.add('disabled-button'); 
        } else {
            submitCommentButton.disabled = false; 
            submitCommentButton.classList.remove('disabled-button'); 
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

    function prepareEditComment(index) {
        const memes = JSON.parse(localStorage.getItem('memes')) || [];
        const commentToEdit = memes[currentMemeIndex].comments[index];
        
        document.getElementById('editCommentInput').value = commentToEdit;
        editingCommentIndex = index; 
        document.getElementById('editCommentSection').style.display = 'block'; 
    }

    window.editComment = function(index) {
        const memes = JSON.parse(localStorage.getItem('memes')) || [];
        const commentToEdit = memes[currentMemeIndex].comments[index];
        
        document.getElementById('newComment').value = commentToEdit;
        editingCommentIndex = index; 

        document.querySelector('#commentForm button[type="submit"]').textContent = 'Salvar Comentário Editado';
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

    document.getElementById('commentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newComment = document.getElementById('newComment').value;
        if (!newComment) return;

        const memes = JSON.parse(localStorage.getItem('memes')) || [];
        if (!memes[currentMemeIndex].comments) {
            memes[currentMemeIndex].comments = [];
        }
        memes[currentMemeIndex].comments.push(newComment);
        localStorage.setItem('memes', JSON.stringify(memes));
        loadComments(memes[currentMemeIndex].comments);
        document.getElementById('newComment').value = '';
    });

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
