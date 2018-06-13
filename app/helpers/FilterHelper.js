// @flow
import Company from '../models/Company';

export const filterName = {
    companyFlag: 'companyFlag',
    mainActivity: 'mainActivity',
    revenue: 'revenue',
    numberOfEmployees: 'numberOfEmployees',
    address: 'address'
};

export type Filter = {
    name: string,
    value: any
}

class FilterHelper {
    static applyFiltersToCompanies (filters: Filter[], companies: Object[]) {
        let filteredCompanies = companies;

        const companyFlagFilters = filters.filter((filter) => filter.name === filterName.companyFlag);

        if (companyFlagFilters.length > 0) {
            filteredCompanies = filteredCompanies.filter((company) => (
                companyFlagFilters.some((filter) => {
                    switch (filter.value) {
                        case 'hq':
                            return Company.isHQ(company);
                        case 'customer':
                            return company.customer;
                    }
                })
            ));
        }

        return filteredCompanies.filter((company) => {
            const mainActivityFilters = filters.filter((filter) => filter.name === filterName.mainActivity);

            if (mainActivityFilters.length > 0) {
                return mainActivityFilters.some((filter) => company.mainActivity && filter.value === company.mainActivity.description);
            }

            const revenueFilters = filters.filter((filter) => filter.name === filterName.revenue);

            if (revenueFilters.length > 0) {
                return revenueFilters.some((filter) => company.revenue && filter.value === company.revenue);
            }

            const numberOfEmployeesFilters = filters.filter((filter) => filter.name === filterName.numberOfEmployees);

            if (numberOfEmployeesFilters.length > 0) {
                return numberOfEmployeesFilters.some((filter) => company.numberOfEmployees && filter.value === company.numberOfEmployees);
            }

            const addressFilters = filters.filter((filter) => filter.name === filterName.address);

            if (addressFilters.length > 0) {
                return addressFilters.some((filter) => company.addresses[0] && filter.value.city === company.addresses[0].city && filter.value.state === company.addresses[0].state);
            }

            return true;
        });
    }
}

export default FilterHelper;
