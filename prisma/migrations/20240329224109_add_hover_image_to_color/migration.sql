/*
  Warnings:

  - You are about to drop the column `brand_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `section_id` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[brand_id]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[color_id]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[color_name]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_order_id]` on the table `Product_Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_id]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[section_name]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[size_id]` on the table `Size` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[size_type]` on the table `Size` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[size_amount_id]` on the table `Size_Amount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `general_product_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_section_id_fkey";

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "hover_image_url" TEXT,
ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "brand_id",
DROP COLUMN "description",
DROP COLUMN "image_url",
DROP COLUMN "section_id",
ADD COLUMN     "general_product_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role_id" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "GeneralProduct" (
    "general_product_id" SERIAL NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "general_product_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GeneralProduct_pkey" PRIMARY KEY ("general_product_id")
);

-- CreateTable
CREATE TABLE "WantedProduct" (
    "general_product_id" INTEGER NOT NULL,
    "most_wanted_product_count" INTEGER NOT NULL,

    CONSTRAINT "WantedProduct_pkey" PRIMARY KEY ("general_product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_brand_id_key" ON "Brand"("brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "Color_color_id_key" ON "Color"("color_id");

-- CreateIndex
CREATE UNIQUE INDEX "Color_color_name_key" ON "Color"("color_name");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_id_key" ON "Order"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_id_key" ON "Product"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_Order_product_order_id_key" ON "Product_Order"("product_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_id_key" ON "Role"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "Section_section_name_key" ON "Section"("section_name");

-- CreateIndex
CREATE UNIQUE INDEX "Size_size_id_key" ON "Size"("size_id");

-- CreateIndex
CREATE UNIQUE INDEX "Size_size_type_key" ON "Size"("size_type");

-- CreateIndex
CREATE UNIQUE INDEX "Size_Amount_size_amount_id_key" ON "Size_Amount"("size_amount_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- AddForeignKey
ALTER TABLE "GeneralProduct" ADD CONSTRAINT "GeneralProduct_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("brand_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralProduct" ADD CONSTRAINT "GeneralProduct_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("section_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WantedProduct" ADD CONSTRAINT "WantedProduct_general_product_id_fkey" FOREIGN KEY ("general_product_id") REFERENCES "GeneralProduct"("general_product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_general_product_id_fkey" FOREIGN KEY ("general_product_id") REFERENCES "GeneralProduct"("general_product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
