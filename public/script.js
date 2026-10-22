document.addEventListener("DOMContentLoaded", () => {
    carregarObras();

    const form = document.getElementById("formObra");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (validarFormulario()) {
            const novaObra = {
                id: Date.now(),
                nome: document.getElementById("nome").value,
                autor: document.getElementById("autor").value,
                ano: document.getElementById("ano").value,
                periodo: document.getElementById("periodo").value,
                tipo: document.getElementById("tipo").value,
                detalhamento: document.getElementById("detalhamento").value
            };

            try {
                const response = await fetch('/obras', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novaObra)
                });

                if (response.ok) {
                    form.reset();
                    limparBordas();
                    carregarObras();
                }
            } catch (error) {
                console.error("Erro ao salvar obra:", error);
            }
        }
    });
});

function limparErros() {
    document.getElementById("mensagensErro").innerHTML = "";
}

function limparBordas() {
    const campos = document.querySelectorAll("input, select, textarea");
    campos.forEach(campo => campo.style.borderColor = "#ccc");
}

function validarFormulario() {
    limparErros();
    limparBordas();

    const nome = document.getElementById("nome");
    const autor = document.getElementById("autor");
    const ano = document.getElementById("ano");
    const periodo = document.getElementById("periodo");
    const tipo = document.getElementById("tipo");

    let erros = [];

    if (nome.value.trim().length < 6) {
        erros.push("O nome da obra deve ter no mínimo 6 caracteres.");
        nome.style.borderColor = "red";
    }

    if (autor.value.trim().length < 10) {
        erros.push("O nome do autor deve ter no mínimo 10 caracteres.");
        autor.style.borderColor = "red";
    }

    if (!ano.value.trim() || isNaN(ano.value) || ano.value.length > 4) {
        erros.push("O ano da obra deve ser um número válido de até 4 dígitos.");
        ano.style.borderColor = "red";
    }

    if (periodo.value === "") {
        erros.push("Selecione um período válido.");
        periodo.style.borderColor = "red";
    }

    if (tipo.value === "") {
        erros.push("Selecione um tipo válido.");
        tipo.style.borderColor = "red";
    }

    if (erros.length > 0) {
        const ulErros = document.getElementById("mensagensErro");
        erros.forEach(erro => {
            const li = document.createElement("li");
            li.textContent = erro;
            ulErros.appendChild(li);
        });
        return false;
    }

    return true;
}

async function carregarObras() {
    try {
        const response = await fetch('/obras');
        const obras = await response.json();
        
        const tbody = document.getElementById("corpoTabela");
        tbody.innerHTML = "";

        obras.forEach(obra => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${obra.nome}</td>
                <td>${obra.autor}</td>
                <td>${obra.ano}</td>
                <td>${obra.periodo}</td>
                <td>${obra.tipo}</td>
                <td><button type="button" onclick="excluirObra(event, ${obra.id})">Excluir</button></td>
            `;

            tr.addEventListener("click", () => {
                const painel = document.getElementById("painelDetalhes");
                const texto = document.getElementById("detalhamentoSelecionado");
                texto.textContent = obra.detalhamento ? obra.detalhamento : "Nenhum detalhamento informado.";
                painel.style.display = "block";
            });

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar obras:", error);
    }
}

async function excluirObra(event, id) {
    event.stopPropagation();

    if (confirm("Deseja realmente excluir esta obra?")) {
        try {
            const response = await fetch(`/obras/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                carregarObras();
                document.getElementById("painelDetalhes").style.display = "none";
            }
        } catch (error) {
            console.error("Erro ao excluir obra:", error);
        }
    }
}