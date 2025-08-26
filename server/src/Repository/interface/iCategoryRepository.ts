import { Icategory } from "../../Model/categorySchema"

export interface IcategoryRepository {
    findCategory(category: string): Promise<Icategory | null>;
    createCategory(category: string): Promise<Icategory | null>;
    categoryData(
        searchQuery: string,
        statusFilter: string,
        sortField: string,
        sortOrder: string,
        page: number,
        limit: number
    ): Promise<{category:Icategory[]|[],totalDoc:number}>;
    allCategoryData(): Promise<Icategory[]>
    editCategory(id: string, category: string): Promise<Icategory | null>
    changeCategoryStatus(id: string): Promise<Icategory | null>;

}