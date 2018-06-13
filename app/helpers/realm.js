// @flow
import Realm from 'realm';

export default new Realm({
    schemaVersion: 3,
    schema: [
        {
            name: 'User',
            properties: {
                username: 'string',
                password: 'string',
                accessToken: 'string',
                loginType: 'string',
                selectedMenu: {
                    type: 'string',
                    optional: true
                },
                name: {
                    type: 'string',
                    optional: true
                },
                imagePath: {
                    type: 'string',
                    optional: true
                },
                tenantSubDomain: {
                    type: 'string',
                    optional: true
                },
                loggedIn: 'bool',
                requestedNotification: 'bool'
            }
        },
        {
            name: 'Address',
            properties: {
                address1: 'string',
                address2: {
                    type: 'string',
                    optional: true
                },
                address3: {
                    type: 'string',
                    optional: true
                },
                addressType: {
                    type: 'string',
                    optional: true
                },
                city: {
                    type: 'string',
                    optional: true
                },
                country: {
                    type: 'string',
                    optional: true
                },
                state: {
                    type: 'string',
                    optional: true
                },
                zipcode: {
                    type: 'string',
                    optional: true
                },
                latitude: {
                    type: 'double',
                    optional: true
                },
                longitude: {
                    type: 'double',
                    optional: true
                }
            }
        },
        {
            name: 'Company',
            properties: {
                favorite: 'bool',
                name: 'string',
                dba: {
                    type: 'string',
                    optional: true
                },
                cnaebr: {
                    type: 'string',
                    optional: true
                },
                taxId: {
                    type: 'string',
                    optional: true
                },
                registerDate: {
                    type: 'string',
                    optional: true
                },
                marketValue: {
                    type: 'string',
                    optional: true
                },
                homePage: {
                    type: 'string',
                    optional: true
                },
                revenue: {
                    type: 'string',
                    optional: true
                },
                numberOfEmployees: {
                    type: 'string',
                    optional: true
                },
                user: 'User',
                industry: {
                    type: 'Industry',
                    optional: true
                },
                mainActivity: 'Activity',
                secondaryActivities: {
                    type: 'list',
                    objectType: 'Activity'
                },
                customer: {
                    type: 'Customer',
                    optional: true
                },
                addresses: {
                    type: 'list',
                    objectType: 'Address'
                },
                emails: {
                    type: 'list',
                    objectType: 'Email'
                },
                phones: {
                    type: 'list',
                    objectType: 'Phone'
                },
                lastViewed: {
                    type: 'date',
                    optional: true
                },
                mdmData: 'MdmData'
            }
        },
        {
            name: 'Update',
            properties: {
                id: 'string',
                recordId: 'string',
                type: 'string',
                title: 'string',
                description: 'string',
                unread: 'bool',
                createdAt: 'date',
                user: 'User'
            }
        },
        {
            name: 'Customer',
            properties: {
                taxId: 'string',
                companyCode: 'string',
                homePage: {
                    type: 'string',
                    optional: true
                },
                mdmData: 'MdmData'
            }
        },
        {
            name: 'Activity',
            properties: {
                description: 'string'
            }
        },
        {
            name: 'Industry',
            properties: {
                description: 'string'
            }
        },
        {
            name: 'Email',
            properties: {
                emailAddress: 'string',
                emailType: {
                    type: 'string',
                    optional: true
                }
            }
        },
        {
            name: 'Phone',
            properties: {
                phoneNumber: 'string',
                phoneType: {
                    type: 'string',
                    optional: true
                }
            }
        },
        {
            name: 'FluigData',
            properties: {
                numberOfCompanies: 'int'
            }
        },
        {
            name: 'Team',
            properties: {
                teamName: 'string'
            }
        },
        {
            name: 'Stats',
            properties: {
                data: 'string'
            }
        },
        {
            name: 'MdmData',
            properties: {
                id: 'string',
                entityTemplateId: 'string'
            }
        },
        {
            name: 'Insights',
            properties: {
                id: 'string',
                label: 'string',
                accessType: 'string',
                namedQueryName: 'string',
                config: 'string'
            }
        }]
});
