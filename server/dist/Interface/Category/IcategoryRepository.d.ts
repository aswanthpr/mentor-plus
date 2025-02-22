import { ICategory } from "../../Model/categorySchema";
export interface ICategoryRepository {
    dbFindCategory(category: string): Promise<ICategory | null>;
    dbCreateCategory(category: string): Promise<ICategory | null>;
    dbcategoryData(): Promise<ICategory[]>;
    dbEditCategory(id: string, category: string): Promise<ICategory | null>;
    dbChangeCategoryStatus(id: string): Promise<ICategory | null>;
}
//# sourceMappingURL=IcategoryRepository.d.ts.map