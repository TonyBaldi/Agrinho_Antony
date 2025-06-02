function cadastrar() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
        alert("Preencha todos os campos.");
        return;
    }

    // Verifica se já existe
    if (localStorage.getItem("usuario_" + email)) {
        alert("Esse email já está cadastrado.");
        return;
    }

    const usuario = { email, senha };
    localStorage.setItem("usuario_" + email, JSON.stringify(usuario));
    alert("Cadastro realizado com sucesso!");
}

function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    document.getElementById("logoutBtn").style.display = "block";

    const usuarioSalvo = localStorage.getItem("usuario_" + email);

    if (!usuarioSalvo) {
        alert("Usuário não encontrado.");
        return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (usuario.senha !== senha) {
        alert("Senha incorreta.");
        return;
    }

    // Salva login atual
    localStorage.setItem("usuarioLogado", email);

    mostrarPublicar();
}

function mostrarPublicar() {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("publicarSection").style.display = "block";
    document.getElementById("logoutBtn").style.display = "block";
}

function logout() {
    localStorage.removeItem("usuarioLogado");
    document.getElementById("authSection").style.display = "block";
    document.getElementById("publicarSection").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
}

function publicar() {
    const texto = document.getElementById("textoPublicacao").value.trim();
    if (texto === "") {
        alert("Digite algo para publicar.");
        return;
    }

    const usuarioEmail = localStorage.getItem("usuarioLogado");

    const publicacao = document.createElement("div");
    publicacao.className = "publicacao";

    // Adiciona autor + texto
    const autor = document.createElement("p");
    autor.innerHTML = `<strong>Publicado por:</strong> ${usuarioEmail}`;
    autor.style.fontSize = "14px";
    autor.style.marginBottom = "5px";

    const conteudo = document.createElement("p");
    conteudo.textContent = texto;

    publicacao.appendChild(autor);
    publicacao.appendChild(conteudo);

    document.getElementById("publicacoes").prepend(publicacao);
    document.getElementById("textoPublicacao").value = "";
}


const publicacao = document.createElement("div");
publicacao.className = "publicacao";
publicacao.textContent = texto;

document.getElementById("publicacoes").prepend(publicacao);
document.getElementById("textoPublicacao").value = "";

// Verifica se usuário está logado ao carregar a página
window.onload = function () {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (usuarioLogado) {
    mostrarPublicar();
  } else {
    document.getElementById("logoutBtn").style.display = "none";
  }
};

function irParaPrincipal() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}