document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("cadastroForm").addEventListener("submit", function (event) {
        event.preventDefault();
        validarFormulario();
    });

    const celularInput = document.getElementById("celular");
    celularInput.addEventListener("input", function () {
        let value = celularInput.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length >= 2) value = "(" + value.slice(0, 2) + ") " + value.slice(2);
        if (value.length >= 10) value = value.slice(0, 10) + "-" + value.slice(10);
        celularInput.value = value;
    });

    document.getElementById("dataNascimento").addEventListener("input", function () {
        verificarMenorIdade(this.value);
    });
});

function validarFormulario() {
    let telefoneFixo = document.getElementById("telefoneFixo")?.value.trim();
    let celular = document.getElementById("celular")?.value.trim();
    let cep = document.getElementById("cep")?.value.trim();
    let senha = document.getElementById("senha")?.value.trim();
    let confirmarSenha = document.getElementById("confirmarSenha")?.value.trim();
    let dataNascimento = document.getElementById("dataNascimento")?.value;
    let nomePai = document.getElementById("nomePai")?.value.trim();
    let nomeMae = document.getElementById("nomeMae")?.value.trim();
    let erros = 0;

    limparMensagensErro();

    // Validação Telefone Fixo (Formato: (XX) XXXX-XXXX)
    if (!/^\(\d{2}\) \d{4}-\d{4}$/.test(telefoneFixo)) {
        mostrarErro("telefoneFixo", "Formato inválido. Use (XX) XXXX-XXXX.");
        erros++;
    }

    // Validação Celular (aceita fixo ou celular)
    if (!/^\(\d{2}\)\s?(?:9\d{4}|\d{4})-\d{4}$/.test(celular)) {
        mostrarErro("celular", "Formato inválido. Use (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX.");
        erros++;
    }

    // Validação CEP (Formato: 12345-678 ou apenas números)
    if (!/^\d{5}-\d{3}$/.test(cep) && !/^\d{8}$/.test(cep)) {
        mostrarErro("cep", "Formato inválido. Use XXXXX-XXX ou apenas números.");
        erros++;
    }

    // Validação Senha
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(senha)) {
        mostrarErro("senha", "A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.");
        erros++;
    }

    if (senha !== confirmarSenha) {
        mostrarErro("confirmarSenha", "As senhas não coincidem.");
        erros++;
    }

    // Validação Menor de Idade
    if (dataNascimento) {
        let idade = calcularIdade(dataNascimento);
        if (idade < 18) {
            if (!nomePai) {
                mostrarErro("nomePai", "Obrigatório para menores de idade.");
                erros++;
            }
            if (!nomeMae) {
                mostrarErro("nomeMae", "Obrigatório para menores de idade.");
                erros++;
            }
        }
    }

    if (erros === 0) {
        alert("Cadastro realizado com sucesso!");
        document.getElementById("cadastroForm").reset();
        document.getElementById("infoMenor").style.display = "none";
    }
}

function mostrarErro(id, mensagem) {
    let campo = document.getElementById(id);
    if (!campo) return;

    let erro = campo.nextElementSibling;

    if (!erro || !erro.classList.contains("erro")) {
        erro = document.createElement("span");
        erro.classList.add("erro");
        campo.parentNode.appendChild(erro);
    }

    erro.textContent = mensagem;
    campo.style.borderColor = "red";
}

function limparMensagensErro() {
    document.querySelectorAll(".erro").forEach(e => e.remove());
    document.querySelectorAll("input").forEach(i => i.style.borderColor = "#ccc");
}

function calcularIdade(data) {
    let nascimento = new Date(data);
    let hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    let mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

function verificarMenorIdade(data) {
    const idade = calcularIdade(data);
    const infoMenor = document.getElementById("infoMenor");
    if (idade < 18) {
        infoMenor.style.display = "block";
    } else {
        infoMenor.style.display = "none";
    }
}
