import { Icategory } from "../../Model/categorySchema";
export interface IcategoryRepository {
    findCategory(category: string): Promise<Icategory | null>;
    createCategory(category: string): Promise<Icategory | null>;
    categoryData(): Promise<Icategory[]>;
    editCategory(id: string, category: string): Promise<Icategory | null>;
    changeCategoryStatus(id: string): Promise<Icategory | null>;
}
//# sourceMappingURL=iCategoryRepository.d.ts.map