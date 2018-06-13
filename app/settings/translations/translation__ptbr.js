// @flow
export default {
    login: {
        emailAndPasswordMissing: 'Insira um endereço de email e uma senha',
        emailMissing: 'Insira um endereço de email',
        passwordMissing: 'Insira sua senha',
        passwordPlaceholder: 'Senha',
        emailPlaceholder: 'Informe sua e-mail',
        loginButton: 'Next',
        or: 'ou',
        fluigIdentityButton: 'Entrar usando',
        switchButton: 'Clique aqui para alterar',
        invalidEmail: 'E-mail inválido'
    },
    team: {
        teamNotExist: 'O time que você informou não existe',
        teamMissing: 'Por favor informe o domínio do seu time',
        teamPlaceholder: 'Informe sua equipe',
        nextButton: 'Proximo',
        createAccount: 'Criar Conta',
        reminder: 'Mande um lembrete'
    },
    home: {
        inviteCallout: 'Convide seu colega',
        searchPlaceholder: 'Pesquisar {{numberOfCompanies}} empresas',
        companiesListEmptyState: 'Adicione empresas para o seus favoritos pesquisando',
        stateListEmptyState: 'Carregando dados de estado',
        companiesListHeader: {
            counting: {
                one: '1 Favorito',
                other: '{{count}} Favoritos',
                zero: '0 Favoritos'
            }
        }
    },
    userAccount: {
        title: 'Conta',
        inviteButton: 'Convidar pessoas',
        feedbackButton: 'Enviar sugestões',
        logOutButton: 'Sair'
    },
    invite: {
        title: 'Convidar',
        sendButton: 'Enviar',
        to: 'Para',
        emailPlaceholder: 'adicione endereço de email',
        namePlaceholder: 'Nome',
        emptyState: 'Compartilhe este aplicativo com seus colegas para que eles possam começar a ter informações sobre seus dados!',
        success: 'Convite enviado com sucesso!'
    },
    updates: {
        title: 'Atualizações',
        emptyState: 'Nenhuma atualização das suas empresas favoritas',
        opportunities: 'Oportunidades',
        tickets: 'Tickets',
        general: 'Geral',
        nps: 'NPS',
        clear: 'Claro'
    },
    searchResults: {
        result: 'result',
        results: 'results',
        found: 'found',
        watchList: 'Watchlist'
    },
    companiesList: {
        customer: 'Cliente'
    },
    voice: {
        welcome: 'Oi, Como posso te ajudar?',
        question: 'Did I understand correctly?',
        thanks: 'Thank you for helping me to learn your language',
        detail: 'você quer ver mais detalhes sobre?',
        attr: 'Alunos com Risco',
        finan: 'Perda Financeira',
        enterMessage: 'Insira a mensagem ...',
        misUnderstand: 'Desculpa, eu não sei a resposta para esta pergunta'
    },
    companyDetail: {
        customer: 'Cliente',
        unknown: 'Desconhecido',
        cancel: 'Cancelar',
        submit: 'Enviar',
        numberOfEmployeesModal: {
            title: 'Qual o Número de Empregados para {{title}}?',
            optionGreater: 'Mais que 500'
        },
        revenueModal: {
            title: 'Qual o valor da Faturamento ($) para {{title}}?',
            optionLess: 'Menos que 5M',
            optionGreater: 'Mais que 1B'
        },
        tab: {
            overview: 'Informações básicas',
            insights: 'Detalhes do cliente'
        },
        opportunities: {
            row: {
                footer: 'Prioridade: {{priority}}'
            },
            emptyState: 'Nenhuma oportunidade',
            heading: 'Oportunidades',
            subHeading: 'Data de Encerramento Estimada'
        },
        tickets: {
            row: {
                footer: 'Criado: {{creationDate}}, Interações: {{internalInteractionsCount}}(I), {{externalInteractionsCount}}(E)'
            },
            emptyState: 'Nenhum ticket',
            heading: 'Tickets',
            subHeading: 'SLA'
        },
        summary: {
            taxId: 'CNPJ',
            dba: 'Nome Fantasia',
            activity: 'Atividade',
            numberOfEmployees: 'Número de Empregados',
            revenue: 'Faturamento',
            marketValue: 'Valor de Mercado',
            registerDate: 'Data de Registro',
            updateThis: 'Atualize isto',
            hasBeenEdited: 'Obrigado pela sua sugestão! Ela foi enviada para revisão e será atualizada assim que for verificada'
        },
        contact: {
            website: 'Website',
            email: 'Email',
            phone: 'Telefone',
            cannotOpen: 'Não pôde abrir {{value}}',
            copiedToClipboard: '{{value}} copiado para a área de transferência',
            open: 'Abrir',
            copy: 'Copiar',
            cancel: 'Cancelar',
            contact: 'Contato'
        },
        location: {
            goToRecord: 'Abrir Empresa',
            copyAddress: 'Copiar endereço',
            cancel: 'Cancelar',
            addressCopied: 'Endereço copiado para a área de transferência',
            otherLocations: 'Outras localidades',
            location: 'Endereço'
        },
        nps: {
            score: 'Score {{currentScore}}',
            lastUpdated: 'Última atualização: {{date}}',
            trend: 'Tendência'
        }
    },
    map: {
        title: 'Mapa'
    },
    date: {
        seconds: 'segundos',
        justNow: 'Agora Pouco'
    },
    searchFilter: {
        title: 'Set the {{category}} filters',
        revenue: 'Revenue',
        marketValue: 'Market Value',
        numberOfEmployees: 'Number of Employees',
        state: 'State',
        addAState: 'Add a state',
        situationDate: 'Situation Date',
        registeredDate: 'Registered Date',
        from: 'From',
        to: 'To',
        seeRecords: 'See {{count}} records'
    },
    searchFilterValues: {
        title: 'Filtros',
        clearAll: 'Pesquisar',
        search: 'Pesquisar {{filterName}}',
        confirm: {
            counting: {
                one: 'Confirmar 1 {{filterNameSingular}}',
                other: 'Confirmar {{count}} {{filterNamePlural}}',
                zero: 'Selecione filtros'
            }
        }
    },
    searchHome: {
        search: 'Search',
        exploreCategories: 'Explore categories',
        recentSearch: 'Recent Search',
        result: 'result',
        results: 'results',
        filters: 'Filters',
        lastUpdatedDate: 'Last Updated Date',
        to: 'to'
    },
    addState: {
        title: 'Add a state',
        ok: 'Ok'
    },
    hamburgerMenu: {
        title: 'Select a\nDashboard'
    }
};
