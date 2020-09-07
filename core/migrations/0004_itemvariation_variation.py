# Generated by Django 3.1 on 2020-09-06 19:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20200902_1729'),
    ]

    operations = [
        migrations.CreateModel(
            name='Variation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.item')),
            ],
            options={
                'unique_together': {('name', 'item')},
            },
        ),
        migrations.CreateModel(
            name='ItemVariation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=120)),
                ('attachment', models.ImageField(blank=True, null=True, upload_to='')),
                ('variation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.variation')),
            ],
            options={
                'unique_together': {('value', 'variation')},
            },
        ),
    ]
