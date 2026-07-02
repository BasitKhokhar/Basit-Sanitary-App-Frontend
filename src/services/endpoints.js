// endpoints.js — centralized API paths. One place to see/maintain every route.
// ⚠️ Endpoints marked NEEDS-BACKEND are consumed by new feature UIs and may not
// exist yet — implement server-side to fully enable Orders / Reviews / Wishlist.

export const endpoints = {
  auth: {
    refresh: "/auth/refresh",
  },
  products: {
    all: (page = 1, limit = 10) => `/products/allproducts?page=${page}&limit=${limit}`,
    categories: "/products/categories",
    search: (q, page = 1, limit = 10) =>
      `/products/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
    reviews: (id) => `/products/${id}/reviews`, // NEEDS-BACKEND (GET list / POST create)
  },
  cart: {
    count: "/cart/count",
    items: "/cart/cartitems",
    add: "/cart/addtocart",
  },
  orders: {
    create: "/orders/create",
    mine: (page = 1, limit = 10) => `/orders/myorders?page=${page}&limit=${limit}`, // NEEDS-BACKEND
    detail: (id) => `/orders/${id}`, // NEEDS-BACKEND
  },
  wishlist: {
    list: "/wishlist", // NEEDS-BACKEND (optional — local AsyncStorage fallback in WishlistContext)
    toggle: "/wishlist/toggle", // NEEDS-BACKEND
  },
  content: { sliderImages: "/content/sliderimages" },
  services: { list: "/services/getservices", plumbers: "/services/getplumbers" },
  users: { details: "/users/getuserdetails", images: "/users/user_images" },
  notifications: {
    all: (page = 1, limit = 10) => `/notifications/allnotifications?page=${page}&limit=${limit}`,
    update: (id) => `/notifications/update/${id}`,
    create: "/notifications/Createnotifications",
  },
  payment: { stripeIntent: "/payment/stripe-intent" },
};

export default endpoints;
