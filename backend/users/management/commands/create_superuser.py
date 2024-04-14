from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Creates a superuser from provided command line arguments'

    def add_arguments(self, parser):
        parser.add_argument('--email_id', type=str, help='EmailID for the superuser')
        parser.add_argument('--username', type=str, help='Username for the superuser')
        parser.add_argument('--dob', type=str, help='Dob for the superuser')
        parser.add_argument('--password', type=str, help='Password for the superuser')

    def handle(self, *args, **options):
        User = get_user_model()
        User.objects.create_superuser(
            email_id=options['email_id'],
            password=options['password'],
            dob=options['dob'],
            username=options['username']
        )
        self.stdout.write(self.style.SUCCESS('Successfully created new superuser'))