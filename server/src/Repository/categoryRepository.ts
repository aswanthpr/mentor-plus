import { PipelineStage } from "mongoose";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import categorySchema, { Icategory } from "../Model/categorySchema";
import { baseRepository } from "./baseRepo";

class categoryRespository
  extends baseRepository<Icategory>
  implements IcategoryRepository
{
  constructor() {
    super(categorySchema);
  }

  async findCategory(category: string): Promise<Icategory | null> {
    try {
      return await this.find_One({ category });
    } catch (error: unknown) {
      throw new Error(
        `error while find category in repository ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async createCategory(category: string): Promise<Icategory | null> {
    try {
      return await this.createDocument({ category });
    } catch (error: unknown) {
      throw new Error(
        `error while create category in repository ${
          error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }

  async categoryData(
    searchQuery: string,
    statusFilter: string,
    sortField: string,
    sortOrder: string,
    skip: number,
    limit: number
  ): Promise<{category:Icategory[]|[],totalDoc:number}> {
    try {
console.log( searchQuery, statusFilter, sortField, sortOrder, limit,skip)        
      const pipeline: PipelineStage[] = [];

      if (searchQuery) {
        pipeline.push({
          $match: { category: { $regex: searchQuery, $options: "i" } },
        });
      }
      if (statusFilter !== "all") {
        pipeline.push({
          $match: { isBlocked: statusFilter === "blocked" },
        });
      }
     // Sorting Logic
    if (sortField === "atoz" || sortField === "ztoa") {
        const sortOrderValue = sortField === "atoz" ? 1 : -1;
        pipeline.push({ $sort: { category: sortOrderValue } });
      } else {
        // Default Sorting 
        pipeline.push({ $sort: { createdAt: sortOrder === "asc" ? 1 : -1 } });
      }
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });
      const countPipeline = [
        ...JSON.parse(JSON.stringify(pipeline)).slice(0, -2),
        { $count: "totalDocuments" },
      ];
      const [category, totalCount] = await Promise.all([
        this.aggregateData(categorySchema, pipeline),
        categorySchema.aggregate(countPipeline),
      ]);
      return {
        category,
        totalDoc: totalCount?.[0]?.totalDocuments || 0,
      };
     
    } catch (error: unknown) {
      throw new Error(
        `error while getting category Data in repository ${
          error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }
  async allCategoryData(): Promise<Icategory[]> {
    try {
      return await this.find(categorySchema, {});
    } catch (error: unknown) {
      throw new Error(
        `error while getting category Data in repository ${
          error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }

  //editing category;
  async editCategory(id: string, category: string): Promise<Icategory | null> {
    try {
      return await this.find_By_Id_And_Update(categorySchema, id, {
        $set: { category: category },
      });
    } catch (error: unknown) {
      throw new Error(
        `error while editing category  in repository ${
          error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }

  async changeCategoryStatus(id: string): Promise<Icategory | null> {
    try {
      return await this.find_By_Id_And_Update(categorySchema, id, [
        { $set: { isBlocked: { $not: "$isBlocked" } } },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `error while change category status in repository ${
          error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }
}
export default new categoryRespository();
