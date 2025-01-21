import { ICategoryRepository } from "../Interface/Category/ICategoryRepository";
import { ICategory } from "../Model/categorySchema";
import { BaseRepository } from "./baseRepo";
declare class CategoryRespository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor();
    dbFindCategory(category: string): Promise<ICategory | null>;
    dbCreateCategory(category: string): Promise<ICategory | null>;
    dbcategoryData(): Promise<ICategory[]>;
    dbEditCategory(id: string, category: string): Promise<ICategory | null>;
    dbChangeCategoryStatus(id: string): Promise<ICategory | null>;
}
declare const _default: CategoryRespository;
export default _default;
//# sourceMappingURL=categoryRepository.d.ts.map