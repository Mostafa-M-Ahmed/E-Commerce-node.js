export class ApiFeatures {
    // query
    constructor(mongooseQuery, query) {
        this.query = query;
        this.mongooseQuery = mongooseQuery;
    }

    // sort
    sort() {
        this.mongooseQuery.sort(this.query.sort);
        return this;
    }

    // pagination
    pagination() {
        const { page = 1, limit = 5 } = this.query;
        const skip = (page - 1) * limit;
        const options = {
            page,
            limit,
            skip,
        };
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }

    // filters
    filters() {
        const { page = 1, limit = 5, sort, ...filters } = this.query;
        const filtersAsString = JSON.stringify(filters);
        const replacedFilters = filtersAsString.replaceAll(
            /lt|gt|lte|gte|regex|ne|eq/g,
            (ele) => `$${ele}`
        );
        const parsedFilters = JSON.parse(replacedFilters)

        this.mongooseQuery.find(parsedFilters)

        return this;
    }
}