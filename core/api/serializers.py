from core.models import Item,Order,OrderItem,Variation,ItemVariation,Address
from rest_framework.serializers import ModelSerializer,SerializerMethodField,StringRelatedField
from django_countries.serializer_fields import CountryField


class ItemVariationSerializer(ModelSerializer):
    class Meta:
        model = ItemVariation
        fields = ('value','attachment','id')

class VariationSerializer(ModelSerializer):
    item_variations = SerializerMethodField()
    class Meta:
        model = Variation
        fields = ('name','item_variations','id')

    def get_item_variations(self,obj):
        return ItemVariationSerializer(obj.itemvariation_set.all(),many=True).data

class VariationDetailSerializer(ModelSerializer):
    class Meta:
        model = Variation
        fields = ('id','name')



class ItemVariationDetailSerializer(ModelSerializer):
    variation = SerializerMethodField()
    class Meta:
        model =ItemVariation
        fields = ('id','variation','value','attachment')

    def get_variation(self,obj):
        return VariationDetailSerializer(obj.variation).data


class StringSerializer(StringRelatedField):
    def to_internal_value(self,value):
        return value

class ItemSerializer(ModelSerializer):
    category = SerializerMethodField()
    label = SerializerMethodField()
    class Meta:
        model = Item
        fields =  ('title', 'price', 'discount_price', 'category', 'label', 'slug', 'description', 'image','id')
    def get_category(self,obj):
        return obj.get_category_display()

    def get_label(self,obj):
        return obj.get_category_display()


class ItemDetailSerializer(ModelSerializer):
    category = SerializerMethodField()
    label = SerializerMethodField()
    variations = SerializerMethodField()
    class Meta:
        model = Item
        fields =  ('title', 'price', 'discount_price', 'category', 'label', 'slug', 'description', 'image','id','variations')
    def get_category(self,obj):
        return obj.get_category_display()

    def get_label(self,obj):
        return obj.get_category_display()

    def get_variations(self,obj):
        return VariationSerializer(obj.variation_set.all(),many=True).data
        


class OrderItemSerializer(ModelSerializer):
    item = SerializerMethodField()
    total_price = SerializerMethodField()
    item_variations = SerializerMethodField()

    class Meta:
        model = OrderItem
        fields =  ('id','quantity','item','total_price','item_variations')

    def get_item(self,obj):
        return ItemSerializer(obj.item).data

    def get_total_price(self,obj):
        return obj.get_total_price()

    def get_item_variations(self,obj):
        return ItemVariationDetailSerializer(obj.item_variations.all(),many=True).data


class OrderSerializer(ModelSerializer):
    order_items = SerializerMethodField()
    total = SerializerMethodField()

    class Meta:
        model = Order
        fields =  ('id','order_items','total')

    def get_order_items(self,obj):
        return OrderItemSerializer(obj.items.all(),many=True).data

    def get_total(self,obj):
        return obj.get_total()

   
        

class AddressSerializer(ModelSerializer):
    country = CountryField()
    class Meta:
        model = Address
        fields = (
            'street_address',
            'apartment_address',
            'country',
            'zip',
            'address_type',
            'default',
            'user',
            'id'
        )