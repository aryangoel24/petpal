# Generated by Django 4.2.8 on 2023-12-07 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_blogpost'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='creator',
            field=models.CharField(default='some shelter', max_length=200),
            preserve_default=False,
        ),
    ]
