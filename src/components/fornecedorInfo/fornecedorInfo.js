class FornecedorInfo {
    constructor(containerId) {
        this.container = $(`#${containerId}`);
        this.validations = {
            razaoSocial: {
                validator: (value) => value.trim().length > 0,
                message: 'Razão Social é obrigatória.'
            },
            nomeFantasia: {
                validator: (value) => value.trim().length > 0,
                message: 'Nome Fantasia é obrigatório.'
            },
            cnpj: {
                validator: (value) => /^\d{14}$/.test(value.replace(/\D/g, '')),
                message: 'CNPJ inválido. Deve conter 14 dígitos numéricos.'
            },
            cep: {
                validator: (value) => /^\d{8}$/.test(value.replace(/\D/g, '')),
                message: 'CEP inválido. Deve conter 8 dígitos numéricos.'
            },
            endereco: {
                validator: (value) => value.trim().length > 0,
                message: 'Endereço é obrigatório.'
            },
            contatoNome: {
                validator: (value) => value.trim().length > 0,
                message: 'Nome de contato é obrigatório.'
            },
            telefone: {
                validator: (value) => /^\d{10,11}$/.test(value.replace(/\D/g, '')),
                message: 'Telefone inválido. Deve conter 10 ou 11 dígitos numéricos.'
            },
            email: {
                validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'E-mail inválido.'
            }   
        };
    }

    async render() {
        const template = await $.get('./src/components/fornecedorInfo/fornecedorInfo.html');
        this.container.html(template);
        this.setupEventListeners();
    }

    setupEventListeners() {
        $('#cep').on('blur', this.buscarCEP.bind(this));
        
        Object.keys(this.validations).forEach(fieldName => {
            $(`#${fieldName}`).on('blur', () => this.validateField(fieldName));
        });

        this.container.on('click', '.produtoImagemPreview', function() {
            $(this).siblings('.produtoImagem').click();
        });
    }

    async buscarCEP() {
        const cep = $('#cep').val().replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const data = await $.getJSON(`https://viacep.com.br/ws/${cep}/json/`);
                if (!data.erro) {
                    $('#endereco').val(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
                    $('#endereco').prop('readonly', true);
                    this.setFieldValidState('cep', true);
                    this.validateField('endereco');
                } else {
                    $('#endereco').val('');
                    $('#endereco').prop('readonly', false);
                    this.setFieldValidState('cep', false, 'CEP não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                $('#endereco').val('');
                $('#endereco').prop('readonly', false);
                this.setFieldValidState('cep', false, 'Erro ao buscar CEP.');
            }
        } else {
            $('#endereco').val('');
            $('#endereco').prop('readonly', false);
            this.setFieldValidState('cep', false, 'CEP inválido.');
        }
    }

    validateField(fieldName) {
        const field = $(`#${fieldName}`);
        const value = field.val();
        const validation = this.validations[fieldName];

        if (validation && validation.validator(value)) {
            this.setFieldValidState(fieldName, true);
            return true;
        } else {
            this.setFieldValidState(fieldName, false, validation ? validation.message : 'Campo inválido.');
            return false;
        }
    }

    setFieldValidState(fieldName, isValid, errorMessage = '') {
        const field = $(`#${fieldName}`);
        const feedbackElement = field.siblings('.invalid-feedback');

        field.removeClass('is-valid is-invalid');
        field.addClass(isValid ? 'is-valid' : 'is-invalid');

        if (!isValid) {
            if (feedbackElement.length === 0) {
                field.after(`<div class="invalid-feedback">${errorMessage}</div>`);
            } else {
                feedbackElement.text(errorMessage);
            }
        }
    }

    validateAllFields() {
        let isValid = true;
        Object.keys(this.validations).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }

    getData() {
        return {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            cep: $('#cep').val(),
            endereco: $('#endereco').val(),
            contatoNome: $('#contatoNome').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val()
        };
    }
}