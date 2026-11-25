export type CategoriaProducto = 'Antojito' | 'Platillo' | 'Snack' | 'Carne' | 'Bebida' | 'Extra' | string;

export interface ProductoInventario {
    idProd: number;
    nombre: string;
    categoria: CategoriaProducto;
    precio: number;
    stock: number;
    controla_stock: number; // 0 o 1
    disponible: number;     // 0 o 1
    tiempo_estimado_min: number;
}
