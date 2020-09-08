from django_countries import countries
from rest_framework.generics import ListAPIView,RetrieveAPIView,CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK,HTTP_400_BAD_REQUEST
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .serializers import ItemSerializer,OrderSerializer,ItemDetailSerializer,AddressSerializer
from core.models import Item,Order,OrderItem,Variation,ItemVariation,Address
from django.http import Http404


class ProductListView(ListAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (AllowAny,)


class AddToCartView(APIView):
    permission_classes = (AllowAny,)
    def post(self,request,*args,**kwargs):
        slug = request.data.get('slug',None)
        variations = request.data.get('variations',[])
        if slug is None:
            return Response({'message':'invalid request'},status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item,slug=slug)    


        minimum_variation_count = Variation.objects.filter(item=item).count()
        if len(variations) < minimum_variation_count:
            return Response({'message':'Please specify the minimum variations'},status=HTTP_400_BAD_REQUEST)

        # crazy logic here
        order_item_qs = OrderItem.objects.filter(item=item,user=request.user,ordered=False)
         
        for v in variations:
            order_item_qs = order_item_qs.filter(item_variations__exact=v)
        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity+=1
            order_item.save()
        else:  
            order_item = OrderItem.objects.create(item=item,user=request.user,ordered=False)
            order_item.item_variations.add(*variations)
            order_item.save()



        order_qs = Order.objects.filter(user=request.user,ordered=False)
        if order_qs.exists():
            order  =  order_qs[0]
          
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
            return Response({'message':'This item was added to your cart'},status=HTTP_200_OK)
        else:
            ordered_date = timezone.now()
            order = Order.objects.create(user=request.user,ordered_date=ordered_date)
            order.items.add(order_item)
            return Response({'message':'This item was added to your cart'},status=HTTP_200_OK)


class OrderSummaryView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            order = Order.objects.get(user=self.request.user,ordered=False)
            return order
        except:
            # return Response({'message':'You do not have an active user'},status=HTTP_400_BAD_REQUEST)
            raise Http404("You do not have an active order")

class ItemDetailView(RetrieveAPIView):
    serializer_class=ItemDetailSerializer
    permission_classes = (AllowAny,)
    queryset = Item.objects.all()
    lookup_field = 'slug'


class AddressListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    

class AddressCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


# country list_view
class CountryListView(APIView):
    def get(self,request,*args,**kwargs):
        return Response(countries,status=HTTP_200_OK)


class UserIDView(APIView):
    def get(self,request,*args, **kwargs):
        return Response({'userID':request.user.id},status=HTTP_200_OK)