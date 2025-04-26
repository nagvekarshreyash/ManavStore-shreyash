export interface Product {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  prices: {
    resellerPrice: number;
    specialPrice: number;
    mrp: number;
    regularPrice: number;
  };
  colors: Array<{
    _id: string;
    colorName: string;
    images: string[];
  }>;
  pdfLink: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface ShareOptions {
  productName: boolean;
  price: boolean;
  description: boolean;
  category: boolean;
  color: boolean;
  image?: boolean;
}

// Remove the types object since we're just exporting interfaces
export default {
  // We can leave this empty or remove the default export entirely
  // since we're using named exports for our interfaces
};