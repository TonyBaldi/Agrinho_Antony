document.getElementById("imagemProduto").addEventListener("change", function (event) {
    const preview = document.getElementById("previewImagem");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        preview.style.display = "none";
    }
});

// Configuração Firebase (use a sua config exata)
const firebaseConfig = {
    apiKey: "AIzaSyDZXnqbqqITRgza8wj9yRGDdjo4PP2iL7Q",
    authDomain: "agronolar-c0eec.firebaseapp.com",
    projectId: "agronolar-c0eec",
    storageBucket: "agronolar-c0eec.firebasestorage.app",
    messagingSenderId: "254907286475",
    appId: "1:254907286475:web:244a30bd363c58f0d6ac4e",
    measurementId: "G-2Z97E4BZJP"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const analytics = firebase.analytics(); // opcional

// Função para mostrar a área de publicar e esconder autenticação
function mostrarPublicar() {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("publicarSection").style.display = "block";
    document.getElementById("logoutBtn").style.display = "block";
}

// Cadastro
function cadastrar() {
    const nomeUsuario = document.getElementById("nomeUsuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (!nomeUsuario || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não conferem.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: nomeUsuario
            });
        })
        .then(() => {
            alert("Cadastro realizado com sucesso!");
            mostrarPublicar();
        })
        .catch((error) => {
            alert("Erro no cadastro: " + error.message);
        });
}

// Login
function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    auth.signInWithEmailAndPassword(email, senha)
        .then(() => {
            mostrarPublicar();
        })
        .catch((error) => {
            alert("Erro no login: " + error.message);
        });
}

// Logout
function logout() {
    auth.signOut()
        .then(() => {
            // logout automático pelo onAuthStateChanged
        })
        .catch((error) => {
            alert("Erro ao sair: " + error.message);
        });

    document.getElementById("authSection").style.display = "block";
    document.getElementById("publicarSection").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";

    // Limpa os campos
    document.getElementById("nomeUsuario").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("confirmarSenha").value = "";

    // Esconde campos extras do cadastro
    document.getElementById("campoNomeUsuario").style.display = "none";
    document.getElementById("campoConfirmarSenha").style.display = "none";

    // Mostra os botões padrões
    document.getElementById("btnCadastrar").style.display = "inline-block";
    document.getElementById("btnLogin").style.display = "inline-block";

    document.getElementById("btnFinalizarCadastro").style.display = "none";

}

// Monitorar estado do usuário logado
auth.onAuthStateChanged((user) => {
    if (user) {
        mostrarPublicar();
        document.querySelector(".sidebar").style.display = "flex";
    } else {
        document.getElementById("authSection").style.display = "block";
        document.getElementById("publicarSection").style.display = "none";
        document.getElementById("logoutBtn").style.display = "none";

        // Esconde a sidebar
        document.querySelector(".sidebar").style.display = "none";
    }
});

// Publicar (igual ao que você já tem)
function publicar() {
    const texto = document.getElementById("textoPublicacao").value.trim();
    const preco = document.getElementById("preco").value.trim();
    const unidade = document.getElementById("unidade").value.trim();

    if (!texto || !preco || !unidade) {
        alert("Preencha todos os campos da publicação.");
        return;
    }

    const usuario = auth.currentUser;
    const nomeUsuario = usuario && usuario.displayName ? usuario.displayName : "Anônimo";
    const emailUsuario = usuario && usuario.email ? usuario.email : "";

    const publicacao = document.createElement("div");
    publicacao.className = "publicacao";

    const autor = document.createElement("p");
    autor.innerHTML = `<strong>Publicado por:</strong> ${nomeUsuario}`;

    const conteudo = document.createElement("p");
    conteudo.textContent = texto;

    const precoInfo = document.createElement("p");
    precoInfo.innerHTML = `<strong>Preço:</strong> R$ ${parseFloat(preco).toFixed(2)}`;

    const unidadeInfo = document.createElement("p");
    unidadeInfo.innerHTML = `<strong>Unidade:</strong> ${unidade}`;

    publicacao.appendChild(autor);
    publicacao.appendChild(conteudo);
    publicacao.appendChild(precoInfo);
    publicacao.appendChild(unidadeInfo);

    // Adicionar imagem, se houver
    const imagemInput = document.getElementById("imagemProduto");
    const arquivoImagem = imagemInput.files[0];
    if (arquivoImagem) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(arquivoImagem);
        img.style.maxWidth = "100px";
        img.style.cursor = "pointer";
        img.onclick = () => {
            const imgModal = document.createElement("div");
            imgModal.style.position = "fixed";
            imgModal.style.top = "0";
            imgModal.style.left = "0";
            imgModal.style.width = "100vw";
            imgModal.style.height = "100vh";
            imgModal.style.backgroundColor = "rgba(0,0,0,0.8)";
            imgModal.style.display = "flex";
            imgModal.style.alignItems = "center";
            imgModal.style.justifyContent = "center";
            imgModal.style.cursor = "zoom-out";
            imgModal.onclick = () => document.body.removeChild(imgModal);

            const imgGrande = document.createElement("img");
            imgGrande.src = img.src;
            imgGrande.style.maxWidth = "90%";
            imgGrande.style.maxHeight = "90%";
            imgModal.appendChild(imgGrande);

            document.body.appendChild(imgModal);
        };
        publicacao.appendChild(img);
    }
    const contactButton = document.createElement("button");
    contactButton.textContent = "Contatar Publicador";
    contactButton.classList.add("contact-button"); // Adiciona uma classe para estilização (CSS)
    contactButton.onclick = async () => { // Adicione 'async' aqui para usar await
        if (emailUsuario) {
            try {
                await navigator.clipboard.writeText(emailUsuario);
                alert(`E-mail do publicador copiado: ${emailUsuario}\nAgora você pode colar no seu cliente de e-mail.`);
            } catch (err) {
                // Caso a API de clipboard não esteja disponível ou haja erro
                alert(`Não foi possível copiar o e-mail automaticamente. Copie manualmente: ${emailUsuario}`);
                console.error('Erro ao copiar para a área de transferência:', err);
            }
        } else {
            alert("Não foi possível encontrar um e-mail de contato para este usuário.");
        }
    };
    publicacao.appendChild(contactButton);

    document.getElementById("publicacoes").prepend(publicacao);

    // Limpa os campos
    document.getElementById("textoPublicacao").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("unidade").value = "";
    imagemInput.value = "";  // limpa o campo da imagem
}

// Função para scroll no topo (como já tinha)
function irParaPrincipal() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSenha(idInput) {
    const input = document.getElementById(idInput);
    const btn = input.nextElementSibling;

    if (input.type === "password") {
        input.type = "text";
        btn.textContent = "Ocultar";
    } else {
        input.type = "password";
        btn.textContent = "Mostrar";
    }
}

function mostrarCadastro() {
    // Exibe os campos extras para cadastro
    document.getElementById("campoNomeUsuario").style.display = "block";
    document.getElementById("campoConfirmarSenha").style.display = "block";

    // Oculta botão cadastrar e login
    document.getElementById("btnCadastrar").style.display = "none";
    document.getElementById("btnLogin").style.display = "none";

    // Exibe o botão finalizar cadastro
    document.getElementById("btnFinalizarCadastro").style.display = "inline-block";
}

function finalizarCadastro() {
    const nomeUsuario = document.getElementById("nomeUsuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (!nomeUsuario || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não conferem.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: nomeUsuario
            });
        })
        .then(() => {
            alert("Cadastro realizado com sucesso!");
            mostrarPublicar();
        })
        .catch((error) => {
            alert("Erro no cadastro: " + error.message);
        });
}