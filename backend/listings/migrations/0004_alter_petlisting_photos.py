# Generated by Django 4.2.8 on 2023-12-06 03:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0003_alter_petlisting_shelter'),
    ]

    operations = [
        migrations.AlterField(
            model_name='petlisting',
            name='photos',
            field=models.ImageField(blank=True, null=True, upload_to='pet_photos/'),
        ),
    ]
