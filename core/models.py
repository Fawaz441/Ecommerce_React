from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.db.models import Sum
from django.shortcuts import reverse
from django.utils.text import slugify
from django_countries.fields import CountryField

CATEGORY_CHOICES = (
    ("S","Shirt "),
    ("SW","Sport Wear "),
    ("OW","Outwear "),
)

LABEL_CHOICES = (
    ("p","Primary"),
    ("S","Secondary"),
    ("D","Danger"),
)

ADDRESS_CHOICES = (
    ("B","Biling"),
    ("S","Shipping"),
)

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=50,blank=True,null=True)
    one_click_purchasing = models.BooleanField(default=False)


class Item(models.Model):
    title = models.CharField(max_length=100,unique=True)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True,null=True)
    category = models.CharField(choices=CATEGORY_CHOICES,max_length=2)
    label = models.CharField(choices=LABEL_CHOICES,max_length=1)
    slug = models.SlugField(blank=True,null=True)
    description = models.TextField()
    image = models.ImageField()

    def __str__(self):
        return self.title

    def save(self,*args,**kwargs):
       self.slug = slugify(self.title)
       super().save(*args,**kwargs) 

    
class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item,on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    item_variations= models.ManyToManyField('ItemVariation',blank=True)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_price(self):
        total_price = self.item.price * self.quantity
        if self.item.discount_price:
            total_price = self.item.discount_price * self.quantity
        return total_price


class Order(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20,blank=True,null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey('Address',related_name='shipping_address',on_delete=models.SET_NULL,blank=True,null=True)
    billing_address = models.ForeignKey('Address',related_name='billing_address',on_delete=models.SET_NULL,blank=True,null=True)
    coupon = models.ForeignKey('Coupon',on_delete=models.CASCADE,null=True,blank=True)

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_total_price()
        return total


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100)
    country = CountryField(multiple=False)
    zip = models.CharField(max_length=100)
    address_type = models.CharField(max_length=1,choices=ADDRESS_CHOICES,null=True,blank=True)
    default = models.BooleanField(default=False)

def userprofile_receiver(sender,instance,created,*args,**kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)

post_save.connect(userprofile_receiver,sender=settings.AUTH_USER_MODEL)


class Coupon(models.Model):
    code = models.CharField(max_length=20)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Variation(models.Model):
    name = models.CharField(max_length=200)
    item = models.ForeignKey(Item,on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = (
            ('name','item')
        )


class ItemVariation(models.Model):
    value = models.CharField(max_length=120)
    variation = models.ForeignKey(Variation,on_delete=models.CASCADE)
    attachment = models.ImageField(blank=True,null=True)

    def __str__(self):
        return self.value

    class Meta:
        unique_together = (
            ('value','variation')
        )
