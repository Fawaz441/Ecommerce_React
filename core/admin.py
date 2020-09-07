from django.contrib import admin
from .models import Item,Order,OrderItem,Address,Variation,ItemVariation
admin.site.register(Item)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Address)

class ItemVariationInline(admin.TabularInline):
    model = ItemVariation
    extra = 1

class VariationAdmin(admin.ModelAdmin):
    list_display = ['name','item']
    inlines = [ItemVariationInline]

class ItemVariationAdmin(admin.ModelAdmin):
    list_display = ['value','variation','attachment']

admin.site.register(ItemVariation,ItemVariationAdmin)
admin.site.register(Variation,VariationAdmin)
