class ProdutosTable {
    constructor(containerId) {
        this.container = $(`#${containerId}`);
        this.produtos = [];
        this.unidadesMedida = ['Unidade', 'Kg', 'g', 'L', 'mL', 'm', 'cm', 'm²', 'm³'];
    }

    async render() {
        const template = await $.get('./src/components/produtosTable/produtosTable.html');
        this.container.html(template);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.container.on('click', '#adicionarProduto', this.adicionarProduto.bind(this));
        this.container.on('input', '.quantidade, .valorUnitario', this.calcularValorTotal.bind(this));
        this.container.on('click', '.removerProduto', this.removerProduto.bind(this));
        this.container.on('change', '.produtoImagem', this.handleImagemUpload.bind(this));
    }

    adicionarProduto() {
        const unidadesMedidaOptions = this.unidadesMedida.map(um => `<option value="${um}">${um}</option>`).join('');
        const newRow = $(`
            <tr>
                <td rowspan="2">
                    <img src="./public/assets/imagens/produto.svg" class="img-thumbnail produtoImagemPreview" style="max-width: 100px; max-height: 100px;">
                    <input type="file" class="form-control-file produtoImagem" style="display: none;">
                </td>
                <td colspan="2">
                    <input type="text" class="form-control produto" placeholder="Produto" required>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="row">
                        <div class="col">
                            <select class="form-control unidadeMedida" required>
                                <option value="">Selecione a unidade</option>
                                ${unidadesMedidaOptions}
                            </select>
                        </div>
                        <div class="col">
                            <input type="number" class="form-control quantidade" placeholder="Quantidade" required>
                        </div>
                        <div class="col">
                            <input type="number" class="form-control valorUnitario" placeholder="Valor Unitário" required>
                        </div>
                        <div class="col">
                            <input type="number" class="form-control valorTotal" placeholder="Valor Total" readonly>
                        </div>
                    </div>
                </td>
                <td>
                    <button type="button" class="btn btn-danger removerProduto">Remover</button>
                </td>
            </tr>
        `);
        $('#produtosTable tbody').append(newRow);
    }

    calcularValorTotal(event) {
        const row = $(event.target).closest('tr');
        const quantidade = parseFloat(row.find('.quantidade').val()) || 0;
        const valorUnitario = parseFloat(row.find('.valorUnitario').val()) || 0;
        row.find('.valorTotal').val((quantidade * valorUnitario).toFixed(2));
    }

    removerProduto(event) {
        $(event.target).closest('tr').prev().remove();
        $(event.target).closest('tr').remove();
    }

    handleImagemUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        const imgPreview = $(event.target).siblings('.produtoImagemPreview');

        reader.onload = function (e) {
            imgPreview.attr('src', e.target.result);
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    getData() {
        const produtos = [];
        $('#produtosTable tbody tr:nth-child(odd)').each(function (index, element) {
            const produtoRow = $(element);
            const detalhesRow = produtoRow.next();

            produtos.push({
                imagem: produtoRow.find('.produtoImagemPreview').attr('src'),
                produto: produtoRow.find('.produto').val(),
                unidadeMedida: detalhesRow.find('.unidadeMedida').val(),
                quantidade: parseFloat(detalhesRow.find('.quantidade').val()),
                valorUnitario: parseFloat(detalhesRow.find('.valorUnitario').val()),
                valorTotal: parseFloat(detalhesRow.find('.valorTotal').val())
            });
        });
        return produtos;
    }
}