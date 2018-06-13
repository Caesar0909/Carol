// @flow
export default {
    login: {
        emailAndPasswordMissing: 'Please enter an email address and password',
        emailMissing: 'Please enter an email address',
        passwordMissing: 'Please enter a password',
        passwordPlaceholder: 'Password',
        emailPlaceholder: 'Inform your e-mail',
        loginButton: 'Next',
        or: 'or',
        fluigIdentityButton: 'Login with',
        switchButton: 'Click here to switch',
        invalidEmail: 'Invalid Email'
    },
    team: {
        teamNotExist: 'Team you provided does not exist',
        teamMissing: 'Please enter a team domain',
        teamPlaceholder: 'Inform your team',
        nextButton: 'Next',
        createAccount: 'Create account',
        reminder: 'Send Reminder'
    },
    home: {
        inviteCallout: 'Invite your colleague',
        searchPlaceholder: 'Search {{numberOfCompanies}} companies',
        companiesListEmptyState: 'Add companies to your favorites by searching',
        stateListEmptyState: 'Loading state data',
        companiesListHeader: {
            counting: {
                one: '1 Favorite',
                other: '{{count}} Favorites',
                zero: '0 Favorites'
            }
        }
    },
    userAccount: {
        title: 'Account',
        inviteButton: 'Invite others',
        feedbackButton: 'Provide feedback',
        logOutButton: 'Log out'
    },
    invite: {
        title: 'Invite',
        sendButton: 'Send',
        to: 'To',
        emailPlaceholder: 'add email address',
        namePlaceholder: 'Name',
        emptyState: 'Share this app with your colleagues so they start getting insights from their data!',
        success: 'Invitation sent successfully!'
    },
    updates: {
        title: 'Updates',
        emptyState: 'No updates from your favorite companies',
        opportunities: 'Opportunities',
        tickets: 'Tickets',
        general: 'General',
        nps: 'NPS',
        clear: 'Clear'
    },
    searchResults: {
        result: 'result',
        results: 'results',
        found: 'found',
        watchList: 'Watchlist'
    },
    companiesList: {
        customer: 'Customer'
    },
    voice: {
        welcomeHeading: 'Hi, how can I help?',
        welcomeBody: 'You can tap on the microphone or text your question',
        question: 'Did I understand correctly?',
        thanks: 'Thank you for helping me to learn your language',
        detail: 'Do you want to see more details about?',
        attr: 'Attrition Risk Score',
        finan: 'Financial Loss',
        enterMessage: 'How can I help you?',
        commonQuestion: 'Why don\'t you ask:',
        misUnderstand: 'Sorry, I don\'t know the answer for that question'
    },
    companyDetail: {
        customer: 'Customer',
        unknown: 'Unknown',
        cancel: 'Cancel',
        submit: 'Submit',
        numberOfEmployeesModal: {
            title: 'What is the Number of Employees for {{title}}?',
            optionGreater: 'Greater than 500'
        },
        revenueModal: {
            title: 'What is the value of Revenue ($) for {{title}}?',
            optionLess: 'Less than 5M',
            optionGreater: 'Greater than 1B'
        },
        tab: {
            overview: 'Basic info',
            insights: 'Customer detail'
        },
        opportunities: {
            row: {
                footer: 'Priority: {{priority}}'
            },
            emptyState: 'No opportunities',
            heading: 'Opportunities',
            subHeading: 'Expected Close Date'
        },
        tickets: {
            row: {
                footer: 'Created: {{creationDate}}, Interactions: {{internalInteractionsCount}}(I), {{externalInteractionsCount}}(E)'
            },
            emptyState: 'No tickets',
            heading: 'Tickets',
            subHeading: 'SLA'
        },
        summary: {
            taxId: 'Tax ID',
            dba: 'Doing Business As',
            activity: 'Activity',
            numberOfEmployees: 'Number of Employees',
            revenue: 'Revenue',
            marketValue: 'Market Value',
            registerDate: 'Register Date',
            updateThis: 'Update this',
            hasBeenEdited: 'Thank you for your suggested information! It has been sent for review and will be updated once it has been verified'
        },
        contact: {
            website: 'Website',
            email: 'Email',
            phone: 'Phone',
            cannotOpen: 'Cannot open {{value}}',
            copiedToClipboard: '{{value}} copied to clipboard',
            open: 'Open',
            copy: 'Copy',
            cancel: 'Cancel',
            contact: 'Contact'
        },
        location: {
            goToRecord: 'Go to Company',
            copyAddress: 'Copy address',
            cancel: 'Cancel',
            addressCopied: 'Address copied to clipboard',
            otherLocations: 'Other locations',
            location: 'Location'
        },
        nps: {
            score: 'Score {{currentScore}}',
            lastUpdated: 'Last updated: {{date}}',
            trend: 'Trend'
        }
    },
    map: {
        title: 'Map'
    },
    date: {
        seconds: 'seconds',
        justNow: 'Just Now'
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
        title: 'Filters',
        clearAll: 'Search',
        search: 'Search {{filterName}}',
        confirm: {
            counting: {
                one: 'Confirm 1 {{filterNameSingular}}',
                other: 'Confirm {{count}} {{filterNamePlural}}',
                zero: 'Select filters'
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
