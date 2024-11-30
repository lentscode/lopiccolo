export interface Cart {
  id: number
  createdAt: Date
  updatedAt: Date
  items: CartItem
  total: number
}

export interface CartItem {
  id: number
  name: string
  description: string
  price: number
  availability: number
  imagesUrls: string[]
  quantity: number
}