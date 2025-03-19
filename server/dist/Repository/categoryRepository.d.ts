import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { Icategory } from "../Model/categorySchema";
import { baseRepository } from "./baseRepo";
declare class categoryRespository extends baseRepository<Icategory> implements IcategoryRepository {
    constructor();
    findCategory(category: string): Promise<Icategory | null>;
    createCategory(category: string): Promise<Icategory | null>;
    categoryData(searchQuery: string, statusFilter: string, sortField: string, sortOrder: string, skip: number, limit: number): Promise<{
        category: Icategory[] | [];
        totalDoc: number;
    }>;
    allCategoryData(): Promise<Icategory[]>;
    editCategory(id: string, category: string): Promise<Icategory | null>;
    changeCategoryStatus(id: string): Promise<Icategory | null>;
}
declare const _default: categoryRespository;
export default _default;
//# sourceMappingURL=categoryRepository.d.ts.map