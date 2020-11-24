import { Category } from './../services/category.interface';
import { getCategories } from './../services/categories';
import React from "react";

const useCategories = () => {

    const [categories, categoriesSet] = React.useState<Category[]>();

    React.useEffect(() => {
        getCategories().then(data => {
            categoriesSet(data);
        });
    }, []);

    return categories;
};

export default useCategories;