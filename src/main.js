$(document).ready(async function () {
    const fornecedorInfo = new FornecedorInfo('fornecedorInfoContainer');
    const produtosTable = new ProdutosTable('produtosTableContainer');
    const anexosTable = new AnexosTable('anexosTableContainer');

    await fornecedorInfo.render();
    await produtosTable.render();
    await anexosTable.render();

    $('#fornecedorForm').on('submit', function (e) {
        e.preventDefault();

        if (!fornecedorInfo.validateAllFields()) {
            alert('Por favor, corrija os erros no formulário antes de enviar.');
            return;
        }

        if (produtosTable.getData().length === 0) {
            alert('Adicione pelo menos um produto.');
            return;
        }

        if (anexosTable.getData().length === 0) {
            alert('Adicione pelo menos um anexo.');
            return;
        }

        const fornecedor = {
            ...fornecedorInfo.getData(),
            produtos: produtosTable.getData(),
            anexos: anexosTable.getData()
        };

        $('#loadingModal').modal('show');

        console.log(JSON.stringify(fornecedor, null, 2));

        const jsonString = JSON.stringify(fornecedor, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'fornecedor.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setTimeout(() => {
            $('#loadingModal').modal('hide');
            alert('Fornecedor salvo com sucesso!');
            location.reload(); 
        }, 2000);
    });
});