# Generated by Django 4.2.8 on 2023-12-05 21:20

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('listings', '0002_rename_user_petlisting_shelter'),
        ('accounts', '0002_seeker_alter_shelter_location_delete_userprofile'),
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('denied', 'Denied'), ('withdrawn', 'Withdrawn')], default='pending', max_length=10)),
                ('creation_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('last_update_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('pet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='listings.petlisting')),
                ('seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.seeker')),
                ('shelter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.shelter')),
            ],
        ),
    ]
