class AnexosTable {
    constructor(containerId) {
        this.container = $(`#${containerId}`);
        this.anexos = [];
    }

    async render() {
        const template = await $.get('./src/components/anexosTable/anexosTable.html');
        this.container.html(template);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.container.on('click', '#adicionarAnexo', this.adicionarAnexo.bind(this));
        this.container.on('click', '.visualizarAnexo', (e) => this.visualizarAnexo($(e.target).data('index')));
        this.container.on('click', '.removerAnexo', (e) => this.removerAnexo($(e.target).data('index')));
    }

    adicionarAnexo() {
        const file = $('#anexoInput')[0].files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const anexo = {
                    nome: file.name,
                    conteudo: e.target.result,
                    type: file.type
                };
                this.anexos.push(anexo);
                this.atualizarTabelaAnexos();
                $('#anexoInput').val('');
            };
            reader.readAsArrayBuffer(file);
        }
    }

    atualizarTabelaAnexos() {
        const tbody = $('#anexosTable tbody');
        tbody.empty();
        this.anexos.forEach((anexo, index) => {
            tbody.append(`
                <tr>
                    <td>${anexo.nome}</td>
                    <td>
                        <button type="button" class="btn btn-info visualizarAnexo" data-index="${index}">Visualizar</button>
                        <button type="button" class="btn btn-danger removerAnexo" data-index="${index}">Remover</button>
                    </td>
                </tr>
            `);
        });
    }

    visualizarAnexo(index) {
        const anexo = this.anexos[index];
        const arrayBufferView = new Uint8Array(anexo.conteudo);
        const blob = new Blob([arrayBufferView], { type: anexo.type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = anexo.nome;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    removerAnexo(index) {
        this.anexos.splice(index, 1);
        this.atualizarTabelaAnexos();
    }

    getData() {
        return this.anexos;
    }
}