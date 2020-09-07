from django.urls import path
from . import views

urlpatterns = [
    path('productlist/',views.ProductListView.as_view(),name='product_list'),
    path('products/<slug>',views.ItemDetailView.as_view(),name='product_detail'),
    path('add_to_cart/',views.AddToCartView.as_view(),name='add_to_cart'),
    path('order-summary/',views.OrderSummaryView.as_view(),name='order-summary'),
    path('addresses/',views.AddressListVIew.as_view(),name='addresses'),
    path('addresses/create/',views.AddressListVIew.as_view(),name='addresses-create'),
    path('countries/',views.CountryListView.as_view(),name='countries'),
]