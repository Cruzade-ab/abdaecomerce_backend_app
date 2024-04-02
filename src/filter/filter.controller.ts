import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { FilterService } from './filter.service';
import { GeneralProductDTO } from 'src/dto/products_dto';

@Injectable()
@Controller('/api/filter')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  async filterProducts(
    @Query('brand') brand?: string,
    @Query('color') color?: string,
    @Query('section') section?: string,
    @Query('min_value') minValue?: number,
    @Query('max_value') maxValue?: number,
): Promise<GeneralProductDTO[]> {
    return this.filterService.filterProducts({ brand, color, section, minValue, maxValue });
}

  @Get('brands')
  async getBrands(){
    return this.filterService.getAllBrands()
  }
  @Get('colors')
  async getColors(){
    return this.filterService.getAllColors()
  }


  @Get('sections')
  async getSections(){
    return this.filterService.getAllSections()
    
  }


}
